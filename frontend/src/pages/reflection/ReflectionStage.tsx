import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface SelectedExperience {
  id: string;
  type: 'skill' | 'experience' | 'achievement' | 'connection';
  title: string;
  description: string;
  relevance_score: number;
  source: 'resume' | 'job_description';
  user_elaboration?: string;
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

interface ReflectionSynthesis {
  narrative_summary: string;
  key_connections: Array<{
    title: string;
    description: string;
    significance: string;
    strength: number;
  }>;
  unique_value_proposition: string;
  growth_areas: string[];
  surprising_insights: string[];
}

interface IgnatianPrompt {
  id: string;
  category: 'values_alignment' | 'service_to_others' | 'personal_mission' | 'growth_opportunities';
  question: string;
  context: string;
  follow_up?: string;
}

const ReflectionStage: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [selectedExperiences, setSelectedExperiences] = useState<SelectedExperience[]>([]);
  const [synthesis, setSynthesis] = useState<ReflectionSynthesis | null>(null);
  const [ignatianPrompts, setIgnatianPrompts] = useState<IgnatianPrompt[]>([]);
  const [reflectionResponses, setReflectionResponses] = useState<Record<string, string>>({});
  const [currentSection, setCurrentSection] = useState<'synthesis' | 'reflection'>('synthesis');
  const [synthesisLoading, setSynthesisLoading] = useState(false);
  const [promptsLoading, setPromptsLoading] = useState(false);

  useEffect(() => {
    loadAnalysisAndExperiences();
  }, []);

  const loadAnalysisAndExperiences = async () => {
    if (!token) return;

    try {
      // Load latest analysis
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/analysis/latest/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const analysisData = await response.json();
        setAnalysis(analysisData);
        
        if (analysisData.status === 'completed') {
          // For now, we'll simulate selected experiences from localStorage
          // In a real implementation, this would come from the backend
          const mockSelectedExperiences = generateMockSelectedExperiences(analysisData);
          setSelectedExperiences(mockSelectedExperiences);
          
          // Generate synthesis automatically
          await generateSynthesis(mockSelectedExperiences, analysisData);
        }
      } else {
        // No analysis found, redirect back to context
        navigate('/context');
      }
    } catch (error) {
      console.error('Failed to load analysis:', error);
      navigate('/context');
    } finally {
      setLoading(false);
    }
  };

  const generateMockSelectedExperiences = (analysisData: AnalysisResult): SelectedExperience[] => {
    const experiences: SelectedExperience[] = [];
    
    // Simulate selected experiences from analysis data
    if (analysisData.resume_analysis?.skills) {
      analysisData.resume_analysis.skills.slice(0, 2).forEach((skill: any, index: number) => {
        experiences.push({
          id: `skill-${index}`,
          type: 'skill',
          title: skill.name || `Skill ${index + 1}`,
          description: skill.description || 'A valuable skill from your background',
          relevance_score: skill.relevance || 0.8,
          source: 'resume',
          user_elaboration: `This skill has been crucial in my professional development and I've used it extensively in various projects.`
        });
      });
    }
    
    if (analysisData.connections_analysis?.matches) {
      analysisData.connections_analysis.matches.slice(0, 2).forEach((match: any, index: number) => {
        experiences.push({
          id: `connection-${index}`,
          type: 'connection',
          title: match.title || `Connection ${index + 1}`,
          description: match.description || 'A meaningful connection between your background and the role',
          relevance_score: match.strength || 0.9,
          source: 'resume',
          user_elaboration: `This connection really resonates with me because it represents how my past experiences align with what I want to do next.`
        });
      });
    }
    
    return experiences;
  };

  const generateSynthesis = async (experiences: SelectedExperience[], analysisData: AnalysisResult) => {
    setSynthesisLoading(true);
    
    try {
      // Simulate LLM synthesis generation
      // In a real implementation, this would call the backend LLM service
      const mockSynthesis: ReflectionSynthesis = {
        narrative_summary: `Based on your selected experiences, a compelling narrative emerges about someone who brings both technical expertise and meaningful personal connections to their work. Your background demonstrates a consistent pattern of growth, learning, and contributing value in collaborative environments. The experiences you've highlighted show not just what you've done, but how you've grown through these experiences and what they mean to you personally.`,
        key_connections: [
          {
            title: "Technical Skills Meet Human Impact",
            description: "Your technical abilities are consistently applied in ways that benefit others and create meaningful outcomes.",
            significance: "This suggests you're not just technically proficient, but that you understand how to use technology to serve a greater purpose.",
            strength: 0.9
          },
          {
            title: "Growth Through Challenge",
            description: "Multiple experiences show you seeking out challenges and growing through them rather than avoiding difficulty.",
            significance: "This demonstrates resilience and a growth mindset that will serve you well in new roles.",
            strength: 0.85
          },
          {
            title: "Collaborative Leadership",
            description: "You tend to lead through collaboration and bringing out the best in others rather than through authority.",
            significance: "This aligns well with modern workplace values and the collaborative nature of most impactful work.",
            strength: 0.8
          }
        ],
        unique_value_proposition: "You bring a unique combination of technical competence, collaborative spirit, and genuine care for meaningful impact. Your experiences show someone who doesn't just do good work, but who helps others do their best work too.",
        growth_areas: [
          "Continuing to articulate the 'why' behind your technical decisions",
          "Building confidence in presenting your ideas to larger audiences",
          "Developing systems thinking for larger-scale impact"
        ],
        surprising_insights: [
          "Your most meaningful experiences often involve teaching or mentoring others",
          "You consistently choose collaborative approaches even when individual achievement might be easier",
          "Your technical skills seem to energize you most when they're solving human problems"
        ]
      };
      
      setSynthesis(mockSynthesis);
    } catch (error) {
      console.error('Failed to generate synthesis:', error);
    } finally {
      setSynthesisLoading(false);
    }
  };

  const generateIgnatianPrompts = async () => {
    setPromptsLoading(true);
    
    try {
      // Simulate Ignatian prompt generation
      // In a real implementation, this would call the backend LLM service
      const mockPrompts: IgnatianPrompt[] = [
        {
          id: 'values-1',
          category: 'values_alignment',
          question: "Looking at the connections we've identified in your experiences, what deeper values do you see reflected in the work that energizes you most?",
          context: "The Ignatian tradition emphasizes understanding our deepest values and how they guide our choices.",
          follow_up: "How might these values help you discern which opportunities align with your authentic self?"
        },
        {
          id: 'service-1',
          category: 'service_to_others',
          question: "In what ways do you see this potential role allowing you to be 'a person for others' - contributing to something larger than yourself?",
          context: "Ignatian spirituality calls us to consider how our work serves the broader human community.",
          follow_up: "What specific aspects of this service feel most meaningful to you personally?"
        },
        {
          id: 'mission-1',
          category: 'personal_mission',
          question: "Reflecting on your experiences and the patterns we've identified, what do you sense might be your unique contribution to the world?",
          context: "Each person has a particular way they're called to make a difference - their personal mission.",
          follow_up: "How does this potential role fit into that larger sense of purpose?"
        },
        {
          id: 'growth-1',
          category: 'growth_opportunities',
          question: "Where do you notice tensions or challenges in your experiences that might be inviting you to grow?",
          context: "In Ignatian spirituality, difficulties often point toward areas where God is inviting us to develop.",
          follow_up: "How might embracing these growth areas actually serve your deeper mission?"
        }
      ];
      
      setIgnatianPrompts(mockPrompts);
      setCurrentSection('reflection');
    } catch (error) {
      console.error('Failed to generate prompts:', error);
    } finally {
      setPromptsLoading(false);
    }
  };

  const handleReflectionResponse = (promptId: string, response: string) => {
    setReflectionResponses(prev => ({
      ...prev,
      [promptId]: response
    }));
  };

  const getCompletedReflections = () => {
    return Object.keys(reflectionResponses).filter(id => 
      reflectionResponses[id] && reflectionResponses[id].trim().length > 0
    ).length;
  };

  const canProceed = () => {
    return getCompletedReflections() >= Math.min(3, ignatianPrompts.length);
  };

  const getCategoryIcon = (category: IgnatianPrompt['category']) => {
    switch (category) {
      case 'values_alignment':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      case 'service_to_others':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'personal_mission':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'growth_opportunities':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
    }
  };

  const getCategoryColor = (category: IgnatianPrompt['category']) => {
    switch (category) {
      case 'values_alignment':
        return 'bg-red-100 text-red-600';
      case 'service_to_others':
        return 'bg-blue-100 text-blue-600';
      case 'personal_mission':
        return 'bg-purple-100 text-purple-600';
      case 'growth_opportunities':
        return 'bg-green-100 text-green-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your reflection materials...</p>
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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Previous Stages Required</h2>
          <p className="text-gray-600 mb-6">
            Please complete the Context and Experience stages first.
          </p>
          <button
            onClick={() => navigate('/context')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Go to Context Stage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Reflection Stage
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            Now we'll synthesize your selected experiences into meaningful insights and engage in 
            Ignatian-style reflection to explore what these connections mean for your personal mission and values.
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
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                ✓
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Experience</span>
            </div>
            <div className="w-16 h-1 bg-green-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">Reflection</span>
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

        {/* Section Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setCurrentSection('synthesis')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                currentSection === 'synthesis'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sense-Making & Synthesis
            </button>
            <button
              onClick={() => setCurrentSection('reflection')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                currentSection === 'reflection'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              disabled={!synthesis}
            >
              Ignatian Reflection
            </button>
          </div>
        </div>

        {/* Synthesis Section */}
        {currentSection === 'synthesis' && (
          <div className="space-y-8">
            {/* Selected Experiences Summary */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Your Selected Experiences</h3>
              <div className="grid gap-4">
                {selectedExperiences.map((exp) => (
                  <div key={exp.id} className="border border-gray-200 rounded-md p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{exp.title}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        exp.source === 'resume' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {exp.source === 'resume' ? 'From Resume' : 'From Job'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{exp.description}</p>
                    {exp.user_elaboration && (
                      <div className="bg-blue-50 border border-blue-200 rounded p-3">
                        <p className="text-sm text-blue-800">
                          <strong>Why this matters to you:</strong> {exp.user_elaboration}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Synthesis Results */}
            {synthesisLoading ? (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Synthesizing your experiences and generating insights...</p>
              </div>
            ) : synthesis ? (
              <div className="space-y-6">
                {/* Narrative Summary */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Your Personal Narrative</h3>
                  <p className="text-gray-700 leading-relaxed">{synthesis.narrative_summary}</p>
                </div>

                {/* Key Connections */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Key Connections We've Identified</h3>
                  <div className="space-y-4">
                    {synthesis.key_connections.map((connection, index) => (
                      <div key={index} className="border border-gray-200 rounded-md p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{connection.title}</h4>
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                            {Math.round(connection.strength * 100)}% strength
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{connection.description}</p>
                        <p className="text-sm text-blue-700 bg-blue-50 p-2 rounded">
                          <strong>Why this matters:</strong> {connection.significance}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Unique Value Proposition */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Your Unique Value Proposition</h3>
                  <p className="text-gray-700 leading-relaxed">{synthesis.unique_value_proposition}</p>
                </div>

                {/* Insights Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Growth Areas */}
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Areas for Growth</h3>
                    <ul className="space-y-2">
                      {synthesis.growth_areas.map((area, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          <span className="text-gray-700 text-sm">{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Surprising Insights */}
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Surprising Insights</h3>
                    <ul className="space-y-2">
                      {synthesis.surprising_insights.map((insight, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-5 h-5 text-yellow-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <span className="text-gray-700 text-sm">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Continue to Reflection */}
                <div className="text-center">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-blue-900 mb-2">Ready for Deeper Reflection?</h3>
                    <p className="text-blue-800 text-sm mb-4">
                      Now that we've synthesized your experiences into meaningful insights, 
                      let's engage in Ignatian-style reflection to explore what these connections mean for your values and mission.
                    </p>
                    <button
                      onClick={generateIgnatianPrompts}
                      disabled={promptsLoading}
                      className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {promptsLoading ? 'Generating Reflection Questions...' : 'Begin Ignatian Reflection'}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Reflection Section */}
        {currentSection === 'reflection' && (
          <div className="space-y-8">
            {ignatianPrompts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <p className="text-gray-600 mb-4">Please complete the Sense-Making section first to generate your reflection questions.</p>
                <button
                  onClick={() => setCurrentSection('synthesis')}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Go to Sense-Making →
                </button>
              </div>
            ) : (
              <>
                {/* Instructions */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-blue-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Ignatian Reflection</h3>
                      <p className="text-gray-600 text-sm mb-2">
                        These questions are designed in the Ignatian tradition to help you explore the deeper meaning 
                        behind your experiences and how they connect to your values, mission, and service to others.
                      </p>
                      <p className="text-gray-600 text-sm">
                        Take your time with each question. Respond with at least 3 reflections to continue.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reflection Prompts */}
                <div className="space-y-6">
                  {ignatianPrompts.map((prompt) => (
                    <div key={prompt.id} className="bg-white rounded-lg shadow-sm border p-6">
                      <div className="flex items-start mb-4">
                        <div className={`p-2 rounded-lg mr-4 ${getCategoryColor(prompt.category)}`}>
                          {getCategoryIcon(prompt.category)}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900 mb-2">{prompt.question}</h4>
                          <p className="text-sm text-gray-600 mb-2">{prompt.context}</p>
                          {prompt.follow_up && (
                            <p className="text-sm text-blue-600 italic">{prompt.follow_up}</p>
                          )}
                        </div>
                      </div>
                      
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        placeholder="Take your time to reflect deeply on this question. What comes up for you?"
                        value={reflectionResponses[prompt.id] || ''}
                        onChange={(e) => handleReflectionResponse(prompt.id, e.target.value)}
                      />
                      
                      {reflectionResponses[prompt.id] && reflectionResponses[prompt.id].trim().length > 0 && (
                        <div className="mt-2 flex items-center text-green-600 text-sm">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Reflection captured
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Progress and Next Steps */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Reflection Progress</h3>
                    <span className="text-sm text-gray-600">
                      {getCompletedReflections()} of {ignatianPrompts.length} reflections completed
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(getCompletedReflections() / ignatianPrompts.length) * 100}%` }}
                    ></div>
                  </div>

                  {canProceed() ? (
                    <div className="text-center">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <p className="text-green-800 text-sm mb-3">
                          Excellent reflection! You've completed {getCompletedReflections()} deep reflections. 
                          You're ready to move forward and create your action plan.
                        </p>
                        <button 
                          onClick={() => navigate('/action')}
                          className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
                        >
                          Continue to Action Stage
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-blue-800 text-sm">
                          Complete at least {Math.min(3, ignatianPrompts.length)} reflections to continue to the Action stage.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReflectionStage;