import React from 'react';
import { motion } from 'framer-motion';
import { CONFIG } from '../config/config';
import { Card } from './ui/Card';

/**
 * Premium Speakers Directory Component.
 */
export function SpeakerSection() {
  // Helper to extract initials for placeholder avatars
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 select-none">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h3 className="text-xs uppercase font-heading font-extrabold text-primary-blue tracking-widest pl-1 mb-3">
          Keynote Leaders
        </h3>
        <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
          Learn From Industry Experts
        </h2>
        <div className="h-1 w-12 bg-linear-to-r from-primary-blue to-indigo-500 rounded-full mx-auto mt-4" />
      </div>

      {/* Speaker Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
        {CONFIG.speakers.map((speaker, index) => (
          <Card 
            key={index} 
            hoverEffect={true} 
            delay={0.1 * index}
            className="flex flex-col text-left h-full border border-gray-800/40 relative overflow-hidden"
          >
            {/* Soft accent top line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary-blue to-indigo-500" />
            
            {/* Header: Avatar, Name, Company details */}
            <div className="flex items-center gap-4 mb-5">
              {speaker.avatar ? (
                <img
                  src={speaker.avatar}
                  alt={speaker.name}
                  className="w-14 h-14 rounded-xl object-cover border border-gray-800 shadow-sm"
                />
              ) : (
                // Fallback initial avatar with custom gradient
                <div className={`w-14 h-14 rounded-xl bg-linear-to-tr flex items-center justify-center font-heading text-sm font-extrabold text-white shadow-sm border border-white/20
                  ${index === 0 ? 'from-blue-500 to-indigo-600' : ''}
                  ${index === 1 ? 'from-purple-500 to-indigo-600' : ''}
                  ${index === 2 ? 'from-sky-500 to-blue-600' : ''}
                `}>
                  {getInitials(speaker.name)}
                </div>
              )}

              <div>
                <h4 className="font-heading font-extrabold text-base text-white leading-tight">
                  {speaker.name}
                </h4>
                <p className="text-xs text-primary-blue font-bold tracking-wide mt-0.5">
                  {speaker.designation}
                </p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                  {speaker.company}
                </p>
              </div>
            </div>

            {/* Body: Description */}
            <p className="text-xs sm:text-sm font-sans font-medium text-gray-400 leading-relaxed mt-1 flex-grow">
              {speaker.description}
            </p>

            {/* Hover visual helper */}
            <div className="mt-5 pt-4 border-t border-gray-800/40 flex items-center justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              <span>View Profile</span>
              <span className="text-primary-blue group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
