import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

/**
 * Premium Glassmorphic Toast Notification.
 */
export function Toast({
  message,
  type = 'info', // 'success' | 'error' | 'info'
  isVisible,
  onClose,
  duration = 4000
}) {
  useEffect(() => {
    if (isVisible && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />,
    info: <Info className="h-5 w-5 text-primary-blue shrink-0" />
  };

  const colors = {
    success: "border-emerald-200/50 bg-emerald-50/90 text-emerald-950 shadow-emerald-500/5",
    error: "border-red-200/50 bg-red-50/90 text-red-950 shadow-red-500/5",
    info: "border-blue-200/50 bg-blue-50/90 text-blue-950 shadow-blue-500/5"
  };

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none w-full max-w-sm px-4">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl border backdrop-blur-md shadow-lg ${colors[type]}`}
            role="alert"
          >
            <div className="flex items-center gap-3">
              {icons[type]}
              <span className="text-sm font-sans font-medium tracking-wide leading-relaxed">
                {message}
              </span>
            </div>
            
            <button
              onClick={onClose}
              className="p-1 hover:bg-black/5 rounded-lg transition-colors cursor-pointer text-gray-500 hover:text-gray-800"
              aria-label="Close notification"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
