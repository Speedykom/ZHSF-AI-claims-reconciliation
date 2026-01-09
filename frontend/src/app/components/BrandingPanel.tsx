import React from 'react';
import { motion } from 'framer-motion';

const BrandingPanel = () => {
  const simpleFadeVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <motion.div
      className="hidden lg:flex w-1/2 bg-black flex-col justify-center px-16 xl:px-24 relative overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={simpleFadeVariants}
    >
      <div className="z-10 relative">
        <h1 className="text-white text-6xl font-extrabold tracking-tighter mb-6">
          ZANZIBAR HEALTH SERVICES FUND
        </h1>
        <p className="text-gray-400 text-lg xl:text-xl font-light tracking-wide">
          Qualilty Health For All
        </p>
      </div>
    </motion.div>
  );
};

export default BrandingPanel;
