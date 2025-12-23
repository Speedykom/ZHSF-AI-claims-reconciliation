import React from 'react';
import { motion } from 'framer-motion';
import FormHeader from './FormHeader';
import EmailInput from './EmailInput';
import PasswordInput from './PasswordInput';
import LoginButton from './LoginButton';

interface LoginFormProps {
  showPassword: boolean;
  onTogglePassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ showPassword, onTogglePassword }) => {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 lg:p-12">
      <motion.div
        className="w-full max-w-[420px]"
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
      >
        <FormHeader />
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <EmailInput />
          <PasswordInput showPassword={showPassword} onToggle={onTogglePassword} />
          <LoginButton />
        </form>
      </motion.div>
    </div>
  );
};

export default LoginForm;
