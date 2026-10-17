import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Calculator,
  ShieldCheck,
  AlertCircle,
  CalendarCheck,
  Phone,
  ArrowRight,
  FileText,
  Clock,
  HelpCircle,
  Building,
  Sparkles,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { DEFAULT_SITE_SETTINGS } from '../data/initialData';
import { PaymentPlanType } from '../types';

interface PaymentPlansPageProps {
  onBackToHome: () => void;
  onBookInspection: () => void;
  onSelectPlan: (plan: PaymentPlanType) => void;
  onContactDesk: () => void;
}

export const PaymentPlansPage: React.FC<PaymentPlansPageProps> = ({
  onBackToHome,
  onBookInspection,
  onSelectPlan,
  onContactDesk,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'6_month' | '8_month'>('6_month');
  const [plotCount, setPlotCount] = useState<number>(1);
  const [depositPercent, setDepositPercent] = useState<number>(30);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const pricePerPlot = selectedPlan === '8_month' ? 20000000 : 30000000;
  const durationMonths = selectedPlan === '8_month' ? 8 : 6;
  const totalAmount = pricePerPlot * plotCount;
  const initialDeposit = Math.round(totalAmount * (depositPercent / 100));
  const remainingBalance = totalAmount - initialDeposit;
  const remainingMonths = Math.max(1, durationMonths - 1);
  const monthlyInstallment = Math.round(remainingBalance / remainingMonths);

  const formatCurrency = (val: number) => {
    return '₦' + val.toLocaleString('en-NG');
  };

  const faqs = [
    {
      q: 'What is the current standard payment plan for New Dawn Smart City?',
      a: 'The active standard estate plan commenced on 1 October 2026 at ₦30,000,000 for a prime 500 SQM plot, structured over a 6-month installment spread. An initial deposit provides immediate provisional documentation.',
    },
    {
      q: 'Can I still access the ₦20,000,000 promotional rate?',
      a: 'The advertised promotional offer concluded on 30 September 2026. However, our investment desk can review whether promotional allocations or tailored terms can be approved for qualified buyers.',
    },
    {
      q: 'What documents do I receive upon initial deposit and full completion?',
      a: 'Upon initial deposit, you receive an Official Payment Receipt, Provisional Letter of Allocation, and Contract of Sale. Upon completing your payment spread, you receive the full Deed of Assignment, Registered Survey Plan, and physical plot demarcation.',
    },
    {
      q: 'Can I pay outright for an immediate physical allocation?',
      a: 'Yes. Outright payment is welcomed and qualifies buyers for immediate plot selection, expedited beaconing, and priority access to estate development services.',
    },
    {
      q: 'Are there hidden development levies or unexpected charges?',
      a: 'Consistent Experts operates with 100% transparency. Any documentation fees, registered survey fees, and statutory infrastructure levies are itemized clearly prior to commitment.',
    },
    {
      q: 'What is the topography and soil condition of the estate land?',
      a: 'New Dawn Smart City is 100% dry tableland located in New Asaba, Delta State. It requires zero sand-filling, saving significant construction costs for prospective homeowners and developers.',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50/60 text-neutral-900 pb-20">
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="bg-white border-b border-neutral-200 sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-500 font-medium">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-1.5 text-neutral-700 hover:text-[#E96818] transition-colors font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#E96818]" />
              <span>Back to Home</span>
            </button>
            <span>/</span>
            <span className="text-[#373E0C] font-bold">Payment Plans & Ownership</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBookInspection}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#E96818] hover:bg-[#d65b10] rounded-lg transition-colors cursor-pointer"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Book Inspection</span>
            </button>
            <a
              href="tel:09169508000"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#373E0C] bg-[#F2F6EF] hover:bg-[#373E0C]/10 border border-[#373E0C]/20 rounded-lg transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#E96818]" />
              <span>0916 950 8000</span>
            </a>
          </div>
        </div>
      </div>

      {/* Hero Header Section */}
      <section className="bg-gradient-to-b from-[#F2F6EF] via-white to-neutral-50 pt-14 pb-16 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#373E0C]/20 text-[#373E0C] text-xs font-bold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#E96818]" />
            <span>Transparent Investment & Acquisition Structure</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#373E0C] tracking-tight leading-tight">
            New Dawn Smart City Payment Plans
          </h1>

          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-3xl mx-auto text-pretty">
            Invest in prime 500 SQM residential land in New Asaba, Delta State. Choose from flexible installment structures designed to accommodate your cashflow while securing verified title and estate infrastructure.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-neutral-600 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#E96818]" />
              <span>100% Dry Tableland</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#E96818]" />
              <span>500 SQM Standard Plots</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#E96818]" />
              <span>Zero Sand-Filling Required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#E96818]" />
              <span>Official Registered Documentation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Core Pricing Plans Side-by-Side */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          {/* Active Standard Plan (Featured Card) */}
          <div className="relative bg-white rounded-3xl border-2 border-[#E96818] p-8 sm:p-10 shadow-xl shadow-[#E96818]/10 flex flex-col justify-between order-1 md:order-1">
            <div className="space-y-6">
              {/* Badge */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-white bg-[#E96818] px-4 py-1.5 rounded-lg uppercase tracking-wider shadow-xs">
                  Active Standard Plan
                </span>
                <span className="text-xs font-semibold text-neutral-500">
                  Effective 1 October 2026
                </span>
              </div>

              {/* Title & Tag */}
              <div>
                <h2 className="text-3xl font-extrabold text-[#373E0C]">
                  6 Months Payment Plan
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                  Primary residential plot allocation package with flexible 6-month installment spread.
                </p>
              </div>

              {/* Pricing Display */}
              <div className="py-4 border-y border-neutral-100 space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-extrabold text-[#373E0C] tracking-tight font-mono tabular-nums">
                    ₦30,000,000
                  </span>
                </div>
                <div className="text-sm font-semibold text-neutral-600">
                  Per 500 SQM Residential Plot Parcel
                </div>
              </div>

              {/* Verified Features */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Package Inclusions & Terms
                </div>
                <ul className="space-y-3 text-sm text-neutral-700">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#E96818] shrink-0 mt-0.5" />
                    <span><strong>500 SQM Prime Plot:</strong> Clean layout with clear boundary demarcations.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#E96818] shrink-0 mt-0.5" />
                    <span><strong>6-Month Installment Spread:</strong> Spread remaining payments conveniently.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#E96818] shrink-0 mt-0.5" />
                    <span><strong>Immediate Documentation:</strong> Receive Provisional Allocation Letter upon initial deposit.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#E96818] shrink-0 mt-0.5" />
                    <span><strong>Estate Infrastructure Access:</strong> Gated entry, solar streetlights & paved roads.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#E96818] shrink-0 mt-0.5" />
                    <span><strong>Physical Plot Inspection:</strong> Free scheduled physical tour and site confirmation.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-8 space-y-3">
              <button
                onClick={() => onSelectPlan('6_month_standard')}
                className="w-full flex items-center justify-center gap-2.5 py-4 px-6 text-sm font-bold text-white bg-[#E96818] hover:bg-[#d65b10] active:scale-98 rounded-xl shadow-md shadow-[#E96818]/25 transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Select 6-Month Plan & Reserve</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-center text-neutral-500">
                Initial deposit from 20% to 30% begins provisional allocation
              </p>
            </div>
          </div>

          {/* Promotional Offer Card */}
          <div className="relative bg-white rounded-3xl border-2 border-neutral-200/90 p-8 sm:p-10 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between order-2 md:order-2">
            <div className="space-y-6">
              {/* Badge */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200/80 px-3.5 py-1.5 rounded-lg uppercase tracking-wider">
                  Previous Promotional Offer
                </span>
                <span className="text-xs font-semibold text-neutral-400">
                  Ended 30 Sept 2026
                </span>
              </div>

              {/* Title & Tag */}
              <div>
                <h2 className="text-3xl font-extrabold text-[#373E0C]">
                  8 Months Payment Plan
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                  Flyer promotional benchmark for extended installment allocations.
                </p>
              </div>

              {/* Pricing Display */}
              <div className="py-4 border-y border-neutral-100 space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-extrabold text-[#373E0C] tracking-tight font-mono tabular-nums">
                    ₦20,000,000
                  </span>
                </div>
                <div className="text-sm font-semibold text-neutral-600">
                  Per 500 SQM Residential Plot Parcel
                </div>
              </div>

              {/* Advisory Alert */}
              <div className="bg-amber-50/80 border border-amber-200/70 rounded-2xl p-4 text-xs text-amber-900 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Promotional Status Confirmation Notice</span>
                </div>
                <p className="text-amber-800 leading-relaxed">
                  The advertised promotional deadline of 30 September 2026 has concluded. Prospective investors may contact Consistent Experts to verify if any discretionary allocations or promo extensions remain available.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Promotional Outline
                </div>
                <ul className="space-y-3 text-sm text-neutral-700">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#373E0C] shrink-0 mt-0.5" />
                    <span>Standard 500 SQM residential plot parcel.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#373E0C] shrink-0 mt-0.5" />
                    <span>8-month phased payment schedule.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#373E0C] shrink-0 mt-0.5" />
                    <span>Access to planned estate road network and utilities.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#373E0C] shrink-0 mt-0.5" />
                    <span>Subject to final management clearance.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-8 space-y-3">
              <button
                onClick={() => onSelectPlan('8_month_promo')}
                className="w-full flex items-center justify-center gap-2.5 py-4 px-6 text-sm font-bold text-[#373E0C] bg-[#F2F6EF] hover:bg-[#373E0C] hover:text-white border border-[#373E0C]/30 rounded-xl transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Enquire About Promotional Availability</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-center text-neutral-500">
                Direct inquiry to our sales team for available allocations
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Payment Schedule & Cashflow Calculator */}
        <section className="mt-16 max-w-5xl mx-auto bg-white rounded-3xl border border-neutral-200 p-6 sm:p-10 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#F2F6EF] border border-[#373E0C]/15 flex items-center justify-center text-[#E96818]">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#373E0C]">
                  Interactive Installment & Cashflow Calculator
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500">
                  Simulate your customized payment breakdown for single or multiple plot acquisitions.
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F2F6EF] text-[#373E0C] text-xs font-semibold self-start sm:self-auto">
              <span>Duration: {durationMonths} Months</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 pt-8">
            {/* Input Controls */}
            <div className="lg:col-span-7 space-y-6">
              {/* Select Plan Duration */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                  1. Select Payment Structure
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedPlan('6_month')}
                    className={`py-3 px-4 rounded-xl text-left border transition-all cursor-pointer ${
                      selectedPlan === '6_month'
                        ? 'border-[#E96818] bg-[#E96818]/5 shadow-xs'
                        : 'border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#373E0C]">6 Months Plan (Active)</div>
                    <div className="text-xs text-neutral-500 mt-0.5">₦30,000,000 / plot</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPlan('8_month')}
                    className={`py-3 px-4 rounded-xl text-left border transition-all cursor-pointer ${
                      selectedPlan === '8_month'
                        ? 'border-[#373E0C] bg-[#373E0C]/5 shadow-xs'
                        : 'border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#373E0C]">8 Months Plan (Promo)</div>
                    <div className="text-xs text-neutral-500 mt-0.5">₦20,000,000 / plot</div>
                  </button>
                </div>
              </div>

              {/* Number of Plots */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                  2. Number of 500 SQM Plots
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setPlotCount(count)}
                      className={`py-2.5 text-center text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        plotCount === count
                          ? 'bg-[#373E0C] text-white border-[#373E0C]'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      {count} {count === 1 ? 'Plot' : 'Plots'} ({count * 500}m²)
                    </button>
                  ))}
                </div>
              </div>

              {/* Down Payment % */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                    3. Target Initial Deposit: {depositPercent}%
                  </label>
                  <span className="text-xs font-mono font-bold text-[#E96818]">
                    {formatCurrency(initialDeposit)}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[20, 30, 40, 50].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setDepositPercent(pct)}
                      className={`py-2 text-center text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        depositPercent === pct
                          ? 'bg-[#E96818] text-white border-[#E96818]'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calculation Output Card */}
            <div className="lg:col-span-5 bg-[#F2F6EF]/80 rounded-2xl border border-[#373E0C]/15 p-6 flex flex-col justify-between space-y-6">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#373E0C] mb-3">
                  Summary Estimation
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#373E0C]/10">
                    <span className="text-neutral-600">Total Land Investment:</span>
                    <span className="font-bold text-[#373E0C] font-mono text-sm">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-[#373E0C]/10">
                    <span className="text-neutral-600">Initial Deposit ({depositPercent}%):</span>
                    <span className="font-bold text-[#E96818] font-mono text-sm">
                      {formatCurrency(initialDeposit)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-[#373E0C]/10">
                    <span className="text-neutral-600">Remaining Balance:</span>
                    <span className="font-bold text-neutral-800 font-mono text-sm">
                      {formatCurrency(remainingBalance)}
                    </span>
                  </div>

                  <div className="pt-2 bg-white rounded-xl p-3 border border-[#373E0C]/10">
                    <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wide">
                      Estimated Monthly Spread ({remainingMonths} installments)
                    </div>
                    <div className="text-2xl font-extrabold text-[#373E0C] font-mono mt-1">
                      {formatCurrency(monthlyInstallment)}
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">
                      Spread over remaining {remainingMonths} months following initial deposit
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectPlan(selectedPlan === '6_month' ? '6_month_standard' : '8_month_promo')}
                className="w-full py-3.5 px-4 text-xs font-bold text-white bg-[#373E0C] hover:bg-[#2c320a] rounded-xl transition-all cursor-pointer text-center"
              >
                Proceed With This Calculation
              </button>
            </div>
          </div>
        </section>

        {/* Step-by-Step Acquisition Journey (How to Purchase) */}
        <section className="mt-20 max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#E96818]">
              Seamless 5-Step Roadmap
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#373E0C]">
              How to Acquire Your Plot at New Dawn Smart City
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600">
              From site inspection to physical handover, our streamlined legal process ensures absolute transparency and peace of mind.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                step: '01',
                title: 'Site Inspection',
                desc: 'Schedule a physical walk-through or virtual inspection with our verified agents in New Asaba.',
              },
              {
                step: '02',
                title: 'KYC & Reservation',
                desc: 'Complete the official subscription form and select your preferred plot layout on the masterplan.',
              },
              {
                step: '03',
                title: 'Initial Deposit',
                desc: 'Make your initial deposit into the verified Consistent Experts bank account and receive your receipt.',
              },
              {
                step: '04',
                title: 'Provisional Letter',
                desc: 'Obtain your formal Contract of Sale and Provisional Letter of Allocation guaranteeing your plot parcel.',
              },
              {
                step: '05',
                title: 'Physical Allocation',
                desc: 'Upon full completion, receive your Deed of Assignment, Registered Survey, and plot demarcation beacons.',
              },
            ].map((s) => (
              <div
                key={s.step}
                className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs relative flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="text-2xl font-mono font-extrabold text-[#E96818]">
                    {s.step}
                  </div>
                  <h4 className="text-sm font-bold text-[#373E0C]">
                    {s.title}
                  </h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Payment Security & Anti-Fraud Advisory */}
        <section className="mt-16 max-w-5xl mx-auto bg-[#373E0C] text-white rounded-3xl p-8 sm:p-10 shadow-xl">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#E96818] uppercase tracking-wider">
                <ShieldCheck className="w-5 h-5 text-[#E96818]" />
                <span>Anti-Fraud & Payment Security Notice</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Official Consistent Experts Payment Guidelines
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                To protect our clients, all property payments must be executed strictly to designated corporate accounts in the name of <strong>Consistent Experts</strong>. No agent or staff member is authorized to receive cash or personal account transfers. Always verify invoice account numbers via our official hotlines before transferring funds.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-neutral-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E96818]" />
                  <span>Corporate Bank Transfer Only</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E96818]" />
                  <span>Instant Electronic Receipt Issuance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E96818]" />
                  <span>Hotline Account Verification</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center space-y-3">
              <div className="text-xs font-bold text-neutral-200 uppercase tracking-wider">
                Sales Verification Desk
              </div>
              <div className="text-lg font-bold text-white font-mono">
                0916 950 8000
              </div>
              <div className="text-xs text-neutral-300">
                Plot 20, New Asaba, Delta State
              </div>
              <button
                onClick={onContactDesk}
                className="w-full py-2.5 px-4 text-xs font-bold text-[#373E0C] bg-white hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
              >
                Request Official Invoice
              </button>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions */}
        <section className="mt-16 max-w-4xl mx-auto">
          <div className="text-center mb-10 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[#373E0C]">
              Need Clarity?
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#373E0C]">
              Payment Plans FAQ
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-neutral-50/50 transition-colors"
                  >
                    <span className="text-sm sm:text-base font-bold text-[#373E0C]">
                      {faq.q}
                    </span>
                    <span
                      className={`text-lg font-mono text-[#E96818] transition-transform ${
                        isOpen ? 'rotate-45' : ''
                      }`}
                    >
                      +
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-600 border-t border-neutral-100 leading-relaxed bg-[#F2F6EF]/30">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom Call to Action Strip */}
        <section className="mt-20 max-w-5xl mx-auto bg-white rounded-3xl border border-neutral-200 p-8 sm:p-12 text-center space-y-6 shadow-sm">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#373E0C]">
            Ready to Select Your Plot at New Dawn Smart City?
          </h3>
          <p className="text-sm text-neutral-600 max-w-2xl mx-auto">
            Book a complimentary physical inspection tour with our estate managers or speak directly with our advisory desk to initiate your acquisition.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onBookInspection}
              className="flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-[#E96818] hover:bg-[#d65b10] rounded-xl shadow-md shadow-[#E96818]/25 transition-all cursor-pointer whitespace-nowrap"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Book a Free Site Inspection</span>
            </button>

            <button
              onClick={onContactDesk}
              className="flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-[#373E0C] bg-[#F2F6EF] hover:bg-[#373E0C] hover:text-white border border-[#373E0C]/25 rounded-xl transition-all cursor-pointer whitespace-nowrap"
            >
              <Phone className="w-4 h-4 text-[#E96818]" />
              <span>Speak to Sales Advisory</span>
            </button>

            <button
              onClick={onBackToHome}
              className="px-5 py-3.5 text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
            >
              Back to Overview
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
