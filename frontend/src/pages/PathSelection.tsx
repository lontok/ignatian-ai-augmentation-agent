import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

type PathType = 'exploration' | 'interview';

const PathSelection: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPath, setSelectedPath] = useState<PathType | null>(null);

  const handlePathSelection = (path: PathType) => {
    setSelectedPath(path);
    // Store the selected path in sessionStorage for persistence
    sessionStorage.setItem('selectedPath', path);
    // Navigate to Context stage with the selected path
    navigate('/context');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Where are you in your job search journey?
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the path that best fits your current situation. 
            This will help us tailor your experience through the Ignatian Pedagogical Paradigm.
          </p>
        </div>

        {/* Path Options */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Exploration Mode */}
          <div 
            className={`bg-white rounded-lg shadow-lg p-8 border-2 transition-all cursor-pointer hover:shadow-xl ${
              selectedPath === 'exploration' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
            }`}
            onClick={() => setSelectedPath('exploration')}
          >
            <div className="mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                I'm exploring opportunities
              </h2>
              <div className="text-sm font-medium text-blue-600 mb-4">
                EXPLORATION MODE
              </div>
            </div>

            <div className="space-y-4 text-gray-600">
              <p className="font-medium text-gray-900">Perfect if you're:</p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Researching different career paths</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Applying to multiple similar positions</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Want to maximize your efficiency</span>
                </li>
              </ul>

              <div className="bg-blue-50 p-4 rounded-md mt-4">
                <p className="text-sm">
                  <strong>What you'll do:</strong> Upload 3-5 job descriptions and create ONE strategic 
                  portfolio project that addresses multiple roles simultaneously.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4">
                <span className="text-sm text-gray-500">Timeline: Flexible</span>
                <span className="text-sm font-medium text-blue-600">Recommended</span>
              </div>
            </div>

            <button
              onClick={() => handlePathSelection('exploration')}
              className={`w-full mt-6 py-3 px-4 rounded-md font-medium transition-colors ${
                selectedPath === 'exploration'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Choose Exploration Mode
            </button>
          </div>

          {/* Interview Prep Mode */}
          <div 
            className={`bg-white rounded-lg shadow-lg p-8 border-2 transition-all cursor-pointer hover:shadow-xl ${
              selectedPath === 'interview' ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-200'
            }`}
            onClick={() => setSelectedPath('interview')}
          >
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                I have an interview scheduled
              </h2>
              <div className="text-sm font-medium text-green-600 mb-4">
                INTERVIEW PREP MODE
              </div>
            </div>

            <div className="space-y-4 text-gray-600">
              <p className="font-medium text-gray-900">Perfect if you:</p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Have a specific interview coming up</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Need a focused portfolio piece quickly</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Want to tailor your project to one role</span>
                </li>
              </ul>

              <div className="bg-green-50 p-4 rounded-md mt-4">
                <p className="text-sm">
                  <strong>What you'll do:</strong> Upload one specific job description and create a 
                  highly targeted portfolio project for that exact role.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4">
                <span className="text-sm text-gray-500">Timeline: Interview date</span>
                <span className="text-sm font-medium text-green-600">Fast track</span>
              </div>
            </div>

            <button
              onClick={() => handlePathSelection('interview')}
              className={`w-full mt-6 py-3 px-4 rounded-md font-medium transition-colors ${
                selectedPath === 'interview'
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Choose Interview Prep Mode
            </button>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-gray-100 rounded-lg p-6 text-center">
          <p className="text-gray-700 mb-2">
            <strong>Not sure which to choose?</strong>
          </p>
          <p className="text-gray-600">
            You can always switch paths later. Most students start with Exploration Mode to understand 
            the field, then use Interview Prep Mode when they secure specific interviews.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PathSelection;