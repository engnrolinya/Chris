import { Enquiry, EnquiryFormData, EnquiryStatus, EnquiryType, PaymentPlanType } from '../types';

const STORAGE_KEY = 'ce_new_dawn_enquiries_v1';
const OWNER_PIN_KEY = 'ce_admin_pin';
const DEFAULT_OWNER_PIN = 'CE2026';

// Realistic sample enquiries to demonstrate the authenticated owner dashboard out of the box
const SAMPLE_ENQUIRIES: Enquiry[] = [
  {
    id: 'ENQ-2026-1001',
    fullName: 'Chief Emeka Okonkwo',
    phone: '0803 456 7890',
    email: 'emeka.okonkwo@investors.ng',
    preferredContactMethod: 'phone',
    enquiryType: 'payment_plan',
    preferredPaymentPlan: '6_month_standard',
    propertySize: '500_sqm',
    preferredInspectionDate: '2026-10-24',
    message: 'Interested in acquiring two 500 SQM residential plots under the 6-month plan. Please confirm corner plot availability and physical inspection arrangements.',
    consent: true,
    sourceSection: 'Pricing Comparison Section',
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    status: 'inspection_scheduled',
    internalNotes: 'Contacted by phone on Oct 16. Site coordinator assigned for Saturday 10:00 AM inspection at Plot 20.',
    notificationSentToOwner: true,
  },
  {
    id: 'ENQ-2026-1002',
    fullName: 'Dr. Ngozi Adeleke',
    phone: '0812 889 0044',
    email: 'ngozi.adeleke@medconsult.org',
    preferredContactMethod: 'whatsapp',
    enquiryType: 'price_enquiry',
    preferredPaymentPlan: '8_month_promo',
    propertySize: '500_sqm',
    message: 'I saw the 8-month ₦20M flyer offer. I understand the September deadline has passed, but is there any management consideration for immediate commitment?',
    consent: true,
    sourceSection: 'Limited-Time Promo Card',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    status: 'new',
    internalNotes: 'Awaiting sales manager review on promotional extension quota.',
    notificationSentToOwner: true,
  },
  {
    id: 'ENQ-2026-1003',
    fullName: 'Engr. Babatunde Alabi',
    phone: '0905 112 3344',
    email: 'babatunde.alabi@infra.com',
    preferredContactMethod: 'email',
    enquiryType: 'inspection_booking',
    preferredPaymentPlan: '6_month_standard',
    propertySize: '500_sqm',
    preferredInspectionDate: '2026-10-26',
    message: 'Requesting an inspection of the internal road layout and drainage construction at New Dawn Smart City.',
    consent: true,
    sourceSection: 'Book an Inspection Modal',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    status: 'contacted',
    internalNotes: 'Sent layout drawings via email. Client requested morning slot.',
    notificationSentToOwner: true,
  },
];

