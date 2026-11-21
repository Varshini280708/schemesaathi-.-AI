import { SCHEMES as LOCAL_SCHEMES, Scheme, Category } from '@/data/schemes';
import { supabase } from '@/lib/supabase';

interface SchemeRow {
  id: string;
  name: string;
  category: string;
  description: string;
  eligibility_summary: string;
  benefit: string;
  deadline: string;
  last_verified: string;
  official_source: string;
  match_level: 'strong' | 'potential' | 'low';
  who_can_apply: string[];
  eligibility_requirements: string[];
  conditions_to_verify: string[];
  benefits_list: string[];
  required_documents: string[];
  application_steps: string[];
  important_dates: { label: string; date: string }[];
}

function rowToScheme(r: SchemeRow): Scheme {
  return {
    id: r.id,
    name: r.name,
    category: r.category as Category,
    description: r.description,
    eligibilitySummary: r.eligibility_summary,
    benefit: r.benefit,
    deadline: r.deadline,
    lastVerified: r.last_verified,
    officialSource: r.official_source,
    matchLevel: r.match_level,
    whoCanApply: r.who_can_apply,
    eligibilityRequirements: r.eligibility_requirements,
    conditionsToVerify: r.conditions_to_verify,
    benefitsList: r.benefits_list,
    requiredDocuments: r.required_documents,
    applicationSteps: r.application_steps,
    importantDates: r.important_dates,
  };
}

/**
 * Fetches the scheme catalog from Supabase, falling back to the bundled
 * mock data when the database is unreachable (e.g. offline demo mode).
 */
export async function fetchSchemes(): Promise<{ schemes: Scheme[]; source: 'database' | 'local' }> {
  try {
    const { data, error } = await supabase.from('schemes').select('*').order('id');
    if (error || !data || data.length === 0) {
      return { schemes: LOCAL_SCHEMES, source: 'local' };
    }
    return { schemes: data.map(rowToScheme), source: 'database' };
  } catch {
    return { schemes: LOCAL_SCHEMES, source: 'local' };
  }
}
