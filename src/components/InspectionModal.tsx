import React, { useState } from 'react';
import { X, Calendar, MapPin, CheckCircle2, AlertCircle, Phone, MessageSquare, Mail, ShieldCheck } from 'lucide-react';
import { EnquiryService } from '../services/enquiryService';
import { ContactMethod } from '../types';
import { DEFAULT_SITE_SETTINGS } from '../data/initialData';

interface InspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPrivacyPolicy: () => void;
}

export const InspectionModal: React.FC<InspectionModalProps> = ({
  isOpen,
  onClose,
  onOpenPrivacyPolicy,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredContactMethod, setPreferredContactMethod] = useState<ContactMethod>('phone');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (honeypot.trim() !== '') return;

    if (!fullName.trim() || fullName.trim().length < 3) {
      setErrorMessage('Please provide your full name.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 8) {
      setErrorMessage('Please provide a valid telephone number.');
      return;
    }
    if (!consent) {
      setErrorMessage('You must acknowledge and consent to being contacted.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await EnquiryService.submitEnquiry(
        {
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          preferredContactMethod,
          enquiryType: 'inspection_booking',
          preferredPaymentPlan: '6_month_standard',
          propertySize: '500_sqm',
          preferredInspectionDate: preferredDate,
          message: message.trim() || 'Requesting physical plot inspection at Plot 20, New Asaba.',
          consent,
          honeypot: '',
        },
        'Inspection Booking Modal'
      );

      if (result.success) {
        setSuccess(true);
      } else {
        setErrorMessage(result.error || 'Failed to submit inspection request.');
      }
    } catch {
      setErrorMessage('A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setErrorMessage(null);
    setFullName('');
    setPhone('');
    setEmail('');
    setPreferredDate('');
    setMessage('');
    setConsent(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="relative max-w-xl w-full bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#373E0C] text-white p-6 sm:p-7 flex items-start justify-between">
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-[#E96818]">
              Site Visit Coordination
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Book a Property Inspection
            </h3>
            <p className="text-xs text-neutral-200 flex items-center gap-1.5 pt-1">
              <MapPin className="w-3.5 h-3.5 text-[#E96818]" />
              <span>Plot 20, New Asaba, Delta State, Nigeria</span>
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {success ? (
            <div className="text-center py-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h4 className="text-xl font-bold text-[#373E0C]">
                  Inspection Request Received
                </h4>
                {/* Specific prompt required copy */}
                <p className="text-sm text-neutral-700 max-w-md mx-auto leading-relaxed">
                  Thank you for your interest in New Dawn Smart City. Your inspection request has been received. Our team will contact you to confirm the details.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F2F6EF] border border-[#373E0C]/15 text-xs text-neutral-700 text-left space-y-1">
                <div className="font-bold text-[#373E0C] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#E96818]" />
                  <span>Inspection Guidelines</span>
                </div>
                <p>
                  Inspections run Monday through Saturday. Our site coordinator will call to agree on precise timing and meeting point at Plot 20.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleClose}
                  className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-[#373E0C] hover:bg-[#2b3109] rounded-xl transition-colors cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Spam Trap */}
              <input
                type="text"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="hidden"
                tabIndex={-1}
              />

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-[#E96818]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-neutral-300 focus:outline-none focus:border-[#E96818]"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                    Phone Number <span className="text-[#E96818]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0916 950 8000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-neutral-300 focus:outline-none focus:border-[#E96818]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-neutral-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-neutral-300 focus:outline-none focus:border-[#E96818]"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                    Preferred Inspection Date
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-neutral-300 focus:outline-none focus:border-[#E96818]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                    Preferred Contact Method
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'phone', label: 'Call', icon: Phone },
                      { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
                      { id: 'email', label: 'Email', icon: Mail },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isSelected = preferredContactMethod === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setPreferredContactMethod(item.id as ContactMethod)}
                          className={`flex items-center justify-center gap-1 py-2.5 px-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                            isSelected
                              ? 'bg-[#373E0C] text-white border-[#373E0C]'
                              : 'bg-neutral-50 text-neutral-700 border-neutral-200'
                          }`}
                        >
                          <Icon className="w-3 h-3" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                  Inspection Notes / Group Size
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Planning to attend with my surveyor, preferred morning slot."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-neutral-300 focus:outline-none focus:border-[#E96818]"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#E96818] rounded border-neutral-300 focus:ring-[#E96818]"
                  />
                  <span className="text-xs text-neutral-600 leading-snug">
                    I agree to be contacted by Consistent Experts regarding this site inspection appointment.
                  </span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 text-sm font-bold text-white bg-[#E96818] hover:bg-[#d65b10] disabled:bg-neutral-400 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {isSubmitting ? 'Scheduling Inspection...' : 'Submit Inspection Request'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
