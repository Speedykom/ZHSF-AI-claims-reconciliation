"use client";

import React, { useState } from 'react';
import BrandingPanel from './components/BrandingPanel';
import LoginForm from './components/LoginForm';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen w-full font-sans">
      <BrandingPanel />
      <LoginForm showPassword={showPassword} onTogglePassword={() => setShowPassword(!showPassword)} />
    </div>
  );
};

export default LoginPage;
