import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import MultiStepForm from './MultiStepForm';

export interface QuestionnaireResponse {
  [key: string]: string | string[];
}

export interface BackgroundQuestionnaireData {
  id?: number;
  responses: QuestionnaireResponse;
  completed_at?: string;
  created_at?: string;
  updated_at?: string;
}

interface BackgroundQuestionnaireProps {
  onComplete: (data: BackgroundQuestionnaireData) => void;
  onBack?: () => void;
}

interface Question {
  id: string;
  question: string;
  type: 'text' | 'textarea' | 'select';
  options?: string[];
}

export default function BackgroundQuestionnaire({ onComplete, onBack }: BackgroundQuestionnaireProps) {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [existingData, setExistingData] = useState<BackgroundQuestionnaireData | null>(null);
  const [reanalysisLoading, setReanalysisLoading] = useState(false);
  const [reanalysisMessage, setReanalysisMessage] = useState('');
  
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

  // Define questions organized by category
  const questions: { [category: string]: Question[] } = {
    "Values & Motivations": [
      {
        id: "career_values",
        question: "What are your top 3 career values? (e.g., work-life balance, impact, growth)",
        type: "text"
      },
      {
        id: "mission_alignment",
        question: "How important is it that your work aligns with your personal mission or values?",
        type: "select",
        options: ["Not important", "Somewhat important", "Very important", "Essential"]
      },
      {
        id: "social_impact",
        question: "Describe a time when you made a positive impact on others.",
        type: "textarea"
      }
    ],
    "Service Orientation": [
      {
        id: "service_experience",
        question: "What volunteer or service experiences have been most meaningful to you?",
        type: "textarea"
      },
      {
        id: "helping_others",
        question: "How do you prefer to help others in a professional setting?",
        type: "text"
      },
      {
        id: "community_involvement",
        question: "What communities or causes are you passionate about?",
        type: "text"
      }
    ],
    "Growth & Learning": [
      {
        id: "learning_style",
        question: "How do you learn best? (e.g., hands-on, reading, mentorship)",
        type: "text"
      },
      {
        id: "skill_development",
        question: "What skills are you most excited to develop in your next role?",
        type: "textarea"
      },
      {
        id: "mentorship_preference",
        question: "Do you prefer to work independently or with mentorship/guidance?",
        type: "select",
        options: ["Strongly prefer independence", "Prefer independence", "Balanced", "Prefer guidance", "Strongly prefer guidance"]
      }
    ],
    "Work Style & Environment": [
      {
        id: "work_environment",
        question: "Describe your ideal work environment.",
        type: "textarea"
      },
      {
        id: "collaboration_style",
        question: "How do you prefer to collaborate with others?",
        type: "text"
      },
      {
        id: "pace_preference",
        question: "Do you prefer fast-paced or steady-paced work environments?",
        type: "select",
        options: ["Fast-paced", "Moderately fast", "Balanced", "Steady", "Slow and thoughtful"]
      }
    ]
  };

  // Fetch existing questionnaire data
  useEffect(() => {
    const fetchExistingData = async () => {
      if (!user || !token) return;
      
      try {
        const response = await fetch(`${apiUrl}/questionnaire/background/latest`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setExistingData(data);
        }
      } catch (error) {
        console.error('Error fetching existing questionnaire:', error);
      }
    };

    fetchExistingData();
  }, [user, token, apiUrl]);

  const triggerResumeReanalysis = async () => {
    if (!token) return;
    
    setReanalysisLoading(true);
    setReanalysisMessage('Updating your analysis with personal context...');
    
    try {
      // First, get the user's resume document
      const docsResponse = await fetch(`${apiUrl}/documents/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!docsResponse.ok) {
        throw new Error('Failed to fetch documents');
      }
      
      const docsData = await docsResponse.json();
      const resumeDoc = docsData.documents?.find((doc: any) => doc.document_type === 'resume');
      
      if (!resumeDoc) {
        console.error('No resume found to re-analyze');
        return;
      }
      
      // Start new analysis with questionnaire data
      const analysisResponse = await fetch(`${apiUrl}/analysis/resume/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume_document_id: resumeDoc.id,
        }),
      });
      
      if (!analysisResponse.ok) {
        throw new Error('Failed to start re-analysis');
      }
      
      const analysisData = await analysisResponse.json();
      
      // Poll for completion
      await pollForAnalysisCompletion(analysisData.analysis_id);
      
    } catch (error) {
      console.error('Failed to trigger re-analysis:', error);
      setReanalysisMessage('Failed to update analysis. You can manually re-analyze from the Context page.');
    } finally {
      setReanalysisLoading(false);
    }
  };
  
  const pollForAnalysisCompletion = async (analysisId: number) => {
    const maxAttempts = 60; // 30 seconds max
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      try {
        const response = await fetch(`${apiUrl}/analysis/${analysisId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.status === 'completed') {
            setReanalysisMessage('Analysis updated successfully! Redirecting...');
            setTimeout(() => {
              navigate('/context');
            }, 2000);
            return;
          } else if (data.status === 'failed') {
            throw new Error('Analysis failed');
          }
          
          // Update progress message if available
          if (data.progress_message) {
            setReanalysisMessage(data.progress_message);
          }
        }
      } catch (error) {
        console.error('Error polling analysis:', error);
      }
      
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    throw new Error('Analysis timeout');
  };

  const handleSubmit = useCallback(async (responses: QuestionnaireResponse) => {
    if (!token) return;
    
    setLoading(true);
    try {
      let response;
      if (existingData?.id) {
        // Update existing questionnaire
        response = await fetch(`${apiUrl}/questionnaire/background/${existingData.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            responses,
            is_complete: true
          }),
        });
      } else {
        // Create new questionnaire
        response = await fetch(`${apiUrl}/questionnaire/background`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            responses,
            is_complete: true
          }),
        });
      }
      
      if (response.ok) {
        const data = await response.json();
        
        // Trigger resume re-analysis with questionnaire data
        await triggerResumeReanalysis();
        
        // Call original onComplete callback
        onComplete(data);
      } else {
        throw new Error('Failed to save questionnaire');
      }
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      alert('Failed to save questionnaire. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [existingData, onComplete, token, apiUrl]);

  const handleSaveProgress = useCallback(async (responses: QuestionnaireResponse) => {
    if (!user || !token) return;
    
    try {
      let response;
      if (existingData?.id) {
        response = await fetch(`${apiUrl}/questionnaire/background/${existingData.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            responses,
            is_complete: false
          }),
        });
      } else {
        response = await fetch(`${apiUrl}/questionnaire/background`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            responses,
            is_complete: false
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setExistingData(data);
        }
      }
    } catch (error) {
      console.error('Error saving questionnaire progress:', error);
    }
  }, [existingData, user, token, apiUrl]);

  // Show re-analysis loading overlay
  if (reanalysisLoading) {
    return (
      <div className="background-questionnaire">
        <div className="reanalysis-overlay">
          <div className="reanalysis-content">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium mb-2">Enhancing Your Analysis</h3>
            <p className="text-gray-600 text-center">{reanalysisMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="background-questionnaire">
      <div className="questionnaire-header">
        <h2>Personal Background</h2>
        <p className="subtitle">
          Help us understand who you are beyond your resume. Your responses will guide our recommendations
          and ensure alignment with your values and aspirations.
        </p>
      </div>

      <MultiStepForm
        questions={questions}
        initialData={existingData?.responses || {}}
        onSubmit={handleSubmit}
        onSaveProgress={handleSaveProgress}
        onBack={onBack}
        loading={loading}
      />
    </div>
  );
}