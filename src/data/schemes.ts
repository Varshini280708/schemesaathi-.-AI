export type Category =
  | 'Education'
  | 'Agriculture'
  | 'Women & Family'
  | 'Employment'
  | 'Healthcare'
  | 'Housing'
  | 'Senior Citizens';

export const CATEGORIES: Category[] = [
  'Education',
  'Agriculture',
  'Women & Family',
  'Employment',
  'Healthcare',
  'Housing',
  'Senior Citizens',
];

export interface Scheme {
  id: string;
  name: string;
  category: Category;
  description: string;
  eligibilitySummary: string;
  benefit: string;
  deadline: string; // ISO date
  lastVerified: string; // ISO date
  officialSource: string;
  matchLevel: 'strong' | 'potential' | 'low';
  whoCanApply: string[];
  eligibilityRequirements: string[];
  conditionsToVerify: string[];
  benefitsList: string[];
  requiredDocuments: string[];
  applicationSteps: string[];
  importantDates: { label: string; date: string }[];
}

export const SCHEMES: Scheme[] = [
  {
    id: 'ts-education-scholarship',
    name: 'Telangana Merit Scholarship (Illustrative)',
    category: 'Education',
    description:
      'Tuition and maintenance support for college students from low-income families pursuing degree and professional courses.',
    eligibilitySummary:
      'College students in Telangana from families with limited income, pursuing full-time degree courses.',
    benefit: 'Up to ₹60,000 per year towards tuition and maintenance (illustrative).',
    deadline: '2026-12-15',
    lastVerified: '2026-11-02',
    officialSource: 'Telangana Education Portal (sample)',
    matchLevel: 'strong',
    whoCanApply: [
      'Students enrolled in a recognised college in Telangana',
      'Families with annual income below the notified limit',
      'Students meeting minimum attendance requirements',
    ],
    eligibilityRequirements: [
      'Admission in a full-time degree or professional course',
      'Family income certificate issued by the competent authority',
      'Not receiving another overlapping full scholarship',
    ],
    conditionsToVerify: [
      'Exact income ceiling varies by course and category',
      'Renewal rules for second and later years of study',
    ],
    benefitsList: [
      'Tuition fee reimbursement (illustrative amount)',
      'Monthly maintenance allowance',
      'Reimbursement for exam and other special fees',
    ],
    requiredDocuments: [
      'Aadhaar copy (do NOT share in this app)',
      'Income certificate',
      'College admission proof / bonafide certificate',
      'Previous year marks memo',
      'Bank passbook first page (do NOT enter bank details here)',
      'Recent passport photo',
    ],
    applicationSteps: [
      'Review the scheme eligibility conditions carefully',
      'Collect the income and study certificates',
      'Open the official education portal of the state',
      'Read the official instructions before filling the form',
      'Complete and submit the application on the official portal',
      'Note your application reference number for tracking',
    ],
    importantDates: [
      { label: 'Applications open', date: '2026-11-01' },
      { label: 'Last date to apply', date: '2026-12-15' },
      { label: 'Expected verification period', date: '2027-01-15' },
    ],
  },
  {
    id: 'ts-farmer-investment-support',
    name: 'Farmer Investment Support Scheme (Illustrative)',
    category: 'Agriculture',
    description:
      'Seasonal investment assistance for small and marginal farmers to support crop cultivation costs.',
    eligibilitySummary:
      'Small and marginal farmer households holding cultivable land in Telangana.',
    benefit: 'Seasonal financial assistance per acre of cultivated land (illustrative).',
    deadline: '2027-01-10',
    lastVerified: '2026-10-20',
    officialSource: 'State Agriculture Department (sample)',
    matchLevel: 'potential',
    whoCanApply: [
      'Farmer households owning or cultivating land in Telangana',
      'Small and marginal farmers prioritised',
      'Land records updated in the farmer\u2019s name',
    ],
    eligibilityRequirements: [
      'Updated land record (pattadar passbook)',
      'Active cultivation during the season',
      'Not a government employee household (as per rules)',
    ],
    conditionsToVerify: [
      'Tenant farmer coverage under current guidelines',
      'Village-level verification of cultivation status',
    ],
    benefitsList: [
      'Per-acre investment support per season (illustrative)',
      'Priority access to related agriculture schemes',
    ],
    requiredDocuments: [
      'Pattadar passbook / land record copy',
      'Aadhaar copy (do NOT share in this app)',
      'Bank account details for direct transfer (do NOT enter here)',
      'Mobile number linked to the account',
    ],
    applicationSteps: [
      'Check the latest eligibility guidelines',
      'Ensure land records are current',
      'Visit the official agriculture portal or nearest centre',
      'Fill in the official application form',
      'Track the verification status',
    ],
    importantDates: [
      { label: 'Season registration opens', date: '2026-12-01' },
      { label: 'Last date to register', date: '2027-01-10' },
    ],
  },
  {
    id: 'ts-women-safety-support',
    name: 'Women Safety & Support Initiative (Illustrative)',
    category: 'Women & Family',
    description:
      'Support programme for women covering safety resources, legal aid access and skill development.',
    eligibilitySummary:
      'Women residents of Telangana aged 18 and above; special priority for vulnerable households.',
    benefit: 'Access to legal aid, helplines and free skill training (illustrative).',
    deadline: '2026-12-31',
    lastVerified: '2026-11-05',
    officialSource: 'Women & Child Welfare Dept. (sample)',
    matchLevel: 'potential',
    whoCanApply: [
      'Women aged 18 years and above',
      'Residents of Telangana',
      'Applicants from vulnerable or low-income households',
    ],
    eligibilityRequirements: [
      'Proof of residence in Telangana',
      'Age proof meeting the minimum requirement',
    ],
    conditionsToVerify: [
      'Specific sub-scheme eligibility within the initiative',
      'Availability of training centres in your district',
    ],
    benefitsList: [
      'Free legal aid consultation',
      '24x7 helpline access',
      'Skill development courses at no cost',
    ],
    requiredDocuments: [
      'Residence proof',
      'Aadhaar copy (do NOT share in this app)',
      'Passport-size photo',
    ],
    applicationSteps: [
      'Identify the sub-scheme that fits your need',
      'Gather residence and age proof',
      'Contact the official women welfare centre',
      'Complete the registration form',
      'Attend the orientation session',
    ],
    importantDates: [
      { label: 'Rolling admissions', date: '2026-11-15' },
      { label: 'Batch registration closes', date: '2026-12-31' },
    ],
  },
  {
    id: 'ts-youth-employment',
    name: 'Youth Skill & Employment Programme (Illustrative)',
    category: 'Employment',
    description:
      'Free job-readiness training, certification and placement support for unemployed youth.',
    eligibilitySummary:
      'Unemployed youth aged 18\u201335 in Telangana with minimum school education.',
    benefit: 'Free training, certification and placement assistance (illustrative).',
    deadline: '2027-01-20',
    lastVerified: '2026-10-28',
    officialSource: 'Employment & Training Dept. (sample)',
    matchLevel: 'strong',
    whoCanApply: [
      'Youth aged 18 to 35 years',
      'Residents of Telangana',
      'Currently not in regular employment or full-time education',
    ],
    eligibilityRequirements: [
      'Minimum 10th class pass (some courses need higher)',
      'Valid residence proof',
      'Registered with the employment exchange (where required)',
    ],
    conditionsToVerify: [
      'Course-wise entry criteria differ',
      'Stipend availability for specific batches',
    ],
    benefitsList: [
      'Free classroom and practical training',
      'Government-recognised certificate (via official channel)',
      'Placement drives and interview preparation',
    ],
    requiredDocuments: [
      'Educational qualification certificates',
      'Aadhaar copy (do NOT share in this app)',
      'Residence proof',
      'Recent photo',
    ],
    applicationSteps: [
      'Browse available course options',
      'Check the course-specific eligibility',
      'Register on the official training portal',
      'Choose a training centre and batch',
      'Attend the counselling session',
    ],
    importantDates: [
      { label: 'Registration opens', date: '2026-11-20' },
      { label: 'Counselling begins', date: '2027-01-25' },
    ],
  },
  {
    id: 'ts-health-insurance',
    name: 'Family Health Protection Scheme (Illustrative)',
    category: 'Healthcare',
    description:
      'Cashless treatment coverage for eligible families at empanelled hospitals.',
    eligibilitySummary:
      'Low-income families in Telangana; coverage for listed medical procedures.',
    benefit: 'Cashless treatment up to a defined annual limit (illustrative).',
    deadline: '2026-12-05',
    lastVerified: '2026-11-08',
    officialSource: 'Health & Medical Care Dept. (sample)',
    matchLevel: 'strong',
    whoCanApply: [
      'Families listed in the state socio-economic database',
      'Low-income households without other similar cover',
    ],
    eligibilityRequirements: [
      'Family found eligible in the official survey list',
      'Aadhaar-seeded ration card (as per rules)',
    ],
    conditionsToVerify: [
      'Listed procedure coverage for your case',
      'Empanelled hospital availability nearby',
    ],
    benefitsList: [
      'Cashless treatment at empanelled hospitals',
      'Coverage for listed pre and post-hospitalisation care',
    ],
    requiredDocuments: [
      'Ration card',
      'Aadhaar copy (do NOT share in this app)',
      'Health record or doctor\u2019s referral where applicable',
    ],
    applicationSteps: [
      'Check whether your family is on the eligible list',
      'Visit the official health scheme portal or kiosk',
      'Verify and update family member details',
      'Download the health card (via official process)',
      'Use it at an empanelled hospital when needed',
    ],
    importantDates: [
      { label: 'Verification window', date: '2026-11-10' },
      { label: 'Enrolment closes', date: '2026-12-05' },
    ],
  },
  {
    id: 'ts-housing-assistance',
    name: 'Affordable Housing Assistance (Illustrative)',
    category: 'Housing',
    description:
      'Financial assistance for house construction or purchase for eligible low-income families.',
    eligibilitySummary:
      'Homeless or houseless low-income families in Telangana without a pucca house.',
    benefit: 'Construction assistance in defined phases (illustrative).',
    deadline: '2027-02-01',
    lastVerified: '2026-10-15',
    officialSource: 'Housing Board Portal (sample)',
    matchLevel: 'potential',
    whoCanApply: [
      'Families without a pucca house',
      'Households below the income threshold',
      'Applicants not previously availed a similar housing benefit',
    ],
    eligibilityRequirements: [
      'No existing pucca house in the family',
      'Household income below the notified ceiling',
      'Valid land or allotment documents',
    ],
    conditionsToVerify: [
      'Beneficiary list approval by the local authority',
      'Phase-wise fund release schedule',
    ],
    benefitsList: [
      'Phased construction assistance (illustrative amount)',
      'Support for land survey documentation',
    ],
    requiredDocuments: [
      'Income certificate',
      'Land documents or allotment letter',
      'Aadhaar copy (do NOT share in this app)',
      'Family photo',
    ],
    applicationSteps: [
      'Confirm household eligibility',
      'Collect income and land documents',
      'Apply through the official housing portal',
      'Attend the local verification visit',
      'Track the sanction status',
    ],
    importantDates: [
      { label: 'New applications open', date: '2026-12-10' },
      { label: 'Application deadline', date: '2027-02-01' },
    ],
  },
  {
    id: 'ts-senior-pension',
    name: 'Old Age Pension Scheme (Illustrative)',
    category: 'Senior Citizens',
    description:
      'Monthly pension support for senior citizens from low-income households.',
    eligibilitySummary:
      'Residents aged 60 and above from economically weaker households.',
    benefit: 'Monthly pension credited to the bank account (illustrative).',
    deadline: '2026-12-25',
    lastVerified: '2026-11-01',
    officialSource: 'Rural Development Dept. (sample)',
    matchLevel: 'strong',
    whoCanApply: [
      'Senior citizens aged 60 years and above',
      'Households below the poverty line as per official criteria',
      'Residents of Telangana',
    ],
    eligibilityRequirements: [
      'Minimum age of 60 years',
      'Low household income as per official norms',
      'Not receiving another similar pension',
    ],
    conditionsToVerify: [
      'Current pension amount revision',
      'Life certificate renewal schedule',
    ],
    benefitsList: [
      'Monthly pension amount (illustrative)',
      'Annual life certificate reminder support',
    ],
    requiredDocuments: [
      'Age proof (Aadhaar / certificate — do NOT share here)',
      'Income certificate',
      'Bank passbook details (do NOT enter in this app)',
      'Recent photo',
    ],
    applicationSteps: [
      'Verify the current age criteria',
      'Collect the income and age proofs',
      'Apply at the official ward / mandal office or portal',
      'Complete verification',
      'Track pension credit monthly',
    ],
    importantDates: [
      { label: 'Applications accepted', date: '2026-11-15' },
      { label: 'Verification deadline', date: '2026-12-25' },
    ],
  },
  {
    id: 'ts-student-transport',
    name: 'Student Bus Pass Scheme (Illustrative)',
    category: 'Education',
    description:
      'Discounted or free bus travel passes for students of recognised institutions.',
    eligibilitySummary:
      'Full-time students in Telangana travelling between home and institution.',
    benefit: 'Free or heavily discounted travel pass (illustrative).',
    deadline: '2026-12-01',
    lastVerified: '2026-10-25',
    officialSource: 'State Transport Corporation (sample)',
    matchLevel: 'potential',
    whoCanApply: [
      'Full-time students of recognised institutions',
      'Students travelling on a regular route',
    ],
    eligibilityRequirements: [
      'Valid student ID or bonafide certificate',
      'Residence within the served route area',
    ],
    conditionsToVerify: [
      'Route availability and pass type',
      'Photo verification requirements',
    ],
    benefitsList: [
      'Free pass for eligible school students (illustrative)',
      'Discounted pass for college students',
    ],
    requiredDocuments: [
      'Bonafide / student ID certificate',
      'Aadhaar copy (do NOT share in this app)',
      'Passport photo',
    ],
    applicationSteps: [
      'Confirm the pass type for your route',
      'Get the bonafide certificate from your institution',
      'Apply on the official transport portal or depot',
      'Collect the pass after verification',
    ],
    importantDates: [
      { label: 'Pass issuance window', date: '2026-11-05' },
      { label: 'Window closes', date: '2026-12-01' },
    ],
  },
  {
    id: 'ts-micro-irrigation',
    name: 'Micro Irrigation Support (Illustrative)',
    category: 'Agriculture',
    description:
      'Subsidy for drip and sprinkler irrigation systems to improve water efficiency.',
    eligibilitySummary:
      'Farmers with water access who wish to install micro irrigation systems.',
    benefit: 'Subsidy covering a portion of system cost (illustrative).',
    deadline: '2027-01-31',
    lastVerified: '2026-10-18',
    officialSource: 'Horticulture Dept. (sample)',
    matchLevel: 'low',
    whoCanApply: [
      'Farmers owning cultivable land with water source',
      'Applicants not availed this subsidy before',
    ],
    eligibilityRequirements: [
      'Proof of land ownership or cultivation rights',
      'Confirmed water source on the land',
    ],
    conditionsToVerify: [
      'Current subsidy percentage by category',
      'Empanelled vendor list',
    ],
    benefitsList: [
      'Subsidy on drip / sprinkler systems (illustrative %)',
      'Technical guidance for installation',
    ],
    requiredDocuments: [
      'Land record copy',
      'Aadhaar copy (do NOT share in this app)',
      'Water source proof',
    ],
    applicationSteps: [
      'Confirm the current subsidy rate',
      'Choose an empanelled vendor',
      'Apply on the official horticulture portal',
      'Complete installation inspection',
      'Receive subsidy by direct transfer',
    ],
    importantDates: [
      { label: 'Applications open', date: '2026-11-25' },
      { label: 'Last date', date: '2027-01-31' },
    ],
  },
  {
    id: 'ts-entrepreneur-women',
    name: 'Women Entrepreneur Start-up Grant (Illustrative)',
    category: 'Women & Family',
    description:
      'Seed support and subsidised loans for women starting small businesses.',
    eligibilitySummary:
      'Women aged 22\u201355 planning or running a small business in Telangana.',
    benefit: 'Seed grant and subsidised loan interest (illustrative).',
    deadline: '2027-01-05',
    lastVerified: '2026-11-03',
    officialSource: 'Industries Dept. (sample)',
    matchLevel: 'strong',
    whoCanApply: [
      'Women aged 22 to 55 years',
      'Business registered or planned in Telangana',
      'Household meeting income criteria where applicable',
    ],
    eligibilityRequirements: [
      'Business plan or existing small business proof',
      'Aadhaar and residence proof',
      'Training certificate (for some categories)',
    ],
    conditionsToVerify: [
      'Loan guarantee requirements',
      'Sector-specific grant limits',
    ],
    benefitsList: [
      'Seed grant amount (illustrative)',
      'Interest subsidy on bank loans',
      'Mentorship and training access',
    ],
    requiredDocuments: [
      'Business plan summary',
      'Aadhaar copy (do NOT share in this app)',
      'Residence proof',
      'Bank account details (do NOT enter here)',
    ],
    applicationSteps: [
      'Attend the official orientation session',
      'Prepare the business plan',
      'Apply on the official industries portal',
      'Attend the selection interview',
      'Complete the disbursement formalities',
    ],
    importantDates: [
      { label: 'Orientation starts', date: '2026-11-28' },
      { label: 'Application deadline', date: '2027-01-05' },
    ],
  },
  {
    id: 'ts-rural-jobs',
    name: 'Rural Employment Guarantee (Illustrative)',
    category: 'Employment',
    description:
      'Guaranteed wage employment for rural households willing to do public work.',
    eligibilitySummary:
      'Adult members of rural households in Telangana willing to work.',
    benefit: 'Wage employment for up to 100 days per year (illustrative).',
    deadline: '2026-12-20',
    lastVerified: '2026-10-30',
    officialSource: 'Rural Development Dept. (sample)',
    matchLevel: 'strong',
    whoCanApply: [
      'Adult members (18+) of rural households',
      'Households willing to do unskilled public work',
    ],
    eligibilityRequirements: [
      'Residence in a rural area',
      'Adult age of 18 years or above',
      'Job card from the local authority',
    ],
    conditionsToVerify: [
      'Work availability in your village this season',
      'Current wage rate notification',
    ],
    benefitsList: [
      'Daily wage employment (illustrative rate)',
      'Job card and work record',
    ],
    requiredDocuments: [
      'Aadhaar copy (do NOT share in this app)',
      'Residence proof',
      'Bank account details (do NOT enter here)',
      'Recent photo',
    ],
    applicationSteps: [
      'Apply for a job card at the local office',
      'Submit the work request form',
      'Wait for the work allocation',
      'Attend the assigned work site',
    ],
    importantDates: [
      { label: 'Job card drive', date: '2026-11-18' },
      { label: 'Work season begins', date: '2026-12-20' },
    ],
  },
  {
    id: 'ts-diabetic-care',
    name: 'Chronic Disease Care Support (Illustrative)',
    category: 'Healthcare',
    description:
      'Free screening, medicines and follow-up support for chronic conditions like diabetes and hypertension.',
    eligibilitySummary:
      'Residents diagnosed with or at risk of listed chronic conditions.',
    benefit: 'Free medicines and periodic health check-ups (illustrative).',
    deadline: '2027-02-15',
    lastVerified: '2026-11-06',
    officialSource: 'National Health Mission (sample)',
    matchLevel: 'potential',
    whoCanApply: [
      'Residents of Telangana',
      'People diagnosed with listed chronic conditions',
      'Adults aged 30+ for screening camps',
    ],
    eligibilityRequirements: [
      'Diagnosis or screening at an official facility',
      'Residence in the service area',
    ],
    conditionsToVerify: [
      'Medicine stock availability at your centre',
      'Follow-up schedule by district',
    ],
    benefitsList: [
      'Free monthly medicine supply (illustrative)',
      'Quarterly health check-up',
      'Specialist referral where needed',
    ],
    requiredDocuments: [
      'Aadhaar copy (do NOT share in this app)',
      'Medical reports where available',
      'Residence proof',
    ],
    applicationSteps: [
      'Visit the nearest official health centre',
      'Complete the free screening',
      'Register for the follow-up programme',
      'Collect medicines as scheduled',
    ],
    importantDates: [
      { label: 'Screening camps', date: '2026-11-30' },
      { label: 'Enrolment ongoing', date: '2027-02-15' },
    ],
  },
];

export interface Deadline {
  schemeId: string;
  label: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
}

export const UPCOMING_DEADLINES: Deadline[] = [
  { schemeId: 'ts-student-transport', label: 'Bus pass window closes', date: '2026-12-01', priority: 'high' },
  { schemeId: 'ts-health-insurance', label: 'Health card enrolment closes', date: '2026-12-05', priority: 'high' },
  { schemeId: 'ts-education-scholarship', label: 'Scholarship last date', date: '2026-12-15', priority: 'high' },
  { schemeId: 'ts-rural-jobs', label: 'Work season begins', date: '2026-12-20', priority: 'medium' },
  { schemeId: 'ts-senior-pension', label: 'Pension verification deadline', date: '2026-12-25', priority: 'medium' },
  { schemeId: 'ts-women-safety-support', label: 'Batch registration closes', date: '2026-12-31', priority: 'low' },
  { schemeId: 'ts-entrepreneur-women', label: 'Grant application deadline', date: '2027-01-05', priority: 'medium' },
  { schemeId: 'ts-farmer-investment-support', label: 'Season registration closes', date: '2027-01-10', priority: 'low' },
];
