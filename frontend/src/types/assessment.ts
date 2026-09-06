import { AssessmentSite } from './location';

export type AssessmentCategory = 'physical' | 'biological' | 'naturalResources' | 'socioEconomic';
export type AssessmentLevel = 'Very Low' | 'Low' | 'Moderate' | 'High' | 'Very High';

export interface AssessmentParameter {
    id: string;
    label: string;
}

export interface AssessmentCategoryDefinition {
    id: AssessmentCategory;
    label: string;
    shortLabel: string;
    parameters: AssessmentParameter[];
}

export type CategoryAssessment = Record<string, AssessmentLevel | undefined>;
export type SiteAssessment = Record<AssessmentCategory, CategoryAssessment>;
export type AssessmentData = Record<string, SiteAssessment>;

export const ASSESSMENT_CATEGORIES: AssessmentCategoryDefinition[] = [
    {
        id: 'physical',
        label: 'Physical Environment',
        shortLabel: 'Physical',
        parameters: [
            { id: 'terrainSlope', label: 'Terrain / Slope Condition' },
            { id: 'floodSusceptibility', label: 'Flood Susceptibility' },
            { id: 'drainageCondition', label: 'Drainage Condition' },
            { id: 'soilStability', label: 'Soil Stability' },
            { id: 'airQualitySensitivity', label: 'Air Quality Sensitivity' },
            { id: 'noiseEnvironment', label: 'Noise Environment' },
        ],
    },
    {
        id: 'biological',
        label: 'Biological Environment',
        shortLabel: 'Biological',
        parameters: [
            { id: 'vegetationSensitivity', label: 'Vegetation Sensitivity' },
            { id: 'biodiversitySensitivity', label: 'Biodiversity Sensitivity' },
            { id: 'forestGreenCover', label: 'Forest / Green Cover Proximity' },
            { id: 'ecologicallySensitiveArea', label: 'Ecologically Sensitive Area Proximity' },
        ],
    },
    {
        id: 'naturalResources',
        label: 'Natural Resources',
        shortLabel: 'Natural Resources',
        parameters: [
            { id: 'surfaceWaterProximity', label: 'Surface Water Proximity' },
            { id: 'groundwaterSensitivity', label: 'Groundwater Sensitivity' },
            { id: 'landResourceSensitivity', label: 'Land Resource Sensitivity' },
            { id: 'naturalResourceDependency', label: 'Natural Resource Dependency' },
        ],
    },
    {
        id: 'socioEconomic',
        label: 'Socio-Economic Environment',
        shortLabel: 'Socio-Economic',
        parameters: [
            { id: 'settlementProximity', label: 'Settlement Proximity' },
            { id: 'populationSensitivity', label: 'Population Sensitivity' },
            { id: 'publicInfrastructure', label: 'Public Infrastructure Proximity' },
            { id: 'communitySensitivity', label: 'Community Sensitivity' },
            { id: 'culturalHeritage', label: 'Cultural / Heritage Sensitivity' },
        ],
    },
];

export const ASSESSMENT_LEVELS: AssessmentLevel[] = ['Very Low', 'Low', 'Moderate', 'High', 'Very High'];

export function createEmptySiteAssessment(): SiteAssessment {
    return ASSESSMENT_CATEGORIES.reduce((assessment, category) => {
        assessment[category.id] = {};
        return assessment;
    }, {} as SiteAssessment);
}

export function countCompletedAssessment(assessment: SiteAssessment, category: AssessmentCategory) {
    return Object.values(assessment[category]).filter(Boolean).length;
}

export function countCategoryParameters(category: AssessmentCategory) {
    return ASSESSMENT_CATEGORIES.find((definition) => definition.id === category)?.parameters.length || 0;
}

export function getSiteCompletion(assessment: SiteAssessment) {
    const total = ASSESSMENT_CATEGORIES.reduce((sum, category) => sum + category.parameters.length, 0);
    const completed = ASSESSMENT_CATEGORIES.reduce((sum, category) => sum + countCompletedAssessment(assessment, category.id), 0);
    return { completed, total, percentage: total ? Math.round((completed / total) * 100) : 0 };
}

export function createAssessmentData(sites: AssessmentSite[]): AssessmentData {
    return sites.reduce((data, site) => {
        data[site.id] = createEmptySiteAssessment();
        return data;
    }, {} as AssessmentData);
}

