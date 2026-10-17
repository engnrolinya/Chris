import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldAlert } from 'lucide-react';
import { FAQ_ITEMS } from '../data/initialData';

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 lg:py-28 bg-[#F2F6EF]/40 border-t border-neutral-100 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-bold uppercase tracking-wider text-[#373E0C]">
            Questions & Answers
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#373E0C] tracking-tight mt-2">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-neutral-600 mt-3 leading-relaxed">
            Essential facts, payment plan clarifications, and independent verification guidance for prospective property owners at New Dawn Smart City.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-expanded={isOpen}
                  className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 hover:bg-neutral-50/70 transition-colors cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-[#373E0C]">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-neutral-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180 text-[#E96818]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 bg-neutral-50/30 animate-in fade-in duration-150">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Due Diligence Advisory Box */}
        <div className="mt-12 p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs sm:text-sm space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Important Real Estate Due Diligence Notice</span>
          </div>
          <p className="leading-relaxed text-amber-800">
            Consistent Experts supports safe, transparent transactions. We encourage all prospective buyers to independently verify survey coordinates, layout charts, and title documentation with registered surveyors and legal practitioners prior to executing binding transactions.
          </p>
        </div>
      </div>
    </section>
  );
};
