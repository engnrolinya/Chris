export type EnquiryType =
  | 'price_enquiry'
  | 'payment_plan'
  | 'property_availability'
  | 'inspection_booking'
  | 'general';

export type PaymentPlanType =
  | '8_month_promo'
  | '6_month_standard'
  | 'undecided';

export type ContactMethod = 'phone' | 'whatsapp' | 'email';

export type EnquiryStatus =
  | 'new'
  | 'contacted'
  | 'inspection_scheduled'
  | 'converted'
  | 'closed';

export interface Enquiry {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  preferredContactMethod: ContactMethod;
  enquiryType: EnquiryType;
  preferredPaymentPlan: PaymentPlanType;
  propertySize: '500_sqm' | 'other';
  preferredInspectionDate?: string;
  message: string;
  consent: boolean;
  sourceSection: string;
  createdAt: string;
  status: EnquiryStatus;
  internalNotes?: string;
  notificationSentToOwner?: boolean;
}

export interface EnquiryFormData {
  fullName: string;
  phone: string;
  email: string;
  preferredContactMethod: ContactMethod;
  enquiryType: EnquiryType;
  preferredPaymentPlan: PaymentPlanType;
  propertySize: '500_sqm' | 'other';
  preferredInspectionDate: string;
  message: string;
  consent: boolean;
  honeypot: string; // Anti-spam trap
}

export interface SiteSettings {
  companyName: string;
  tagline: string;
  estateName: string;
  address: string;
  locationArea: string;
  phones: string[];
  primaryWhatsAppPhone: string;
  email: string;
  websiteUrl: string;
  instagramHandle: string;
  facebookName: string;
  promoPlan: {
    title: string;
    price: number;
    priceFormatted: string;
    durationMonths: number;
    size: string;
    flyerDeadline: string;
    statusLabel: string;
    note: string;
  };
  standardPlan: {
    title: string;
    price: number;
    priceFormatted: string;
    durationMonths: number;
    size: string;
    commencementDate: string;
    statusLabel: string;
    note: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  quickAction?: 'view_prices' | 'book_inspection' | 'call_hotline' | 'open_whatsapp';
  metadata?: Record<string, any>;
}

export interface ChatConversation {
  id: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  status: 'active' | 'waiting_owner' | 'resolved';
  createdAt: string;
  updatedAt: string;
  lastMessageSnippet: string;
  messages: ChatMessage[];
  unreadByOwner: boolean;
  topic?: string;
}
