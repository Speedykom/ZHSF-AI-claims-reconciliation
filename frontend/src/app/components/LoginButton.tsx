import React from 'react';
import { motion } from 'framer-motion';

const LoginButton = () => {
  return (
    <div className="pt-2">
      <motion.button
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
        className="w-full bg-[#0f172a] text-white font-semibold py-3.5 rounded-lg hover:bg-black transition-colors shadow-lg shadow-gray-900/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
      >
        Log In
      </motion.button>
    </div>
  );
};

export default LoginButton;
