import { SiteSettings } from '../types';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  companyName: 'Consistent Experts',
  tagline: 'Built Right... Delivered Better...',
  estateName: 'New Dawn Smart City',
  address: 'Plot 20, New Asaba, Delta State, Nigeria',
  locationArea: 'New Asaba, Delta State, Nigeria',
  phones: [
    '0916 950 8000',
    '0813 601 9021',
    '0901 968 2520',
    '0816 314 1151',
  ],
  primaryWhatsAppPhone: '2349169508000', // Nigeria international format
  email: 'info@consistentexperts.com',
  websiteUrl: 'https://www.consistentexperts.com',
  instagramHandle: 'Consistent_Experts',
  facebookName: 'Consistent Experts',
  promoPlan: {
    title: '8 Months Payment Plan',
    price: 20000000,
    priceFormatted: '₦20,000,000',
    durationMonths: 8,
    size: 'Per 500 SQM',
    flyerDeadline: '30 September 2026',
    statusLabel: 'Previous Promotional Offer — Confirmation Required',
    note: 'The promotional deadline of 30 September 2026 on the flyer has concluded. Please contact our sales team to verify current promotional availability and active terms.',
  },
  standardPlan: {
    title: '6 Months Payment Plan',
    price: 30000000,
    priceFormatted: '₦30,000,000',
    durationMonths: 6,
    size: 'Per 500 SQM',
    commencementDate: '1 October 2026',
    statusLabel: 'Standard Payment Plan',
    note: 'Commenced 1 October 2026. Flexible 6-month structured payment schedule for 500 SQM plots. Terms subject to confirmation by Consistent Experts.',
  },
};

export const ESTATE_FEATURES = [
  {
    id: 'electricity',
    title: 'STEADY ELECTRICITY',
    description: 'Designed to support reliable electricity access within the estate.',
    category: 'Utilities',
    iconName: 'Zap',
  },
  {
    id: 'street-lights',
    title: 'STREET LIGHTS',
    description: 'Street lighting designed to improve visibility throughout the estate.',
    category: 'Safety',
    iconName: 'Sun',
  },
  {
    id: 'roads',
    title: 'GOOD ROAD NETWORK',
    description: 'Road infrastructure designed to improve movement and accessibility.',
    category: 'Infrastructure',
    iconName: 'Milestone',
  },
  {
    id: 'gated-community',
    title: 'GATED COMMUNITY',
    description: 'A gated residential environment with controlled access.',
    category: 'Access Control',
    iconName: 'ShieldCheck',
  },
  {
    id: 'security',
    title: '24/7 SECURITY',
    description: 'Security arrangements intended to support residents and property owners.',
    category: 'Protection',
    iconName: 'Lock',
  },
  {
    id: 'serene-environment',
    title: 'SERENE ENVIRONMENT',
    description: 'A calm environment designed for comfortable residential living.',
    category: 'Lifestyle',
    iconName: 'Trees',
  },
];

import slide1Img from '../assets/images/hero_new_dawn_smart_city_1792253580563.jpg';
import slide2Img from '../assets/images/estate_entrance_gate_1792253581050.jpg';
import slide3Img from '../assets/images/modern_smart_villa_1792253581571.jpg';
import slide4Img from '../assets/images/estate_road_infrastructure_1792253581935.jpg';

export const GALLERY_ITEMS = [
  {
    id: 'hero-villa',
    title: 'New Dawn Smart City Architectural Masterpiece',
    category: 'Architecture',
    imagePath: slide1Img,
    description: 'Contemporary residential design featuring expansive glass panels, serene dusk illumination, and landscaped frontage.',
  },
  {
    id: 'entrance-gate',
    title: 'Controlled Access Estate Gatehouse',
    category: 'Security',
    imagePath: slide2Img,
    description: 'Architectural security post with separate resident and visitor access lanes, boom barriers, and stone-accented perimeter.',
  },
  {
    id: 'modern-duplex',
    title: 'Contemporary Two-Story Villa Duplex Concept',
    category: 'Architecture',
    imagePath: slide3Img,
    description: 'Geometric luxury twin-duplex residence with private paved driveways and lush tropical landscape verges.',
  },
  {
    id: 'internal-road',
    title: 'Planned Internal Road Infrastructure & Solar Lighting',
    category: 'Infrastructure',
    imagePath: slide4Img,
    description: 'Wide asphalt carriageways with integrated concrete curbs, solar-powered lighting, and pedestrian pathways.',
  },
];

export const FAQ_ITEMS = [
  {
    id: 'faq-1',
    question: 'Where is New Dawn Smart City located?',
    answer:
      'New Dawn Smart City is situated at Plot 20, New Asaba, Delta State, Nigeria. It is positioned in an expanding, accessible residential corridor designed for long-term residential and investment value.',
  },
  {
    id: 'faq-2',
    question: 'What is the price per 500 SQM?',
    answer:
      'The standard 6-month payment plan commenced on 1 October 2026 is priced at ₦30,000,000 per 500 SQM. A previous 8-month promotional offer of ₦20,000,000 was available through 30 September 2026; prospective buyers are advised to contact Consistent Experts to verify current pricing and active promotional availability.',
  },
  {
    id: 'faq-3',
    question: 'What payment plans are available?',
    answer:
      'The primary payment plans shown on company documentation include a 6-month standard payment plan and an 8-month promotional plan. Custom installment terms or milestone payments should be discussed and confirmed directly with the Consistent Experts finance and sales team.',
  },
  {
    id: 'faq-4',
    question: 'How can I book a property inspection?',
    answer:
      'You can schedule a physical site inspection directly on this website using our inspection booking form, or by contacting our team via phone (0916 950 8000, 0813 601 9021) or WhatsApp. Our site representative will coordinate a convenient inspection date and guide you through Plot 20, New Asaba.',
  },
  {
    id: 'faq-5',
    question: 'How do I contact Consistent Experts?',
    answer:
      'You can reach our sales and client services team through any of our four direct hotlines: 0916 950 8000, 0813 601 9021, 0901 968 2520, or 0816 314 1151. You may also email us at info@consistentexperts.com or visit our estate office in New Asaba, Delta State.',
  },
  {
    id: 'faq-6',
    question: 'How can I confirm current property availability?',
    answer:
      'Plot allocations at New Dawn Smart City are updated continuously. To verify available plot numbers, layout positions, corner-piece allocations, or commercial plots, submit an enquiry or call our representative for the live estate allotment chart.',
  },
  {
    id: 'faq-7',
    question: 'What documentation should I verify before purchasing property?',
    answer:
      'Consistent Experts upholds transparency and encourages all prospective property owners to conduct independent due diligence. Prospective buyers should review the survey plan, layout approval, deed of assignment/conveyance provisions, and consult with their legal counsel or registered surveyor before concluding transactions.',
  },
];
