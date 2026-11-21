/*
# Create schemes catalog and seed illustrative scheme data

1. Purpose
   SchemeSaathi AI is a frontend prototype for discovering government schemes.
   This migration creates the catalog of schemes the app displays, plus the
   category lookup, and seeds it with the illustrative sample schemes the
   frontend currently ships as hardcoded data.

2. New Tables
   - `scheme_categories`
     - `name` (text, primary key) — e.g. Education, Agriculture.
     - `sort_order` (integer) — display ordering.
   - `schemes`
     - `id` (text, primary key) — stable slug, e.g. 'ts-education-scholarship'.
     - `name` (text, not null) — scheme display name.
     - `category` (text, not null, FK to scheme_categories) — scheme category.
     - `description` (text, not null) — short description.
     - `eligibility_summary` (text, not null) — one-line eligibility summary.
     - `benefit` (text, not null) — headline benefit statement.
     - `deadline` (date, not null) — application deadline.
     - `last_verified` (date, not null) — date the entry was last checked.
     - `official_source` (text, not null) — source label (illustrative).
     - `match_level` (text, not null) — 'strong' | 'potential' | 'low'.
     - `who_can_apply` (jsonb, not null) — list of bullet points.
     - `eligibility_requirements` (jsonb, not null) — list of bullet points.
     - `conditions_to_verify` (jsonb, not null) — list of bullet points.
     - `benefits_list` (jsonb, not null) — list of bullet points.
     - `required_documents` (jsonb, not null) — list of document names.
     - `application_steps` (jsonb, not null) — ordered list of steps.
     - `important_dates` (jsonb, not null) — list of {label, date} objects.
     - `created_at` (timestamptz, default now).

3. Modified Tables
   - None.

4. Security
   - Enable RLS on both tables.
   - The app has NO sign-in: the catalog is intentionally public reference
     data, so SELECT policies use USING (true) scoped TO anon, authenticated.
   - No write policies: the catalog is read-only for the app. No INSERT,
     UPDATE or DELETE grants are given to anon/authenticated.
   - Grant SELECT on both tables to anon + authenticated (and service_role
     for consistency with other tooling).

5. Important Notes
   - The catalog is illustrative sample data, not verified government data.
     All rows are marked as such via the frontend's disclaimer UI.
   - Seeding is idempotent using ON CONFLICT DO UPDATE on the stable `id`
     and `name` keys, so re-running the migration never duplicates rows.
*/

