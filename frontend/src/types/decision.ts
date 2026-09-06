import { RankedSiteResult } from './mcda';

export type DecisionConfidence = 'HIGHER CONFIDENCE' | 'MODERATE CONFIDENCE' | 'LIMITED CONFIDENCE';
export type CategoryDecisionStatus = 'Strength' | 'Moderate Position' | 'Requires Attention' | 'Not Assessed';

export interface DecisionCategoryProfile {
    label: string;
    score: number | null;
    status: CategoryDecisionStatus;
}

export interface DecisionSupportSummary {
    results: RankedSiteResult[];
    recommended: RankedSiteResult | null;
    averageInventoryCompletion: number;
    averageMethodologyCompletion: number;
    mcdaReadiness: number;
    confidence: DecisionConfidence;
    categories: DecisionCategoryProfile[];
    reasons: string[];
    concerns: string[];
}
