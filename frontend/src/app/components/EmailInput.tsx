import React from 'react';
import { FiMail } from 'react-icons/fi';

const EmailInput = () => {
  return (
    <div className="space-y-2">
      <label htmlFor="email" className="block text-sm font-medium text-gray-900">
        Email Address
      </label>
      <div className="relative group">
        <input
          type="email"
          id="email"
          placeholder="name@company.com"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400 group-focus-within:text-gray-900 transition-colors">
          <FiMail size={18} />
        </div>
      </div>
    </div>
  );
};

export default EmailInput;
