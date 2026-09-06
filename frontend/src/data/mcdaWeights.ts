import { AssessmentCategory } from '../types/assessment';
import { ParameterWeightConfig } from '../types/mcda';

export const DEFAULT_PARAMETER_WEIGHTS: ParameterWeightConfig[] = [
    // Demonstration weights only. These can later be replaced with expert or AHP-derived weights.
    { parameterId: 'terrainSlope', category: 'physical', weight: 0.22, scoringDirection: 'negative' },
    { parameterId: 'floodSusceptibility', category: 'physical', weight: 0.20, scoringDirection: 'negative' },
    { parameterId: 'drainageCondition', category: 'physical', weight: 0.16, scoringDirection: 'negative' },
    { parameterId: 'soilStability', category: 'physical', weight: 0.16, scoringDirection: 'positive' },
    { parameterId: 'airQualitySensitivity', category: 'physical', weight: 0.14, scoringDirection: 'negative' },
    { parameterId: 'noiseEnvironment', category: 'physical', weight: 0.12, scoringDirection: 'negative' },
    { parameterId: 'vegetationSensitivity', category: 'biological', weight: 0.30, scoringDirection: 'negative' },
    { parameterId: 'biodiversitySensitivity', category: 'biological', weight: 0.25, scoringDirection: 'negative' },
    { parameterId: 'forestGreenCover', category: 'biological', weight: 0.25, scoringDirection: 'negative' },
    { parameterId: 'ecologicallySensitiveArea', category: 'biological', weight: 0.20, scoringDirection: 'negative' },
    { parameterId: 'surfaceWaterProximity', category: 'naturalResources', weight: 0.30, scoringDirection: 'negative' },
    { parameterId: 'groundwaterSensitivity', category: 'naturalResources', weight: 0.25, scoringDirection: 'negative' },
    { parameterId: 'landResourceSensitivity', category: 'naturalResources', weight: 0.25, scoringDirection: 'negative' },
    { parameterId: 'naturalResourceDependency', category: 'naturalResources', weight: 0.20, scoringDirection: 'negative' },
    { parameterId: 'settlementProximity', category: 'socioEconomic', weight: 0.25, scoringDirection: 'negative' },
    { parameterId: 'populationSensitivity', category: 'socioEconomic', weight: 0.20, scoringDirection: 'negative' },
    { parameterId: 'publicInfrastructure', category: 'socioEconomic', weight: 0.20, scoringDirection: 'negative' },
    { parameterId: 'communitySensitivity', category: 'socioEconomic', weight: 0.20, scoringDirection: 'negative' },
    { parameterId: 'culturalHeritage', category: 'socioEconomic', weight: 0.15, scoringDirection: 'negative' },
];

export const CATEGORY_LABELS: Record<AssessmentCategory, string> = {
    physical: 'Physical Environment',
    biological: 'Biological Environment',
    naturalResources: 'Natural Resources',
    socioEconomic: 'Socio-Economic Environment',
};

export function getParameterWeight(parameterId: string) {
    return DEFAULT_PARAMETER_WEIGHTS.find((config) => config.parameterId === parameterId);
}

