import { AssessmentData } from './assessment';
import { AssessmentSite } from './location';

export type ImpactLevel = 'No Significant Impact' | 'Low Impact' | 'Moderate Impact' | 'High Impact' | 'Very High Impact';
export type AdHocImpactLevel = 'Low' | 'Moderate' | 'High' | 'Very High';
export type MatrixData = Record<string, ImpactLevel | undefined>;

export interface AdHocObservation {
    id: string;
    component: 'Physical' | 'Biological' | 'Natural Resources' | 'Socio-Economic';
    observation: string;
    impact: AdHocImpactLevel;
    mitigation: string;
}

export interface SiteMethodology {
    matrix: MatrixData;
    observations: AdHocObservation[];
}

export type MethodologyData = Record<string, SiteMethodology>;

export const MATRIX_COMPONENTS = [
    { id: 'physical', label: 'Physical Environment' },
    { id: 'biological', label: 'Biological Environment' },
    { id: 'naturalResources', label: 'Natural Resources' },
    { id: 'socioEconomic', label: 'Socio-Economic Environment' },
] as const;

export const PROJECT_ACTIVITIES = [
    { id: 'siteDevelopment', label: 'Site Development' },
    { id: 'constructionActivities', label: 'Construction Activities' },
    { id: 'transportation', label: 'Transportation' },
    { id: 'resourceUtilization', label: 'Resource Utilization' },
    { id: 'operationalActivities', label: 'Operational Activities' },
] as const;

export const IMPACT_LEVELS: ImpactLevel[] = ['No Significant Impact', 'Low Impact', 'Moderate Impact', 'High Impact', 'Very High Impact'];
export const AD_HOC_IMPACT_LEVELS: AdHocImpactLevel[] = ['Low', 'Moderate', 'High', 'Very High'];

export function createEmptySiteMethodology(): SiteMethodology {
    return { matrix: {}, observations: [] };
}

export function createMethodologyData(sites: AssessmentSite[]): MethodologyData {
    return sites.reduce((data, site) => {
        data[site.id] = createEmptySiteMethodology();
        return data;
    }, {} as MethodologyData);
}

export function countMatrixEntries(matrix: MatrixData) {
    return Object.values(matrix).filter(Boolean).length;
}

export function countInventoryEntries(assessment: AssessmentData[string]) {
    return Object.values(assessment).reduce((total, category) => total + Object.values(category).filter(Boolean).length, 0);
}

