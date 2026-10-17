import React, { useState } from 'react';
import { Check, Info, Calculator, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { DEFAULT_SITE_SETTINGS } from '../data/initialData';
import { PaymentPlanType } from '../types';

interface PaymentPlansSectionProps {
  onSelectPlan: (plan: PaymentPlanType) => void;
  onViewFullPage?: () => void;
}

export const PaymentPlansSection: React.FC<PaymentPlansSectionProps> = ({
  onSelectPlan,
  onViewFullPage,
}) => {
  const [calculatorPlan, setCalculatorPlan] = useState<'8_month' | '6_month'>('6_month');
  const [plotCount, setPlotCount] = useState<number>(1);

  const pricePerPlot = calculatorPlan === '8_month' ? 20000000 : 30000000;
  const duration = calculatorPlan === '8_month' ? 8 : 6;
  const totalAmount = pricePerPlot * plotCount;
  const estimatedMonthly = Math.round(totalAmount / duration);

  const formatCurrency = (val: number) => {
    return '₦' + val.toLocaleString('en-NG');
  };

  return (
    <section id="payment-plans" className="py-20 lg:py-28 bg-[#F2F6EF]/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="text-xs font-bold uppercase tracking-wider text-[#373E0C]">
            Investment & Ownership Structure
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#373E0C] tracking-tight">
            Choose Your Payment Plan
          </h2>
          <p className="text-base text-neutral-600 leading-relaxed text-pretty">
            Explore structured land acquisition packages for New Dawn Smart City in New Asaba, Delta State. Compare payment durations and initiate your plot reservation directly.
          </p>

          {onViewFullPage && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onViewFullPage}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#373E0C] hover:bg-[#282d09] rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <span>View Full Dedicated Payment Plans Page</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#E96818]" />
              </button>
            </div>
          )}
        </div>

        {/* Pricing Cards: Side-by-side on desktop, stacked on mobile */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          {/* CARD ONE: Limited-Time Offer (Previous Promotional Offer — Confirmation Required) */}
          <div className="relative bg-white rounded-2xl border-2 border-neutral-200/90 p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            {/* Top Label */}
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-md uppercase tracking-wider">
                  Previous Promotional Offer — Confirmation Required
                </span>
              </div>

              <div className="pt-2">
                <h3 className="text-2xl font-bold text-[#373E0C]">
                  8 Months Payment Plan
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Flyer promotional window: Ended 30 September 2026
                </p>
              </div>

              {/* Price Block */}
              <div className="pt-2 border-b border-neutral-100 pb-5">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-extrabold text-[#373E0C] tracking-tight font-mono tabular-nums">
                    ₦20,000,000
                  </span>
                </div>
                <div className="text-sm font-semibold text-neutral-600 mt-1">
                  Per 500 SQM Plot
                </div>
              </div>

              {/* Verification Advisory */}
              <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-4 text-xs text-amber-900 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Promotional Status Advisory</span>
                </div>
                <p className="text-amber-800 leading-relaxed">
                  The advertised deadline of 30 September 2026 on the flyer has concluded. Please contact Consistent Experts to verify if promotional allocations or discount terms remain available for this plan.
                </p>
              </div>

              {/* Features List */}
              <ul className="space-y-3 pt-2 text-sm text-neutral-700">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#373E0C] shrink-0 mt-0.5" />
                  <span>Standard 500 SQM residential plot parcel</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#373E0C] shrink-0 mt-0.5" />
                  <span>8-month phased payment schedule</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#373E0C] shrink-0 mt-0.5" />
                  <span>Access to estate infrastructure and planned amenities</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#373E0C] shrink-0 mt-0.5" />
                  <span>Subject to current management confirmation</span>
                </li>
              </ul>
            </div>

            {/* CTA Button */}
            <div className="pt-8">
              <button
                onClick={() => onSelectPlan('8_month_promo')}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 text-sm font-bold text-[#373E0C] bg-[#F2F6EF] hover:bg-[#373E0C] hover:text-white border border-[#373E0C]/30 rounded-xl transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Enquire About This Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CARD TWO: Standard Payment Plan (Commenced 1 October 2026) */}
          <div className="relative bg-white rounded-2xl border-2 border-[#E96818] p-8 shadow-lg shadow-[#E96818]/10 flex flex-col justify-between">
            {/* Top Badge */}
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-white bg-[#E96818] px-3.5 py-1 rounded-md uppercase tracking-wider shadow-xs">
                  Active Standard Plan
                </span>
                <span className="text-xs font-semibold text-neutral-500">
                  Commenced 1 Oct 2026
                </span>
              </div>

              <div className="pt-2">
                <h3 className="text-2xl font-bold text-[#373E0C]">
                  6 Months Payment Plan
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Active estate payment structure for residential plot allocation
                </p>
              </div>

              {/* Price Block */}
              <div className="pt-2 border-b border-neutral-100 pb-5">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-extrabold text-[#373E0C] tracking-tight font-mono tabular-nums">
                    ₦30,000,000
                  </span>
                </div>
                <div className="text-sm font-semibold text-neutral-600 mt-1">
                  Per 500 SQM Plot
                </div>
              </div>

              {/* Verified Features List */}
              <ul className="space-y-3 pt-2 text-sm text-neutral-700">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#E96818] shrink-0 mt-0.5" />
                  <span className="font-semibold text-neutral-900">
                    Prime 500 SQM residential plot allocation
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#E96818] shrink-0 mt-0.5" />
                  <span>Structured 6-month installment spread</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#E96818] shrink-0 mt-0.5" />
                  <span>Full access to New Dawn Smart City estate network</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#E96818] shrink-0 mt-0.5" />
                  <span>Immediate provisional documentation upon initial deposit</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#E96818] shrink-0 mt-0.5" />
                  <span>Physical plot inspection and survey verification</span>
                </li>
              </ul>
            </div>

            {/* CTA Button */}
            <div className="pt-8">
              <button
                onClick={() => onSelectPlan('6_month_standard')}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 text-sm font-bold text-white bg-[#E96818] hover:bg-[#d65b10] active:scale-98 rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Enquire About This Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Payment Schedule & Cashflow Estimate */}
        <div className="mt-14 max-w-4xl mx-auto bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2.5 text-[#373E0C] font-bold text-lg mb-4">
            <Calculator className="w-5 h-5 text-[#E96818]" />
            <h3>Estimated Payment Spread Calculator</h3>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-2">
                Select Plan
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCalculatorPlan('6_month')}
                  className={`py-2 px-3 text-xs font-bold rounded-lg border transition-colors whitespace-nowrap ${
                    calculatorPlan === '6_month'
                      ? 'bg-[#373E0C] text-white border-[#373E0C]'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  6 Months (₦30M)
                </button>
                <button
                  type="button"
                  onClick={() => setCalculatorPlan('8_month')}
                  className={`py-2 px-3 text-xs font-bold rounded-lg border transition-colors whitespace-nowrap ${
                    calculatorPlan === '8_month'
                      ? 'bg-[#373E0C] text-white border-[#373E0C]'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  8 Months (₦20M)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-2">
                Number of 500 SQM Plots
              </label>
              <select
                value={plotCount}
                onChange={(e) => setPlotCount(Number(e.target.value))}
                className="w-full py-2 px-3 text-xs font-semibold text-neutral-800 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-[#E96818]"
              >
                <option value={1}>1 Plot (500 SQM)</option>
                <option value={2}>2 Plots (1,000 SQM)</option>
                <option value={3}>3 Plots (1,500 SQM)</option>
                <option value={4}>4 Plots (2,000 SQM)</option>
              </select>
            </div>

            <div className="bg-[#F2F6EF] p-4 rounded-xl border border-[#373E0C]/10 flex flex-col justify-center">
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wide">
                Est. Monthly Installment ({duration} mos)
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-[#373E0C] font-mono tabular-nums">
                {formatCurrency(estimatedMonthly)}
              </span>
              <span className="text-[10px] text-neutral-500 mt-0.5">
                Total: {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>

          <p className="text-xs text-neutral-500 italic">
            * Note: Installment estimates are illustrative calculations based on even monthly distribution. Initial deposit requirements, milestone releases, and promotional terms are subject to formal confirmation by Consistent Experts.
          </p>
        </div>

        {/* Mandated Disclaimer Note */}
        <div className="mt-8 text-center text-xs text-neutral-500 max-w-3xl mx-auto flex items-center justify-center gap-2">
          <Info className="w-4 h-4 text-neutral-400 shrink-0" />
          <span>
            Prices, availability, promotional terms, and payment conditions are subject to confirmation by Consistent Experts.
          </span>
        </div>
      </div>
    </section>
  );
};
