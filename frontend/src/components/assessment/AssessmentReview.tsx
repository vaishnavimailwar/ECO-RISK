import { SiteAssessment, ASSESSMENT_CATEGORIES } from '../../types/assessment';

interface AssessmentReviewProps {
    assessment: SiteAssessment;
    onContinue: () => void;
}

export default function AssessmentReview({ assessment, onContinue }: AssessmentReviewProps) {
    const entries = ASSESSMENT_CATEGORIES.flatMap((category) => category.parameters
        .map((parameter) => ({ category: category.label, parameter: parameter.label, value: assessment[category.id][parameter.id] }))
        .filter((entry) => entry.value));

    return (
        <section className="assessment-review">
            <div className="assessment-content__heading">
                <p className="eyebrow">Data review</p>
                <h2>Review Environmental Assessment</h2>
                <p>Review the user-entered environmental inventory for this site. No risk score or recommendation is generated here.</p>
            </div>
            <button type="button" className="primary-button assessment-continue-button" onClick={onContinue}>Continue to EIA Methodologies</button>
            {entries.length === 0 ? (
                <div className="assessment-empty">No parameters have been assessed yet. Choose a category to begin entering observations.</div>
            ) : (
                <div className="review-list">
                    {entries.map((entry) => (
                        <div className="review-row" key={`${entry.category}-${entry.parameter}`}>
                            <div><span>{entry.category}</span><strong>{entry.parameter}</strong></div>
                            <b>{entry.value}</b>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

