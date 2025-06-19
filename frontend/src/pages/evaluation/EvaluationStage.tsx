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

interface InterviewQuestion {
  id: string;
  category: 'behavioral' | 'technical' | 'values_based' | 'project_specific';
  question: string;
  context: string;
  ideal_elements: string[];
  follow_up?: string;
}

interface SelfAssessment {
  id: string;
  area: string;
  description: string;
  reflection_prompt: string;
  rating_scale: string[];
}

const EvaluationStage: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [projectPlan, setProjectPlan] = useState<ProjectPlan | null>(null);
  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestion[]>([]);
  const [selfAssessments, setSelfAssessments] = useState<SelfAssessment[]>([]);
  const [interviewResponses, setInterviewResponses] = useState<Record<string, string>>({});
  const [assessmentResponses, setAssessmentResponses] = useState<Record<string, { rating: number; reflection: string }>>({});
  const [finalReflection, setFinalReflection] = useState('');
  const [currentSection, setCurrentSection] = useState<'interview' | 'assessment' | 'reflection'>('interview');
  const [questionsLoading, setQuestionsLoading] = useState(false);

  useEffect(() => {
    loadProjectData();
  }, []);

  const loadProjectData = async () => {
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
          // For now, simulate project data from Action stage
          // In a real implementation, this would be loaded from the backend
          loadMockProjectData();
          await generateMockInterviewQuestions();
          generateMockSelfAssessments();
        }
      } else {
        // No analysis found, redirect back to context
        navigate('/context');
      }
    } catch (error) {
      console.error('Failed to load project data:', error);
      navigate('/context');
    } finally {
      setLoading(false);
    }
  };

  const loadMockProjectData = () => {
    // Simulate project plan from Action stage
    const mockProject: ProjectPlan = {
      id: 'project-1',
      title: 'Customer Experience Analytics Dashboard',
      overview: 'A comprehensive data visualization platform that analyzes customer journey metrics and identifies improvement opportunities for enhanced user experience.',
      objectives: [
        'Demonstrate proficiency in data analysis and visualization',
        'Show understanding of customer experience principles',
        'Apply business intelligence to real-world scenarios'
      ],
      target_skills: ['Data Analysis', 'Business Intelligence', 'Customer Experience', 'Problem Solving'],
      deliverables: [
        {
          title: 'Data Collection & Processing Framework',
          description: 'Automated system for gathering and cleaning customer interaction data',
          timeline: 'Week 1-2',
          skills_demonstrated: ['Data Engineering', 'Process Automation', 'Quality Assurance']
        },
        {
          title: 'Interactive Analytics Dashboard',
          description: 'Visual dashboard showing key customer journey metrics and trends',
          timeline: 'Week 3-4',
          skills_demonstrated: ['Data Visualization', 'UI/UX Design', 'Business Intelligence']
        },
        {
          title: 'Improvement Recommendations Report',
          description: 'Strategic recommendations based on data insights for customer experience enhancement',
          timeline: 'Week 5-6',
          skills_demonstrated: ['Strategic Thinking', 'Business Analysis', 'Communication']
        }
      ],
      implementation_steps: [
        {
          phase: 'Planning & Research',
          tasks: ['Define project scope', 'Research industry best practices', 'Identify data sources'],
          duration: '1 week',
          key_outcomes: ['Project charter', 'Technical requirements', 'Data strategy']
        },
        {
          phase: 'Development',
          tasks: ['Build data pipeline', 'Create dashboard interface', 'Implement analytics'],
          duration: '3 weeks',
          key_outcomes: ['Working prototype', 'Data visualizations', 'User interface']
        },
        {
          phase: 'Analysis & Recommendations',
          tasks: ['Analyze results', 'Generate insights', 'Prepare recommendations'],
          duration: '2 weeks',
          key_outcomes: ['Data insights', 'Strategic recommendations', 'Final presentation']
        }
      ],
      interview_talking_points: [
        'How this project demonstrates my analytical approach to customer experience',
        'The technical challenges I overcame during development',
        'How my findings could impact business strategy',
        'What I learned about translating data into actionable insights'
      ],
      values_integration: 'This project reflects my commitment to using data and technology to serve others by improving customer experiences and helping businesses better understand and meet their customers\' needs.',
      reflection_prompts: [
        'How did this project challenge me to grow professionally?',
        'What aspects of this work energized me most?',
        'How does this project reflect my values and mission?'
      ]
    };
    
    setProjectPlan(mockProject);
  };

  const generateMockInterviewQuestions = async () => {
    setQuestionsLoading(true);
    
    try {
      // Simulate LLM-generated interview questions
      // In a real implementation, this would call the backend LLM service
      const mockQuestions: InterviewQuestion[] = [
        {
          id: 'behavioral-1',
          category: 'behavioral',
          question: 'Tell me about a time when you had to analyze complex data to solve a business problem. How did you approach it?',
          context: 'This question allows you to discuss your Customer Experience Analytics Dashboard project and demonstrate your analytical problem-solving skills.',
          ideal_elements: [
            'Describe the business problem and data complexity',
            'Explain your systematic approach to analysis',
            'Highlight insights discovered and their business impact',
            'Show how you communicated findings to stakeholders'
          ],
          follow_up: 'What would you do differently if you encountered a similar challenge?'
        },
        {
          id: 'technical-1',
          category: 'technical',
          question: 'Walk me through how you would design a system to collect and analyze customer interaction data in real-time.',
          context: 'This technical question relates directly to your dashboard project and tests your understanding of data architecture.',
          ideal_elements: [
            'Discuss data collection methods and sources',
            'Explain data processing and storage considerations',
            'Address real-time analytics requirements',
            'Consider scalability and reliability factors'
          ]
        },
        {
          id: 'values-1',
          category: 'values_based',
          question: 'How do you ensure that your analytical work serves not just business goals, but also creates genuine value for customers?',
          context: 'This question explores your values-driven approach to work and connects to your reflection on serving others through data.',
          ideal_elements: [
            'Discuss the human impact of data-driven decisions',
            'Explain how you balance business and customer needs',
            'Share your philosophy on ethical data use',
            'Connect to your personal mission and values'
          ],
          follow_up: 'Can you give me a specific example of when you prioritized customer benefit over pure business metrics?'
        },
        {
          id: 'project-1',
          category: 'project_specific',
          question: 'In your Customer Experience Analytics Dashboard project, what was the most surprising insight you discovered, and how did it change your recommendations?',
          context: 'This question tests your ability to extract meaningful insights from data and adapt your approach based on findings.',
          ideal_elements: [
            'Describe the unexpected finding in detail',
            'Explain why it was surprising given initial assumptions',
            'Show how you validated and explored this insight',
            'Discuss how it influenced your final recommendations'
          ]
        },
        {
          id: 'behavioral-2',
          category: 'behavioral',
          question: 'Describe a situation where you had to present complex analytical findings to stakeholders with varying levels of technical knowledge.',
          context: 'This question assesses your communication skills and ability to make data accessible to different audiences.',
          ideal_elements: [
            'Describe the audience and their needs',
            'Explain how you adapted your presentation approach',
            'Show specific techniques used to clarify complex concepts',
            'Highlight the outcome and stakeholder feedback'
          ]
        },
        {
          id: 'values-2',
          category: 'values_based',
          question: 'Looking at your career journey and this project, how do you see analytical work fitting into your larger purpose or calling?',
          context: 'This deeply reflective question connects your work to your personal mission and Ignatian values.',
          ideal_elements: [
            'Connect analytical work to serving others',
            'Discuss how data can create positive impact',
            'Share your vision for using skills meaningfully',
            'Reflect on growth and future aspirations'
          ]
        }
      ];
      
      setInterviewQuestions(mockQuestions);
    } catch (error) {
      console.error('Failed to generate interview questions:', error);
    } finally {
      setQuestionsLoading(false);
    }
  };

  const generateMockSelfAssessments = () => {
    const mockAssessments: SelfAssessment[] = [
      {
        id: 'technical-skills',
        area: 'Technical Skills Development',
        description: 'How effectively did you apply and develop technical skills during this project?',
        reflection_prompt: 'Reflect on the technical challenges you faced and how you grew through them. What skills did you strengthen, and what areas need continued development?',
        rating_scale: ['Significant growth needed', 'Some development needed', 'Met expectations', 'Exceeded expectations', 'Exceptional growth']
      },
      {
        id: 'problem-solving',
        area: 'Problem-Solving Approach',
        description: 'How systematic and effective was your approach to analyzing and solving business problems?',
        reflection_prompt: 'Consider your methodology for breaking down complex problems. How did you identify root causes and develop solutions? What would you do differently next time?',
        rating_scale: ['Needs significant improvement', 'Some improvement needed', 'Solid approach', 'Strong methodology', 'Exceptional problem-solving']
      },
      {
        id: 'communication',
        area: 'Communication & Presentation',
        description: 'How effectively did you communicate your findings and recommendations?',
        reflection_prompt: 'Evaluate your ability to make complex data insights accessible and compelling. How well did you tailor your communication to different audiences?',
        rating_scale: ['Major improvement needed', 'Some development needed', 'Clear communication', 'Highly effective', 'Exceptional clarity']
      },
      {
        id: 'values-integration',
        area: 'Values Integration',
        description: 'How well did this project reflect and advance your personal values and mission?',
        reflection_prompt: 'Reflect on how this work connected to your deeper purpose. Did the project energize you? How did it serve others? What did you learn about your calling?',
        rating_scale: ['Minimal connection', 'Some alignment', 'Good integration', 'Strong values alignment', 'Profound purpose connection']
      },
      {
        id: 'impact-potential',
        area: 'Impact & Implementation',
        description: 'How realistic and impactful are your project recommendations?',
        reflection_prompt: 'Consider the practical value of your work. How likely are your recommendations to create real positive change? What would increase their impact?',
        rating_scale: ['Limited impact', 'Some potential value', 'Meaningful impact', 'Significant value', 'Transformational potential']
      }
    ];
    
    setSelfAssessments(mockAssessments);
  };

  const handleInterviewResponse = (questionId: string, response: string) => {
    setInterviewResponses(prev => ({
      ...prev,
      [questionId]: response
    }));
  };

  const handleAssessmentResponse = (assessmentId: string, rating: number, reflection: string) => {
    setAssessmentResponses(prev => ({
      ...prev,
      [assessmentId]: { rating, reflection }
    }));
  };

  const getCategoryIcon = (category: InterviewQuestion['category']) => {
    switch (category) {
      case 'behavioral':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'technical':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'values_based':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      case 'project_specific':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  const getCategoryColor = (category: InterviewQuestion['category']) => {
    switch (category) {
      case 'behavioral':
        return 'bg-blue-100 text-blue-600';
      case 'technical':
        return 'bg-green-100 text-green-600';
      case 'values_based':
        return 'bg-red-100 text-red-600';
      case 'project_specific':
        return 'bg-purple-100 text-purple-600';
    }
  };

  const getCompletedInterviews = () => {
    return Object.keys(interviewResponses).filter(id => 
      interviewResponses[id] && interviewResponses[id].trim().length > 0
    ).length;
  };

  const getCompletedAssessments = () => {
    return Object.keys(assessmentResponses).filter(id => 
      assessmentResponses[id] && assessmentResponses[id].reflection.trim().length > 0
    ).length;
  };

  const canComplete = () => {
    return getCompletedInterviews() >= 3 && 
           getCompletedAssessments() >= 3 && 
           finalReflection.trim().length > 0;
  };

  const renderStarRating = (assessmentId: string, currentRating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => {
              const current = assessmentResponses[assessmentId] || { rating: 0, reflection: '' };
              handleAssessmentResponse(assessmentId, star, current.reflection);
            }}
            className={`w-6 h-6 ${
              star <= currentRating 
                ? 'text-yellow-500' 
                : 'text-gray-300 hover:text-yellow-400'
            }`}
          >
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your evaluation materials...</p>
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
            Please complete the Context, Experience, Reflection, and Action stages first.
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
            Evaluation Stage
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            Complete your Ignatian journey with mock interview practice, self-assessment, and final reflection on your growth and learning.
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
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                ✓
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Action</span>
            </div>
            <div className="w-16 h-1 bg-green-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                5
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">Evaluation</span>
            </div>
          </div>
        </div>

        {/* Project Summary */}
        {projectPlan && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Your Portfolio Project</h3>
            <div className="border border-gray-200 rounded-md p-4">
              <h4 className="font-medium text-gray-900 mb-2">{projectPlan.title}</h4>
              <p className="text-gray-600 text-sm mb-3">{projectPlan.overview}</p>
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-sm text-blue-800">
                  <strong>Values Integration:</strong> {projectPlan.values_integration}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Section Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setCurrentSection('interview')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                currentSection === 'interview'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mock Interview
            </button>
            <button
              onClick={() => setCurrentSection('assessment')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                currentSection === 'assessment'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Self-Assessment
            </button>
            <button
              onClick={() => setCurrentSection('reflection')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                currentSection === 'reflection'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Final Reflection
            </button>
          </div>
        </div>

        {/* Mock Interview Section */}
        {currentSection === 'interview' && (
          <div className="space-y-8">
            {/* Instructions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-blue-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Mock Interview Practice</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    These questions are tailored to your background, project work, and the target role. 
                    Practice answering them as if you're in a real interview setting.
                  </p>
                  <p className="text-gray-600 text-sm">
                    Complete at least 3 questions to continue. Focus on connecting your responses to your project work and values.
                  </p>
                </div>
              </div>
            </div>

            {/* Interview Questions */}
            {questionsLoading ? (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Generating personalized interview questions...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {interviewQuestions.map((question) => (
                  <div key={question.id} className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-start mb-4">
                      <div className={`p-2 rounded-lg mr-4 ${getCategoryColor(question.category)}`}>
                        {getCategoryIcon(question.category)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h4 className="text-lg font-medium text-gray-900">{question.question}</h4>
                          <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${
                            question.category === 'behavioral' ? 'bg-blue-100 text-blue-800' :
                            question.category === 'technical' ? 'bg-green-100 text-green-800' :
                            question.category === 'values_based' ? 'bg-red-100 text-red-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {question.category.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{question.context}</p>
                        
                        {/* Ideal Elements */}
                        <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
                          <h5 className="text-sm font-medium text-green-900 mb-2">Key elements to include:</h5>
                          <ul className="text-sm text-green-800 space-y-1">
                            {question.ideal_elements.map((element, index) => (
                              <li key={index} className="flex items-start">
                                <span className="w-1 h-1 bg-green-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                {element}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {question.follow_up && (
                          <p className="text-sm text-blue-600 italic mb-4">
                            <strong>Follow-up:</strong> {question.follow_up}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={5}
                      placeholder="Practice your response here. Think about specific examples from your project work..."
                      value={interviewResponses[question.id] || ''}
                      onChange={(e) => handleInterviewResponse(question.id, e.target.value)}
                    />
                    
                    {interviewResponses[question.id] && interviewResponses[question.id].trim().length > 0 && (
                      <div className="mt-2 flex items-center text-green-600 text-sm">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Response recorded
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Progress */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Interview Progress</h3>
                <span className="text-sm text-gray-600">
                  {getCompletedInterviews()} of {interviewQuestions.length} questions completed
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(getCompletedInterviews() / interviewQuestions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Self-Assessment Section */}
        {currentSection === 'assessment' && (
          <div className="space-y-8">
            {/* Instructions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-green-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Self-Assessment</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Reflect on your growth and learning through this portfolio project. 
                    Rate yourself honestly and provide thoughtful reflection on each area.
                  </p>
                  <p className="text-gray-600 text-sm">
                    Complete at least 3 assessments to continue.
                  </p>
                </div>
              </div>
            </div>

            {/* Assessment Areas */}
            <div className="space-y-6">
              {selfAssessments.map((assessment) => (
                <div key={assessment.id} className="bg-white rounded-lg shadow-sm border p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">{assessment.area}</h4>
                  <p className="text-gray-600 text-sm mb-4">{assessment.description}</p>
                  
                  {/* Rating */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <div className="flex items-center space-x-4">
                      {renderStarRating(assessment.id, assessmentResponses[assessment.id]?.rating || 0)}
                      <span className="text-sm text-gray-600">
                        {assessmentResponses[assessment.id]?.rating ? 
                          assessment.rating_scale[assessmentResponses[assessment.id].rating - 1] : 
                          'Click to rate'
                        }
                      </span>
                    </div>
                  </div>
                  
                  {/* Reflection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reflection</label>
                    <p className="text-sm text-gray-600 mb-2">{assessment.reflection_prompt}</p>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      rows={4}
                      placeholder="Share your honest reflection on this area..."
                      value={assessmentResponses[assessment.id]?.reflection || ''}
                      onChange={(e) => {
                        const current = assessmentResponses[assessment.id] || { rating: 0, reflection: '' };
                        handleAssessmentResponse(assessment.id, current.rating, e.target.value);
                      }}
                    />
                  </div>
                  
                  {assessmentResponses[assessment.id]?.reflection && assessmentResponses[assessment.id].reflection.trim().length > 0 && (
                    <div className="mt-2 flex items-center text-green-600 text-sm">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Assessment completed
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Progress */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Assessment Progress</h3>
                <span className="text-sm text-gray-600">
                  {getCompletedAssessments()} of {selfAssessments.length} assessments completed
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(getCompletedAssessments() / selfAssessments.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Final Reflection Section */}
        {currentSection === 'reflection' && (
          <div className="space-y-8">
            {/* Instructions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-purple-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Final Reflection</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Complete your Ignatian journey with a final reflection on your entire experience - 
                    from initial document analysis through project completion and interview preparation.
                  </p>
                  <p className="text-gray-600 text-sm">
                    Consider your growth, insights, and how this journey has prepared you for your career goals.
                  </p>
                </div>
              </div>
            </div>

            {/* Final Reflection */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Your Ignatian Journey Reflection</h4>
              
              <div className="space-y-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded p-4">
                  <h5 className="font-medium text-blue-900 mb-2">Reflection Prompts</h5>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li>• How has this journey changed your understanding of your strengths and calling?</li>
                    <li>• What connections between your values and career goals became clearer through this process?</li>
                    <li>• How do you see yourself using this project and these insights in future interviews?</li>
                    <li>• What aspects of this experience energized you most? What does that tell you about your path forward?</li>
                    <li>• How will you continue to integrate reflection and discernment into your career decisions?</li>
                  </ul>
                </div>
              </div>
              
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={8}
                placeholder="Reflect on your entire journey through the Ignatian Pedagogical Paradigm. What have you learned about yourself, your values, and your calling? How has this process prepared you not just for interviews, but for a meaningful career?"
                value={finalReflection}
                onChange={(e) => setFinalReflection(e.target.value)}
              />
              
              {finalReflection.trim().length > 0 && (
                <div className="mt-2 flex items-center text-purple-600 text-sm">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Final reflection captured
                </div>
              )}
            </div>
          </div>
        )}

        {/* Completion Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Journey Completion</h3>
            <span className="text-sm text-gray-600">
              Overall Progress: {Math.round(((getCompletedInterviews() >= 3 ? 1 : 0) + 
                                            (getCompletedAssessments() >= 3 ? 1 : 0) + 
                                            (finalReflection.trim().length > 0 ? 1 : 0)) / 3 * 100)}%
            </span>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-3 ${
                getCompletedInterviews() >= 3 ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
              <span className={`text-sm ${
                getCompletedInterviews() >= 3 ? 'text-green-600' : 'text-gray-500'
              }`}>
                Complete at least 3 interview questions ({getCompletedInterviews()}/3)
              </span>
            </div>
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-3 ${
                getCompletedAssessments() >= 3 ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
              <span className={`text-sm ${
                getCompletedAssessments() >= 3 ? 'text-green-600' : 'text-gray-500'
              }`}>
                Complete at least 3 self-assessments ({getCompletedAssessments()}/3)
              </span>
            </div>
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-3 ${
                finalReflection.trim().length > 0 ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
              <span className={`text-sm ${
                finalReflection.trim().length > 0 ? 'text-green-600' : 'text-gray-500'
              }`}>
                Complete final reflection
              </span>
            </div>
          </div>

          {canComplete() ? (
            <div className="text-center">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
                <div className="flex items-center justify-center mb-3">
                  <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-green-900 mb-2">Congratulations!</h4>
                <p className="text-green-800 text-sm mb-4">
                  You have successfully completed your Ignatian journey. You now have a comprehensive portfolio project,
                  interview practice, self-assessment insights, and deep reflection to guide your career path.
                </p>
                <div className="space-y-3">
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="w-full bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Return to Dashboard
                  </button>
                  <button 
                    onClick={() => {
                      // In a real implementation, this would trigger portfolio export
                      alert('Portfolio export functionality coming soon!');
                    }}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Export Complete Portfolio
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  Complete the remaining requirements above to finish your Ignatian journey.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvaluationStage;