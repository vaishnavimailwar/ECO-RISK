import { useState } from 'react';
import { AssessmentData } from '../../types/assessment';
import { AssessmentSite } from '../../types/location';
import { ImpactLevel, MethodologyData, AdHocObservation } from '../../types/methodology';
import AdHocAssessment from './AdHocAssessment';
import ChecklistAssessment from './ChecklistAssessment';
import ImpactMatrix from './ImpactMatrix';
import MethodologyNavigation, { MethodologyTab } from './MethodologyNavigation';
import MethodologyReview from './MethodologyReview';

interface MethodologyWorkspaceProps { sites: AssessmentSite[]; assessmentData: AssessmentData; methodologyData: MethodologyData; onMethodologyChange: (siteId: string, matrix: Record<string, ImpactLevel | undefined>, observations: AdHocObservation[]) => void; onBackToInventory: () => void; onBackToGis: () => void; onViewResults: () => void; }

export default function MethodologyWorkspace({ sites, assessmentData, methodologyData, onMethodologyChange, onBackToInventory, onBackToGis, onViewResults }: MethodologyWorkspaceProps) {
    const [selectedSiteId, setSelectedSiteId] = useState(sites[0]?.id || '');
    const [activeTab, setActiveTab] = useState<MethodologyTab>('checklist');
    const site = sites.find((candidate) => candidate.id === selectedSiteId) || sites[0];
    if (!site) return null;
    const methodology = methodologyData[site.id];
    const updateMatrix = (key: string, value: ImpactLevel) => onMethodologyChange(site.id, { ...methodology.matrix, [key]: value }, methodology.observations);
    const updateObservations = (observations: AdHocObservation[]) => onMethodologyChange(site.id, methodology.matrix, observations);
    return <div className="methodology-workspace"><div className="methodology-workspace__top"><div><p className="eyebrow">Environmental Impact Assessment</p><h2>EIA Methodology Workspace</h2></div><div className="methodology-workspace__actions"><button type="button" className="back-to-map" onClick={onBackToInventory}>Back to Environmental Inventory</button><button type="button" className="back-to-map" onClick={onBackToGis}>Back to GIS Workspace</button></div></div><div className="methodology-site-switcher"><span>Assessing site</span><select value={site.id} onChange={(event) => { setSelectedSiteId(event.target.value); setActiveTab('checklist'); }}>{sites.map((candidate) => <option value={candidate.id} key={candidate.id}>{candidate.label} · {candidate.name.split(',')[0]}</option>)}</select></div><MethodologyNavigation activeTab={activeTab} onChange={setActiveTab} /><main className="methodology-content">{activeTab === 'checklist' && <ChecklistAssessment site={site} assessment={assessmentData[site.id]} />}{activeTab === 'matrix' && <ImpactMatrix site={site} matrix={methodology.matrix} onChange={updateMatrix} />}{activeTab === 'adhoc' && <AdHocAssessment observations={methodology.observations} onChange={updateObservations} />}{activeTab === 'review' && <MethodologyReview site={site} assessment={assessmentData[site.id]} methodology={methodology} onViewResults={onViewResults} />}</main></div>;
}