import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, AlertCircle, Phone, MessageSquare, Mail, Calendar, HelpCircle, ShieldCheck } from 'lucide-react';
import { EnquiryFormData, EnquiryType, PaymentPlanType, ContactMethod } from '../types';
import { EnquiryService } from '../services/enquiryService';
import { DEFAULT_SITE_SETTINGS } from '../data/initialData';

interface EnquiryFormSectionProps {
  initialPlan?: PaymentPlanType;
  initialType?: EnquiryType;
  onOpenPrivacyPolicy: () => void;
}

export const EnquiryFormSection: React.FC<EnquiryFormSectionProps> = ({
  initialPlan,
  initialType,
  onOpenPrivacyPolicy,
}) => {
  const [formData, setFormData] = useState<EnquiryFormData>({
    fullName: '',
    phone: '',
    email: '',
    preferredContactMethod: 'phone',
    enquiryType: initialType || 'price_enquiry',
    preferredPaymentPlan: initialPlan || '6_month_standard',
    propertySize: '500_sqm',
    preferredInspectionDate: '',
    message: '',
    consent: false,
    honeypot: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submittedEnquiryId, setSubmittedEnquiryId] = useState<string>('');
  const [serverError, setServerError] = useState<string | null>(null);

  // Sync external preselection
  useEffect(() => {
    if (initialPlan) {
      setFormData((prev) => ({ ...prev, preferredPaymentPlan: initialPlan }));
    }
  }, [initialPlan]);

  useEffect(() => {
    if (initialType) {
      setFormData((prev) => ({ ...prev, enquiryType: initialType }));
    }
  }, [initialType]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Please enter your full name (at least 3 characters).';
    }

    const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      newErrors.phone = 'Please enter a valid telephone number with area code.';
    }

    if (formData.email && formData.email.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please provide a valid email format (e.g., name@example.com).';
      }
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = 'Please provide details about your enquiry (minimum 10 characters).';
    } else if (formData.message.trim().length > 1500) {
      newErrors.message = 'Message must be under 1500 characters.';
    }

    if (!formData.consent) {
      newErrors.consent = 'You must agree to be contacted and acknowledge the privacy policy.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await EnquiryService.submitEnquiry(formData, 'Customer Enquiry Form Section');

      if (result.success && result.enquiry) {
        setSubmittedEnquiryId(result.enquiry.id);
        setSubmissionSuccess(true);
      } else {
        setServerError(result.error || 'Failed to submit enquiry. Please try again or reach us by telephone.');
      }
    } catch {
      setServerError('A network error occurred. Your information is preserved; please retry or contact our hotline directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmissionSuccess(false);
    setSubmittedEnquiryId('');
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      preferredContactMethod: 'phone',
      enquiryType: 'price_enquiry',
      preferredPaymentPlan: '6_month_standard',
      propertySize: '500_sqm',
      preferredInspectionDate: '',
      message: '',
      consent: false,
      honeypot: '',
    });
    setErrors({});
  };

  return (
    <section id="contact-form" className="py-20 lg:py-28 bg-white/85 backdrop-blur-[2px] relative z-10 border-t border-neutral-100 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Form Container */}
        <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xl overflow-hidden">
          {/* Header Banner */}
          <div className="bg-[#373E0C] text-white p-8 sm:p-10">
            <div className="text-xs font-bold uppercase tracking-wider text-[#E96818]">
              Direct Developer Contact
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white">
              Interested in New Dawn Smart City?
            </h2>
            <p className="text-sm sm:text-base text-neutral-200 mt-2 leading-relaxed">
              Have questions about pricing, availability, payment plans, or property inspections? Send us a message and our team will follow up.
            </p>
          </div>

          <div className="p-8 sm:p-10">
            {submissionSuccess ? (
              /* Success State */
              <div className="text-center py-12 px-4 space-y-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-extrabold text-[#373E0C]">
                    Enquiry Successfully Received
                  </h3>
                  <p className="text-sm text-neutral-600 max-w-lg mx-auto">
                    Thank you for your interest in New Dawn Smart City. Your enquiry has been securely logged with reference number:
                  </p>
                  <div className="inline-block px-4 py-2 bg-[#F2F6EF] border border-[#373E0C]/20 rounded-xl font-mono text-sm font-bold text-[#373E0C]">
                    {submittedEnquiryId}
                  </div>
                </div>

                <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 text-xs text-neutral-600 max-w-lg mx-auto text-left space-y-2">
                  <div className="font-bold text-neutral-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#E96818]" />
                    <span>Next Steps</span>
                  </div>
                  <p>
                    A Consistent Experts property coordinator has received your message and will reach out via your preferred method ({formData.preferredContactMethod}) shortly.
                  </p>
                  <p className="text-neutral-500">
                    Direct notification dispatched to <code className="text-neutral-700 font-semibold">{DEFAULT_SITE_SETTINGS.email}</code>.
                  </p>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={handleReset}
                    className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-[#373E0C] bg-[#F2F6EF] hover:bg-[#373E0C]/10 border border-[#373E0C]/20 rounded-lg transition-colors cursor-pointer"
                  >
                    Submit Another Enquiry
                  </button>
                  <a
                    href={`https://wa.me/${DEFAULT_SITE_SETTINGS.primaryWhatsAppPhone}?text=${encodeURIComponent(
                      `Hello Consistent Experts, I just submitted enquiry ${submittedEnquiryId} for New Dawn Smart City.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-lg transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Message Directly on WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              /* Active Form */
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* Honeypot Spam Trap (hidden from human users) */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="company_code_honeypot">Leave blank</label>
                  <input
                    type="text"
                    id="company_code_honeypot"
                    name="company_code_honeypot"
                    value={formData.honeypot}
                    onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {serverError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">Submission Issue</div>
                      <div>{serverError}</div>
                    </div>
                  </div>
                )}

                {/* Row 1: Full Name & Phone Number */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                      Full Name <span className="text-[#E96818]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chief Emeka Okonkwo"
                      value={formData.fullName}
                      onChange={(e) => {
                        setFormData({ ...formData, fullName: e.target.value });
                        if (errors.fullName) setErrors({ ...errors, fullName: '' });
                      }}
                      className={`w-full px-4 py-3 text-sm rounded-xl border bg-white text-neutral-900 transition-colors focus:outline-none ${
                        errors.fullName
                          ? 'border-red-400 focus:border-red-500 ring-2 ring-red-100'
                          : 'border-neutral-300 focus:border-[#E96818]'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                      Phone Number <span className="text-[#E96818]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 0813 601 9021"
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          if (errors.phone) setErrors({ ...errors, phone: '' });
                        }}
                        className={`w-full px-4 py-3 text-sm rounded-xl border bg-white text-neutral-900 transition-colors focus:outline-none ${
                          errors.phone
                            ? 'border-red-400 focus:border-red-500 ring-2 ring-red-100'
                            : 'border-neutral-300 focus:border-[#E96818]'
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Row 2: Email (Optional) & Preferred Contact Method */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                      Email Address <span className="text-neutral-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. yourname@domain.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                      className={`w-full px-4 py-3 text-sm rounded-xl border bg-white text-neutral-900 transition-colors focus:outline-none ${
                        errors.email
                          ? 'border-red-400 focus:border-red-500 ring-2 ring-red-100'
                          : 'border-neutral-300 focus:border-[#E96818]'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                      Preferred Contact Method
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'phone', label: 'Phone', icon: Phone },
                        { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
                        { id: 'email', label: 'Email', icon: Mail },
                      ].map((item) => {
                        const Icon = item.icon;
                        const isSelected = formData.preferredContactMethod === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                preferredContactMethod: item.id as ContactMethod,
                              })
                            }
                            className={`flex items-center justify-center gap-1.5 py-3 px-2 text-xs font-bold rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                              isSelected
                                ? 'bg-[#373E0C] text-white border-[#373E0C] shadow-xs'
                                : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Row 3: Enquiry Type & Preferred Payment Plan */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                      Enquiry Type
                    </label>
                    <select
                      value={formData.enquiryType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          enquiryType: e.target.value as EnquiryType,
                        })
                      }
                      className="w-full px-4 py-3 text-sm rounded-xl border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:border-[#E96818]"
                    >
                      <option value="price_enquiry">Price Enquiry</option>
                      <option value="payment_plan">Payment Plan Details</option>
                      <option value="property_availability">Property Availability & Plots</option>
                      <option value="inspection_booking">Book Physical Inspection</option>
                      <option value="general">General Enquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                      Preferred Payment Plan
                    </label>
                    <select
                      value={formData.preferredPaymentPlan}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          preferredPaymentPlan: e.target.value as PaymentPlanType,
                        })
                      }
                      className="w-full px-4 py-3 text-sm rounded-xl border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:border-[#E96818]"
                    >
                      <option value="6_month_standard">6-Month Standard Plan (₦30M / 500 SQM)</option>
                      <option value="8_month_promo">8-Month Promotional Plan (₦20M / 500 SQM)</option>
                      <option value="undecided">Undecided / Discuss with Sales Team</option>
                    </select>
                  </div>
                </div>

                {/* Row 4: Property Size & Preferred Inspection Date */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                      Property Size
                    </label>
                    <select
                      value={formData.propertySize}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          propertySize: e.target.value as '500_sqm' | 'other',
                        })
                      }
                      className="w-full px-4 py-3 text-sm rounded-xl border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:border-[#E96818]"
                    >
                      <option value="500_sqm">500 SQM (Standard Single Plot)</option>
                      <option value="other">Multiple Plots / Other / Not Sure</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                      Preferred Inspection Date <span className="text-neutral-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.preferredInspectionDate}
                        onChange={(e) =>
                          setFormData({ ...formData, preferredInspectionDate: e.target.value })
                        }
                        className="w-full px-4 py-3 text-sm rounded-xl border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:border-[#E96818]"
                      />
                    </div>
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                      Message / Special Requests <span className="text-[#E96818]">*</span>
                    </label>
                    <span className="text-[11px] text-neutral-400">
                      {formData.message.length}/1500 chars
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us what you would like to know (e.g. specific questions regarding plot allocation, payment milestones, or survey inspection)..."
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (errors.message) setErrors({ ...errors, message: '' });
                    }}
                    className={`w-full px-4 py-3 text-sm rounded-xl border bg-white text-neutral-900 transition-colors focus:outline-none ${
                      errors.message
                        ? 'border-red-400 focus:border-red-500 ring-2 ring-red-100'
                        : 'border-neutral-300 focus:border-[#E96818]'
                    }`}
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-600">{errors.message}</p>
                  )}
                </div>

                {/* Consent Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.consent}
                      onChange={(e) => {
                        setFormData({ ...formData, consent: e.target.checked });
                        if (errors.consent) setErrors({ ...errors, consent: '' });
                      }}
                      className="mt-1 w-4 h-4 text-[#E96818] rounded border-neutral-300 focus:ring-[#E96818]"
                    />
                    <span className="text-xs text-neutral-600 leading-relaxed">
                      I agree to be contacted by Consistent Experts regarding this enquiry and acknowledge that my details will be processed in accordance with the{' '}
                      <button
                        type="button"
                        onClick={onOpenPrivacyPolicy}
                        className="text-[#373E0C] font-semibold underline hover:text-[#E96818]"
                      >
                        Privacy Policy
                      </button>
                      .
                    </span>
                  </label>
                  {errors.consent && (
                    <p className="mt-1.5 text-xs text-red-600">{errors.consent}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2.5 py-4 px-6 text-sm font-bold text-white bg-[#E96818] hover:bg-[#d65b10] disabled:bg-neutral-400 active:scale-98 rounded-xl shadow-lg shadow-[#E96818]/25 transition-all cursor-pointer whitespace-nowrap"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending Your Enquiry...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send My Enquiry</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Trust guarantee note */}
                <div className="text-center text-[11px] text-neutral-400">
                  Your information is kept confidential and sent directly to the Consistent Experts sales desk.
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
