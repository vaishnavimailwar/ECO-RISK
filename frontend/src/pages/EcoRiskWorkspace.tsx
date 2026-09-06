import { useEffect, useRef, useState } from 'react';
import { LocateFixed } from 'lucide-react';
import AssessmentBar from '../components/sites/AssessmentBar';
import GisMap from '../components/map/GisMap';
import CoordinateSearch from '../components/search/CoordinateSearch';
import LocationSearch from '../components/search/LocationSearch';
import SiteList from '../components/sites/SiteList';
import { AssessmentSite, LocationPoint } from '../types/location';
import AssessmentWorkspace from '../components/assessment/AssessmentWorkspace';
import { AssessmentCategory, AssessmentData, AssessmentLevel, createEmptySiteAssessment } from '../types/assessment';
import MethodologyWorkspace from '../components/methodologies/MethodologyWorkspace';
import { AdHocObservation, ImpactLevel, MethodologyData, createEmptySiteMethodology } from '../types/methodology';
import MCDAResults from '../components/MCDAResults';
import DecisionSupport from '../components/DecisionSupport';
import { isWithinIndiaFocus } from '../types/location';
import { clearProjectSession, loadProjectSession, saveProjectSession } from '../services/persistence';
import { createAssessmentProject, createAssessmentSite, saveDecision, saveInventory, saveMCDA, saveMethodology } from '../services/assessmentApi';
import { calculateDecisionSupport } from '../services/decisionEngine';
import { calculateRankedMCDA } from '../services/mcdaEngine';

function SectionHeading({ children }: { children: string }) {
    return <h2 className="panel-section__heading">{children}</h2>;
}

