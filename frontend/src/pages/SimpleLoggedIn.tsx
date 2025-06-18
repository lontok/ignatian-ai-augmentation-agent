import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const SimpleLoggedIn: React.FC = () => {
  const { user, logout, token } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              ✅ Successfully Logged In!
            </h1>
            <p className="text-gray-600 mb-6">
              Welcome to the Ignatian AI Augmentation Agent
            </p>
          </div>

          <div className="space-y-4 text-left">
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm font-medium text-gray-700">Name:</p>
              <p className="text-gray-900">{user?.name || 'Not available'}</p>
            </div>
            
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm font-medium text-gray-700">Email:</p>
              <p className="text-gray-900">{user?.email || 'Not available'}</p>
            </div>

            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm font-medium text-gray-700">User ID:</p>
              <p className="text-gray-900">{user?.id || 'Not available'}</p>
            </div>

            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm font-medium text-gray-700">Token Status:</p>
              <p className="text-gray-900">{token ? '✅ Present' : '❌ Missing'}</p>
            </div>

            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm font-medium text-gray-700">Login Time:</p>
              <p className="text-gray-900">{user?.last_login ? new Date(user.last_login).toLocaleString() : 'Not available'}</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </button>
            
            <button
              onClick={logout}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleLoggedIn;