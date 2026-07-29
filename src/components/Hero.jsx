import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ChevronRight, Users } from 'lucide-react';
import { CONFIG } from '../config/config';
import { Button } from './ui/Button';

/**
 * Premium Hero Section with Apple/Linear-style typography and CTA buttons.
 */
export function Hero({ onEnterPortal }) {
  // Stagger children animations for standard premium entry
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="relative w-full py-16 md:py-28 overflow-hidden select-none">
      {/* Background radial spotlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse duration-[8000ms]" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto text-center px-4 sm:px-6 flex flex-col items-center"
      >
        {/* Organizer Badge */}
        <motion.div 
          variants={itemVariants}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-blue-900/30 bg-blue-950/20 backdrop-blur-xs text-xs font-heading font-semibold text-primary-blue tracking-wide mb-6"
        >
          <Users className="h-3.5 w-3.5" />
          <span>Organized by {CONFIG.organizerName}</span>
        </motion.div>

        {/* Huge Headline */}
        <motion.h1 
          variants={itemVariants}
          className="text-4xl sm:text-6xl md:text-7xl font-heading font-extrabold tracking-tight text-white leading-[1.05] mb-6"
        >
          {CONFIG.eventName.split(" ").map((word, idx) => (
            <span key={idx} className={idx === CONFIG.eventName.split(" ").length - 1 ? "bg-linear-to-r from-primary-blue to-blue-400 bg-clip-text text-transparent" : ""}>
              {word}{" "}
            </span>
          ))}
        </motion.h1>

        {/* Tagline */}
        <motion.p 
          variants={itemVariants}
          className="text-base sm:text-xl md:text-2xl text-gray-400 font-medium tracking-wide max-w-2xl leading-relaxed mb-10"
        >
          {CONFIG.eventTagline}
        </motion.p>

        {/* Meta Grid badges */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-3xl mb-12"
        >
          {/* Date */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-800/40 bg-gray-950/40 backdrop-blur-xs text-left">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-950/45 text-primary-blue">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Date</p>
              <p className="text-xs sm:text-sm font-semibold text-gray-100 leading-snug">{CONFIG.eventDate}</p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-800/40 bg-gray-950/40 backdrop-blur-xs text-left">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-950/45 text-indigo-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Time</p>
              <p className="text-xs sm:text-sm font-semibold text-gray-100 leading-snug">{CONFIG.eventTime}</p>
            </div>
          </div>

          {/* Venue */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-800/40 bg-gray-950/40 backdrop-blur-xs text-left">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-950/45 text-emerald-400">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Venue</p>
              <p className="text-xs sm:text-sm font-semibold text-gray-100 leading-snug truncate">{CONFIG.eventVenue}</p>
            </div>
          </div>
        </motion.div>

        {/* Call to action */}
        <motion.div variants={itemVariants}>
          <Button
            variant="primary"
            onClick={onEnterPortal}
            iconRight={ChevronRight}
            className="px-8 py-4 text-base shadow-lg shadow-blue-500/15"
          >
            Enter Attendance Portal
          </Button>
        </motion.div>

        {/* Small Brand/Footer info */}
        <motion.div 
          variants={itemVariants}
          className="mt-12 text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 select-none"
        >
          <span>Organized by {CONFIG.organizerName}</span>
          <span>•</span>
          <span>Powered by {CONFIG.poweredByName}</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
