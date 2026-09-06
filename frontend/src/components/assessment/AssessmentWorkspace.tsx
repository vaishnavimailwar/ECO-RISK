import { useState } from 'react';
import { AssessmentSite } from '../../types/location';
import { AssessmentCategory, AssessmentData, ASSESSMENT_CATEGORIES } from '../../types/assessment';
import AssessmentCategoryNav from './AssessmentCategoryNav';
import AssessmentParameter from './AssessmentParameter';
import AssessmentProgress from './AssessmentProgress';
import AssessmentReview from './AssessmentReview';

interface AssessmentWorkspaceProps {
    sites: AssessmentSite[];
    assessmentData: AssessmentData;
    onAssessmentChange: (siteId: string, category: AssessmentCategory, parameterId: string, value: 'Very Low' | 'Low' | 'Moderate' | 'High' | 'Very High') => void;
    onBack: () => void;
    onContinue: () => void;
}

export default function AssessmentWorkspace({ sites, assessmentData, onAssessmentChange, onBack, onContinue }: AssessmentWorkspaceProps) {
    const [selectedSiteId, setSelectedSiteId] = useState(sites[0]?.id || '');
    const [activeCategory, setActiveCategory] = useState<AssessmentCategory | 'review'>('physical');
    const site = sites.find((candidate) => candidate.id === selectedSiteId) || sites[0];

    if (!site) return null;
    const assessment = assessmentData[site.id];
    const category = activeCategory === 'review' ? null : ASSESSMENT_CATEGORIES.find((candidate) => candidate.id === activeCategory);

    return (
        <div className="assessment-workspace">
            <AssessmentProgress site={site} assessment={assessment} onBack={onBack} onSiteChange={(siteId) => { setSelectedSiteId(siteId); setActiveCategory('physical'); }} sites={sites} selectedSiteId={site.id} />
            <div className="assessment-workspace__body">
                <AssessmentCategoryNav categories={ASSESSMENT_CATEGORIES} activeCategory={activeCategory} assessment={assessment} onChange={setActiveCategory} />
                <main className="assessment-content">
                    {category ? (
                        <section>
                            <div className="assessment-content__heading">
                                <p className="eyebrow">Baseline study input</p>
                                <h2>{category.label}</h2>
                                <p>Record the current environmental sensitivity observed or documented for this parameter.</p>
                            </div>
                            <div className="assessment-parameter-list">
                                {category.parameters.map((parameter) => (
                                    <AssessmentParameter key={parameter.id} parameter={parameter} value={assessment[category.id][parameter.id]} onChange={(value) => onAssessmentChange(site.id, category.id, parameter.id, value)} />
                                ))}
                            </div>
                        </section>
                    ) : <AssessmentReview assessment={assessment} onContinue={onContinue} />}
                </main>
            </div>
        </div>
    );
}