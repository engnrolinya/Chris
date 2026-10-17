import React from 'react';
import { X, ShieldCheck, Mail, MapPin } from 'lucide-react';
import { DEFAULT_SITE_SETTINGS } from '../data/initialData';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#373E0C] text-white p-6 sm:p-7 flex items-center justify-between border-b border-[#373E0C]/40">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#E96818]" />
            <div>
              <h3 className="text-lg font-bold text-white">
                Privacy Policy & Data Notice
              </h3>
              <p className="text-xs text-neutral-300">
                Consistent Experts · New Dawn Smart City
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto space-y-5 text-xs sm:text-sm text-neutral-700 leading-relaxed">
          <section className="space-y-2">
            <h4 className="font-bold text-[#373E0C] text-sm uppercase tracking-wide">
              1. Information We Collect
            </h4>
            <p>
              When you submit an enquiry, request a payment plan breakdown, or schedule a physical property inspection at New Dawn Smart City, Consistent Experts collects only necessary contact and preference data:
            </p>
            <ul className="list-disc list-inside space-y-1 text-neutral-600 pl-2">
              <li>Full Name</li>
              <li>Telephone and/or WhatsApp number</li>
              <li>Email address (where provided)</li>
              <li>Preferred payment plan and plot size interest (e.g. 500 SQM)</li>
              <li>Preferred inspection dates and communication notes</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h4 className="font-bold text-[#373E0C] text-sm uppercase tracking-wide">
              2. How Your Information Is Used
            </h4>
            <p>
              Your personal data is used solely to respond to your specific property inquiries, schedule and confirm physical site inspections in New Asaba, Delta State, and provide documentation verifications. We do not sell, rent, or lease your personal information to third parties.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="font-bold text-[#373E0C] text-sm uppercase tracking-wide">
              3. Data Storage & Security
            </h4>
            <p>
              Enquiry submissions are stored securely and access is restricted to authorized administrative personnel of Consistent Experts. We implement standard safeguards to protect your personal details against unauthorized access.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="font-bold text-[#373E0C] text-sm uppercase tracking-wide">
              4. Contacting Us Regarding Your Data
            </h4>
            <p>
              If you wish to review, modify, or request deletion of your enquiry information, please contact our data team:
            </p>
            <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-1">
              <div><strong>Company:</strong> Consistent Experts</div>
              <div><strong>Address:</strong> Plot 20, New Asaba, Delta State, Nigeria</div>
              <div><strong>Email:</strong> {DEFAULT_SITE_SETTINGS.email}</div>
              <div><strong>Hotlines:</strong> {DEFAULT_SITE_SETTINGS.phones.join(', ')}</div>
            </div>
          </section>
        </div>

        <div className="p-4 bg-neutral-50 border-t border-neutral-200 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-[#373E0C] hover:bg-[#2b3109] rounded-xl transition-colors cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
