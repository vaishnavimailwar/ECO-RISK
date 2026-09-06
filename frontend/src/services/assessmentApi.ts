import { AssessmentData } from '../types/assessment';
import { AssessmentSite } from '../types/location';
import { MethodologyData } from '../types/methodology';
import { DecisionSupportSummary } from '../types/decision';
import { RankedSiteResult } from '../types/mcda';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    });
    if (!response.ok) throw new Error(`Assessment API request failed (${response.status})`);
    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
}

export interface PersistedProjectRef {
    projectId: number;
    siteIds: Record<string, number>;
}

export async function createAssessmentProject(projectName = 'ECO-RISK Assessment Project'): Promise<{ id: number }> {
    return request<{ id: number }>('/assessments/projects', { method: 'POST', body: JSON.stringify({ project_name: projectName }) });
}

export async function createAssessmentSite(projectId: number, site: AssessmentSite): Promise<{ id: number }> {
    return request<{ id: number }>(`/assessments/projects/${projectId}/sites`, {
        method: 'POST',
        body: JSON.stringify({ site_label: site.label, location_name: site.name, latitude: site.latitude, longitude: site.longitude }),
    });
}

export async function saveInventory(siteId: number, inventoryData: AssessmentData[string]): Promise<void> {
    await request(`/assessments/sites/${siteId}/inventory`, { method: 'PUT', body: JSON.stringify({ inventory_data: inventoryData }) });
}

export async function saveMethodology(siteId: number, methodology: MethodologyData[string]): Promise<void> {
    await request(`/assessments/sites/${siteId}/methodology`, {
        method: 'PUT',
        body: JSON.stringify({ checklist_data: {}, impact_matrix_data: methodology.matrix, ad_hoc_observations: methodology.observations }),
    });
}

export async function saveMCDA(projectId: number, results: RankedSiteResult[], siteIds: Record<string, number>): Promise<void> {
    await request(`/assessments/projects/${projectId}/mcda`, {
        method: 'PUT',
        body: JSON.stringify({ results: results.flatMap((result) => siteIds[result.site.id] ? [{ site_id: siteIds[result.site.id], overall_score: result.overallScore, rank: result.rank, category_scores: result.categoryScores, calculation_metadata: { completeness: result.completeness, status: result.status } }] : []) }),
    });
}

export async function saveDecision(projectId: number, summary: DecisionSupportSummary, siteIds: Record<string, number>): Promise<void> {
    await request(`/assessments/projects/${projectId}/decision`, {
        method: 'PUT',
        body: JSON.stringify({ recommended_site_id: summary.recommended ? siteIds[summary.recommended.site.id] : null, recommended_site_label: summary.recommended?.site.label, overall_score: summary.recommended?.overallScore, decision_data: summary, confidence_status: summary.confidence, assessment_completeness: summary.averageInventoryCompletion }),
    });
}


