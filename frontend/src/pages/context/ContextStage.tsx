import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import DocumentUpload from '../../components/documents/DocumentUpload';

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

const ContextStage: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadDocuments();
    checkLatestAnalysis();
  }, []);

  useEffect(() => {
    // Clear polling interval on component unmount
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  useEffect(() => {
    // Auto-trigger analysis when both documents are uploaded and no analysis exists
    if (hasRequiredDocuments() && !analysis && !analysisLoading) {
      handleStartAnalysis();
    }
  }, [documents, analysis]);

  const loadDocuments = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/documents/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents || []);
      }
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkLatestAnalysis = async () => {
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
        
        // Start polling if analysis is in progress
        if (analysisData.status === 'processing' || analysisData.status === 'pending') {
          startPolling(analysisData.id);
        }
      }
    } catch (error) {
      // No analysis exists yet, which is fine
      console.log('No existing analysis found');
    }
  };

  const handleUploadSuccess = (document: Document) => {
    setDocuments(prev => [...prev, document]);
    setUploadSuccess(`${document.document_type === 'resume' ? 'Resume' : 'Job description'} uploaded successfully!`);
    setUploadError(null);
    
    // Clear success message after 3 seconds
    setTimeout(() => setUploadSuccess(null), 3000);
  };

  const handleUploadError = (error: string) => {
    setUploadError(error);
    setUploadSuccess(null);
  };

  const getExistingDocument = (type: 'resume' | 'job_description') => {
    return documents.find(doc => doc.document_type === type);
  };

  const hasRequiredDocuments = () => {
    return getExistingDocument('resume') && getExistingDocument('job_description');
  };

  const handleStartAnalysis = async () => {
    const resumeDoc = getExistingDocument('resume');
    const jobDoc = getExistingDocument('job_description');
    
    if (!resumeDoc || !jobDoc || !token) return;

    setAnalysisLoading(true);
    setAnalysisError(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/analysis/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume_document_id: resumeDoc.id,
          job_document_id: jobDoc.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysis({
          id: data.analysis_id,
          status: data.status,
          created_at: new Date().toISOString(),
        });
        
        // Start polling for updates
        startPolling(data.analysis_id);
      } else {
        const errorData = await response.json();
        setAnalysisError(errorData.detail || 'Failed to start analysis');
      }
    } catch (error) {
      setAnalysisError('Failed to start analysis. Please try again.');
    } finally {
      setAnalysisLoading(false);
    }
  };

  const startPolling = (analysisId: number) => {
    // Clear existing interval
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/analysis/${analysisId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const analysisData = await response.json();
          setAnalysis(analysisData);
          
          // Stop polling when analysis is complete or failed
          if (analysisData.status === 'completed' || analysisData.status === 'failed') {
            clearInterval(interval);
            setPollingInterval(null);
          }
        }
      } catch (error) {
        console.error('Failed to poll analysis status:', error);
      }
    }, 3000); // Poll every 3 seconds

    setPollingInterval(interval);
  };

  const canProceed = () => {
    return hasRequiredDocuments() && analysis?.status === 'completed';
  };

  const getAnalysisStatusText = () => {
    if (!analysis) return null;
    
    switch (analysis.status) {
      case 'pending':
        return 'Analysis queued...';
      case 'processing':
        return 'Analyzing your documents...';
      case 'completed':
        return 'Analysis complete!';
      case 'failed':
        return 'Analysis failed. Please try again.';
      default:
        return 'Unknown status';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your documents...</p>
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
            Context Stage
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Welcome to the first stage of the Ignatian Pedagogical Paradigm. 
            Upload your resume and target job description to begin your journey 
            toward a personalized portfolio project.
          </p>
          
          {/* General Instructions */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-w-3xl mx-auto">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-gray-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="text-left">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Before you begin:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Have your current resume ready (PDF, DOC, DOCX, or TXT format)</li>
                  <li>• Save the job posting you're interested in as a PDF or text file</li>
                  <li>• Both files should be under 10MB</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">Context</span>
            </div>
            <div className="w-16 h-1 bg-gray-200"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span className="ml-2 text-sm text-gray-400">Experience</span>
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

        {/* Status Messages */}
        {uploadSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md">
            {uploadSuccess}
          </div>
        )}

        {uploadError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
            {uploadError}
          </div>
        )}

        {/* Document Upload Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Resume Upload */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="mb-4">
              {getExistingDocument('resume') ? (
                <div className="flex items-center text-green-600 mb-2">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Resume uploaded
                </div>
              ) : (
                <div className="flex items-center text-gray-400 mb-2">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Resume required
                </div>
              )}
            </div>
            
            {!getExistingDocument('resume') ? (
              <DocumentUpload
                documentType="resume"
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
              />
            ) : (
              <div className="text-center py-8">
                <div className="text-green-600 mb-2">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-600">
                  {getExistingDocument('resume')?.original_filename}
                </p>
                <button
                  onClick={() => setDocuments(prev => prev.filter(doc => doc.document_type !== 'resume'))}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  Upload different resume
                </button>
              </div>
            )}
          </div>

          {/* Job Description Upload */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="mb-4">
              {getExistingDocument('job_description') ? (
                <div className="flex items-center text-green-600 mb-2">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Job description uploaded
                </div>
              ) : (
                <div className="flex items-center text-gray-400 mb-2">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Job description required
                </div>
              )}
            </div>

            {/* Instructions for job description export */}
            {!getExistingDocument('job_description') && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex">
                  <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Need to save a job posting?</p>
                    <ul className="text-xs space-y-1 list-disc list-inside">
                      <li><strong>From web browser:</strong> Print page → "Save as PDF" or Ctrl/Cmd+P → PDF</li>
                      <li><strong>Copy text:</strong> Select all text → Copy → Paste into text document → Save as .txt</li>
                      <li><strong>From email:</strong> Forward to yourself → Print to PDF or save as text file</li>
                      <li><strong>From job sites:</strong> Look for "Save as PDF" or "Print" options</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {!getExistingDocument('job_description') ? (
              <DocumentUpload
                documentType="job_description"
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
              />
            ) : (
              <div className="text-center py-8">
                <div className="text-green-600 mb-2">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-600">
                  {getExistingDocument('job_description')?.original_filename}
                </p>
                <button
                  onClick={() => setDocuments(prev => prev.filter(doc => doc.document_type !== 'job_description'))}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  Upload different job description
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Analysis Status */}
        {hasRequiredDocuments() && (
          <div className="mb-8">
            {analysisError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
                {analysisError}
                <button 
                  onClick={handleStartAnalysis}
                  className="ml-4 underline hover:no-underline"
                  disabled={analysisLoading}
                >
                  Try again
                </button>
              </div>
            )}
            
            {analysis && (
              <div className={`border rounded-lg p-6 ${
                analysis.status === 'completed' ? 'bg-green-50 border-green-200' :
                analysis.status === 'failed' ? 'bg-red-50 border-red-200' :
                'bg-blue-50 border-blue-200'
              }`}>
                <div className={`text-center ${
                  analysis.status === 'completed' ? 'text-green-800' :
                  analysis.status === 'failed' ? 'text-red-800' :
                  'text-blue-800'
                }`}>
                  {(analysis.status === 'pending' || analysis.status === 'processing') && (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  )}
                  
                  {analysis.status === 'completed' && (
                    <svg className="w-8 h-8 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  
                  {analysis.status === 'failed' && (
                    <svg className="w-8 h-8 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  
                  <h3 className="text-lg font-medium mb-2">{getAnalysisStatusText()}</h3>
                  
                  {analysis.status === 'processing' && (
                    <p className="text-sm mb-4">
                      Our AI is analyzing your resume and job description to identify 
                      connections and opportunities. This typically takes 1-2 minutes.
                    </p>
                  )}
                  
                  {analysis.status === 'completed' && analysis.context_summary && (
                    <div className="text-left bg-white rounded-md p-4 mb-4">
                      <h4 className="font-medium mb-2">Context Analysis Summary:</h4>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{analysis.context_summary}</p>
                    </div>
                  )}
                  
                  {analysis.error_message && (
                    <p className="text-sm text-red-700 mb-4">
                      {analysis.error_message}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Next Steps */}
        <div className="text-center">
          {canProceed() ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="text-green-800">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium mb-2">Ready to Continue!</h3>
                <p className="text-sm mb-4">
                  Your documents have been analyzed and we've identified key connections 
                  between your background and the target role. Let's move to the Experience stage!
                </p>
                <button 
                  onClick={() => navigate('/experience')}
                  className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
                >
                  Continue to Experience Stage
                </button>
              </div>
            </div>
          ) : hasRequiredDocuments() ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="text-blue-800">
                <h3 className="text-lg font-medium mb-2">Analysis in Progress</h3>
                <p className="text-sm">
                  Please wait while we analyze your documents to prepare for the next stage.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="text-blue-800">
                <h3 className="text-lg font-medium mb-2">Upload Required Documents</h3>
                <p className="text-sm">
                  Please upload both your resume and the target job description to continue 
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

export default ContextStage;