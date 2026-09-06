import { AssessmentSite } from '../../types/location';
import { SiteAssessment, countCompletedAssessment, getSiteCompletion, ASSESSMENT_CATEGORIES } from '../../types/assessment';

interface AssessmentProgressProps {
    site: AssessmentSite;
    assessment: SiteAssessment;
    onBack: () => void;
    onSiteChange: (siteId: string) => void;
    sites: AssessmentSite[];
    selectedSiteId: string;
}

export default function AssessmentProgress({ site, assessment, onBack, onSiteChange, sites, selectedSiteId }: AssessmentProgressProps) {
    const completion = getSiteCompletion(assessment);
    return (
        <div className="assessment-progress">
            <div className="assessment-progress__topline">
                <span>Environmental assessment</span>
                <button type="button" className="back-to-map" onClick={onBack}>Back to GIS workspace</button>
            </div>
            <div className="assessment-progress__identity">
                <div>
                    <p className="eyebrow">Environmental inventory</p>
                    <h2>{site.label} <span>{site.name.split(',')[0]}</span></h2>
                    <p>{site.latitude.toFixed(5)}, {site.longitude.toFixed(5)}</p>
                </div>
                <label className="site-switcher">
                    <span>Assessing site</span>
                    <select value={selectedSiteId} onChange={(event) => onSiteChange(event.target.value)}>
                        {sites.map((candidate) => <option value={candidate.id} key={candidate.id}>{candidate.label} · {candidate.name.split(',')[0]}</option>)}
                    </select>
                </label>
            </div>
            <div className="completion-summary">
                <div className="completion-summary__label">
                    <span>Environmental assessment</span>
                    <strong>{completion.percentage}% Complete</strong>
                </div>
                <div className="completion-track"><span style={{ width: `${completion.percentage}%` }} /></div>
                <div className="completion-categories">
                    {ASSESSMENT_CATEGORIES.map((category) => (
                        <span key={category.id}><strong>{countCompletedAssessment(assessment, category.id)} / {category.parameters.length}</strong> {category.shortLabel}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}

