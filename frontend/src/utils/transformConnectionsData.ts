/**
 * Transform connections data from backend format to ConnectionsDetailTable format
 */

interface BackendSkillMatch {
  skill: string;
  confidence?: number;
  evidence?: string;
}

interface BackendConnectionsData {
  skill_matches?: BackendSkillMatch[] | Record<string, any>;
  experience_connections?: any[];
  growth_opportunities?: string[];
  value_alignment?: any;
  unique_strengths?: string[];
  development_areas?: string[];
  portfolio_project_themes?: string[];
  ignatian_reflection_points?: string[];
  overall_fit_score?: number;
  next_steps_suggestions?: string[];
  // Enhanced format fields (if present)
  skill_alignment?: {
    direct_matches?: any[];
    transferable_skills?: any[];
    skill_gaps?: any[];
  };
}

interface TransformedConnectionsData {
  skill_alignment: {
    direct_matches: Array<{
      skill: string;
      job_requirement_snippet?: string;
      candidate_evidence: string;
      role_application: string;
      confidence_score: number;
      strength_level: string;
      source_reference?: string;
    }>;
    transferable_skills: Array<{
      candidate_skill: string;
      role_requirement: string;
      transfer_pathway: string;
      development_needed: string;
      confidence_score: number;
      timeline_to_proficiency: string;
    }>;
    skill_gaps: Array<{
      missing_skill: string;
      job_requirement_snippet?: string;
      importance: string;
      learning_pathway: string;
      mitigation_strategy: string;
      portfolio_project_opportunity: string;
    }>;
  };
}

export function transformConnectionsData(backendData: BackendConnectionsData | null | undefined): TransformedConnectionsData | null {
  if (!backendData) {
    return null;
  }

  // If the data already has the enhanced format, return it as is
  if (backendData.skill_alignment?.direct_matches || backendData.skill_alignment?.transferable_skills || backendData.skill_alignment?.skill_gaps) {
    return {
      skill_alignment: {
        direct_matches: backendData.skill_alignment.direct_matches || [],
        transferable_skills: backendData.skill_alignment.transferable_skills || [],
        skill_gaps: backendData.skill_alignment.skill_gaps || []
      }
    };
  }

  // Transform old format to new format
  const transformed: TransformedConnectionsData = {
    skill_alignment: {
      direct_matches: [],
      transferable_skills: [],
      skill_gaps: []
    }
  };

  // Transform skill_matches to direct_matches
  if (backendData.skill_matches) {
    if (Array.isArray(backendData.skill_matches)) {
      transformed.skill_alignment.direct_matches = backendData.skill_matches.map((match: BackendSkillMatch, index: number) => ({
        skill: match.skill || `Skill ${index + 1}`,
        candidate_evidence: match.evidence || 'Evidence available in resume',
        role_application: 'Directly applicable to the role requirements',
        confidence_score: match.confidence || 8,
        strength_level: match.confidence && match.confidence >= 8 ? 'strong' : 'moderate'
      }));
    } else if (typeof backendData.skill_matches === 'object') {
      // Handle object format where skills are keys
      transformed.skill_alignment.direct_matches = Object.entries(backendData.skill_matches).map(([skill, confidence], index) => ({
        skill: skill,
        candidate_evidence: 'Demonstrated in previous experience',
        role_application: 'Directly applicable to the role requirements',
        confidence_score: typeof confidence === 'number' ? confidence : 8,
        strength_level: typeof confidence === 'number' && confidence >= 8 ? 'strong' : 'moderate'
      }));
    }
  }

  // Transform experience_connections to direct_matches (instead of transferable_skills)
  if (Array.isArray(backendData.experience_connections) && backendData.experience_connections.length > 0) {
    const transferableAsMatches = backendData.experience_connections.slice(0, 3).map((exp: any, index: number) => ({
      skill: exp.skill || exp.experience || `Related Experience ${index + 1}`,
      candidate_evidence: exp.evidence || exp.description || 'Demonstrated through related experience',
      role_application: exp.connection || exp.application || 'Transferable to this role through similar application',
      confidence_score: exp.confidence || 7,
      strength_level: 'moderate'
    }));
    
    // Add these to direct matches
    transformed.skill_alignment.direct_matches.push(...transferableAsMatches);
  }

  // Transform development_areas and growth_opportunities to skill_gaps
  const gapSources = [
    ...(backendData.development_areas || []),
    ...(backendData.growth_opportunities || [])
  ];

  if (gapSources.length > 0) {
    transformed.skill_alignment.skill_gaps = gapSources.slice(0, 4).map((gap: string, index: number) => ({
      missing_skill: gap,
      importance: index === 0 ? 'critical' : index === 1 ? 'important' : 'nice-to-have',
      learning_pathway: `Online courses, hands-on practice, or mentorship in ${gap}`,
      mitigation_strategy: `Demonstrate related skills and show commitment to learning ${gap}`,
      portfolio_project_opportunity: backendData.portfolio_project_themes && backendData.portfolio_project_themes[index] 
        ? `Build a project focusing on ${backendData.portfolio_project_themes[index]}`
        : `Create a project demonstrating ${gap}`
    }));
  }

  // If we don't have any data in the expected format, create some placeholder data
  if (transformed.skill_alignment.direct_matches.length === 0 && 
      transformed.skill_alignment.transferable_skills.length === 0 && 
      transformed.skill_alignment.skill_gaps.length === 0) {
    
    // Try to extract something meaningful from the data
    if (backendData.unique_strengths && backendData.unique_strengths.length > 0) {
      transformed.skill_alignment.direct_matches = backendData.unique_strengths.slice(0, 3).map((strength: string) => ({
        skill: strength,
        candidate_evidence: 'Demonstrated through experience',
        role_application: 'Valuable for this role',
        confidence_score: 8,
        strength_level: 'strong'
      }));
    }

    // Add a message indicating data format mismatch
    console.warn('Connections data format mismatch - using fallback transformation');
  }

  return transformed;
}