export class EnquiryService {
  private static getStoredEnquiries(): Enquiry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        // Initialize with realistic samples
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_ENQUIRIES));
        return SAMPLE_ENQUIRIES;
      }
      return JSON.parse(data);
    } catch {
      return SAMPLE_ENQUIRIES;
    }
  }

  private static saveEnquiries(list: Enquiry[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Failed to save enquiries to localStorage', e);
    }
  }

  public static async submitEnquiry(
    formData: EnquiryFormData,
    sourceSection: string = 'Website Enquiry Form'
  ): Promise<{ success: boolean; enquiry?: Enquiry; error?: string }> {
    // 1. Anti-spam honeypot verification
    if (formData.honeypot && formData.honeypot.trim() !== '') {
      // Silently reject bot submission
      return { success: false, error: 'Spam submission detected.' };
    }

    // 2. Server/client validation
    if (!formData.fullName || formData.fullName.trim().length < 3) {
      return { success: false, error: 'Please provide a valid full name.' };
    }
    if (!formData.phone || formData.phone.trim().length < 9) {
      return { success: false, error: 'Please provide a valid telephone number.' };
    }
    if (!formData.message || formData.message.trim().length < 10) {
      return { success: false, error: 'Please provide a message with at least 10 characters.' };
    }
    if (!formData.consent) {
      return { success: false, error: 'You must agree to be contacted regarding your enquiry.' };
    }

    // Generate unique ID
    const newId = `ENQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newEnquiry: Enquiry = {
      id: newId,
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      email: formData.email?.trim() || undefined,
      preferredContactMethod: formData.preferredContactMethod,
      enquiryType: formData.enquiryType,
      preferredPaymentPlan: formData.preferredPaymentPlan,
      propertySize: formData.propertySize,
      preferredInspectionDate: formData.preferredInspectionDate || undefined,
      message: formData.message.trim(),
      consent: formData.consent,
      sourceSection,
      createdAt: new Date().toISOString(),
      status: 'new',
      notificationSentToOwner: true,
    };

    // Try posting to backend API if available
    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEnquiry),
      });
      if (response.ok) {
        const saved = await response.json();
        // Also cache locally
        const current = this.getStoredEnquiries();
        this.saveEnquiries([saved.enquiry || newEnquiry, ...current]);
        return { success: true, enquiry: saved.enquiry || newEnquiry };
      }
    } catch {
      // Backend not reached, fallback to persistent local storage
    }

    // Fallback saving directly
    const current = this.getStoredEnquiries();
    const updated = [newEnquiry, ...current];
    this.saveEnquiries(updated);

    return { success: true, enquiry: newEnquiry };
  }

  public static async getEnquiries(params?: {
    search?: string;
    status?: EnquiryStatus | 'all';
    enquiryType?: EnquiryType | 'all';
    paymentPlan?: PaymentPlanType | 'all';
  }): Promise<Enquiry[]> {
    let list: Enquiry[] = [];

    try {
      const response = await fetch('/api/enquiries');
      if (response.ok) {
        const data = await response.json();
        list = data.enquiries || [];
      } else {
        list = this.getStoredEnquiries();
      }
    } catch {
      list = this.getStoredEnquiries();
    }

    if (!params) return list;

    return list.filter((item) => {
      if (params.status && params.status !== 'all' && item.status !== params.status) {
        return false;
      }
      if (params.enquiryType && params.enquiryType !== 'all' && item.enquiryType !== params.enquiryType) {
        return false;
      }
      if (params.paymentPlan && params.paymentPlan !== 'all' && item.preferredPaymentPlan !== params.paymentPlan) {
        return false;
      }
      if (params.search && params.search.trim() !== '') {
        const q = params.search.toLowerCase();
        const matchesName = item.fullName.toLowerCase().includes(q);
        const matchesPhone = item.phone.toLowerCase().includes(q);
        const matchesEmail = item.email ? item.email.toLowerCase().includes(q) : false;
        const matchesMsg = item.message.toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesEmail && !matchesMsg) {
          return false;
        }
      }
      return true;
    });
  }

  public static async updateEnquiry(
    id: string,
    updates: { status?: EnquiryStatus; internalNotes?: string }
  ): Promise<boolean> {
    try {
      await fetch(`/api/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch {
      // Continue to local update
    }

    const list = this.getStoredEnquiries();
    const idx = list.findIndex((e) => e.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      this.saveEnquiries(list);
      return true;
    }
    return false;
  }

  public static verifyOwnerPin(pin: string): boolean {
    const savedPin = localStorage.getItem(OWNER_PIN_KEY) || DEFAULT_OWNER_PIN;
    return pin.trim() === savedPin;
  }

  public static updateOwnerPin(currentPin: string, newPin: string): boolean {
    if (this.verifyOwnerPin(currentPin) && newPin.trim().length >= 4) {
      localStorage.setItem(OWNER_PIN_KEY, newPin.trim());
      return true;
    }
    return false;
  }

  public static exportToCsv(enquiries: Enquiry[]): void {
    const headers = [
      'Enquiry ID',
      'Date & Time',
      'Full Name',
      'Phone Number',
      'Email',
      'Preferred Contact Method',
      'Enquiry Type',
      'Payment Plan',
      'Property Size',
      'Preferred Inspection Date',
      'Status',
      'Source Section',
      'Message',
      'Internal Notes',
    ];

    const escapeCsv = (str?: string) => {
      if (!str) return '""';
      const clean = str.replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = enquiries.map((e) => [
      escapeCsv(e.id),
      escapeCsv(new Date(e.createdAt).toLocaleString()),
      escapeCsv(e.fullName),
      escapeCsv(e.phone),
      escapeCsv(e.email || 'N/A'),
      escapeCsv(e.preferredContactMethod),
      escapeCsv(e.enquiryType),
      escapeCsv(e.preferredPaymentPlan),
      escapeCsv(e.propertySize),
      escapeCsv(e.preferredInspectionDate || 'None specified'),
      escapeCsv(e.status),
      escapeCsv(e.sourceSection),
      escapeCsv(e.message),
      escapeCsv(e.internalNotes || ''),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `Consistent_Experts_Enquiries_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  public static resetToDemo(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_ENQUIRIES));
  }
}
