import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

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

interface ReflectionResponses {
  [key: string]: string;
}

interface ProjectPlan {
  id: string;
  title: string;
  overview: string;
  objectives: string[];
  target_skills: string[];
  deliverables: Array<{
    title: string;
    description: string;
    timeline: string;
    skills_demonstrated: string[];
  }>;
  implementation_steps: Array<{
    phase: string;
    tasks: string[];
    duration: string;
    key_outcomes: string[];
  }>;
  interview_talking_points: string[];
  values_integration: string;
  reflection_prompts: string[];
}

const ActionStage: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [synthesis, setSynthesis] = useState<ReflectionSynthesis | null>(null);
  const [reflectionResponses, setReflectionResponses] = useState<ReflectionResponses>({});
  const [projectPlan, setProjectPlan] = useState<ProjectPlan | null>(null);
  const [projectLoading, setProjectLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState<'planning' | 'implementation' | 'export'>('planning');

  useEffect(() => {
    loadReflectionData();
  }, []);

  const loadReflectionData = async () => {
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
          // For now, simulate reflection data from previous stages
          // In a real implementation, this would be loaded from the backend
          loadMockReflectionData();
        }
      } else {
        // No analysis found, redirect back to context
        navigate('/context');
      }
    } catch (error) {
      console.error('Failed to load reflection data:', error);
      navigate('/context');
    } finally {
      setLoading(false);
    }
  };

  const loadMockReflectionData = () => {
    // Simulate synthesis data from Reflection stage
    const mockSynthesis: ReflectionSynthesis = {
      narrative_summary: "Your experiences reveal a consistent pattern of bridging technical expertise with human impact. You excel in collaborative environments where analytical skills serve meaningful purposes.",
      key_connections: [
        {
          title: "Technical Skills Meet Human Impact",
          description: "Your technical abilities are consistently applied in ways that benefit others and create meaningful outcomes.",
          significance: "This suggests you're not just technically proficient, but that you understand how to use technology to serve a greater purpose.",
          strength: 0.9
        },
        {
          title: "Collaborative Leadership",
          description: "You tend to lead through collaboration and bringing out the best in others rather than through authority.",
          significance: "This aligns well with modern workplace values and the collaborative nature of most impactful work.",
          strength: 0.85
        }
      ],
      unique_value_proposition: "You bring a unique combination of technical competence, collaborative spirit, and genuine care for meaningful impact.",
      growth_areas: [
        "Continuing to articulate the 'why' behind your technical decisions",
        "Building confidence in presenting your ideas to larger audiences"
      ],
      surprising_insights: [
        "Your most meaningful experiences often involve teaching or mentoring others",
        "You consistently choose collaborative approaches even when individual achievement might be easier"
      ]
    };

    // Simulate reflection responses
    const mockReflectionResponses: ReflectionResponses = {
      'values-1': 'I see that my deepest values center around using my skills to amplify voices that often go unheard. When I work on projects that combine data analysis with social impact, I feel most energized and authentic.',
      'service-1': 'This role would allow me to be a person for others by using business analysis to identify inequities and propose data-driven solutions that create more inclusive outcomes for underrepresented communities.',
      'mission-1': 'I sense that my unique contribution involves translating complex data into stories that drive social change. I want to be someone who helps organizations see the human impact behind their numbers.',
      'growth-1': 'The tension I notice is between my desire for technical excellence and my impatience with slow institutional change. This challenge invites me to develop patience and strategic thinking for long-term impact.'
    };

    setSynthesis(mockSynthesis);
    setReflectionResponses(mockReflectionResponses);
  };

  const generateProjectPlan = async () => {
    setProjectLoading(true);
    
    try {
      // Simulate LLM project generation
      // In a real implementation, this would call the backend LLM service
      const mockProject: ProjectPlan = {
        id: 'project-1',
        title: 'Diversity & Inclusion Analytics Dashboard',
        overview: 'Create a comprehensive analytics dashboard that visualizes diversity metrics across departments and identifies opportunities for more inclusive hiring and promotion practices. This project demonstrates technical competence while advancing social justice values.',
        objectives: [
          'Analyze current diversity patterns in hiring, promotions, and retention',
          'Identify systemic barriers affecting underrepresented groups',
          'Design actionable recommendations for improving inclusion',
          'Create compelling visualizations that tell human stories behind the data',
          'Present findings that inspire organizational change'
        ],
        target_skills: [
          'Data Analysis & Visualization',
          'Statistical Analysis',
          'Dashboard Design (Tableau/Power BI)',
          'Business Communication',
          'Stakeholder Presentation',
          'Ethical Data Use'
        ],
        deliverables: [
          {
            title: 'Data Collection & Analysis Report',
            description: 'Comprehensive analysis of diversity metrics with statistical insights and trend identification',
            timeline: 'Week 1-2',
            skills_demonstrated: ['Data Analysis', 'Statistical Reasoning', 'Research Methods']
          },
          {
            title: 'Interactive Analytics Dashboard',
            description: 'User-friendly dashboard with filters, drill-down capabilities, and narrative elements',
            timeline: 'Week 3-4',
            skills_demonstrated: ['Data Visualization', 'Dashboard Design', 'User Experience']
          },
          {
            title: 'Strategic Recommendations Presentation',
            description: 'Executive-level presentation with actionable recommendations and implementation roadmap',
            timeline: 'Week 5',
            skills_demonstrated: ['Business Communication', 'Strategic Thinking', 'Presentation Skills']
          },
          {
            title: 'Implementation Toolkit',
            description: 'Practical resources for HR teams to implement recommended changes',
            timeline: 'Week 6',
            skills_demonstrated: ['Change Management', 'Process Design', 'Training Development']
          }
        ],
        implementation_steps: [
          {
            phase: 'Discovery & Data Collection',
            tasks: [
              'Identify available data sources and access requirements',
              'Design data collection methodology ensuring privacy protection',
              'Gather and clean diversity metrics data',
              'Conduct preliminary analysis to identify key patterns'
            ],
            duration: '2 weeks',
            key_outcomes: ['Clean dataset', 'Initial insights', 'Analysis framework']
          },
          {
            phase: 'Analysis & Insight Generation',
            tasks: [
              'Perform statistical analysis of hiring and promotion patterns',
              'Identify correlation between diversity metrics and business outcomes',
              'Benchmark against industry standards and best practices',
              'Develop narrative framework connecting data to human impact'
            ],
            duration: '2 weeks',
            key_outcomes: ['Statistical insights', 'Trend analysis', 'Narrative framework']
          },
          {
            phase: 'Visualization & Dashboard Creation',
            tasks: [
              'Design dashboard wireframes with user experience principles',
              'Build interactive visualizations using appropriate tools',
              'Implement filters and drill-down capabilities',
              'Test dashboard with potential users and iterate'
            ],
            duration: '1.5 weeks',
            key_outcomes: ['Interactive dashboard', 'User-tested interface', 'Documentation']
          },
          {
            phase: 'Recommendations & Presentation',
            tasks: [
              'Synthesize insights into actionable recommendations',
              'Create executive presentation with compelling narrative',
              'Develop implementation roadmap with timelines and metrics',
              'Design toolkit for ongoing diversity monitoring'
            ],
            duration: '1.5 weeks',
            key_outcomes: ['Strategic recommendations', 'Executive presentation', 'Implementation toolkit']
          }
        ],
        interview_talking_points: [
          'How I combined technical analysis with social impact to create meaningful change',
          'The process of translating complex data into compelling narratives for decision-makers',
          'Challenges I overcame in balancing analytical rigor with human-centered storytelling',
          'How this project reflects my values of using business skills to serve others',
          'Specific technical skills I developed and how they apply to the target role',
          'The ethical considerations I navigated when working with sensitive diversity data'
        ],
        values_integration: 'This project authentically integrates your technical capabilities with your service-oriented values. By focusing on diversity and inclusion, you demonstrate how business analysis can advance social justice. The collaborative approach to dashboard design reflects your preference for bringing out the best in others, while the emphasis on narrative and human impact aligns with your calling to amplify underrepresented voices.',
        reflection_prompts: [
          'How did working on diversity data deepen your understanding of systemic inequities?',
          'What did you learn about the responsibility that comes with analyzing sensitive information?',
          'How did this project challenge you to grow in your technical and communication skills?',
          'In what ways did this work feel like a calling rather than just an assignment?',
          'How might this experience shape your future choices about the kind of work you want to do?'
        ]
      };
      
      setProjectPlan(mockProject);
      setCurrentSection('implementation');
    } catch (error) {
      console.error('Failed to generate project plan:', error);
    } finally {
      setProjectLoading(false);
    }
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'Discovery & Data Collection':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
      case 'Analysis & Insight Generation':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2 2z" />
          </svg>
        );
      case 'Visualization & Dashboard Creation':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        );
      case 'Recommendations & Presentation':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your reflection insights...</p>
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
            Please complete the Context, Experience, and Reflection stages first.
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Action Stage
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            Transform your insights into action! Based on your reflection and synthesis, 
            we'll create a meaningful portfolio project that demonstrates your skills while 
            advancing your values and mission.
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
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                ✓
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Reflection</span>
            </div>
            <div className="w-16 h-1 bg-green-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                4
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">Action</span>
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
              onClick={() => setCurrentSection('planning')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                currentSection === 'planning'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Project Planning
            </button>
            <button
              onClick={() => setCurrentSection('implementation')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                currentSection === 'implementation'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              disabled={!projectPlan}
            >
              Implementation Guide
            </button>
            <button
              onClick={() => setCurrentSection('export')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                currentSection === 'export'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              disabled={!projectPlan}
            >
              Export & Share
            </button>
          </div>
        </div>

        {/* Planning Section */}
        {currentSection === 'planning' && (
          <div className="space-y-8">
            {/* Reflection Summary */}
            {synthesis && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Your Reflection Insights</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Your Unique Value Proposition</h4>
                    <p className="text-gray-700 text-sm mb-4">{synthesis.unique_value_proposition}</p>
                    
                    <h4 className="font-medium text-gray-900 mb-2">Key Connections</h4>
                    <div className="space-y-2">
                      {synthesis.key_connections.slice(0, 2).map((connection, index) => (
                        <div key={index} className="text-sm">
                          <span className="font-medium text-gray-800">{connection.title}:</span>
                          <span className="text-gray-600 ml-1">{connection.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Your Reflections on Values</h4>
                    <div className="space-y-3">
                      {Object.entries(reflectionResponses).slice(0, 2).map(([key, response]) => (
                        <div key={key} className="bg-blue-50 border border-blue-200 rounded p-3">
                          <p className="text-sm text-blue-800 italic">"{response.substring(0, 120)}..."</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Project Generation */}
            {!projectPlan ? (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <div className="max-w-2xl mx-auto">
                  <svg className="w-16 h-16 text-blue-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z" />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-900 mb-3">Ready to Create Your Portfolio Project?</h3>
                  <p className="text-gray-600 mb-6">
                    Based on your insights and reflections, we'll generate a personalized portfolio project 
                    that demonstrates your skills while advancing your values and mission. This project will 
                    be tailored specifically to both the role requirements and your authentic calling.
                  </p>
                  <button
                    onClick={generateProjectPlan}
                    disabled={projectLoading}
                    className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {projectLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating Your Project Plan...
                      </div>
                    ) : (
                      'Generate Portfolio Project Plan'
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="text-center mb-6">
                  <svg className="w-12 h-12 text-green-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Your Portfolio Project Plan is Ready!</h3>
                  <p className="text-gray-600">
                    We've created a personalized project that integrates your technical skills with your values and mission.
                  </p>
                </div>
                
                <div className="border border-green-200 rounded-lg p-6 bg-green-50">
                  <h4 className="text-lg font-bold text-green-900 mb-2">{projectPlan.title}</h4>
                  <p className="text-green-800 mb-4">{projectPlan.overview}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-green-900 mb-2">Key Skills Demonstrated:</h5>
                      <div className="flex flex-wrap gap-2">
                        {projectPlan.target_skills.slice(0, 4).map((skill, index) => (
                          <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-green-900 mb-2">Timeline:</h5>
                      <p className="text-green-800 text-sm">6-week project with 4 major deliverables</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Implementation Section */}
        {currentSection === 'implementation' && projectPlan && (
          <div className="space-y-8">
            {/* Project Overview */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{projectPlan.title}</h3>
              <p className="text-gray-700 mb-6">{projectPlan.overview}</p>
              
              {/* Objectives */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Project Objectives</h4>
                <ul className="space-y-2">
                  {projectPlan.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700 text-sm">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Values Integration */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">How This Project Reflects Your Values</h4>
                <p className="text-blue-800 text-sm">{projectPlan.values_integration}</p>
              </div>
            </div>

            {/* Implementation Steps */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Implementation Roadmap</h3>
              <div className="space-y-6">
                {projectPlan.implementation_steps.map((step, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-3">
                        {getPhaseIcon(step.phase)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{step.phase}</h4>
                        <p className="text-sm text-gray-600">Duration: {step.duration}</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-gray-800 mb-2">Tasks:</h5>
                        <ul className="space-y-1">
                          {step.tasks.map((task, taskIndex) => (
                            <li key={taskIndex} className="text-sm text-gray-600 flex items-start">
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-800 mb-2">Key Outcomes:</h5>
                        <ul className="space-y-1">
                          {step.key_outcomes.map((outcome, outcomeIndex) => (
                            <li key={outcomeIndex} className="text-sm text-green-700 flex items-start">
                              <svg className="w-3 h-3 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {outcome}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverables */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Project Deliverables</h3>
              <div className="grid gap-4">
                {projectPlan.deliverables.map((deliverable, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{deliverable.title}</h4>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{deliverable.timeline}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{deliverable.description}</p>
                    <div>
                      <span className="text-sm font-medium text-gray-700 mr-2">Skills Demonstrated:</span>
                      <div className="inline-flex flex-wrap gap-1">
                        {deliverable.skills_demonstrated.map((skill, skillIndex) => (
                          <span key={skillIndex} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interview Talking Points */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Interview Talking Points</h3>
              <p className="text-gray-600 text-sm mb-4">
                Use these points to discuss your project during interviews and showcase both your technical skills and values alignment:
              </p>
              <ul className="space-y-3">
                {projectPlan.interview_talking_points.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-gray-700 text-sm">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Export Section */}
        {currentSection === 'export' && projectPlan && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Export Your Portfolio Project</h3>
              <p className="text-gray-600 mb-6">
                Download your complete project plan to use in applications, interviews, and implementation.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-6 text-center">
                  <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <h4 className="font-medium text-gray-900 mb-2">PDF Export</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Complete project plan with implementation steps, talking points, and reflection prompts
                  </p>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
                    Download PDF
                  </button>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6 text-center">
                  <svg className="w-12 h-12 text-blue-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                  </svg>
                  <h4 className="font-medium text-gray-900 mb-2">Web Portfolio</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Interactive web version you can share with potential employers and include in applications
                  </p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Generate Web Portfolio
                  </button>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="text-center">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <svg className="w-8 h-8 text-green-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-green-900 mb-2">Your Action Plan is Complete!</h3>
                <p className="text-green-800 text-sm mb-4">
                  You now have a comprehensive portfolio project that demonstrates your skills while 
                  advancing your values. Ready to move to the final stage for interview preparation?
                </p>
                <button 
                  onClick={() => navigate('/evaluation')}
                  className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
                >
                  Continue to Evaluation Stage
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionStage;