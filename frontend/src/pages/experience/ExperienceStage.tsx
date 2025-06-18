import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface Document {
  id: number;
  document_type: 'resume' | 'job_description';
  filename: string;
  original_filename: string;
  file_size: number;
  created_at: string;
  content_text?: string;
}

interface AnalysisResult {
  id: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  resume_analysis?: any;
  job_analysis?: any;
  connections_analysis?: any;
  context_summary?: string;
  error_message?: string;
  created_at: string;
  completed_at?: string;
}

interface ExperienceItem {
  id: string;
  type: 'skill' | 'experience' | 'achievement' | 'connection';
  title: string;
  description: string;
  relevance_score: number;
  source: 'resume' | 'job_description';
  selected: boolean;
  user_elaboration?: string;
}

const ExperienceStage: React.FC = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [experienceItems, setExperienceItems] = useState<ExperienceItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [elaborations, setElaborations] = useState<Record<string, string>>({});
  const [currentElaboration, setCurrentElaboration] = useState<string | null>(null);

  useEffect(() => {
    loadLatestAnalysis();
  }, []);

  const loadLatestAnalysis = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/analysis/latest/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const analysisData = await response.json();
        setAnalysis(analysisData);
        
        if (analysisData.status === 'completed') {
          processAnalysisForExperiences(analysisData);
        }
      } else {
        // No analysis found, redirect back to context
        window.location.href = '/context';
      }
    } catch (error) {
      console.error('Failed to load analysis:', error);
      window.location.href = '/context';
    } finally {
      setLoading(false);
    }
  };

  const processAnalysisForExperiences = (analysisData: AnalysisResult) => {
    const items: ExperienceItem[] = [];
    
    // Extract items from resume analysis
    if (analysisData.resume_analysis?.skills) {
      analysisData.resume_analysis.skills.forEach((skill: any, index: number) => {
        items.push({
          id: `resume-skill-${index}`,
          type: 'skill',
          title: skill.name || skill,
          description: skill.description || `Skill from your resume`,
          relevance_score: skill.relevance || 0.8,
          source: 'resume',
          selected: false,
        });
      });
    }

    if (analysisData.resume_analysis?.experiences) {
      analysisData.resume_analysis.experiences.forEach((exp: any, index: number) => {
        items.push({
          id: `resume-exp-${index}`,
          type: 'experience',
          title: exp.title || exp.position || `Experience ${index + 1}`,
          description: exp.description || exp.summary || 'Work experience from your resume',
          relevance_score: exp.relevance || 0.7,
          source: 'resume',
          selected: false,
        });
      });
    }

    // Extract items from job analysis
    if (analysisData.job_analysis?.requirements) {
      analysisData.job_analysis.requirements.forEach((req: any, index: number) => {
        items.push({
          id: `job-req-${index}`,
          type: 'skill',
          title: req.name || req,
          description: req.description || `Required for the target role`,
          relevance_score: req.importance || 0.9,
          source: 'job_description',
          selected: false,
        });
      });
    }

    // Extract connections
    if (analysisData.connections_analysis?.matches) {
      analysisData.connections_analysis.matches.forEach((match: any, index: number) => {
        items.push({
          id: `connection-${index}`,
          type: 'connection',
          title: match.title || `Connection ${index + 1}`,
          description: match.description || match.summary || 'Connection identified by AI',
          relevance_score: match.strength || 0.8,
          source: 'resume',
          selected: false,
        });
      });
    }

    // Sort by relevance score
    items.sort((a, b) => b.relevance_score - a.relevance_score);
    setExperienceItems(items);
  };

  const handleItemSelection = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleElaboration = (itemId: string, elaboration: string) => {
    setElaborations(prev => ({
      ...prev,
      [itemId]: elaboration
    }));
  };

  const getItemIcon = (type: ExperienceItem['type']) => {
    switch (type) {
      case 'skill':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case 'experience':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2M8 6a2 2 0 002 2h4a2 2 0 002-2M8 6V4" />
          </svg>
        );
      case 'achievement':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        );
      case 'connection':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
    }
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-100';
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const canProceed = () => {
    return selectedItems.size >= 3; // Require at least 3 selected items
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your analysis results...</p>
        </div>
      </div>
    );
  }

  if (!analysis || analysis.status !== 'completed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Analysis Required</h2>
          <p className="text-gray-600 mb-6">
            Please complete the Context stage first to analyze your documents.
          </p>
          <a
            href="/context"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Go to Context Stage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Experience Stage
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            Review the connections we've identified between your background and the target role. 
            Select the experiences that resonate most with you and elaborate on what made them meaningful.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                ✓
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Context</span>
            </div>
            <div className="w-16 h-1 bg-green-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">Experience</span>
            </div>
            <div className="w-16 h-1 bg-gray-200"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <span className="ml-2 text-sm text-gray-400">Reflection</span>
            </div>
            <div className="w-16 h-1 bg-gray-200"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center text-sm font-medium">
                4
              </div>
              <span className="ml-2 text-sm text-gray-400">Action</span>
            </div>
            <div className="w-16 h-1 bg-gray-200"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center text-sm font-medium">
                5
              </div>
              <span className="ml-2 text-sm text-gray-400">Evaluation</span>
            </div>
          </div>
        </div>

        {/* Context Summary from Previous Stage */}
        {analysis.context_summary && (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-3">Context Analysis Summary</h3>
            <p className="text-blue-800 whitespace-pre-wrap">{analysis.context_summary}</p>
          </div>
        )}

        {/* Instructions */}
        <div className="mb-8 bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-blue-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">How to Use This Stage</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>Review</strong> the experiences, skills, and connections we've identified</li>
                <li>• <strong>Select</strong> items that resonate with you or feel most relevant</li>
                <li>• <strong>Elaborate</strong> on what made these experiences meaningful to you</li>
                <li>• <strong>Focus</strong> on moments that stand out in your memory or connect to your values</li>
                <li>• Select at least 3 items to proceed to the next stage</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Experience Items Grid */}
        <div className="grid gap-6 mb-8">
          {experienceItems.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-lg shadow-sm border-2 transition-all cursor-pointer ${
                selectedItems.has(item.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleItemSelection(item.id)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start flex-1">
                    <div className={`p-2 rounded-lg mr-4 ${
                      item.source === 'resume' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'
                    }`}>
                      {getItemIcon(item.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-medium text-gray-900">{item.title}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRelevanceColor(item.relevance_score)}`}>
                          {Math.round(item.relevance_score * 100)}% match
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.source === 'resume' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {item.source === 'resume' ? 'From Resume' : 'From Job'}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{item.description}</p>
                      
                      {selectedItems.has(item.id) && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tell us more about this experience:
                          </label>
                          <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            placeholder="What made this experience meaningful? How did it impact you? What did you learn?"
                            value={elaborations[item.id] || ''}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleElaboration(item.id, e.target.value);
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedItems.has(item.id)
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-gray-300'
                    }`}>
                      {selectedItems.has(item.id) && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selection Summary */}
        <div className="mb-8 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Your Selections</h3>
          <div className="text-sm text-gray-600">
            <p>You have selected <strong>{selectedItems.size}</strong> experiences.</p>
            {selectedItems.size < 3 && (
              <p className="text-amber-600 mt-1">Select at least 3 experiences to continue to the next stage.</p>
            )}
          </div>
        </div>

        {/* Next Steps */}
        <div className="text-center">
          {canProceed() ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="text-green-800">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium mb-2">Great Selection!</h3>
                <p className="text-sm mb-4">
                  You've selected {selectedItems.size} meaningful experiences. Let's move to the next stage 
                  where we'll explore the deeper connections and insights.
                </p>
                <button className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors">
                  Continue to Sense-Making Stage
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="text-blue-800">
                <h3 className="text-lg font-medium mb-2">Select Your Key Experiences</h3>
                <p className="text-sm">
                  Please select at least 3 experiences that resonate with you to continue 
                  to the next stage of the Ignatian Pedagogical Paradigm.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExperienceStage;