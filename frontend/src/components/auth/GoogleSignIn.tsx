import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

declare global {
  interface Window {
    google: any;
  }
}

interface GoogleSignInProps {
  onError?: (error: string) => void;
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ({ onError }) => {
  const { login, isLoading } = useAuth();

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          {
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left',
          }
        );
      }
    };

    const handleCredentialResponse = async (response: any) => {
      try {
        console.log('🔑 Google credential received:', response.credential?.substring(0, 50) + '...');
        await login(response.credential);
        console.log('✅ Login successful!');
      } catch (error: any) {
        console.error('❌ Google Sign-In failed:', error);
        console.error('Error details:', error.response?.data);
        const errorMessage = error.response?.data?.detail || 'Authentication failed. Please try again.';
        if (onError) {
          onError(errorMessage);
        }
      }
    };

    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleSignIn;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [login, onError]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Signing in...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div id="google-signin-button" className="w-full max-w-sm"></div>
      <p className="text-sm text-gray-500 text-center">
        Sign in with your Google account to get started
      </p>
    </div>
  );
};

export default GoogleSignIn;