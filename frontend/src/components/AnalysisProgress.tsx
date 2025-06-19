import React from 'react';

interface AnalysisProgressProps {
  progressStep?: string;
  progressMessage?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ 
  progressStep, 
  progressMessage,
  status 
}) => {
  const steps = [
    { id: 'initializing', label: 'Initializing', description: 'Starting analysis...' },
    { id: 'analyzing_resume', label: 'Resume Analysis', description: 'Extracting your skills and experience...' },
    { id: 'analyzing_job', label: 'Job Analysis', description: 'Understanding job requirements...' },
    { id: 'finding_connections', label: 'Finding Connections', description: 'Matching your background to the role...' },
    { id: 'extracting_evidence', label: 'Extracting Evidence', description: 'Finding specific examples...' },
    { id: 'generating_summary', label: 'Creating Summary', description: 'Preparing your results...' },
    { id: 'completed', label: 'Complete', description: 'Analysis ready!' }
  ];

  const currentStepIndex = progressStep 
    ? steps.findIndex(step => step.id === progressStep)
    : status === 'completed' ? steps.length - 1 : 0;

  const progressPercentage = Math.max(0, Math.min(100, 
    ((currentStepIndex + 1) / steps.length) * 100
  ));

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-600 mb-2">
          <span>Progress</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="h-full bg-blue-500 opacity-50 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Current Step Message */}
      {progressMessage && (
        <div className="mb-6 text-center">
          <p className="text-sm text-gray-700 font-medium">{progressMessage}</p>
        </div>
      )}

      {/* Steps List */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex && status !== 'completed';
          const isPending = index > currentStepIndex;

          return (
            <div 
              key={step.id}
              className={`flex items-start ${
                isCompleted ? 'opacity-100' : 
                isCurrent ? 'opacity-100' : 
                'opacity-40'
              } transition-opacity duration-300`}
            >
              {/* Step Icon */}
              <div className="flex-shrink-0 mr-3">
                {isCompleted ? (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : isCurrent ? (
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  </div>
                ) : (
                  <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1">
                <h4 className={`text-sm font-medium ${
                  isCompleted ? 'text-gray-900' : 
                  isCurrent ? 'text-blue-900' : 
                  'text-gray-500'
                }`}>
                  {step.label}
                </h4>
                <p className={`text-xs mt-0.5 ${
                  isCompleted ? 'text-gray-600' : 
                  isCurrent ? 'text-blue-700' : 
                  'text-gray-400'
                }`}>
                  {isCurrent && progressMessage ? progressMessage : step.description}
                </p>
              </div>

              {/* Loading Spinner for Current Step */}
              {isCurrent && (
                <div className="flex-shrink-0 ml-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Estimated Time Remaining */}
      {status === 'processing' && currentStepIndex < steps.length - 1 && (
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Estimated time remaining: {Math.max(1, (steps.length - currentStepIndex - 1) * 15)} seconds
          </p>
        </div>
      )}
    </div>
  );
};

export default AnalysisProgress;