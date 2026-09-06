import { ASSESSMENT_CATEGORIES, AssessmentData } from '../types/assessment';
import { AssessmentSite } from '../types/location';
import { AdHocObservation, MATRIX_COMPONENTS, MethodologyData, PROJECT_ACTIVITIES, countMatrixEntries } from '../types/methodology';
import { CATEGORY_LABELS, DEFAULT_PARAMETER_WEIGHTS } from '../data/mcdaWeights';
import { DECISION_THRESHOLDS, MATRIX_ENTRY_TOTAL, METHODOLOGY_COMPLETION_WEIGHTS } from '../data/decisionConfig';
import { calculateRankedMCDA } from './mcdaEngine';
import { CategoryDecisionStatus, DecisionConfidence, DecisionSupportSummary } from '../types/decision';

export function calculateMethodologyCompletion(methodology: MethodologyData[string]) {
    const matrixCompletion = countMatrixEntries(methodology.matrix) / MATRIX_ENTRY_TOTAL;
    const adHocCompletion = methodology.observations.length > 0 ? 1 : 0;
    return Math.round((matrixCompletion * METHODOLOGY_COMPLETION_WEIGHTS.matrix + adHocCompletion * METHODOLOGY_COMPLETION_WEIGHTS.adHocPresence) * 100);
}

export function getCategoryDecisionStatus(score: number | null): CategoryDecisionStatus {
    if (score === null) return 'Not Assessed';
    if (score >= DECISION_THRESHOLDS.strength) return 'Strength';
    if (score >= DECISION_THRESHOLDS.attention) return 'Moderate Position';
    return 'Requires Attention';
}

function getConfidence(inventory: number, methodology: number, readiness: number): DecisionConfidence {
    const composite = (inventory + methodology + readiness) / 3;
    if (composite >= DECISION_THRESHOLDS.highConfidence) return 'HIGHER CONFIDENCE';
    if (composite >= DECISION_THRESHOLDS.moderateConfidence) return 'MODERATE CONFIDENCE';
    return 'LIMITED CONFIDENCE';
}

function getReasons(recommended: DecisionSupportSummary['recommended'], results: DecisionSupportSummary['results']) {
    if (!recommended || recommended.overallScore === null) return [];
    const reasons: string[] = [];
    const assessedCategories = recommended.categoryScores.filter((category) => category.score !== null);
    const advantages = assessedCategories.map((category) => {
        const otherScores = results.filter((result) => result.site.id !== recommended.site.id)
            .map((result) => result.categoryScores.find((candidate) => candidate.category === category.category)?.score)
            .filter((score): score is number => score !== null && score !== undefined);
        const averageOthers = otherScores.length ? otherScores.reduce((sum, score) => sum + score, 0) / otherScores.length : null;
        return { category, advantage: averageOthers === null ? category.score || 0 : (category.score || 0) - averageOthers };
    }).sort((first, second) => second.advantage - first.advantage);
    advantages.slice(0, 3).forEach(({ category, advantage }) => {
        const label = CATEGORY_LABELS[category.category];
        reasons.push(advantage > 0 && results.length > 1
            ? `Stronger performance in ${label} compared with the other assessed sites.`
            : `Strongest recorded category for this site is ${label}.`);
    });
    reasons.push(`Stronger overall weighted MCDA performance at ${recommended.overallScore.toFixed(1)} / 100.`);
    return reasons.slice(0, 4);
}

function getConcerns(recommended: DecisionSupportSummary['recommended'], assessment: AssessmentData[string], methodology: MethodologyData[string]) {
    if (!recommended) return [];
    const concerns: string[] = [];
    const weakest = recommended.categoryScores.filter((category) => category.score !== null).sort((first, second) => (first.score || 0) - (second.score || 0))[0];
    if (weakest && (weakest.score || 0) < DECISION_THRESHOLDS.strength) {
        concerns.push(`${CATEGORY_LABELS[weakest.category]} requires additional evaluation.`);
    }
    const parameterConcerns = ASSESSMENT_CATEGORIES.flatMap((category) => category.parameters.map((parameter) => {
        const value = assessment[category.id][parameter.id];
        const config = DEFAULT_PARAMETER_WEIGHTS.find((candidate) => candidate.parameterId === parameter.id);
        if (!value || !config) return null;
        const unfavourable = config.scoringDirection === 'negative' ? (value === 'High' || value === 'Very High') : (value === 'Very Low' || value === 'Low');
        return unfavourable ? parameter.label.toLowerCase() : null;
    }).filter((value): value is string => Boolean(value)));
    parameterConcerns.slice(0, 2).forEach((parameter) => concerns.push(`${parameter} should be verified through field investigation.`));
    const highMatrixEntry = Object.entries(methodology.matrix).find(([, value]) => value === 'High Impact' || value === 'Very High Impact');
    if (highMatrixEntry) {
        const [componentId, activityId] = highMatrixEntry[0].split('.');
        const component = MATRIX_COMPONENTS.find((candidate) => candidate.id === componentId)?.label || 'Environmental component';
        const activity = PROJECT_ACTIVITIES.find((candidate) => candidate.id === activityId)?.label || 'project activity';
        concerns.push(`${component} requires mitigation planning for ${activity}.`);
    }
    const observation = methodology.observations[0] as AdHocObservation | undefined;
    if (observation && concerns.length < 4) concerns.push(`Ad-hoc observation requires consideration: ${observation.observation}`);
    return concerns.slice(0, 4);
}

export function calculateDecisionSupport(sites: AssessmentSite[], assessmentData: AssessmentData, methodologyData: MethodologyData): DecisionSupportSummary {
    const results = calculateRankedMCDA(sites, assessmentData);
    const averageInventoryCompletion = results.length ? Math.round(results.reduce((sum, result) => sum + result.completeness, 0) / results.length) : 0;
    const methodologyCompletions = sites.map((site) => calculateMethodologyCompletion(methodologyData[site.id]));
    const averageMethodologyCompletion = methodologyCompletions.length ? Math.round(methodologyCompletions.reduce((sum, value) => sum + value, 0) / methodologyCompletions.length) : 0;
    const mcdaReadiness = results.length ? Math.round((results.filter((result) => result.overallScore !== null).length / results.length) * 100) : 0;
    const recommended = results[0] || null;
    const categories = recommended ? recommended.categoryScores.map((category) => ({ label: CATEGORY_LABELS[category.category], score: category.score, status: getCategoryDecisionStatus(category.score) })) : [];
    const confidence = getConfidence(averageInventoryCompletion, averageMethodologyCompletion, mcdaReadiness);
    return { results, recommended, averageInventoryCompletion, averageMethodologyCompletion, mcdaReadiness, confidence, categories, reasons: getReasons(recommended, results), concerns: recommended ? getConcerns(recommended, assessmentData[recommended.site.id], methodologyData[recommended.site.id]) : [] };
}