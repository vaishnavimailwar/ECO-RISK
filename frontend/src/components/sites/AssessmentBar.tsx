import { ArrowRight, MapPin } from 'lucide-react';
import { AssessmentSite } from '../../types/location';

interface AssessmentBarProps {
    sites: AssessmentSite[];
    onAnalyze: () => void;
    message: string;
}

export default function AssessmentBar({ sites, onAnalyze, message }: AssessmentBarProps) {
    const labels = ['Site A', 'Site B', 'Site C'];
    return (
        <section className="assessment-bar" aria-label="Selected assessment sites">
            <div className="assessment-summary">
                <div className="assessment-summary__title">
                    <MapPin size={17} />
                    <div>
                        <span>Assessment Sites</span>
                        <strong>{sites.length} of 3 sites selected</strong>
                    </div>
                </div>
                <div className="assessment-sites">
                    {labels.map((label) => {
                        const site = sites.find((candidate) => candidate.label === label);
                        return (
                            <div className="assessment-site" key={label}>
                                <span>{label}</span>
                                <strong>{site ? site.name.split(',')[0] : '—'}</strong>
                            </div>
                        );
                    })}
                </div>
            </div>
            <button type="button" className={sites.length ? 'primary-button' : 'primary-button primary-button--disabled'} onClick={onAnalyze}>
                Analyze Selected Sites
                <ArrowRight size={17} />
            </button>
            {message && <p className="assessment-bar__message">{message}</p>}
        </section>
    );
}

