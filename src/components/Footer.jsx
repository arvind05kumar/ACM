import React from 'react';
import { CONFIG } from '../config/config';

/**
 * Minimal Premium Footer Component.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-8 border-t border-gray-800/30 bg-gray-950/20 backdrop-blur-xs select-none">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Section: Organization Copyright */}
        <div className="text-xs font-sans text-gray-500 font-medium tracking-wide text-center md:text-left">
          &copy; {currentYear} <span className="font-semibold text-gray-400">{CONFIG.organizerName}</span>, CEC, CGC Landran. All rights reserved.
        </div>

        {/* Right Section: Brand tags */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-heading font-semibold text-gray-500 tracking-wider">
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-gray-400 font-sans font-normal uppercase">Organized by</span>
            <span className="text-gray-300 hover:text-primary-blue transition-colors cursor-default">ACM CEC</span>
          </div>
          
          <span className="text-gray-700">|</span>
          
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-gray-400 font-sans font-normal uppercase">Powered by</span>
            <a 
              href={CONFIG.poweredByUrl || "https://visionforgelabs.in/"} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-300 hover:text-primary-blue transition-colors cursor-pointer"
            >
              {CONFIG.poweredByName}
            </a>
          </div>

          <span className="text-gray-700">|</span>

          <div className="flex items-center gap-1">
            <span className="text-[10px] text-gray-400 font-sans font-normal uppercase">Designed by</span>
            <a 
              href={CONFIG.poweredByUrl || "https://visionforgelabs.in/"} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-300 hover:text-primary-blue transition-colors cursor-pointer"
            >
              {CONFIG.poweredByName}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
