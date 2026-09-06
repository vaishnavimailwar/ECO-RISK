import { AssessmentCategory, AssessmentCategoryDefinition, SiteAssessment, countCompletedAssessment } from '../../types/assessment';

interface AssessmentCategoryNavProps {
    categories: AssessmentCategoryDefinition[];
    activeCategory: AssessmentCategory | 'review';
    assessment: SiteAssessment;
    onChange: (category: AssessmentCategory | 'review') => void;
}

export default function AssessmentCategoryNav({ categories, activeCategory, assessment, onChange }: AssessmentCategoryNavProps) {
    return (
        <nav className="assessment-category-nav" aria-label="Environmental inventory sections">
            <p className="assessment-nav__title">Environmental Inventory</p>
            {categories.map((category) => {
                const completed = countCompletedAssessment(assessment, category.id);
                return (
                    <button type="button" className={activeCategory === category.id ? 'assessment-nav-item assessment-nav-item--active' : 'assessment-nav-item'} key={category.id} onClick={() => onChange(category.id)}>
                        <span>{category.shortLabel}</span>
                        <small>{completed}/{category.parameters.length}</small>
                    </button>
                );
            })}
            <div className="assessment-nav-divider" />
            <button type="button" className={activeCategory === 'review' ? 'assessment-nav-item assessment-nav-item--active' : 'assessment-nav-item'} onClick={() => onChange('review')}>
                <span>Review Assessment</span>
            </button>
        </nav>
    );
}

