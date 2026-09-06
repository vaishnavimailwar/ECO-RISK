import { useState } from 'react';
import { AssessmentData, ASSESSMENT_CATEGORIES } from '../../types/assessment';
import { AssessmentSite } from '../../types/location';
import { countInventoryEntries } from '../../types/methodology';

interface ChecklistAssessmentProps { site: AssessmentSite; assessment: AssessmentData[string]; }

export default function ChecklistAssessment({ site, assessment }: ChecklistAssessmentProps) {
    const [filter, setFilter] = useState('all');
    const categories = filter === 'all' ? ASSESSMENT_CATEGORIES : ASSESSMENT_CATEGORIES.filter((category) => category.id === filter);
    const completed = countInventoryEntries(assessment);
    return (
        <section>
            <div className="methodology-heading">
                <div><p className="eyebrow">Structured inventory method</p><h2>Environmental Impact Checklist</h2><p>Checklist entries are drawn from the user-entered Environmental Inventory for the active site.</p></div>
                <div className="methodology-site-meta"><strong>{site.label} · {site.name.split(',')[0]}</strong><span>{site.latitude.toFixed(5)}, {site.longitude.toFixed(5)}</span><b>{completed} inventory entries recorded</b></div>
            </div>
            <label className="methodology-filter">Show component<select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">All components</option>{ASSESSMENT_CATEGORIES.map((category) => <option value={category.id} key={category.id}>{category.label}</option>)}</select></label>
            <div className="checklist-table"><div className="checklist-row checklist-row--header"><span>Environmental Component</span><span>Parameter</span><span>Current Assessment</span></div>{categories.flatMap((category) => category.parameters.map((parameter) => <div className="checklist-row" key={`${category.id}-${parameter.id}`}><span>{category.label}</span><strong>{parameter.label}</strong><b className={assessment[category.id][parameter.id] ? 'assessment-value assessment-value--set' : 'assessment-value'}>{assessment[category.id][parameter.id] || 'Not assessed'}</b></div>))}</div>
        </section>
    );
}