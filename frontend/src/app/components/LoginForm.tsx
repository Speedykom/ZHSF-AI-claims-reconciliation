'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import FormHeader from './FormHeader';
import { useAuth } from '../../context/AuthContext';

interface LoginFormProps {
  showPassword?: boolean;
  onTogglePassword?: () => void;
  onLogin?: () => void;
  onLogout?: () => void;
  authenticated?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  showPassword = false, 
  onTogglePassword = () => {},
  onLogin,
  onLogout,
  authenticated = false
}) => {
  const loading = false;
  const router = useRouter();
  const { user, keycloak } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const isAuthenticated = authenticated || !!user || keycloak?.authenticated;

    if (isAuthenticated && !showSuccess) {
      setShowSuccess(true);
    }
  }, [authenticated, user, keycloak, showSuccess]);

  useEffect(() => {
    if (showSuccess && !isRedirecting) {
      const timer = setTimeout(() => {
        setIsRedirecting(true);
        router.push('/chat');
        
        setTimeout(() => {
          if (window.location.pathname !== '/chat') {
            window.location.href = '/chat';
          }
        }, 500);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [showSuccess, isRedirecting, router]);

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const successVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.3, ease: "easeIn" }
    }
  };

  if (isRedirecting) {
    return (
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 lg:p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 lg:p-12">
      <AnimatePresence mode="wait">
        {!showSuccess ? (
          <motion.div
            key="login-form"
            className="w-full max-w-[420px]"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeUpVariants}
          >
            <FormHeader />
            <div className="space-y-6">
              {onLogin && (
                <motion.button
                  whileHover={{ scale: 1.005 }}
                  whileTap={{ scale: 0.995 }}
                  onClick={onLogin}
                  className="w-full bg-[#0f172a] text-white font-semibold py-3.5 rounded-lg hover:bg-black transition-colors shadow-lg shadow-gray-900/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                >
                  Log In with Keycloak
                </motion.button>
              )}
              
              {!onLogin && (
                <>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                  <motion.button
                    whileHover={!loading ? { scale: 1.005 } : {}}
                    whileTap={!loading ? { scale: 0.995 } : {}}
                    disabled={loading}
                    onClick={() => keycloak?.login()}
                    className="w-full bg-[#0f172a] text-white font-semibold py-3.5 rounded-lg hover:bg-black disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors shadow-lg shadow-gray-900/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                  >
                    {loading ? 'Loading...' : 'Log In'}
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success-state"
            className="w-full max-w-[420px] text-center"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={successVariants}
          >
            <div className="mb-6">
              <motion.div
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3, ease: "easeOut" }}
              >
                <motion.svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.4, duration: 0.3, ease: "easeOut" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </motion.svg>
              </motion.div>
              <motion.h2
                className="text-2xl font-bold text-gray-800 mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                Login Successful!
              </motion.h2>
              <motion.p
                className="text-gray-600 mb-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                Welcome{user?.name ?`, ${user.name}` : ''}!
              </motion.p>
              <motion.p
                className="text-sm text-gray-500"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                Redirecting to your chat...
              </motion.p>
            </div>
            <motion.div
              className="w-full bg-gray-200 rounded-full h-2 overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.6, duration: 0.9, ease: "easeOut" }}
            >
              <motion.div
                className="h-full bg-blue-600 rounded-full"
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ delay: 0.6, duration: 0.9, ease: "easeOut" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginForm;