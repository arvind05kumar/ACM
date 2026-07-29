import React from 'react';
import { motion } from 'framer-motion';

/**
 * Premium Glassmorphic Card component with optional hover animations.
 */
export function Card({
  children,
  className = '',
  hoverEffect = true,
  delay = 0,
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        ease: [0.16, 1, 0.3, 1],
        delay: delay
      }}
      className={`glass-card rounded-2xl p-6 md:p-8 ${hoverEffect ? 'glass-card-hover' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
