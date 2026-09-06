import { AssessmentCategory, AssessmentLevel } from './assessment';
import { AssessmentSite } from './location';

export type ScoringDirection = 'positive' | 'negative';

export interface ParameterWeightConfig {
    parameterId: string;
    category: AssessmentCategory;
    weight: number;
    scoringDirection: ScoringDirection;
}

export interface CategoryScoreResult {
    category: AssessmentCategory;
    score: number | null;
    completedParameters: number;
    totalParameters: number;
    completedWeight: number;
}

export interface SiteMCDAResult {
    site: AssessmentSite;
    categoryScores: CategoryScoreResult[];
    overallScore: number | null;
    completedParameters: number;
    totalParameters: number;
    completeness: number;
    status: 'Complete Assessment' | 'Partial Assessment' | 'No Assessment Data';
}

export interface RankedSiteResult extends SiteMCDAResult {
    rank: number;
}

export interface MCDAResults {
    sites: RankedSiteResult[];
}

export const QUALITATIVE_SCORE: Record<AssessmentLevel, number> = {
    'Very Low': 1,
    Low: 2,
    Moderate: 3,
    High: 4,
    'Very High': 5,
};

export const CATEGORY_WEIGHTS: Record<AssessmentCategory, number> = {
    physical: 0.30,
    biological: 0.25,
    naturalResources: 0.25,
    socioEconomic: 0.20,
};
