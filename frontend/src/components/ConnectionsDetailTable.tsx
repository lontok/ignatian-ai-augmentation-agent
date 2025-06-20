import React, { useState } from 'react';

interface DirectMatch {
  skill: string;
  job_requirement_snippet?: string;
  candidate_evidence: string | string[];
  connection_explanations?: string[];
  role_application: string;
  confidence_score: number;
  strength_level: string;
  source_reference?: string;
}

interface TransferableSkill {
  candidate_skill: string;
  role_requirement: string;
  transfer_pathway: string;
  development_needed: string;
  confidence_score: number;
  timeline_to_proficiency: string;
}

interface SkillGap {
  missing_skill: string;
  job_requirement_snippet?: string;
  importance: string;
  learning_pathway: string;
  mitigation_strategy: string;
  portfolio_project_opportunity: string;
  source_reference?: string;
}

interface ConnectionsAnalysis {
  skill_alignment?: {
    direct_matches?: DirectMatch[];
    transferable_skills?: TransferableSkill[];
    skill_gaps?: SkillGap[];
  };
}

interface Props {
  connectionsAnalysis?: ConnectionsAnalysis;
  companyName?: string;
}

const ConnectionsDetailTable: React.FC<Props> = ({ connectionsAnalysis, companyName = 'this opportunity' }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'matches' | 'gaps'>('all');
  
  if (!connectionsAnalysis?.skill_alignment) {
    return null;
  }

  const { direct_matches = [], transferable_skills = [], skill_gaps = [] } = connectionsAnalysis.skill_alignment;

  const getMatchIcon = (type: 'match' | 'gap') => {
    switch (type) {
      case 'match':
        return <span className="text-green-600 text-lg">✓</span>;
      case 'gap':
        return <span className="text-red-600 text-lg">✗</span>;
      default:
        return null;
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance.toLowerCase()) {
      case 'critical':
        return 'text-red-700 font-semibold';
      case 'important':
        return 'text-orange-600 font-medium';
      case 'nice-to-have':
        return 'text-gray-600';
      default:
        return 'text-gray-700';
    }
  };

  const shouldShowRow = (type: 'match' | 'gap') => {
    if (activeTab === 'all') return true;
    if (activeTab === 'matches' && type === 'match') return true;
    if (activeTab === 'gaps' && type === 'gap') return true;
    return false;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Detailed Skills Evidence</h3>
        <p className="text-sm text-gray-600 mt-1">
          How your experience aligns with requirements for {companyName}
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'all'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            All ({direct_matches.length + skill_gaps.length})
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'matches'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Direct Matches ({direct_matches.length})
          </button>
          <button
            onClick={() => setActiveTab('gaps')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'gaps'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Gaps ({skill_gaps.length})
          </button>
        </nav>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider w-1/3">
                Job-Description Requirement ▲
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider w-1/3">
                Resume Evidence
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider w-1/3">
                Why This Connects
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Direct Matches */}
            {direct_matches.map((match, index) => shouldShowRow('match') && (
              <tr key={`match-${index}`} className="hover:bg-gray-50">
                <td className="px-4 py-4 align-top">
                  <div className="text-sm text-gray-900">
                    {activeTab === 'all' && (
                      <span className="text-green-600 mr-2">✓</span>
                    )}
                    "{match.job_requirement_snippet || match.skill}"
                  </div>
                  {match.source_reference && (
                    <div className="text-xs text-gray-500 mt-1">{match.source_reference}</div>
                  )}
                </td>
                <td className="px-4 py-4 align-top">
                  {Array.isArray(match.candidate_evidence) ? (
                    <div className="space-y-3">
                      {match.candidate_evidence.map((evidence: string, evidenceIndex: number) => (
                        <div key={evidenceIndex} className="text-sm text-gray-900">
                          <span className="text-gray-400 mr-2">{evidenceIndex + 1}.</span>
                          "{evidence}"
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-900">
                      "{match.candidate_evidence}"
                    </div>
                  )}
                </td>
                <td className="px-4 py-4 align-top">
                  {match.connection_explanations && Array.isArray(match.connection_explanations) ? (
                    <div className="space-y-3">
                      {match.connection_explanations.map((explanation: string, explanationIndex: number) => (
                        <div key={explanationIndex} className="text-sm text-gray-700 italic">
                          <span className="text-gray-400 mr-2">{explanationIndex + 1}.</span>
                          {explanation}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">
                      Connection explanation not available
                    </div>
                  )}
                </td>
              </tr>
            ))}

{/* Skill Gaps */}
            {skill_gaps.map((gap, index) => shouldShowRow('gap') && (
              <tr key={`gap-${index}`} className="hover:bg-gray-50">
                <td className="px-4 py-4 align-top">
                  <div className="text-sm text-gray-900">
                    {activeTab === 'all' && (
                      <span className="text-red-600 mr-2">✗</span>
                    )}
                    "{gap.job_requirement_snippet || gap.missing_skill}"
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {gap.source_reference || 'Requirements'}
                  </div>
                </td>
                <td className="px-4 py-4 align-top">
                  <div className="text-sm text-gray-500 italic">
                    — (no direct evidence)
                  </div>
                </td>
                <td className="px-4 py-4 align-top">
                  <div className="text-sm text-gray-500 italic">
                    N/A - No evidence found
                  </div>
                  {gap.mitigation_strategy && (
                    <div className="text-xs text-gray-600 mt-2">
                      <strong>Next step:</strong> {gap.mitigation_strategy}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* How to Use Section */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-2">How to use this table:</h4>
        <ol className="text-sm text-gray-600 space-y-1">
          <li>1. Review your direct matches (✓) to see which job requirements you already meet.</li>
          <li>2. Look at the Resume Evidence column to see the exact quotes from your resume that demonstrate each skill.</li>
          <li>3. Read the "Why This Connects" column to practice articulating how your experience relates to each requirement.</li>
          <li>4. For gaps (✗), note the "Next step" suggestions to build evidence before applying.</li>
        </ol>
      </div>
    </div>
  );
};

export default ConnectionsDetailTable;