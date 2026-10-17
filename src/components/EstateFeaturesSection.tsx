import React from 'react';
import { Zap, Sun, Milestone, ShieldCheck, Lock, Trees } from 'lucide-react';
import { ESTATE_FEATURES } from '../data/initialData';

export const EstateFeaturesSection: React.FC = () => {
  // Map icons to features
  const getIcon = (id: string) => {
    switch (id) {
      case 'electricity':
        return <Zap className="w-6 h-6 text-[#E96818]" />;
      case 'street-lights':
        return <Sun className="w-6 h-6 text-[#E96818]" />;
      case 'roads':
        return <Milestone className="w-6 h-6 text-[#E96818]" />;
      case 'gated-community':
        return <ShieldCheck className="w-6 h-6 text-[#E96818]" />;
      case 'security':
        return <Lock className="w-6 h-6 text-[#E96818]" />;
      case 'serene-environment':
        return <Trees className="w-6 h-6 text-[#E96818]" />;
      default:
        return <ShieldCheck className="w-6 h-6 text-[#E96818]" />;
    }
  };

  return (
    <section id="features" className="py-20 lg:py-28 bg-[#F2F6EF]/70 backdrop-blur-[2px] relative z-10 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-bold uppercase tracking-wider text-[#373E0C]">
            Infrastructure & Masterplan
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#373E0C] tracking-tight mt-2">
            Estate Features & Living Environment
          </h2>
          <p className="text-base text-neutral-600 leading-relaxed mt-4 text-pretty">
            New Dawn Smart City is planned with essential modern infrastructure designed to support a serene, orderly, and secure residential community in New Asaba.
          </p>
        </div>

        {/* 6-Item Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {ESTATE_FEATURES.map((feature, idx) => (
            <div
              key={feature.id}
              className="group relative bg-white/85 hover:bg-white border border-neutral-200/90 hover:border-[#373E0C]/30 rounded-2xl p-7 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Category & Index Indicator */}
                <div className="flex items-center justify-between text-xs font-semibold text-neutral-400 mb-5">
                  <span className="text-[#373E0C] font-mono tracking-wider">
                    0{idx + 1}
                  </span>
                  <span className="text-neutral-500 font-medium">
                    {feature.category}
                  </span>
                </div>

                {/* Icon Container */}
                <div className="w-12 h-12 rounded-xl bg-white border border-neutral-200/90 shadow-xs flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-200">
                  {getIcon(feature.id)}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-[#373E0C] tracking-tight mb-2">
                  {feature.title}
                </h3>

                {/* Description (Exact flyer wording) */}
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Sub-note */}
              <div className="mt-6 pt-4 border-t border-neutral-200/60 text-[11px] font-medium text-neutral-500 flex items-center gap-1.5">
                <span>Integrated estate provision</span>
              </div>
            </div>
          ))}
        </div>

        {/* Development Note */}
        <div className="mt-12 p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 text-center max-w-3xl mx-auto">
          Features represent the master-planned infrastructural design and operational specifications for New Dawn Smart City. Implementation is carried out under the professional development supervision of Consistent Experts.
        </div>
      </div>
    </section>
  );
};
