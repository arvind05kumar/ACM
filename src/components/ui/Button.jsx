import React from 'react';
import { motion } from 'framer-motion';

/**
 * Premium Button Component with smooth micro-animations.
 */
export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'accent' | 'outline' | 'danger'
  disabled = false,
  isLoading = false,
  className = '',
  iconLeft: IconLeft,
  iconRight: IconRight,
  ...props
}) {
  // Styles based on premium design requirements
  const baseStyles = "relative inline-flex items-center justify-center font-heading font-semibold text-sm transition-all duration-300 rounded-full select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 tracking-wide shadow-xs";
  
  const variants = {
    primary: "bg-linear-to-r from-primary-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md shadow-blue-500/10 active:scale-98",
    secondary: "bg-gray-900/60 hover:bg-gray-900 text-gray-200 border border-gray-800/80 backdrop-blur-md active:scale-98 shadow-sm",
    accent: "bg-white hover:bg-gray-100 text-gray-950 active:scale-98 shadow-sm",
    outline: "bg-transparent border border-gray-800 hover:border-gray-600 text-gray-300 hover:text-white active:scale-98",
    danger: "bg-red-600 hover:bg-red-700 text-white active:scale-98"
  };

  const buttonVariant = variants[variant] || variants.primary;

  return (
    <motion.button
      whileHover={disabled || isLoading ? {} : { scale: 1.02, y: -1 }}
      whileTap={disabled || isLoading ? {} : { scale: 0.98, y: 0 }}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${buttonVariant} ${className}`}
      {...props}
    >
      {/* Loading Spinner */}
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}

      {/* Left Icon */}
      {!isLoading && IconLeft && <IconLeft className="mr-2 h-4 w-4 shrink-0" />}

      {/* Button Content */}
      <span className="relative z-10">{children}</span>

      {/* Right Icon */}
      {!isLoading && IconRight && <IconRight className="ml-2 h-4 w-4 shrink-0" />}
    </motion.button>
  );
}