CREATE TABLE IF NOT EXISTS scheme_categories (
  name text PRIMARY KEY,
  sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS schemes (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL REFERENCES scheme_categories(name),
  description text NOT NULL,
  eligibility_summary text NOT NULL,
  benefit text NOT NULL,
  deadline date NOT NULL,
  last_verified date NOT NULL,
  official_source text NOT NULL,
  match_level text NOT NULL CHECK (match_level IN ('strong', 'potential', 'low')),
  who_can_apply jsonb NOT NULL DEFAULT '[]'::jsonb,
  eligibility_requirements jsonb NOT NULL DEFAULT '[]'::jsonb,
  conditions_to_verify jsonb NOT NULL DEFAULT '[]'::jsonb,
  benefits_list jsonb NOT NULL DEFAULT '[]'::jsonb,
  required_documents jsonb NOT NULL DEFAULT '[]'::jsonb,
  application_steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  important_dates jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE scheme_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE schemes ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON scheme_categories TO anon, authenticated, service_role;
GRANT SELECT ON schemes TO anon, authenticated, service_role;

DROP POLICY IF EXISTS "catalog_read_categories" ON scheme_categories;
CREATE POLICY "catalog_read_categories"
ON scheme_categories FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "catalog_read_schemes" ON schemes;
CREATE POLICY "catalog_read_schemes"
ON schemes FOR SELECT
TO anon, authenticated
USING (true);

INSERT INTO scheme_categories (name, sort_order) VALUES
  ('Education', 1),
  ('Agriculture', 2),
  ('Women & Family', 3),
  ('Employment', 4),
  ('Healthcare', 5),
  ('Housing', 6),
  ('Senior Citizens', 7)
ON CONFLICT (name) DO UPDATE SET sort_order = EXCLUDED.sort_order;

INSERT INTO schemes (
  id, name, category, description, eligibility_summary, benefit,
  deadline, last_verified, official_source, match_level,
  who_can_apply, eligibility_requirements, conditions_to_verify,
  benefits_list, required_documents, application_steps, important_dates
) VALUES
  (
    'ts-education-scholarship',
    'Telangana Merit Scholarship (Illustrative)',
    'Education',
    'Tuition and maintenance support for college students from low-income families pursuing degree and professional courses.',
    'College students in Telangana from families with limited income, pursuing full-time degree courses.',
    'Up to ₹60,000 per year towards tuition and maintenance (illustrative).',
    '2026-12-15', '2026-11-02', 'Telangana Education Portal (sample)', 'strong',
    '["Students enrolled in a recognised college in Telangana","Families with annual income below the notified limit","Students meeting minimum attendance requirements"]'::jsonb,
    '["Admission in a full-time degree or professional course","Family income certificate issued by the competent authority","Not receiving another overlapping full scholarship"]'::jsonb,
    '["Exact income ceiling varies by course and category","Renewal rules for second and later years of study"]'::jsonb,
    '["Tuition fee reimbursement (illustrative amount)","Monthly maintenance allowance","Reimbursement for exam and other special fees"]'::jsonb,
    '["Aadhaar copy (do NOT share in this app)","Income certificate","College admission proof / bonafide certificate","Previous year marks memo","Bank passbook first page (do NOT enter bank details here)","Recent passport photo"]'::jsonb,
    '["Review the scheme eligibility conditions carefully","Collect the income and study certificates","Open the official education portal of the state","Read the official instructions before filling the form","Complete and submit the application on the official portal","Note your application reference number for tracking"]'::jsonb,
    '[{"label":"Applications open","date":"2026-11-01"},{"label":"Last date to apply","date":"2026-12-15"},{"label":"Expected verification period","date":"2027-01-15"}]'::jsonb
  ),
  (
    'ts-farmer-investment-support',
    'Farmer Investment Support Scheme (Illustrative)',
    'Agriculture',
    'Seasonal investment assistance for small and marginal farmers to support crop cultivation costs.',
    'Small and marginal farmer households holding cultivable land in Telangana.',
    'Seasonal financial assistance per acre of cultivated land (illustrative).',
    '2027-01-10', '2026-10-20', 'State Agriculture Department (sample)', 'potential',
    '["Farmer households owning or cultivating land in Telangana","Small and marginal farmers prioritised","Land records updated in the farmer''s name"]'::jsonb,
    '["Updated land record (pattadar passbook)","Active cultivation during the season","Not a government employee household (as per rules)"]'::jsonb,
    '["Tenant farmer coverage under current guidelines","Village-level verification of cultivation status"]'::jsonb,
    '["Per-acre investment support per season (illustrative)","Priority access to related agriculture schemes"]'::jsonb,
    '["Pattadar passbook / land record copy","Aadhaar copy (do NOT share in this app)","Bank account details for direct transfer (do NOT enter here)","Mobile number linked to the account"]'::jsonb,
    '["Check the latest eligibility guidelines","Ensure land records are current","Visit the official agriculture portal or nearest centre","Fill in the official application form","Track the verification status"]'::jsonb,
    '[{"label":"Season registration opens","date":"2026-12-01"},{"label":"Last date to register","date":"2027-01-10"}]'::jsonb
  ),
  (
    'ts-women-safety-support',
    'Women Safety & Support Initiative (Illustrative)',
    'Women & Family',
    'Support programme for women covering safety resources, legal aid access and skill development.',
    'Women residents of Telangana aged 18 and above; special priority for vulnerable households.',
    'Access to legal aid, helplines and free skill training (illustrative).',
    '2026-12-31', '2026-11-05', 'Women & Child Welfare Dept. (sample)', 'potential',
    '["Women aged 18 years and above","Residents of Telangana","Applicants from vulnerable or low-income households"]'::jsonb,
    '["Proof of residence in Telangana","Age proof meeting the minimum requirement"]'::jsonb,
    '["Specific sub-scheme eligibility within the initiative","Availability of training centres in your district"]'::jsonb,
    '["Free legal aid consultation","24x7 helpline access","Skill development courses at no cost"]'::jsonb,
    '["Residence proof","Aadhaar copy (do NOT share in this app)","Passport-size photo"]'::jsonb,
    '["Identify the sub-scheme that fits your need","Gather residence and age proof","Contact the official women welfare centre","Complete the registration form","Attend the orientation session"]'::jsonb,
    '[{"label":"Rolling admissions","date":"2026-11-15"},{"label":"Batch registration closes","date":"2026-12-31"}]'::jsonb
  ),
  (
    'ts-youth-employment',
    'Youth Skill & Employment Programme (Illustrative)',
    'Employment',
    'Free job-readiness training, certification and placement support for unemployed youth.',
    'Unemployed youth aged 18-35 in Telangana with minimum school education.',
    'Free training, certification and placement assistance (illustrative).',
    '2027-01-20', '2026-10-28', 'Employment & Training Dept. (sample)', 'strong',
    '["Youth aged 18 to 35 years","Residents of Telangana","Currently not in regular employment or full-time education"]'::jsonb,
    '["Minimum 10th class pass (some courses need higher)","Valid residence proof","Registered with the employment exchange (where required)"]'::jsonb,
    '["Course-wise entry criteria differ","Stipend availability for specific batches"]'::jsonb,
    '["Free classroom and practical training","Government-recognised certificate (via official channel)","Placement drives and interview preparation"]'::jsonb,
    '["Educational qualification certificates","Aadhaar copy (do NOT share in this app)","Residence proof","Recent photo"]'::jsonb,
    '["Browse available course options","Check the course-specific eligibility","Register on the official training portal","Choose a training centre and batch","Attend the counselling session"]'::jsonb,
    '[{"label":"Registration opens","date":"2026-11-20"},{"label":"Counselling begins","date":"2027-01-25"}]'::jsonb
  ),
  (
    'ts-health-insurance',
    'Family Health Protection Scheme (Illustrative)',
    'Healthcare',
    'Cashless treatment coverage for eligible families at empanelled hospitals.',
    'Low-income families in Telangana; coverage for listed medical procedures.',
    'Cashless treatment up to a defined annual limit (illustrative).',
    '2026-12-05', '2026-11-08', 'Health & Medical Care Dept. (sample)', 'strong',
    '["Families listed in the state socio-economic database","Low-income households without other similar cover"]'::jsonb,
    '["Family found eligible in the official survey list","Aadhaar-seeded ration card (as per rules)"]'::jsonb,
    '["Listed procedure coverage for your case","Empanelled hospital availability nearby"]'::jsonb,
    '["Cashless treatment at empanelled hospitals","Coverage for listed pre and post-hospitalisation care"]'::jsonb,
    '["Ration card","Aadhaar copy (do NOT share in this app)","Health record or doctor''s referral where applicable"]'::jsonb,
    '["Check whether your family is on the eligible list","Visit the official health scheme portal or kiosk","Verify and update family member details","Download the health card (via official process)","Use it at an empanelled hospital when needed"]'::jsonb,
    '[{"label":"Verification window","date":"2026-11-10"},{"label":"Enrolment closes","date":"2026-12-05"}]'::jsonb
  ),
  (
    'ts-housing-assistance',
    'Affordable Housing Assistance (Illustrative)',
    'Housing',
    'Financial assistance for house construction or purchase for eligible low-income families.',
    'Homeless or houseless low-income families in Telangana without a pucca house.',
    'Construction assistance in defined phases (illustrative).',
    '2027-02-01', '2026-10-15', 'Housing Board Portal (sample)', 'potential',
    '["Families without a pucca house","Households below the income threshold","Applicants not previously availed a similar housing benefit"]'::jsonb,
    '["No existing pucca house in the family","Household income below the notified ceiling","Valid land or allotment documents"]'::jsonb,
    '["Beneficiary list approval by the local authority","Phase-wise fund release schedule"]'::jsonb,
    '["Phased construction assistance (illustrative amount)","Support for land survey documentation"]'::jsonb,
    '["Income certificate","Land documents or allotment letter","Aadhaar copy (do NOT share in this app)","Family photo"]'::jsonb,
    '["Confirm household eligibility","Collect income and land documents","Apply through the official housing portal","Attend the local verification visit","Track the sanction status"]'::jsonb,
    '[{"label":"New applications open","date":"2026-12-10"},{"label":"Application deadline","date":"2027-02-01"}]'::jsonb
  ),
  (
    'ts-senior-pension',
    'Old Age Pension Scheme (Illustrative)',
    'Senior Citizens',
    'Monthly pension support for senior citizens from low-income households.',
    'Residents aged 60 and above from economically weaker households.',
    'Monthly pension credited to the bank account (illustrative).',
    '2026-12-25', '2026-11-01', 'Rural Development Dept. (sample)', 'strong',
    '["Senior citizens aged 60 years and above","Households below the poverty line as per official criteria","Residents of Telangana"]'::jsonb,
    '["Minimum age of 60 years","Low household income as per official norms","Not receiving another similar pension"]'::jsonb,
    '["Current pension amount revision","Life certificate renewal schedule"]'::jsonb,
    '["Monthly pension amount (illustrative)","Annual life certificate reminder support"]'::jsonb,
    '["Age proof (Aadhaar / certificate — do NOT share here)","Income certificate","Bank passbook details (do NOT enter in this app)","Recent photo"]'::jsonb,
    '["Verify the current age criteria","Collect the income and age proofs","Apply at the official ward / mandal office or portal","Complete verification","Track pension credit monthly"]'::jsonb,
    '[{"label":"Applications accepted","date":"2026-11-15"},{"label":"Verification deadline","date":"2026-12-25"}]'::jsonb
  ),
  (
    'ts-student-transport',
    'Student Bus Pass Scheme (Illustrative)',
    'Education',
    'Discounted or free bus travel passes for students of recognised institutions.',
    'Full-time students in Telangana travelling between home and institution.',
    'Free or heavily discounted travel pass (illustrative).',
    '2026-12-01', '2026-10-25', 'State Transport Corporation (sample)', 'potential',
    '["Full-time students of recognised institutions","Students travelling on a regular route"]'::jsonb,
    '["Valid student ID or bonafide certificate","Residence within the served route area"]'::jsonb,
    '["Route availability and pass type","Photo verification requirements"]'::jsonb,
    '["Free pass for eligible school students (illustrative)","Discounted pass for college students"]'::jsonb,
    '["Bonafide / student ID certificate","Aadhaar copy (do NOT share in this app)","Passport photo"]'::jsonb,
    '["Confirm the pass type for your route","Get the bonafide certificate from your institution","Apply on the official transport portal or depot","Collect the pass after verification"]'::jsonb,
    '[{"label":"Pass issuance window","date":"2026-11-05"},{"label":"Window closes","date":"2026-12-01"}]'::jsonb
  ),
  (
    'ts-micro-irrigation',
    'Micro Irrigation Support (Illustrative)',
    'Agriculture',
    'Subsidy for drip and sprinkler irrigation systems to improve water efficiency.',
    'Farmers with water access who wish to install micro irrigation systems.',
    'Subsidy covering a portion of system cost (illustrative).',
    '2027-01-31', '2026-10-18', 'Horticulture Dept. (sample)', 'low',
    '["Farmers owning cultivable land with water source","Applicants not availed this subsidy before"]'::jsonb,
    '["Proof of land ownership or cultivation rights","Confirmed water source on the land"]'::jsonb,
    '["Current subsidy percentage by category","Empanelled vendor list"]'::jsonb,
    '["Subsidy on drip / sprinkler systems (illustrative %)","Technical guidance for installation"]'::jsonb,
    '["Land record copy","Aadhaar copy (do NOT share in this app)","Water source proof"]'::jsonb,
    '["Confirm the current subsidy rate","Choose an empanelled vendor","Apply on the official horticulture portal","Complete installation inspection","Receive subsidy by direct transfer"]'::jsonb,
    '[{"label":"Applications open","date":"2026-11-25"},{"label":"Last date","date":"2027-01-31"}]'::jsonb
  ),
  (
    'ts-entrepreneur-women',
    'Women Entrepreneur Start-up Grant (Illustrative)',
    'Women & Family',
    'Seed support and subsidised loans for women starting small businesses.',
    'Women aged 22-55 planning or running a small business in Telangana.',
    'Seed grant and subsidised loan interest (illustrative).',
    '2027-01-05', '2026-11-03', 'Industries Dept. (sample)', 'strong',
    '["Women aged 22 to 55 years","Business registered or planned in Telangana","Household meeting income criteria where applicable"]'::jsonb,
    '["Business plan or existing small business proof","Aadhaar and residence proof","Training certificate (for some categories)"]'::jsonb,
    '["Loan guarantee requirements","Sector-specific grant limits"]'::jsonb,
    '["Seed grant amount (illustrative)","Interest subsidy on bank loans","Mentorship and training access"]'::jsonb,
    '["Business plan summary","Aadhaar copy (do NOT share in this app)","Residence proof","Bank account details (do NOT enter here)"]'::jsonb,
    '["Attend the official orientation session","Prepare the business plan","Apply on the official industries portal","Attend the selection interview","Complete the disbursement formalities"]'::jsonb,
    '[{"label":"Orientation starts","date":"2026-11-28"},{"label":"Application deadline","date":"2027-01-05"}]'::jsonb
  ),
  (
    'ts-rural-jobs',
    'Rural Employment Guarantee (Illustrative)',
    'Employment',
    'Guaranteed wage employment for rural households willing to do public work.',
    'Adult members of rural households in Telangana willing to work.',
    'Wage employment for up to 100 days per year (illustrative).',
    '2026-12-20', '2026-10-30', 'Rural Development Dept. (sample)', 'strong',
    '["Adult members (18+) of rural households","Households willing to do unskilled public work"]'::jsonb,
    '["Residence in a rural area","Adult age of 18 years or above","Job card from the local authority"]'::jsonb,
    '["Work availability in your village this season","Current wage rate notification"]'::jsonb,
    '["Daily wage employment (illustrative rate)","Job card and work record"]'::jsonb,
    '["Aadhaar copy (do NOT share in this app)","Residence proof","Bank account details (do NOT enter here)","Recent photo"]'::jsonb,
    '["Apply for a job card at the local office","Submit the work request form","Wait for the work allocation","Attend the assigned work site"]'::jsonb,
    '[{"label":"Job card drive","date":"2026-11-18"},{"label":"Work season begins","date":"2026-12-20"}]'::jsonb
  ),
  (
    'ts-diabetic-care',
    'Chronic Disease Care Support (Illustrative)',
    'Healthcare',
    'Free screening, medicines and follow-up support for chronic conditions like diabetes and hypertension.',
    'Residents diagnosed with or at risk of listed chronic conditions.',
    'Free medicines and periodic health check-ups (illustrative).',
    '2027-02-15', '2026-11-06', 'National Health Mission (sample)', 'potential',
    '["Residents of Telangana","People diagnosed with listed chronic conditions","Adults aged 30+ for screening camps"]'::jsonb,
    '["Diagnosis or screening at an official facility","Residence in the service area"]'::jsonb,
    '["Medicine stock availability at your centre","Follow-up schedule by district"]'::jsonb,
    '["Free monthly medicine supply (illustrative)","Quarterly health check-up","Specialist referral where needed"]'::jsonb,
    '["Aadhaar copy (do NOT share in this app)","Medical reports where available","Residence proof"]'::jsonb,
    '["Visit the nearest official health centre","Complete the free screening","Register for the follow-up programme","Collect medicines as scheduled"]'::jsonb,
    '[{"label":"Screening camps","date":"2026-11-30"},{"label":"Enrolment ongoing","date":"2027-02-15"}]'::jsonb
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  eligibility_summary = EXCLUDED.eligibility_summary,
  benefit = EXCLUDED.benefit,
  deadline = EXCLUDED.deadline,
  last_verified = EXCLUDED.last_verified,
  official_source = EXCLUDED.official_source,
  match_level = EXCLUDED.match_level,
  who_can_apply = EXCLUDED.who_can_apply,
  eligibility_requirements = EXCLUDED.eligibility_requirements,
  conditions_to_verify = EXCLUDED.conditions_to_verify,
  benefits_list = EXCLUDED.benefits_list,
  required_documents = EXCLUDED.required_documents,
  application_steps = EXCLUDED.application_steps,
  important_dates = EXCLUDED.important_dates;
