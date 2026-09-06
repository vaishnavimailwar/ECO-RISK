import { AssessmentLevel, AssessmentParameter as ParameterDefinition, ASSESSMENT_LEVELS } from '../../types/assessment';

interface AssessmentParameterProps {
    parameter: ParameterDefinition;
    value: AssessmentLevel | undefined;
    onChange: (value: AssessmentLevel) => void;
}

export default function AssessmentParameter({ parameter, value, onChange }: AssessmentParameterProps) {
    return (
        <div className="assessment-parameter">
            <div className="assessment-parameter__label">
                <span>{parameter.label}</span>
                <small>{value || 'Not assessed'}</small>
            </div>
            <div className="assessment-scale" role="radiogroup" aria-label={parameter.label}>
                {ASSESSMENT_LEVELS.map((level) => (
                    <label className={value === level ? 'assessment-scale__option assessment-scale__option--selected' : 'assessment-scale__option'} key={level}>
                        <input type="radio" name={parameter.id} value={level} checked={value === level} onChange={() => onChange(level)} />
                        <span>{level}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}
