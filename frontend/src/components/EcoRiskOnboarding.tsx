import { useEffect, useState } from 'react';
import {
  Building2,
  Home,
  Factory,
  Landmark,
  MapPin,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Leaf,
  Loader2,
  Sparkles,
} from 'lucide-react';

type ProjectType =
  | 'Residential'
  | 'Commercial'
  | 'Industrial'
  | 'Infrastructure'
  | 'Other';

interface EcoRiskOnboardingProps {
  onComplete: (project: {
    name: string;
    type: ProjectType;
    description: string;
    location: string;
  }) => void;
}

const projectTypes = [
  {
    type: 'Residential' as ProjectType,
    icon: Home,
    title: 'Residential',
    description: 'Housing, apartments and residential developments',
  },
  {
    type: 'Commercial' as ProjectType,
    icon: Building2,
    title: 'Commercial',
    description: 'Offices, malls, business and commercial projects',
  },
  {
    type: 'Industrial' as ProjectType,
    icon: Factory,
    title: 'Industrial',
    description: 'Manufacturing plants and industrial facilities',
  },
  {
    type: 'Infrastructure' as ProjectType,
    icon: Landmark,
    title: 'Infrastructure',
    description: 'Roads, bridges, utilities and public infrastructure',
  },
  {
    type: 'Other' as ProjectType,
    icon: Leaf,
    title: 'Other Development',
    description: 'Any other proposed development or activity',
  },
];

