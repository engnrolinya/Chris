# Consistent Experts — New Dawn Smart City Portal
### Architecture, Setup, and Production Deployment Guide

This document provides complete instructions for configuring, testing, and deploying the official web portal for **Consistent Experts** and **New Dawn Smart City Estate** in New Asaba, Delta State, Nigeria.

---

## 1. Brand Identity & Colors
- **Company Name**: Consistent Experts
- **Tagline**: *"Built Right... Delivered Better..."*
- **Development**: New Dawn Smart City
- **Location**: Plot 20, New Asaba, Delta State, Nigeria
- **Primary Olive Green**: `#373E0C`
- **Secondary Orange Accent**: `#E96818`
- **Soft Background**: `#F2F6EF`
- **Telephone Lines**:
  - `0916 950 8000`
  - `0813 601 9021`
  - `0901 968 2520`
  - `0816 314 1151`
- **Email**: `info@consistentexperts.com`
- **WhatsApp**: `+2349169508000`

---

## 2. Database Schema & Access Policies

### SQL Schema (PostgreSQL / Supabase / Neon / Cloud SQL)

```sql
-- Create Enum Types
CREATE TYPE enquiry_status AS ENUM ('new', 'contacted', 'inspection_scheduled', 'converted', 'closed');
CREATE TYPE contact_method AS ENUM ('phone', 'whatsapp', 'email');
CREATE TYPE enquiry_type AS ENUM ('price_enquiry', 'payment_plan', 'property_availability', 'inspection_booking', 'general');
CREATE TYPE payment_plan_type AS ENUM ('8_month_promo', '6_month_standard', 'undecided');

-- Create Enquiries Table
CREATE TABLE IF NOT EXISTS enquiries (
    id VARCHAR(64) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(64) NOT NULL,
    email VARCHAR(255),
    preferred_contact_method contact_method NOT NULL DEFAULT 'phone',
    enquiry_type enquiry_type NOT NULL DEFAULT 'price_enquiry',
    preferred_payment_plan payment_plan_type NOT NULL DEFAULT '6_month_standard',
    property_size VARCHAR(64) NOT NULL DEFAULT '500_sqm',
    preferred_inspection_date DATE,
    message TEXT NOT NULL,
    consent BOOLEAN NOT NULL DEFAULT true,
    source_section VARCHAR(128) NOT NULL DEFAULT 'Customer Enquiry Form',
    status enquiry_status NOT NULL DEFAULT 'new',
    internal_notes TEXT,
    notification_sent_to_owner BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Row Level Security (RLS) Policies
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Anonymous users may insert valid enquiries (lead capture)
CREATE POLICY "Public can insert enquiries"
ON enquiries FOR INSERT
TO anon
WITH CHECK (
    char_length(full_name) >= 3 AND
    char_length(phone) >= 8 AND
    char_length(message) >= 10 AND
    consent = true
);

-- Only authenticated administrators can read and update enquiries
CREATE POLICY "Admins can view and update enquiries"
ON enquiries FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
```

---

## 3. Local Development Setup

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Steps
1. **Clone or navigate to repository**:
   ```bash
   cd consistent-experts-app
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

---

## 4. Owner Notifications & Email Delivery Setup

When an enquiry or inspection is submitted, the system triggers a notification for `info@consistentexperts.com`.

### Setting up Live Email via Resend:
1. Register at [resend.com](https://resend.com) and add your domain `consistentexperts.com`.
2. Add your DKIM and SPF records in your domain DNS manager.
3. Generate an API Key and place it in your environment:
   ```env
   RESEND_API_KEY="re_live_..."
   OWNER_NOTIFICATION_EMAIL="info@consistentexperts.com"
   ```
4. In `server.ts`, initialize Resend client:
   ```typescript
   import { Resend } from 'resend';
   const resend = new Resend(process.env.RESEND_API_KEY);
   
   await resend.emails.send({
     from: 'New Dawn Smart City <alerts@consistentexperts.com>',
     to: process.env.OWNER_NOTIFICATION_EMAIL || 'info@consistentexperts.com',
     reply_to: record.email || undefined,
     subject: `New Lead: ${record.fullName} (${record.enquiryType})`,
     text: `Customer: ${record.fullName}\nPhone: ${record.phone}\nPlan: ${record.preferredPaymentPlan}\nMessage: ${record.message}`
   });
   ```

---

## 5. Owner Portal Access

The application includes an internal Owner Dashboard accessible from the discreet lock link in the footer or mobile navigation.

- **Default Administrator PIN**: `CE2026`
- **Features**:
  - Real-time lead count & pipeline status
  - Filter by Payment Plan (8-Month Promo vs 6-Month Standard)
  - Search by client name, telephone, or email
  - Update status (`New Lead`, `Contacted`, `Inspection Set`, `Converted`, `Closed`)
  - Log internal field notes & plot allocations
  - Export full lead records to `.csv` format
  - Simulated email notification inspector

---

## 6. Pre-Launch Verification Checklist

- [x] **Flyer Information Grounded**: Correct address (Plot 20, New Asaba), all 4 telephone lines, and company slogan displayed.
- [x] **Promotional Deadline Handled**: The 30 September 2026 ₦20M deadline is transparently presented as "Previous Promotional Offer — Confirmation Required" with explicit confirmation advice.
- [x] **Active Standard Plan**: 6-Month ₦30M / 500 SQM plan clearly detailed with commencement date of 1 October 2026.
- [x] **Estate Features**: All 6 advertised amenities (Steady electricity, Street lights, Good road network, Gated community, 24/7 security, Serene environment) accurately presented.
- [x] **Anti-Spam & Validation**: Honeypot field and input validations prevent junk submissions.
- [x] **Interactive Calculator**: Buyers can estimate monthly cashflow breakdowns.
- [x] **Responsive Mobile Experience**: Tested on viewport sizes from 360px to 1440px desktop.
- [x] **No Fabricated Data**: No fake customer reviews, awards, or arbitrary claims.
