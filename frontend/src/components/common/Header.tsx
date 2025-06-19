import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserProfile } from '../auth';

const Header: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <h1 className="text-2xl font-bold text-gray-900">
                Ignatian AI
              </h1>
              <span className="text-sm text-gray-500 hidden sm:inline">
                Augmentation Agent
              </span>
            </Link>
          </div>
          
          {isAuthenticated && (
            <div className="flex items-center space-x-4">
              <UserProfile />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;