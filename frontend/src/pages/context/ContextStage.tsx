import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import DocumentUpload from '../../components/documents/DocumentUpload';
import AnalysisProgress from '../../components/AnalysisProgress';
import { SUPPORTED_FILE_FORMATS } from '../../constants/fileFormats';

interface Document {
  id: number;
  document_type: 'resume' | 'job_description';
  filename: string;
  original_filename: string;
  file_size: number;
  created_at: string;
  content_text?: string;
}

interface ResumeAnalysis {
  id?: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  resume_analysis?: {
    skills?: any;
    experience?: any[];
    education?: any;
    achievements?: string[];
    summary?: string;
    character_strengths?: Array<{
      strength: string;
      evidence: string;
      ignatian_dimension: string;
    }>;
    values_indicators?: {
      service_orientation?: string[];
      collaboration?: string[];
      continuous_learning?: string[];
      excellence_pursuit?: string[];
    };
    growth_mindset?: {
      indicators?: string[];
      development_areas?: string[];
      readiness_for_growth?: string;
    };
    strengths?: Array<{
      strength: string;
      evidence: string;
      workplace_value: string;
    }>;
  };
  progress_step?: string;
  progress_message?: string;
  error_message?: string;
  created_at?: string;
  completed_at?: string;
}

const ContextStage: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Get the selected path from sessionStorage
  const selectedPath = sessionStorage.getItem('selectedPath') || 'exploration';

  useEffect(() => {
    loadDocuments();
    checkLatestResumeAnalysis();
  }, []);

  useEffect(() => {
    // Clear polling interval on component unmount
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);


  // Removed auto-trigger to allow manual analysis initiation
  // Users can now review their uploads before starting analysis

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


  const checkLatestResumeAnalysis = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/analysis/latest/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const analysisData = await response.json();
        setResumeAnalysis(analysisData);
        
        // Start polling if analysis is in progress
        if (analysisData.status === 'processing' || analysisData.status === 'pending') {
          startPolling(analysisData.id);
        }
      }
    } catch (error) {
      // No analysis exists yet, which is fine
      console.log('No existing resume analysis found');
    }
  };

  const handleUploadSuccess = (document: Document) => {
    setDocuments(prev => [...prev, document]);
    setUploadSuccess(`${document.document_type === 'resume' ? 'Resume' : 'Job description'} uploaded successfully!`);
    setUploadError(null);
    
    // Clear success message after 3 seconds
    setTimeout(() => setUploadSuccess(null), 3000);
    
    // Don't auto-trigger analysis - user will click button manually
    // TODO: Enable auto-trigger when resume-only analysis endpoint is available
  };

  const handleUploadError = (error: string) => {
    setUploadError(error);
    setUploadSuccess(null);
  };

  const getExistingDocument = (type: 'resume' | 'job_description') => {
    return documents.find(doc => doc.document_type === type);
  };

  const hasRequiredDocuments = () => {
    // Context stage now only requires resume
    return getExistingDocument('resume');
  };

  const handleStartResumeAnalysis = async () => {
    const resumeDoc = getExistingDocument('resume');
    
    if (!resumeDoc || !token) return;

    setAnalysisLoading(true);
    setAnalysisError(null);
    
    // Clear previous analysis results when re-analyzing
    setResumeAnalysis(null);

    try {
      // Use the new resume-only analysis endpoint
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/analysis/resume/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume_document_id: resumeDoc.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResumeAnalysis({
          id: data.analysis_id,
          status: data.status,
          created_at: new Date().toISOString(),
          progress_step: 'initializing',
          progress_message: 'Starting enhanced Ignatian analysis...'
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
          setResumeAnalysis(analysisData);
          
          // Stop polling when analysis is complete or failed
          if (analysisData.status === 'completed' || analysisData.status === 'failed') {
            clearInterval(interval);
            setPollingInterval(null);
          }
        }
      } catch (error) {
        console.error('Failed to poll analysis status:', error);
      }
    }, 500); // Poll every 0.5 seconds for better progress tracking

    setPollingInterval(interval);
  };




  const canProceed = () => {
    // Context stage can proceed once resume is uploaded
    return hasRequiredDocuments();
  };

  // Utility function to safely extract text from analysis items
  const getItemText = (item: any): string => {
    if (typeof item === 'string') return item;
    if (item?.name) return item.name;
    if (item?.title) return item.title;
    if (item?.text) return item.text;
    if (item?.value) return item.value;
    if (item?.description) return item.description;
    // If it's still an object, try to extract any string property
    if (typeof item === 'object' && item !== null) {
      const firstStringValue = Object.values(item).find(val => typeof val === 'string');
      if (firstStringValue) return firstStringValue as string;
    }
    return ''; // Return empty string instead of stringifying to avoid showing JSON
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
            Context Stage: Understanding Who You Are
          </h1>
          {/* Path Indicator */}
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4
            {selectedPath === 'exploration' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}">
            {selectedPath === 'exploration' ? (
              <>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Exploration Mode
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                Interview Prep Mode
              </>
            )}
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Welcome to the first stage of the Ignatian Pedagogical Paradigm. 
            The Context stage is about understanding <strong>who you are</strong> - your background, 
            skills, and experiences. Upload your resume to begin establishing your personal context.
          </p>
          
          {/* General Instructions */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-w-3xl mx-auto">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-gray-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="text-left">
                <h3 className="text-sm font-medium text-gray-900 mb-2">What you'll need:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Your current resume in {SUPPORTED_FILE_FORMATS.display.full} format</li>
                  <li>• File should be under {SUPPORTED_FILE_FORMATS.maxSizeDisplay}</li>
                  <li>• Job descriptions will be uploaded in the next stage (Experience)</li>
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
              <>
                <DocumentUpload
                  documentType="resume"
                  onUploadSuccess={handleUploadSuccess}
                  onUploadError={handleUploadError}
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Supported formats: {SUPPORTED_FILE_FORMATS.display.short}
                </p>
              </>
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
                
                {/* Re-analyze button */}
                {resumeAnalysis?.status === 'completed' && (
                  <div className="mt-4">
                    <div className="border-t pt-4">
                      <button
                        onClick={handleStartResumeAnalysis}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                        disabled={analysisLoading}
                      >
                        {analysisLoading ? 'Re-analyzing...' : 'Re-analyze with Enhanced Insights'}
                      </button>
                      <p className="mt-2 text-xs text-gray-500">
                        Get deeper Ignatian pedagogical insights from your resume
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Job Descriptions - Next Stage */}
          <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Job Descriptions Come Next
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                In the Experience stage, you'll upload:
              </p>

              <div className="space-y-2 text-sm text-gray-600">
                {selectedPath === 'exploration' ? (
                  <>
                    <div className="flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                      </svg>
                      <span>3-5 job descriptions for multi-target project</span>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-md mt-3">
                      <p className="text-xs text-blue-700">
                        <strong>Tip:</strong> Start collecting job postings that interest you. 
                        Save them as PDF or text files for the next stage.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                      </svg>
                      <span>1 specific job description for your interview</span>
                    </div>
                    <div className="bg-green-50 p-3 rounded-md mt-3">
                      <p className="text-xs text-green-700">
                        <strong>Tip:</strong> Have the exact job posting for your interview ready 
                        as a PDF or text file.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Resume Analysis Section */}
        {hasRequiredDocuments() && (
          <div className="mb-8">
            {analysisError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
                {analysisError}
                <button 
                  onClick={handleStartResumeAnalysis}
                  className="ml-4 underline hover:no-underline"
                  disabled={analysisLoading}
                >
                  Try again
                </button>
              </div>
            )}
            
            {/* Resume Analysis Info */}
            {(!resumeAnalysis || resumeAnalysis.status === 'failed') && !analysisLoading && (
              <div className="text-center p-6 bg-amber-50 border border-amber-200 rounded-lg">
                <svg className="w-12 h-12 mx-auto mb-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3 className="text-lg font-medium text-amber-900 mb-2">Resume Analysis Coming Soon!</h3>
                <p className="text-sm text-amber-700 mb-4">
                  In the Context stage, our AI will analyze your resume to identify skills, experience, and strengths.
                  For now, please proceed to the Experience stage where you'll upload job descriptions.
                </p>
                <div className="mt-4 text-xs text-amber-600">
                  The full analysis will happen after you upload job descriptions in the next stage.
                </div>
              </div>
            )}
            
            {/* Analysis Progress or Results */}
            {resumeAnalysis && resumeAnalysis.status !== 'failed' && (
              <div className={`border rounded-lg p-6 ${
                resumeAnalysis.status === 'completed' ? 'bg-green-50 border-green-200' :
                'bg-blue-50 border-blue-200'
              }`}>
                <div className={`text-center ${
                  resumeAnalysis.status === 'completed' ? 'text-green-800' : 'text-blue-800'
                }`}>
                  {(resumeAnalysis.status === 'pending' || resumeAnalysis.status === 'processing') ? (
                    <AnalysisProgress 
                      status={resumeAnalysis.status}
                      progressStep={resumeAnalysis.progress_step}
                      progressMessage={resumeAnalysis.progress_message}
                    />
                  ) : (
                    <>
                      {resumeAnalysis.status === 'completed' && (
                        <>
                          <svg className="w-8 h-8 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <h3 className="text-lg font-medium mb-4">Resume Analysis Complete</h3>
                          
                          {/* Display analysis results */}
                          {resumeAnalysis.resume_analysis && (
                            <div className="text-left bg-white rounded-md p-6 space-y-4">
                              {resumeAnalysis.resume_analysis.summary && (
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-2">Summary</h4>
                                  <p className="text-sm text-gray-700">{resumeAnalysis.resume_analysis.summary}</p>
                                </div>
                              )}
                              
                              {resumeAnalysis.resume_analysis.skills && (
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-2">Key Skills</h4>
                                  {/* Handle new skills format with technical/soft categorization */}
                                  {resumeAnalysis.resume_analysis.skills.technical || resumeAnalysis.resume_analysis.skills.soft ? (
                                    <>
                                      {resumeAnalysis.resume_analysis.skills.technical && resumeAnalysis.resume_analysis.skills.technical.length > 0 && (
                                        <div className="mb-2">
                                          <h5 className="text-sm font-medium text-gray-700 mb-1">Technical Skills</h5>
                                          <div className="flex flex-wrap gap-2">
                                            {resumeAnalysis.resume_analysis.skills.technical.map((skill: any, index: number) => (
                                              <span key={`tech-${index}`} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                                {getItemText(skill)}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                      {resumeAnalysis.resume_analysis.skills.soft && resumeAnalysis.resume_analysis.skills.soft.length > 0 && (
                                        <div>
                                          <h5 className="text-sm font-medium text-gray-700 mb-1">Soft Skills</h5>
                                          <div className="flex flex-wrap gap-2">
                                            {resumeAnalysis.resume_analysis.skills.soft.map((skill: any, index: number) => (
                                              <span key={`soft-${index}`} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                                {getItemText(skill)}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </>
                                  ) : Array.isArray(resumeAnalysis.resume_analysis.skills) && resumeAnalysis.resume_analysis.skills.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                      {resumeAnalysis.resume_analysis.skills.map((skill: any, index: number) => {
                                        const skillText = getItemText(skill);
                                        return skillText ? (
                                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                            {skillText}
                                          </span>
                                        ) : null;
                                      })}
                                    </div>
                                  ) : null}
                                </div>
                              )}
                              
                              {resumeAnalysis.resume_analysis.experience && resumeAnalysis.resume_analysis.experience.length > 0 && (
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-2">Experience Highlights</h4>
                                  <div className="space-y-3">
                                    {resumeAnalysis.resume_analysis.experience.map((exp: any, index: number) => {
                                      // Handle new experience format with role, organization, etc.
                                      if (typeof exp === 'object' && exp.role) {
                                        return (
                                          <div key={index} className="bg-gray-50 p-3 rounded-md">
                                            <h5 className="font-medium text-gray-900">{exp.role}</h5>
                                            {exp.organization && <p className="text-sm text-gray-600">{exp.organization} {exp.duration ? `• ${exp.duration}` : ''}</p>}
                                            {exp.key_achievements && exp.key_achievements.length > 0 && (
                                              <ul className="mt-2 space-y-1">
                                                {exp.key_achievements.map((achievement: string, idx: number) => (
                                                  <li key={idx} className="text-sm text-gray-700 flex items-start">
                                                    <span className="mr-2">•</span>
                                                    <span>{achievement}</span>
                                                  </li>
                                                ))}
                                              </ul>
                                            )}
                                            {exp.service_impact && (
                                              <p className="mt-2 text-sm text-purple-700 italic">
                                                <span className="font-medium">Service Impact:</span> {exp.service_impact}
                                              </p>
                                            )}
                                          </div>
                                        );
                                      } else {
                                        // Fallback for old format
                                        const expText = getItemText(exp);
                                        return expText ? (
                                          <div key={index} className="text-sm text-gray-700 flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>{expText}</span>
                                          </div>
                                        ) : null;
                                      }
                                    })}
                                  </div>
                                </div>
                              )}
                              
                              {resumeAnalysis.resume_analysis.education && (
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-2">Education</h4>
                                  {/* Handle new education format */}
                                  {typeof resumeAnalysis.resume_analysis.education === 'object' && !Array.isArray(resumeAnalysis.resume_analysis.education) ? (
                                    <div className="bg-gray-50 p-3 rounded-md">
                                      {resumeAnalysis.resume_analysis.education.degree && (
                                        <h5 className="font-medium text-gray-900">{resumeAnalysis.resume_analysis.education.degree}</h5>
                                      )}
                                      {resumeAnalysis.resume_analysis.education.institution && (
                                        <p className="text-sm text-gray-600">{resumeAnalysis.resume_analysis.education.institution}</p>
                                      )}
                                      {resumeAnalysis.resume_analysis.education.achievements && resumeAnalysis.resume_analysis.education.achievements.length > 0 && (
                                        <ul className="mt-2 space-y-1">
                                          {resumeAnalysis.resume_analysis.education.achievements.map((achievement: string, idx: number) => (
                                            <li key={idx} className="text-sm text-gray-700">• {achievement}</li>
                                          ))}
                                        </ul>
                                      )}
                                      {resumeAnalysis.resume_analysis.education.extracurricular && resumeAnalysis.resume_analysis.education.extracurricular.length > 0 && (
                                        <div className="mt-2">
                                          <p className="text-sm font-medium text-gray-700">Activities & Values:</p>
                                          <ul className="space-y-1">
                                            {resumeAnalysis.resume_analysis.education.extracurricular.map((activity: string, idx: number) => (
                                              <li key={idx} className="text-sm text-gray-600">• {activity}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  ) : Array.isArray(resumeAnalysis.resume_analysis.education) && resumeAnalysis.resume_analysis.education.length > 0 ? (
                                    <ul className="space-y-1">
                                      {resumeAnalysis.resume_analysis.education.map((edu: any, index: number) => {
                                        const eduText = getItemText(edu);
                                        return eduText ? (
                                          <li key={index} className="text-sm text-gray-700">{eduText}</li>
                                        ) : null;
                                      })}
                                    </ul>
                                  ) : null}
                                </div>
                              )}
                              
                              {/* New Ignatian Fields */}
                              {resumeAnalysis.resume_analysis.character_strengths && resumeAnalysis.resume_analysis.character_strengths.length > 0 && (
                                <div className="border-t pt-4">
                                  <h4 className="font-semibold text-gray-900 mb-2">Character Strengths (Ignatian Analysis)</h4>
                                  <div className="space-y-3">
                                    {resumeAnalysis.resume_analysis.character_strengths.map((strength, index) => (
                                      <div key={index} className="bg-purple-50 p-3 rounded-md">
                                        <h5 className="font-medium text-purple-900">{strength.strength}</h5>
                                        <p className="text-sm text-gray-700 mt-1">{strength.evidence}</p>
                                        <span className="inline-block mt-2 text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">
                                          {strength.ignatian_dimension}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {resumeAnalysis.resume_analysis.values_indicators && (
                                <div className="border-t pt-4">
                                  <h4 className="font-semibold text-gray-900 mb-2">Values & Service Orientation</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {resumeAnalysis.resume_analysis.values_indicators.service_orientation && resumeAnalysis.resume_analysis.values_indicators.service_orientation.length > 0 && (
                                      <div className="bg-amber-50 p-3 rounded-md">
                                        <h5 className="font-medium text-amber-900 mb-1">Service to Others</h5>
                                        <ul className="text-sm text-gray-700 space-y-1">
                                          {resumeAnalysis.resume_analysis.values_indicators.service_orientation.map((item, idx) => (
                                            <li key={idx} className="flex items-start">
                                              <span className="mr-1">•</span>
                                              <span>{item}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                    {resumeAnalysis.resume_analysis.values_indicators.collaboration && resumeAnalysis.resume_analysis.values_indicators.collaboration.length > 0 && (
                                      <div className="bg-blue-50 p-3 rounded-md">
                                        <h5 className="font-medium text-blue-900 mb-1">Collaboration</h5>
                                        <ul className="text-sm text-gray-700 space-y-1">
                                          {resumeAnalysis.resume_analysis.values_indicators.collaboration.map((item, idx) => (
                                            <li key={idx} className="flex items-start">
                                              <span className="mr-1">•</span>
                                              <span>{item}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                    {resumeAnalysis.resume_analysis.values_indicators.continuous_learning && resumeAnalysis.resume_analysis.values_indicators.continuous_learning.length > 0 && (
                                      <div className="bg-green-50 p-3 rounded-md">
                                        <h5 className="font-medium text-green-900 mb-1">Continuous Learning</h5>
                                        <ul className="text-sm text-gray-700 space-y-1">
                                          {resumeAnalysis.resume_analysis.values_indicators.continuous_learning.map((item, idx) => (
                                            <li key={idx} className="flex items-start">
                                              <span className="mr-1">•</span>
                                              <span>{item}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                    {resumeAnalysis.resume_analysis.values_indicators.excellence_pursuit && resumeAnalysis.resume_analysis.values_indicators.excellence_pursuit.length > 0 && (
                                      <div className="bg-indigo-50 p-3 rounded-md">
                                        <h5 className="font-medium text-indigo-900 mb-1">Excellence (Magis)</h5>
                                        <ul className="text-sm text-gray-700 space-y-1">
                                          {resumeAnalysis.resume_analysis.values_indicators.excellence_pursuit.map((item, idx) => (
                                            <li key={idx} className="flex items-start">
                                              <span className="mr-1">•</span>
                                              <span>{item}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                              
                              {resumeAnalysis.resume_analysis.growth_mindset && (
                                <div className="border-t pt-4">
                                  <h4 className="font-semibold text-gray-900 mb-2">Growth Mindset & Development</h4>
                                  <div className="bg-teal-50 p-4 rounded-md">
                                    {resumeAnalysis.resume_analysis.growth_mindset.indicators && resumeAnalysis.resume_analysis.growth_mindset.indicators.length > 0 && (
                                      <div className="mb-3">
                                        <h5 className="font-medium text-teal-900 mb-1">Growth Indicators</h5>
                                        <ul className="text-sm text-gray-700 space-y-1">
                                          {resumeAnalysis.resume_analysis.growth_mindset.indicators.map((indicator, idx) => (
                                            <li key={idx} className="flex items-start">
                                              <span className="mr-1">•</span>
                                              <span>{indicator}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                    {resumeAnalysis.resume_analysis.growth_mindset.development_areas && resumeAnalysis.resume_analysis.growth_mindset.development_areas.length > 0 && (
                                      <div className="mb-3">
                                        <h5 className="font-medium text-teal-900 mb-1">Areas for Development</h5>
                                        <ul className="text-sm text-gray-700 space-y-1">
                                          {resumeAnalysis.resume_analysis.growth_mindset.development_areas.map((area, idx) => (
                                            <li key={idx} className="flex items-start">
                                              <span className="mr-1">•</span>
                                              <span>{area}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                    {resumeAnalysis.resume_analysis.growth_mindset.readiness_for_growth && (
                                      <div>
                                        <h5 className="font-medium text-teal-900 mb-1">Readiness Assessment</h5>
                                        <p className="text-sm text-gray-700">{resumeAnalysis.resume_analysis.growth_mindset.readiness_for_growth}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                              
                              {resumeAnalysis.resume_analysis.strengths && resumeAnalysis.resume_analysis.strengths.length > 0 && (
                                <div className="border-t pt-4">
                                  <h4 className="font-semibold text-gray-900 mb-2">Key Strengths & Workplace Value</h4>
                                  <div className="space-y-3">
                                    {resumeAnalysis.resume_analysis.strengths.map((strength, index) => (
                                      <div key={index} className="bg-gray-50 p-3 rounded-md">
                                        <h5 className="font-medium text-gray-900">{strength.strength}</h5>
                                        <p className="text-sm text-gray-700 mt-1">
                                          <span className="font-medium">Evidence:</span> {strength.evidence}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                          <span className="font-medium">Workplace Value:</span> {strength.workplace_value}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </>
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
                <h3 className="text-lg font-medium mb-2">Context Complete!</h3>
                <p className="text-sm mb-4">
                  Great! We've captured your background and skills from your resume. 
                  Now let's move to the Experience stage where you'll upload job descriptions 
                  to explore opportunities.
                </p>
                <button 
                  onClick={() => navigate('/experience')}
                  className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
                >
                  Continue to Experience Stage
                </button>
              </div>
            </div>
          ) : !hasRequiredDocuments() ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="text-blue-800">
                <h3 className="text-lg font-medium mb-2">Upload Your Resume</h3>
                <p className="text-sm">
                  Please upload your resume to establish your personal context. 
                  This is the foundation of your journey through the Ignatian Pedagogical Paradigm.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ContextStage;