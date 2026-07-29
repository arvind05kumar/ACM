import React from 'react';
import { CONFIG } from '../config/config';

/**
 * Sticky Glassmorphic Header Component with placeholder logos.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full glass-navbar border-b border-gray-200/40 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Left: Logo 1 */}
        <div className="flex items-center shrink-0">
          {CONFIG.logo1 ? (
            <img src={CONFIG.logo1} alt="Logo 1" className="h-11 sm:h-13 w-auto object-contain" />
          ) : (
            <div className="flex h-8 sm:h-9 px-3 items-center justify-center rounded-md border border-gray-800 bg-gray-950/60 font-mono text-[10px] font-bold text-gray-400 tracking-wider">
              Logo 1
            </div>
          )}
        </div>

        {/* Center: Logo 2 */}
        <div className="flex items-center justify-center">
          {CONFIG.logo2 ? (
            <img src={CONFIG.logo2} alt="Logo 2" className="h-14 sm:h-16 w-auto object-contain" />
          ) : (
            <div className="flex h-8 sm:h-9 px-3 items-center justify-center rounded-md border border-gray-800 bg-gray-950/60 font-mono text-[10px] font-bold text-gray-400 tracking-wider">
              Logo 2
            </div>
          )}
        </div>

        {/* Right: Logo 3 */}
        <div className="flex items-center shrink-0">
          {CONFIG.logo3 ? (
            <img src={CONFIG.logo3} alt="Logo 3" className="h-11 sm:h-13 w-auto object-contain" />
          ) : (
            <div className="flex h-8 sm:h-9 px-3 items-center justify-center rounded-md border border-gray-800 bg-gray-950/60 font-mono text-[10px] font-bold text-gray-400 tracking-wider">
              Logo 3
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
