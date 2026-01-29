/**
 * Centralized Product Catalog
 * 
 * This file contains all product information including pricing, descriptions,
 * features, and Stripe Payment Links. Update this file to add/remove products
 * or modify pricing.
 */

export const products = [
  {
    id: 'ai-scribe',
    name: 'AI Scribe',
    shortDescription: 'Real-time clinical documentation that cuts charting time by 70%',
    longDescription: 'Listen to patient conversations and watch as AI instantly converts speech into perfect clinical notes—saving 2+ hours per provider daily.',
    price: '$299',
    pricePeriod: 'per provider/month',
    route: '/ai-scribe',
    icon: 'bi-mic-fill',
    badge: 'Most Popular',
    usp: 'Save 10 hours a week on charting',
    stripePaymentLink: 'https://buy.stripe.com/placeholder-ai-scribe', // Replace with actual Stripe Payment Link
    features: [
      'Speak naturally—AI handles the rest',
      'Cut charting time by 70%',
      'Medical terms auto-recognized',
      'Perfect grammar every time',
      'Ready for EHR in seconds',
    ],
    useCases: [
      'Behavioral health practices',
      'Primary care clinics',
      'Specialty practices',
    ],
    metrics: [
      { value: '2+ hours', label: 'Saved per provider/day' },
      { value: '70%', label: 'Reduction in charting time' },
      { value: '99.5%', label: 'Transcription accuracy' },
    ],
  },
  {
    id: 'ai-docman',
    name: 'AI Document Manager',
    shortDescription: 'Transform transcripts into formatted medical notes instantly',
    longDescription: 'Drop in messy transcripts and get back perfectly formatted SOAP notes, H&Ps, and discharge summaries—ready to paste into your EHR.',
    price: '$199',
    pricePeriod: 'per assistant/month',
    route: '/ai-agent/ai-docman',
    icon: 'bi-file-earmark-text',
    badge: null,
    usp: 'Save 60 minutes per assistant daily',
    stripePaymentLink: 'https://buy.stripe.com/placeholder-ai-docman', // Replace with actual Stripe Payment Link
    features: [
      'Works with any transcript format',
      'Multiple template options',
      'Perfect formatting every time',
      'Copy-paste ready for EHR',
      'Saves 60 min/day per assistant',
    ],
    useCases: [
      'Medical assistants',
      'Scribes',
      'Practices needing quick document formatting',
    ],
    metrics: [
      { value: '60 min', label: 'Saved per assistant/day' },
      { value: '95%', label: 'Formatting accuracy' },
      { value: '3 sec', label: 'Processing time' },
    ],
  },
  {
    id: 'ai-medical-assistant',
    name: 'AI Medical Assistant',
    shortDescription: 'Full-session intelligence with EHR-ready chart outputs',
    longDescription: 'Record entire patient sessions and automatically generate comprehensive, EHR-ready charts with structured clinical data.',
    price: '$399',
    pricePeriod: 'per provider/month',
    route: '/ai-agent/ai-medical-assistant',
    icon: 'bi-person-workspace',
    badge: null,
    usp: 'Reduce documentation time by 80%',
    stripePaymentLink: 'https://buy.stripe.com/placeholder-ai-medical-assistant', // Replace with actual Stripe Payment Link
    features: [
      'Full session recording and analysis',
      'Auto-generates HPI, assessment, plan',
      'Structured EHR field data',
      'ICD-10 code suggestions',
      'Direct EHR integration',
    ],
    useCases: [
      'Primary care clinics',
      'Urgent care centers',
      'Specialty clinics',
    ],
    metrics: [
      { value: '80%', label: 'Reduction in documentation time' },
      { value: '100%', label: 'Visit data captured' },
      { value: '95%', label: 'EHR integration accuracy' },
    ],
  },
  {
    id: 'ai-receptionist',
    name: 'AI Receptionist',
    shortDescription: '24/7 call handling, appointment scheduling, and patient triage',
    longDescription: 'Automate appointment scheduling, patient inquiries, and call routing with conversational AI that never sleeps—handling 100+ calls simultaneously.',
    price: '$499',
    pricePeriod: 'per practice/month',
    route: '/ai-agent/ai-receptionist',
    icon: 'bi-headset',
    badge: 'Best Value',
    usp: 'Handle 100+ calls simultaneously, 24/7',
    stripePaymentLink: 'https://buy.stripe.com/placeholder-ai-receptionist', // Replace with actual Stripe Payment Link
    features: [
      '24/7 availability, zero wait times',
      'Automated appointment booking',
      'Intelligent call routing & triage',
      'Multi-language support',
      'Reduces staff workload by 70%',
    ],
    useCases: [
      'High call volume practices',
      'After-hours coverage needs',
      'Front-desk staff burnout',
    ],
    metrics: [
      { value: '80%', label: 'Calls handled automatically' },
      { value: '0 min', label: 'Average wait time' },
      { value: '$60K+', label: 'Annual cost savings' },
    ],
  },
  {
    id: 'ai-admin-assistant',
    name: 'AI Admin Assistant',
    shortDescription: 'Automate forms, scheduling, emails, and operational workflows',
    longDescription: 'Eliminate repetitive administrative tasks with intelligent automation that handles forms, emails, and scheduling.',
    price: '$249',
    pricePeriod: 'per practice/month',
    route: '/ai-agent/ai-admin-assistant',
    icon: 'bi-briefcase',
    badge: null,
    usp: 'Save 60% of admin time on repetitive tasks',
    stripePaymentLink: 'https://buy.stripe.com/placeholder-ai-admin-assistant', // Replace with actual Stripe Payment Link
    features: [
      'Automated email drafting and routing',
      'Form processing and data entry',
      'Schedule coordination and updates',
      'Task automation workflows',
    ],
    useCases: [
      'Administrative teams',
      'Operations departments',
      'Practices with high form volume',
    ],
    metrics: [
      { value: '60%', label: 'Admin time saved' },
      { value: '12 sec', label: 'Task completion time' },
      { value: '95%', label: 'Automation accuracy' },
    ],
  },
  {
    id: 'ai-reminders',
    name: 'AI Patient Reminders',
    shortDescription: 'Automated, personalized reminders for appointments, procedures, medications, and care coordination',
    longDescription: 'Automated, intelligent reminders that reduce no-shows and improve patient compliance across the care continuum.',
    price: '$149',
    pricePeriod: 'per practice/month',
    route: '/ai-agent/ai-reminders',
    icon: 'bi-bell',
    badge: null,
    usp: 'Reduce no-shows by 30%',
    stripePaymentLink: 'https://buy.stripe.com/placeholder-ai-reminders', // Replace with actual Stripe Payment Link
    features: [
      'Appointment reminders with confirmation',
      'Procedure prep step-by-step guidance',
      'Medication adherence tracking',
      'Multi-channel delivery (SMS, email, voice)',
    ],
    useCases: [
      'Practices with high no-show rates',
      'Complex procedure scheduling',
      'Medication compliance programs',
    ],
    metrics: [
      { value: '30%', label: 'No-show reduction' },
      { value: '95%', label: 'Reminder delivery rate' },
      { value: '85%', label: 'Patient confirmation rate' },
    ],
  },
  {
    id: 'echopad-insights',
    name: 'Insights',
    shortDescription: 'Healthcare financial intelligence & benchmarking across all 50 states',
    longDescription: 'Aggregate multi-payer data nationwide to identify underpayments, benchmark performance against peers, and optimize clinical and financial outcomes—all in one powerful platform.',
    price: '$499',
    pricePeriod: 'per organization/month',
    route: '/echopad-insights',
    icon: 'bi-graph-up-arrow',
    badge: 'Revenue Intelligence',
    usp: 'Identify $500K+ in underpayments annually',
    stripePaymentLink: 'https://buy.stripe.com/placeholder-echopad-insights', // Replace with actual Stripe Payment Link
    features: [
      'Multi-payer data aggregation',
      'National benchmarking (all 50 states)',
      'Reimbursement transparency',
      'CPT/DRG lookup & analysis',
      'Underpayment detection',
      'Revenue leakage analysis',
      'Contract optimization intelligence',
    ],
    useCases: [
      'Hospitals & Health Systems',
      'Physician Groups & Clinics',
      'Revenue Cycle Teams',
      'Contracting & Strategy Leaders',
    ],
    metrics: [
      { value: '$500K+', label: 'Underpayments identified annually' },
      { value: 'All 50', label: 'States covered' },
      { value: '100%', label: 'Data transparency' },
    ],
  },
  {
    id: 'refercare',
    name: 'ReferCare',
    shortDescription: 'Streamline referral management and patient care coordination',
    longDescription: 'Intelligent referral tracking system that ensures seamless patient handoffs and improves care coordination across providers.',
    price: '$279',
    pricePeriod: 'per practice/month',
    route: '/ai-agent/refercare',
    icon: 'bi-arrow-left-right',
    badge: null,
    usp: 'Reduce referral leakage by 45%',
    stripePaymentLink: 'https://buy.stripe.com/placeholder-refercare', // Replace with actual Stripe Payment Link
    features: [
      'Automated referral tracking',
      'Provider network integration',
      'Patient follow-up reminders',
      'Referral status notifications',
      'Care coordination workflows',
    ],
    useCases: [
      'Multi-specialty practices',
      'Primary care networks',
      'Healthcare systems',
    ],
    metrics: [
      { value: '45%', label: 'Reduction in referral leakage' },
      { value: '85%', label: 'Referral completion rate' },
      { value: '72hr', label: 'Average referral turnaround' },
    ],
  },
];

/**
 * Get product by ID
 */
export function getProductById(id) {
  return products.find(product => product.id === id);
}

/**
 * Get product by route
 */
export function getProductByRoute(route) {
  return products.find(product => product.route === route);
}
