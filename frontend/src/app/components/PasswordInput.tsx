import React from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

interface PasswordInputProps {
  showPassword: boolean;
  onToggle: () => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ showPassword, onToggle }) => {
  return (
    <div className="space-y-2">
      <label htmlFor="password" className="block text-sm font-medium text-gray-900">
        Password
      </label>
      <div className="relative group">
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          placeholder="Enter your password"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
        >
          {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
