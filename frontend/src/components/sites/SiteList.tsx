import { MapPin, Plus, X } from 'lucide-react';
import { AssessmentSite, LocationPoint } from '../../types/location';

interface SiteListProps {
    sites: AssessmentSite[];
    selectedLocation: LocationPoint | null;
    onAddSite: () => void;
    onRemoveSite: (siteId: string) => void;
}

const labels = ['Site A', 'Site B', 'Site C'];

export default function SiteList({ sites, selectedLocation, onAddSite, onRemoveSite }: SiteListProps) {
    const canAddSite = selectedLocation !== null && sites.length < labels.length;
    const nextLabel = labels.find((label) => !sites.some((site) => site.label === label)) || labels[0];
    const duplicate = selectedLocation && sites.some(
        (site) => Math.abs(site.latitude - selectedLocation.latitude) < 0.00001
            && Math.abs(site.longitude - selectedLocation.longitude) < 0.00001,
    );

    return (
        <>
            {selectedLocation && (
                <div className="selected-location">
                    <div className="selected-location__heading">
                        <MapPin size={15} />
                        <span>Selected location</span>
                    </div>
                    <strong>{selectedLocation.name.split(',')[0]}</strong>
                    <span className="selected-location__coordinates">
                        {selectedLocation.latitude.toFixed(5)}, {selectedLocation.longitude.toFixed(5)}
                    </span>
                    <button type="button" className="add-site-button" onClick={onAddSite} disabled={!canAddSite || Boolean(duplicate)}>
                        <Plus size={15} />
                        {duplicate ? 'Already added' : sites.length === 3 ? 'All sites selected' : `Add as ${nextLabel}`}
                    </button>
                </div>
            )}
            <div className="site-slots">
                {labels.map((label) => {
                    const site = sites.find((candidate) => candidate.label === label);
                    return (
                        <div className={`site-slot ${site ? 'site-slot--selected' : ''}`} key={label}>
                            <div className="site-slot__icon"><MapPin size={17} /></div>
                            <div className="site-slot__content">
                                <p>{label}</p>
                                {site ? (
                                    <>
                                        <span className="site-slot__name">{site.name.split(',')[0]}</span>
                                        <span>{site.latitude.toFixed(4)}, {site.longitude.toFixed(4)}</span>
                                    </>
                                ) : <span>Not selected</span>}
                            </div>
                            {site && (
                                <button type="button" className="remove-site-button" onClick={() => onRemoveSite(site.id)} aria-label={`Remove ${label}`}>
                                    <X size={15} />
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
            {sites.length === 3 && <p className="field-message field-message--info">Three assessment sites selected. Remove a site to choose another.</p>}
        </>
    );
}

