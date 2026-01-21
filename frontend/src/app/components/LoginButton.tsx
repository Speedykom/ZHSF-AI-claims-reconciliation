import React from 'react';
import { motion } from 'framer-motion';

interface LoginButtonProps {
  loading: boolean;
  onClick: () => void;
}

const LoginButton: React.FC<LoginButtonProps> = ({ loading, onClick }) => {
  return (
    <div className="pt-2">
      <motion.button
        whileHover={!loading ? { scale: 1.005 } : {}}
        whileTap={!loading ? { scale: 0.995 } : {}}
        disabled={loading}
        onClick={onClick}
        className="w-full bg-[#0f172a] text-white font-semibold py-3.5 rounded-lg hover:bg-black disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors shadow-lg shadow-gray-900/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
      >
        {loading ? 'Loading...' : 'Log In'}
      </motion.button>
    </div>
  );
};

export default LoginButton;
