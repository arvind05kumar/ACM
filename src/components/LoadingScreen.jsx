import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CONFIG } from '../config/config';

/**
 * Premium Loading Screen with dynamic progress percentage and micro-animations.
 */
export function LoadingScreen({ onFinished }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing ACM Portal...');

  useEffect(() => {
    // Dynamic progress tick for high-end SaaS feel
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        
        // Progress speed increases/slows dynamically
        const diff = Math.floor(Math.random() * 15) + 5;
        const next = Math.min(oldProgress + diff, 100);
        
        // Update helper statuses based on percentage
        if (next < 30) {
          setStatusText('Resolving secure handshakes...');
        } else if (next < 65) {
          setStatusText('Loading Google Sheets metadata...');
        } else if (next < 90) {
          setStatusText('Assembling layout modules...');
        } else {
          setStatusText('Ready to load.');
        }

        return next;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  // When progress hits 100%, hold briefly and fade out
  useEffect(() => {
    if (progress === 100) {
      const delayTimer = setTimeout(() => {
        onFinished();
      }, 500);
      return () => clearTimeout(delayTimer);
    }
  }, [progress, onFinished]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        y: -30,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
      }}
      className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-gray-950/95 backdrop-blur-md px-6 select-none"
    >
      {/* Background radial effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[120px] top-1/4 left-1/4" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[120px] bottom-1/4 right-1/4" />

      <div className="relative flex flex-col items-center justify-center">
        {/* Transparent ACM logo container inside a circle */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center rounded-full bg-gray-950/80 border border-gray-800 shadow-2xl p-6 z-10"
        >
          <img src="/acm_logo.png" alt="ACM Logo" className="w-28 h-28 sm:w-32 sm:h-32 object-contain" />
        </motion.div>

        {/* Circular loading tracer */}
        <svg className="absolute w-52 h-52 sm:w-60 sm:h-60 -rotate-90 z-0" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.03)"
            strokeWidth="2"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="46"
            fill="transparent"
            stroke="url(#loader-grad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="289"
            animate={{ strokeDashoffset: 289 - (289 * progress) / 100 }}
            transition={{ ease: "linear", duration: 0.15 }}
          />
          <defs>
            <linearGradient id="loader-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </motion.div>
  );
}
