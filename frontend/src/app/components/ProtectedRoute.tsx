"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { keycloak, authenticated, loading } = useAuth();
  const router = useRouter();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    if (!loading && !authenticated) {
      const promptTimer = setTimeout(() => {
        setShowLoginPrompt(true);
      }, 500);

      const redirectTimer = setTimeout(() => {
        router.push('/');
      }, 2000);

      return () => {
        clearTimeout(promptTimer);
        clearTimeout(redirectTimer);
      };
    }
  }, [authenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-white">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Verifying your session...</p>
          <p className="text-gray-500 text-sm mt-2">This will only take a moment</p>
        </motion.div>
      </div>
    );
  }

  if (!authenticated) {
    if (showLoginPrompt) {
      return (
        <div className="flex min-h-screen w-full items-center justify-center bg-white">
          <motion.div 
            className="text-center max-w-md mx-auto p-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-4">Please log in to access this page.</p>
            <div className="animate-pulse">
              <p className="text-sm text-gray-500">Redirecting to login page...</p>
            </div>
          </motion.div>
        </div>
      );
    }
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <>{children}</>;
}