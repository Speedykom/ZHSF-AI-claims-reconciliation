"use client";

import React from 'react';
import BrandingPanel from './components/BrandingPanel';
import LoginForm from './components/LoginForm';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { keycloak, authenticated, loading } = useAuth();

  const handleLogin = () => {
    keycloak.login();
  };

  const handleLogout = () => {
    keycloak.logout({
      redirectUri: window.location.origin,
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full font-sans">
        <BrandingPanel />
        <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-[420px] text-center">
            <div className="mb-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Checking Authentication</h2>
              <p className="text-gray-600">Please wait while we verify your session...</p>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{ width: '40%', animationDelay: '0.2s' }}></div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{ width: '20%', animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full font-sans">
      <BrandingPanel />
      <LoginForm 
        showPassword={false} 
        onTogglePassword={() => {}}
        onLogin={handleLogin}
        onLogout={handleLogout}
        authenticated={authenticated}
      />
    </div>
  );
};

export default LoginPage;