export default function EcoRiskOnboarding({
  onComplete,
}: EcoRiskOnboardingProps) {
  const [phase, setPhase] = useState<'splash' | 'welcome' | 'type' | 'details' | 'location'>('splash');

  const [projectType, setProjectType] = useState<ProjectType | null>(null);
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('welcome');
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  /* ================= SPLASH ================= */

  if (phase === 'splash') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07110d] overflow-hidden">
        <div className="text-center relative">

          <div className="absolute inset-0 blur-3xl bg-emerald-500/10 rounded-full scale-150" />

          <div className="relative flex justify-center mb-8">
            <div className="w-24 h-24 rounded-3xl border border-emerald-400/30 bg-emerald-400/10 flex items-center justify-center shadow-2xl">
              <Leaf className="w-12 h-12 text-emerald-400" />
            </div>
          </div>

          <h1 className="relative text-5xl md:text-7xl font-black tracking-[0.18em] text-white">
            ECO<span className="text-emerald-400">-RISK</span>
          </h1>

          <p className="relative mt-4 text-emerald-200/60 tracking-[0.35em] uppercase text-sm">
            Environmental Risk Intelligence
          </p>

          <div className="relative mt-12 flex flex-col items-center gap-3">
            <Loader2 className="w-7 h-7 text-emerald-400 animate-spin" />
            <p className="text-sm text-slate-400 tracking-wide">
              Initializing Environmental Intelligence System
            </p>
          </div>

        </div>
      </div>
    );
  }

  /* ================= WELCOME ================= */

  if (phase === 'welcome') {
    return (
      <div className="min-h-screen bg-[#07110d] text-white flex items-center justify-center p-6">

        <div className="max-w-3xl w-full text-center">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 text-emerald-300 text-sm mb-8">
            <Sparkles size={16} />
            AI-Powered Environmental Assessment
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Build Smarter.
            <br />
            <span className="text-emerald-400">
              Assess Before You Build.
            </span>
          </h1>

          <p className="mt-7 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            ECO-RISK helps evaluate environmental sensitivity and potential
            ecological risks before starting a development or construction
            project.
          </p>

          <button
            onClick={() => setPhase('type')}
            className="mt-10 inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition"
          >
            Start Environmental Assessment
            <ArrowRight size={20} />
          </button>

        </div>

      </div>
    );
  }

  /* ================= PROJECT TYPE ================= */

  if (phase === 'type') {
    return (
      <div className="min-h-screen bg-[#07110d] text-white p-6">

        <div className="max-w-6xl mx-auto py-12">

          <button
            onClick={() => setPhase('welcome')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition mb-10"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="max-w-3xl mb-12">

            <p className="text-emerald-400 font-semibold text-sm tracking-widest uppercase">
              Step 1 of 3
            </p>

            <h2 className="text-4xl md:text-5xl font-bold mt-4">
              What are you planning to build?
            </h2>

            <p className="text-slate-400 mt-4 text-lg">
              Select the type of proposed development.
              ECO-RISK will tailor the environmental assessment accordingly.
            </p>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

            {projectTypes.map((project) => {
              const Icon = project.icon;
              const selected = projectType === project.type;

              return (
                <button
                  key={project.type}
                  onClick={() => setProjectType(project.type)}
                  className={`text-left p-7 rounded-2xl border transition-all ${
                    selected
                      ? 'border-emerald-400 bg-emerald-400/10'
                      : 'border-white/10 bg-white/[0.03] hover:border-emerald-400/40'
                  }`}
                >

                  <div className="flex justify-between">

                    <div className="w-12 h-12 rounded-xl bg-emerald-400/10 flex items-center justify-center">
                      <Icon className="text-emerald-400" size={24} />
                    </div>

                    {selected && (
                      <CheckCircle2 className="text-emerald-400" />
                    )}

                  </div>

                  <h3 className="text-xl font-bold mt-6">
                    {project.title}
                  </h3>

                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                    {project.description}
                  </p>

                </button>
              );
            })}

          </div>

          <div className="flex justify-end mt-10">

            <button
              disabled={!projectType}
              onClick={() => setPhase('details')}
              className="inline-flex items-center gap-3 px-7 py-3 rounded-xl bg-emerald-500 text-black font-bold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue
              <ArrowRight size={18} />
            </button>

          </div>

        </div>

      </div>
    );
  }

  /* ================= DETAILS ================= */

  if (phase === 'details') {
    return (
      <div className="min-h-screen bg-[#07110d] text-white p-6">

        <div className="max-w-3xl mx-auto py-12">

          <button
            onClick={() => setPhase('type')}
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-10"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <p className="text-emerald-400 font-semibold text-sm tracking-widest uppercase">
            Step 2 of 3
          </p>

          <h2 className="text-4xl font-bold mt-4">
            Tell us about your project
          </h2>

          <p className="text-slate-400 mt-3">
            Add basic details about the proposed development.
          </p>

          <div className="mt-10 space-y-6">

            <div>
              <label className="text-sm text-slate-300">
                Project Name
              </label>

              <input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Example: Green Valley Residential Project"
                className="mt-2 w-full px-5 py-4 rounded-xl bg-white/[0.04] border border-white/10 focus:border-emerald-400 outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">
                Project Type
              </label>

              <div className="mt-2 px-5 py-4 rounded-xl bg-white/[0.04] border border-emerald-400/20 text-emerald-300">
                {projectType}
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-300">
                Brief Description
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the proposed development..."
                rows={5}
                className="mt-2 w-full px-5 py-4 rounded-xl bg-white/[0.04] border border-white/10 focus:border-emerald-400 outline-none resize-none"
              />
            </div>

          </div>

          <div className="flex justify-end mt-10">

            <button
              disabled={!projectName.trim()}
              onClick={() => setPhase('location')}
              className="inline-flex items-center gap-3 px-7 py-3 rounded-xl bg-emerald-500 text-black font-bold disabled:opacity-40"
            >
              Continue
              <ArrowRight size={18} />
            </button>

          </div>

        </div>

      </div>
    );
  }

  /* ================= LOCATION ================= */

  return (
    <div className="min-h-screen bg-[#07110d] text-white p-6">

      <div className="max-w-3xl mx-auto py-12">

        <button
          onClick={() => setPhase('details')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-10"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <p className="text-emerald-400 font-semibold text-sm tracking-widest uppercase">
          Step 3 of 3
        </p>

        <h2 className="text-4xl font-bold mt-4">
          Where is the project located?
        </h2>

        <p className="text-slate-400 mt-3">
          Enter the proposed project location to begin environmental analysis.
        </p>

        <div className="mt-10">

          <label className="text-sm text-slate-300">
            Project Location
          </label>

          <div className="relative mt-2">

            <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-400" />

            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Search city, district, village or coordinates"
              className="w-full pl-14 pr-5 py-4 rounded-xl bg-white/[0.04] border border-white/10 focus:border-emerald-400 outline-none"
            />

          </div>

        </div>

        <div className="mt-10 p-6 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.03]">

          <div className="flex gap-4">

            <div className="w-11 h-11 rounded-xl bg-emerald-400/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="text-emerald-400" />
            </div>

            <div>

              <h3 className="font-semibold">
                Location-Based Environmental Analysis
              </h3>

              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                ECO-RISK will use geographical, environmental and ecological
                parameters to support site-level impact assessment.
              </p>

            </div>

          </div>

        </div>

        <button
          disabled={!location.trim() || !projectType}
          onClick={() =>
            onComplete({
              name: projectName,
              type: projectType!,
              description,
              location,
            })
          }
          className="mt-10 w-full flex items-center justify-center gap-3 px-7 py-4 rounded-xl bg-emerald-500 text-black font-bold disabled:opacity-40"
        >
          Start ECO-RISK Assessment
          <ArrowRight size={20} />
        </button>

      </div>

    </div>
  );
}