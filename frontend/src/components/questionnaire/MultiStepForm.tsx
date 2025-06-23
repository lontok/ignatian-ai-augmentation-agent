import React, { useState, useEffect, useCallback } from 'react';
import { QuestionnaireResponse } from './BackgroundQuestionnaire';

interface Question {
  id: string;
  question: string;
  type: 'text' | 'textarea' | 'select';
  options?: string[];
}

interface MultiStepFormProps {
  questions: { [category: string]: Question[] };
  initialData?: QuestionnaireResponse;
  onSubmit: (responses: QuestionnaireResponse) => void;
  onSaveProgress?: (responses: QuestionnaireResponse) => void;
  onBack?: () => void;
  loading?: boolean;
}

export default function MultiStepForm({
  questions,
  initialData = {},
  onSubmit,
  onSaveProgress,
  onBack,
  loading = false
}: MultiStepFormProps) {
  const categories = Object.keys(questions);
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<QuestionnaireResponse>(initialData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Auto-save to localStorage
  useEffect(() => {
    const saveToLocalStorage = () => {
      localStorage.setItem('questionnaire_draft', JSON.stringify(responses));
    };
    
    const debounceTimer = setTimeout(saveToLocalStorage, 1000);
    return () => clearTimeout(debounceTimer);
  }, [responses]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('questionnaire_draft');
    if (savedDraft && Object.keys(initialData).length === 0) {
      try {
        const parsed = JSON.parse(savedDraft);
        setResponses(parsed);
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, [initialData]);

  const currentCategory = categories[currentStep];
  const currentQuestions = questions[currentCategory];
  const totalSteps = categories.length;

  const handleInputChange = useCallback((questionId: string, value: string | string[]) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
    
    // Clear error for this field
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  }, [errors]);

  const validateCurrentStep = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    currentQuestions.forEach(question => {
      const response = responses[question.id];
      if (!response || (typeof response === 'string' && response.trim() === '')) {
        newErrors[question.id] = 'This field is required';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = useCallback(async () => {
    if (!validateCurrentStep()) return;

    // Save progress if callback provided
    if (onSaveProgress) {
      await onSaveProgress(responses);
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Final submission
      onSubmit(responses);
    }
  }, [currentStep, totalSteps, responses, onSaveProgress, onSubmit, currentQuestions]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else if (onBack) {
      onBack();
    }
  }, [currentStep, onBack]);

  const renderQuestion = (question: Question) => {
    const value = responses[question.id] || '';
    const error = errors[question.id];

    switch (question.type) {
      case 'textarea':
        return (
          <div key={question.id} className="question-group">
            <label htmlFor={question.id}>{question.question}</label>
            <textarea
              id={question.id}
              value={value as string}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              rows={4}
              className={error ? 'error' : ''}
              disabled={loading}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
        );

      case 'select':
        return (
          <div key={question.id} className="question-group">
            <label htmlFor={question.id}>{question.question}</label>
            <select
              id={question.id}
              value={value as string}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              className={error ? 'error' : ''}
              disabled={loading}
            >
              <option value="">Select an option</option>
              {question.options?.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {error && <span className="error-message">{error}</span>}
          </div>
        );

      default:
        return (
          <div key={question.id} className="question-group">
            <label htmlFor={question.id}>{question.question}</label>
            <input
              type="text"
              id={question.id}
              value={value as string}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              className={error ? 'error' : ''}
              disabled={loading}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
        );
    }
  };

  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="multi-step-form">
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="progress-text">
          Step {currentStep + 1} of {totalSteps}: {currentCategory}
        </div>
      </div>

      <div className="form-content">
        <h3>{currentCategory}</h3>
        <div className="questions-container">
          {currentQuestions.map(renderQuestion)}
        </div>
      </div>

      <div className="form-navigation">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={loading}
          className="btn btn-secondary"
        >
          {currentStep === 0 && onBack ? 'Back' : 'Previous'}
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Saving...' : currentStep === totalSteps - 1 ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  );
}