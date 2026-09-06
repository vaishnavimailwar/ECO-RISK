import { ASSESSMENT_CATEGORIES, AssessmentData, AssessmentLevel } from '../types/assessment';
import { AssessmentSite } from '../types/location';
import { CATEGORY_LABELS, DEFAULT_PARAMETER_WEIGHTS } from '../data/mcdaWeights';
import { CATEGORY_WEIGHTS, CategoryScoreResult, QUALITATIVE_SCORE, RankedSiteResult, SiteMCDAResult } from '../types/mcda';

function scoreLevel(level: AssessmentLevel, direction: 'positive' | 'negative') {
    const convertedScore = QUALITATIVE_SCORE[level];
    const favourableScore = direction === 'positive' ? convertedScore : 6 - convertedScore;
    return (favourableScore / 5) * 100;
}

export function calculateSiteMCDA(site: AssessmentSite, assessment: AssessmentData[string]): SiteMCDAResult {
    const categoryScores: CategoryScoreResult[] = ASSESSMENT_CATEGORIES.map((category) => {
        const categoryConfigs = DEFAULT_PARAMETER_WEIGHTS.filter((config) => config.category === category.id);
        const completed = category.parameters.filter((parameter) => Boolean(assessment[category.id][parameter.id]));
        const completedWeight = categoryConfigs
            .filter((config) => Boolean(assessment[category.id][config.parameterId]))
            .reduce((sum, config) => sum + config.weight, 0);
        const weightedScore = completed.reduce((sum, parameter) => {
            const value = assessment[category.id][parameter.id];
            const config = categoryConfigs.find((candidate) => candidate.parameterId === parameter.id);
            return value && config ? sum + scoreLevel(value, config.scoringDirection) * config.weight : sum;
        }, 0);
        return {
            category: category.id,
            score: completed.length ? weightedScore / completedWeight : null,
            completedParameters: completed.length,
            totalParameters: category.parameters.length,
            completedWeight,
        };
    });

    const assessedCategories = categoryScores.filter((result) => result.score !== null);
    const overallWeight = assessedCategories.reduce((sum, result) => sum + CATEGORY_WEIGHTS[result.category], 0);
    const overallScore = assessedCategories.length
        ? assessedCategories.reduce((sum, result) => sum + (result.score || 0) * CATEGORY_WEIGHTS[result.category], 0) / overallWeight
        : null;
    const completedParameters = categoryScores.reduce((sum, result) => sum + result.completedParameters, 0);
    const totalParameters = categoryScores.reduce((sum, result) => sum + result.totalParameters, 0);
    const completeness = totalParameters ? Math.round((completedParameters / totalParameters) * 100) : 0;
    return {
        site,
        categoryScores,
        overallScore,
        completedParameters,
        totalParameters,
        completeness,
        status: completedParameters === 0 ? 'No Assessment Data' : completeness === 100 ? 'Complete Assessment' : 'Partial Assessment',
    };
}

export function calculateRankedMCDA(sites: AssessmentSite[], assessmentData: AssessmentData): RankedSiteResult[] {
    return sites
        .map((site) => calculateSiteMCDA(site, assessmentData[site.id]))
        .sort((first, second) => (second.overallScore || 0) - (first.overallScore || 0))
        .map((result, index) => ({ ...result, rank: index + 1 }));
}

export function formatCategoryLabel(category: keyof typeof CATEGORY_LABELS) {
    return CATEGORY_LABELS[category];
}