function EcoRiskWorkspace() {
    const [restoredSession] = useState(loadProjectSession);
    const [selectedLocation, setSelectedLocation] = useState<LocationPoint | null>(null);
    const [currentLocation, setCurrentLocation] = useState<LocationPoint | null>(null);
    const [sites, setSites] = useState<AssessmentSite[]>(restoredSession.sites);
    const [assessmentData, setAssessmentData] = useState<AssessmentData>(restoredSession.assessmentData);
    const [assessmentView, setAssessmentView] = useState(false);
    const [methodologyView, setMethodologyView] = useState(false);
    const [mcdaView, setMcdaView] = useState(false);
    const [decisionView, setDecisionView] = useState(false);
    const [methodologyData, setMethodologyData] = useState<MethodologyData>(restoredSession.methodologyData);
    const [backendProjectId, setBackendProjectId] = useState<number | undefined>(restoredSession.backendProjectId);
    const [backendSiteIds, setBackendSiteIds] = useState<Record<string, number>>(restoredSession.backendSiteIds || {});
    const [assessmentMessage, setAssessmentMessage] = useState('');
    const [gpsMessage, setGpsMessage] = useState('');
    const skipNextSave = useRef(false);
    const backendSyncStarted = useRef(false);

    useEffect(() => {
        if (skipNextSave.current) {
            skipNextSave.current = false;
            return;
        }
        saveProjectSession({ sites, assessmentData, methodologyData, backendProjectId, backendSiteIds });
    }, [sites, assessmentData, methodologyData, backendProjectId, backendSiteIds]);

    useEffect(() => {
        const allSitesLinked = Boolean(backendProjectId) && sites.every((site) => Boolean(backendSiteIds[site.id]));
        if (backendSyncStarted.current || sites.length === 0 || allSitesLinked) return;
        backendSyncStarted.current = true;
        void (async () => {
            let projectId = backendProjectId;
            const siteIds = { ...backendSiteIds };
            if (!projectId) projectId = (await createAssessmentProject()).id;
            for (const site of sites) {
                if (!siteIds[site.id]) siteIds[site.id] = (await createAssessmentSite(projectId, site)).id;
            }
            setBackendProjectId(projectId);
            setBackendSiteIds(siteIds);
        })().catch(() => undefined).finally(() => {
            backendSyncStarted.current = false;
        });
    }, [sites, backendProjectId, backendSiteIds]);

    useEffect(() => {
        if (!backendProjectId || sites.length === 0) return;
        void Promise.all(sites.flatMap((site) => {
            const siteId = backendSiteIds[site.id];
            return siteId ? [saveInventory(siteId, assessmentData[site.id]), saveMethodology(siteId, methodologyData[site.id])] : [];
        })).then(async () => {
            const ranked = calculateRankedMCDA(sites, assessmentData);
            await saveMCDA(backendProjectId, ranked, backendSiteIds);
            await saveDecision(backendProjectId, calculateDecisionSupport(sites, assessmentData, methodologyData), backendSiteIds);
        }).catch(() => {
            // Local state remains authoritative when the optional persistence API is unavailable.
        });
    }, [backendProjectId, backendSiteIds, sites, assessmentData, methodologyData]);

    const handleLocationFound = (location: LocationPoint) => {
        setSelectedLocation(location);
        setGpsMessage('');
        if (location.source !== 'gps') setCurrentLocation(null);
    };

    const handleUseMyLocation = () => {
        if (!navigator.geolocation) {
            setGpsMessage('Location services are not supported by this browser.');
            return;
        }

        setGpsMessage('Finding your current location...');
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                const location: LocationPoint = {
                    name: 'My current location',
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    source: 'gps',
                };
                setCurrentLocation(location);
                setSelectedLocation(location);
                setGpsMessage(isWithinIndiaFocus(coords.latitude, coords.longitude)
                    ? 'Current location found.'
                    : 'Current location is outside the India-focused study area. Assessment can still be explored in the prototype.');
            },
            (error) => {
                const message = error.code === error.PERMISSION_DENIED
                    ? 'Location permission was denied. Allow access to use GPS.'
                    : error.code === error.POSITION_UNAVAILABLE
                        ? 'Your location is currently unavailable.'
                        : 'Unable to determine your location. Please try again.';
                setGpsMessage(message);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
        );
    };

    const handleAddSite = () => {
        if (!selectedLocation || sites.length >= 3) return;
        const duplicate = sites.some((site) =>
            Math.abs(site.latitude - selectedLocation.latitude) < 0.00001
            && Math.abs(site.longitude - selectedLocation.longitude) < 0.00001,
        );
        if (duplicate) return;
        const labels = ['Site A', 'Site B', 'Site C'];
        const label = labels.find((candidate) => !sites.some((site) => site.label === candidate));
        if (!label) return;
        const newSite = {
            id: `site-${label.toLowerCase().replace(' ', '-')}`,
            label,
            name: selectedLocation.name,
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
        };
        setSites([...sites, newSite]);
        setAssessmentData({ ...assessmentData, [newSite.id]: createEmptySiteAssessment() });
        setMethodologyData({ ...methodologyData, [newSite.id]: createEmptySiteMethodology() });
    };

    const handleRemoveSite = (siteId: string) => {
        setSites(sites.filter((site) => site.id !== siteId));
        const nextAssessmentData = { ...assessmentData };
        delete nextAssessmentData[siteId];
        setAssessmentData(nextAssessmentData);
        const nextMethodologyData = { ...methodologyData };
        delete nextMethodologyData[siteId];
        setMethodologyData(nextMethodologyData);
        const nextBackendSiteIds = { ...backendSiteIds };
        delete nextBackendSiteIds[siteId];
        setBackendSiteIds(nextBackendSiteIds);
    };

    const handleClearProject = () => {
        if (!window.confirm('Clear all EcoRisk-GIS project data from this browser? This cannot be undone.')) return;
        skipNextSave.current = true;
        clearProjectSession();
        backendSyncStarted.current = false;
        setSelectedLocation(null);
        setCurrentLocation(null);
        setSites([]);
        setAssessmentData({});
        setMethodologyData({});
        setBackendProjectId(undefined);
        setBackendSiteIds({});
        setAssessmentView(false);
        setMethodologyView(false);
        setMcdaView(false);
        setDecisionView(false);
        setAssessmentMessage('');
        setGpsMessage('');
    };

    const handleAnalyzeSites = () => {
        if (sites.length === 0) {
            setAssessmentMessage('Select at least one assessment site before opening the inventory.');
            return;
        }
        setAssessmentMessage('');
        setAssessmentView(true);
    };

    const handleContinueToMethodologies = () => {
        setAssessmentView(false);
        setMethodologyView(true);
    };

    const handleViewResults = () => {
        setMethodologyView(false);
        setMcdaView(true);
    };

    const handleViewDecision = () => {
        setMcdaView(false);
        setDecisionView(true);
    };

    const handleMethodologyChange = (siteId: string, matrix: Record<string, ImpactLevel | undefined>, observations: AdHocObservation[]) => {
        setMethodologyData({ ...methodologyData, [siteId]: { matrix, observations } });
    };

    const handleAssessmentChange = (siteId: string, category: AssessmentCategory, parameterId: string, value: AssessmentLevel) => {
        setAssessmentData({
            ...assessmentData,
            [siteId]: {
                ...assessmentData[siteId],
                [category]: { ...assessmentData[siteId][category], [parameterId]: value },
            },
        });
    };

    return (
        <div className={assessmentView || methodologyView || mcdaView || decisionView ? 'workspace workspace--assessment' : 'workspace'}>
            {decisionView ? (
                <DecisionSupport sites={sites} assessmentData={assessmentData} methodologyData={methodologyData} onBackToComparison={() => { setDecisionView(false); setMcdaView(true); }} onReviewAssessments={() => { setDecisionView(false); setAssessmentView(true); }} />
            ) : mcdaView ? (
                <MCDAResults sites={sites} assessmentData={assessmentData} onBackToMethodologies={() => { setMcdaView(false); setMethodologyView(true); }} onBackToGis={() => setMcdaView(false)} onViewDecision={handleViewDecision} />
            ) : methodologyView ? (
                <MethodologyWorkspace sites={sites} assessmentData={assessmentData} methodologyData={methodologyData} onMethodologyChange={handleMethodologyChange} onBackToInventory={() => { setMethodologyView(false); setAssessmentView(true); }} onBackToGis={() => setMethodologyView(false)} onViewResults={handleViewResults} />
            ) : assessmentView ? (
                <AssessmentWorkspace sites={sites} assessmentData={assessmentData} onAssessmentChange={handleAssessmentChange} onBack={() => setAssessmentView(false)} onContinue={handleContinueToMethodologies} />
            ) : <>
                <aside className="analysis-panel" aria-label="Location and assessment controls">
                    <div className="panel-intro">
                        <p className="eyebrow">Environmental analysis workspace</p>
                        <h2>Explore a location</h2>
                        <p>Explore any Indian location to begin a preliminary environmental site assessment.</p>
                        <button type="button" className="clear-project-button" onClick={handleClearProject}>Clear Project Data</button>
                    </div>

                    <div className="panel-section">
                        <SectionHeading>Location Search</SectionHeading>
                        <LocationSearch onLocationFound={handleLocationFound} />
                    </div>

                    <div className="panel-section">
                        <SectionHeading>Coordinates</SectionHeading>
                        <CoordinateSearch onLocationFound={handleLocationFound} />
                    </div>

                    <div className="panel-section">
                        <SectionHeading>My Location</SectionHeading>
                        <button type="button" className="secondary-button secondary-button--full" onClick={handleUseMyLocation}>
                            <LocateFixed size={16} />
                            Use My Current Location
                        </button>
                        <p className="field-helper">Use browser GPS to explore your current location.</p>
                        {gpsMessage && <p className={`field-message ${gpsMessage.endsWith('.') && !gpsMessage.includes('permission') ? 'field-message--info' : 'field-message--error'}`}>{gpsMessage}</p>}
                    </div>

                    <div className="panel-section panel-section--sites">
                        <SectionHeading>Assessment Sites</SectionHeading>
                        <SiteList sites={sites} selectedLocation={selectedLocation} onAddSite={handleAddSite} onRemoveSite={handleRemoveSite} />
                    </div>
                </aside>

                <section className="map-workspace" aria-label="GIS map workspace">
                    <GisMap selectedLocation={selectedLocation} currentLocation={currentLocation} sites={sites} />
                </section>

                <AssessmentBar sites={sites} onAnalyze={handleAnalyzeSites} message={assessmentMessage} />
            </>}
        </div>
    );
}

export default EcoRiskWorkspace;