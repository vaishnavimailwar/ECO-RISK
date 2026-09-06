import { ASSESSMENT_CATEGORIES, AssessmentData, AssessmentLevel, createEmptySiteAssessment } from '../types/assessment';
import { AssessmentSite } from '../types/location';
import { AD_HOC_IMPACT_LEVELS, AdHocImpactLevel, AdHocObservation, IMPACT_LEVELS, ImpactLevel, MethodologyData, createEmptySiteMethodology } from '../types/methodology';

export const PROJECT_SESSION_KEY = 'ecorisk-gis-project-session';
export const PROJECT_SESSION_VERSION = 1;

export interface ProjectSession {
    version: number;
    sites: AssessmentSite[];
    assessmentData: AssessmentData;
    methodologyData: MethodologyData;
    backendProjectId?: number;
    backendSiteIds?: Record<string, number>;
}

const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
const isFiniteNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);
const isAssessmentLevel = (value: unknown): value is AssessmentLevel => ['Very Low', 'Low', 'Moderate', 'High', 'Very High'].includes(value as string);
const isImpactLevel = (value: unknown): value is ImpactLevel => IMPACT_LEVELS.includes(value as ImpactLevel);
const isAdHocImpactLevel = (value: unknown): value is AdHocImpactLevel => AD_HOC_IMPACT_LEVELS.includes(value as AdHocImpactLevel);
const validComponents = ['Physical', 'Biological', 'Natural Resources', 'Socio-Economic'] as const;

function restoreSites(value: unknown): AssessmentSite[] {
    if (!Array.isArray(value)) return [];
    return value.filter((site): site is AssessmentSite => isRecord(site)
        && typeof site.id === 'string'
        && typeof site.label === 'string'
        && typeof site.name === 'string'
        && isFiniteNumber(site.latitude)
        && isFiniteNumber(site.longitude));
}

function restoreAssessmentData(value: unknown, sites: AssessmentSite[]): AssessmentData {
    const source = isRecord(value) ? value : {};
    return sites.reduce((data, site) => {
        const empty = createEmptySiteAssessment();
        const savedSiteValue = source[site.id];
        const savedSite = isRecord(savedSiteValue) ? savedSiteValue : {};
        ASSESSMENT_CATEGORIES.forEach((category) => {
            const savedCategoryValue = savedSite[category.id];
            const savedCategory = isRecord(savedCategoryValue) ? savedCategoryValue : {};
            category.parameters.forEach((parameter) => {
                const savedValue = savedCategory[parameter.id];
                if (isAssessmentLevel(savedValue)) empty[category.id][parameter.id] = savedValue;
            });
        });
        data[site.id] = empty;
        return data;
    }, {} as AssessmentData);
}

function restoreObservations(value: unknown): AdHocObservation[] {
    if (!Array.isArray(value)) return [];
    return value.filter((observation): observation is AdHocObservation => isRecord(observation)
        && typeof observation.id === 'string'
        && typeof observation.component === 'string'
        && validComponents.includes(observation.component as typeof validComponents[number])
        && typeof observation.observation === 'string'
        && isAdHocImpactLevel(observation.impact)
        && typeof observation.mitigation === 'string');
}

function restoreMethodologyData(value: unknown, sites: AssessmentSite[]): MethodologyData {
    const source = isRecord(value) ? value : {};
    return sites.reduce((data, site) => {
        const empty = createEmptySiteMethodology();
        const savedSiteValue = source[site.id];
        const savedSite = isRecord(savedSiteValue) ? savedSiteValue : {};
        const savedMatrix = isRecord(savedSite.matrix) ? savedSite.matrix : {};
        Object.entries(savedMatrix).forEach(([key, savedValue]) => {
            if (isImpactLevel(savedValue)) empty.matrix[key] = savedValue;
        });
        empty.observations = restoreObservations(savedSite.observations);
        data[site.id] = empty;
        return data;
    }, {} as MethodologyData);
}

export function loadProjectSession(): ProjectSession {
    const fallback: ProjectSession = { version: PROJECT_SESSION_VERSION, sites: [], assessmentData: {}, methodologyData: {} };
    try {
        const raw = window.localStorage.getItem(PROJECT_SESSION_KEY);
        if (!raw) return fallback;
        const parsed: unknown = JSON.parse(raw);
        if (!isRecord(parsed) || parsed.version !== PROJECT_SESSION_VERSION) return fallback;
        const sites = restoreSites(parsed.sites);
        return {
            version: PROJECT_SESSION_VERSION,
            sites,
            assessmentData: restoreAssessmentData(parsed.assessmentData, sites),
            methodologyData: restoreMethodologyData(parsed.methodologyData, sites),
            backendProjectId: typeof parsed.backendProjectId === 'number' ? parsed.backendProjectId : undefined,
            backendSiteIds: isRecord(parsed.backendSiteIds)
                ? Object.fromEntries(Object.entries(parsed.backendSiteIds).filter(([, value]) => typeof value === 'number')) as Record<string, number>
                : undefined,
        };
    } catch {
        return fallback;
    }
}

export function saveProjectSession(session: Omit<ProjectSession, 'version'>): void {
    try {
        window.localStorage.setItem(PROJECT_SESSION_KEY, JSON.stringify({ version: PROJECT_SESSION_VERSION, ...session }));
    } catch {
        // Storage can be unavailable or full; the in-memory session remains usable.
    }
}

export function clearProjectSession(): void {
    try {
        window.localStorage.removeItem(PROJECT_SESSION_KEY);
    } catch {
        // Ignore unavailable storage; resetting React state still clears the active session.
    }
}


