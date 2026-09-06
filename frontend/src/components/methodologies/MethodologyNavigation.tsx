export type MethodologyTab = 'checklist' | 'matrix' | 'adhoc' | 'review';

interface MethodologyNavigationProps {
    activeTab: MethodologyTab;
    onChange: (tab: MethodologyTab) => void;
}

export default function MethodologyNavigation({ activeTab, onChange }: MethodologyNavigationProps) {
    const tabs: { id: MethodologyTab; label: string }[] = [
        { id: 'checklist', label: 'Checklist' },
        { id: 'matrix', label: 'Impact Matrix' },
        { id: 'adhoc', label: 'Ad-Hoc Assessment' },
        { id: 'review', label: 'Methodology Review' },
    ];
    return (
        <nav className="methodology-nav" aria-label="EIA methodologies">
            <span className="methodology-nav__label">EIA Methodologies</span>
            {tabs.map((tab) => <button type="button" key={tab.id} className={activeTab === tab.id ? 'methodology-nav__item methodology-nav__item--active' : 'methodology-nav__item'} onClick={() => onChange(tab.id)}>{tab.label}</button>)}
        </nav>
    );
}

