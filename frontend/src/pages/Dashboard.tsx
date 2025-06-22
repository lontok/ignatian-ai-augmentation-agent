import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.given_name || user?.name}!
        </h1>
        <p className="mt-2 text-gray-600">
          Ready to create your next portfolio project using the Ignatian Pedagogical Paradigm?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* IPP Stages */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Context</h3>
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Stage 1</span>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Upload your resume and target job description to establish the foundation.
          </p>
          <button 
            onClick={() => navigate('/path-selection')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Start Your Journey
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200 opacity-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Experience</h3>
            <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">Stage 2</span>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Explore connections between your background and job requirements.
          </p>
          <button disabled className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-md cursor-not-allowed">
            Complete Context First
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200 opacity-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Reflection</h3>
            <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">Stage 3</span>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Reflect on meaning, values, and personal mission alignment.
          </p>
          <button disabled className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-md cursor-not-allowed">
            Complete Previous Stages
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200 opacity-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Action</h3>
            <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">Stage 4</span>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Generate your customized portfolio project plan.
          </p>
          <button disabled className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-md cursor-not-allowed">
            Complete Previous Stages
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200 opacity-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Evaluation</h3>
            <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">Stage 5</span>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Review your project and practice interview questions.
          </p>
          <button disabled className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-md cursor-not-allowed">
            Complete Previous Stages
          </button>
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg shadow p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Your Progress</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Projects Started:</span>
              <span className="font-bold">0</span>
            </div>
            <div className="flex justify-between">
              <span>Projects Completed:</span>
              <span className="font-bold">0</span>
            </div>
            <div className="flex justify-between">
              <span>Total Reflections:</span>
              <span className="font-bold">0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;