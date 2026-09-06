import { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Building2,
  Factory,
  Home,
  Landmark,
  MapPin,
  Check,
  Globe2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface EcoRiskOnboardingProps {
  onComplete: () => void;
}

type ProjectType =
  | 'Residential'
  | 'Commercial'
  | 'Industrial'
  | 'Infrastructure';

export default function EcoRiskOnboarding({
  onComplete,
}: EcoRiskOnboardingProps) {
  const [step, setStep] = useState(0);
  const [projectType, setProjectType] =
    useState<ProjectType | null>(null);

  const projectTypes = [
    {
      name: 'Residential' as ProjectType,
      description:
        'Housing layouts, apartments and residential development projects',
      icon: Home,
    },
    {
      name: 'Commercial' as ProjectType,
      description:
        'Offices, business complexes, shopping and commercial developments',
      icon: Building2,
    },
    {
      name: 'Industrial' as ProjectType,
      description:
        'Manufacturing plants, industrial facilities and processing units',
      icon: Factory,
    },
    {
      name: 'Infrastructure' as ProjectType,
      description:
        'Roads, railways, utilities and large-scale public infrastructure',
      icon: Landmark,
    },
  ];

  const nextStep = () => {
    if (step === 0) {
      setStep(1);
      return;
    }

    if (step === 1 && projectType) {
      setStep(2);
      return;
    }

    if (step === 2) {
      localStorage.setItem('eco-risk-onboarding-complete', 'true');

      if (projectType) {
        localStorage.setItem(
          'eco-risk-project-type',
          projectType,
        );
      }

      onComplete();
    }
  };

  const previousStep = () => {
    if (step > 0) {
      setStep((current) => current - 1);
    }
  };

  const steps = [
    'Welcome',
    'Project Type',
    'Start Assessment',
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-6xl">

        {/* Top progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-3 mb-4">
            {steps.map((label, index) => {
              const active = index === step;
              const completed = index < step;

              return (
                <div
                  key={label}
                  className="flex items-center flex-1 last:flex-none"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={[
                        'w-9 h-9 rounded-full flex items-center justify-center',
                        'text-sm font-bold transition-all',
                        completed
                          ? 'bg-blue-600 text-white'
                          : active
                            ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                            : 'bg-white border border-slate-200 text-slate-400',
                      ].join(' ')}
                    >
                      {completed ? (
                        <Check size={17} />
                      ) : (
                        index + 1
                      )}
                    </div>

                    <span
                      className={[
                        'hidden md:block text-sm font-semibold whitespace-nowrap',
                        active
                          ? 'text-blue-700'
                          : 'text-slate-400',
                      ].join(' ')}
                    >
                      {label}
                    </span>
                  </div>

                  {index !== steps.length - 1 && (
                    <div
                      className={[
                        'h-px flex-1 mx-4',
                        index < step
                          ? 'bg-blue-500'
                          : 'bg-slate-200',
                      ].join(' ')}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main card */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden">

          {/* Header */}
          <div className="border-b border-slate-100 px-6 sm:px-10 py-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl">
                🌍
              </div>

              <div>
                <h1 className="text-lg font-bold text-slate-900">
                  EcoRisk-GIS AI
                </h1>

                <p className="text-sm text-slate-500">
                  Environmental Site Assessment & Decision Support
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Decision Support Platform
            </div>
          </div>

          {/* STEP 1 */}
          {step === 0 && (
            <div className="px-6 sm:px-12 py-12 sm:py-20 text-center">

              <div className="w-20 h-20 mx-auto mb-7 rounded-3xl bg-blue-50 flex items-center justify-center">
                <Globe2
                  size={38}
                  className="text-blue-600"
                />
              </div>

              <div className="max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6">
                  <Sparkles size={15} />
                  AI-Assisted Environmental Intelligence
                </div>

                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-6">
                  Welcome to EcoRisk-GIS AI
                </h2>

                <p className="text-base sm:text-lg leading-8 text-slate-600">
                  Start by defining your development project and
                  selecting the location for environmental site
                  assessment.
                </p>

                <p className="text-base sm:text-lg leading-8 text-slate-600 mt-4">
                  EcoRisk helps analyse environmental sensitivity,
                  compare potential sites and support informed
                  development decisions.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mt-12 max-w-3xl mx-auto text-left">
                <Feature
                  icon={<MapPin size={20} />}
                  title="Explore Locations"
                  description="Search and analyse candidate sites"
                />

                <Feature
                  icon={<ShieldCheck size={20} />}
                  title="Assess Environmental Risk"
                  description="Evaluate multiple environmental parameters"
                />

                <Feature
                  icon={<Sparkles size={20} />}
                  title="Decision Support"
                  description="Compare sites using structured analysis"
                />
              </div>

              <button
                onClick={nextStep}
                className="mt-12 inline-flex items-center gap-3 px-7 py-3.5 rounded-xl bg-blue-600 text-white font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors"
              >
                Begin Assessment
                <ArrowRight size={19} />
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 1 && (
            <div className="px-6 sm:px-12 py-12">

              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                  <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <Building2
                      size={30}
                      className="text-blue-600"
                    />
                  </div>

                  <h2 className="text-3xl font-bold text-slate-900">
                    What are you planning to build?
                  </h2>

                  <p className="text-slate-600 mt-3">
                    Select the project category. This helps EcoRisk
                    contextualise the environmental assessment.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  {projectTypes.map((project) => {
                    const Icon = project.icon;
                    const selected =
                      projectType === project.name;

                    return (
                      <button
                        key={project.name}
                        onClick={() =>
                          setProjectType(project.name)
                        }
                        className={[
                          'relative text-left rounded-2xl border p-6 transition-all',
                          selected
                            ? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-100'
                            : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm',
                        ].join(' ')}
                      >
                        {selected && (
                          <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                            <Check size={15} />
                          </div>
                        )}

                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center mb-5">
                          <Icon
                            size={24}
                            className="text-blue-600"
                          />
                        </div>

                        <h3 className="text-lg font-bold text-slate-900">
                          {project.name}
                        </h3>

                        <p className="text-sm leading-6 text-slate-500 mt-2">
                          {project.description}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between mt-10">
                  <button
                    onClick={previousStep}
                    className="inline-flex items-center gap-2 px-5 py-3 text-slate-600 font-semibold hover:text-slate-900"
                  >
                    <ArrowLeft size={18} />
                    Back
                  </button>

                  <button
                    onClick={nextStep}
                    disabled={!projectType}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                  >
                    Continue
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 2 && (
            <div className="px-6 sm:px-12 py-16 sm:py-20 text-center">

              <div className="w-20 h-20 mx-auto mb-7 rounded-full bg-blue-50 flex items-center justify-center">
                <Check
                  size={38}
                  className="text-blue-600"
                />
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Your assessment workspace is ready
              </h2>

              <p className="max-w-xl mx-auto mt-5 text-slate-600 text-lg leading-8">
                Project category selected:
              </p>

              <div className="inline-flex mt-4 px-5 py-2.5 rounded-xl bg-blue-50 text-blue-700 font-bold">
                {projectType}
              </div>

              <p className="max-w-xl mx-auto mt-8 text-slate-500 leading-7">
                Next, select one or more locations on the map and
                begin the environmental site assessment.
              </p>

              <div className="flex items-center justify-center gap-4 mt-10">
                <button
                  onClick={previousStep}
                  className="inline-flex items-center gap-2 px-5 py-3 text-slate-600 font-semibold"
                >
                  <ArrowLeft size={18} />
                  Back
                </button>

                <button
                  onClick={nextStep}
                  className="inline-flex items-center gap-3 px-7 py-3.5 rounded-xl bg-blue-600 text-white font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors"
                >
                  Open Workspace
                  <ArrowRight size={19} />
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-slate-400 mt-6">
          EcoRisk-GIS AI • Environmental Intelligence & Decision Support
        </p>
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-5 rounded-2xl border border-slate-200 bg-white">
      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
        {icon}
      </div>

      <h3 className="font-bold text-slate-900">
        {title}
      </h3>

      <p className="text-sm text-slate-500 leading-6 mt-2">
        {description}
      </p>
    </div>
  );
}