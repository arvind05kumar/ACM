import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { CONFIG } from '../config/config';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

// Custom inline Instagram SVG component (Lucide deprecated brand icons in v0.400+)
function Instagram(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

/**
 * Premium Instagram Follow Gate to verify two profiles before granting form access.
 */
export function InstagramGate({ onGateSuccess }) {
  const [step, setStep] = useState(1); // 1 = Card 1 Active, 2 = Card 2 Active, 3 = Completed

  // Card 1 state
  const [visited1, setVisited1] = useState(false);
  const [countdown1, setCountdown1] = useState(0);

  // Card 2 state
  const [visited2, setVisited2] = useState(false);
  const [countdown2, setCountdown2] = useState(0);

  // References for intervals
  const timerRef = useRef(null);

  // Clean timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Handle click for Page 1 (Vision Forge first)
  const handleVisitPage1 = () => {
    if (visited1) return;

    // Open in new tab
    window.open(CONFIG.instagramPage2.url, '_blank', 'noopener,noreferrer');

    setVisited1(true);
    const duration = CONFIG.instagramPage2.countdownSeconds || 8;
    setCountdown1(duration);

    timerRef.current = setInterval(() => {
      setCountdown1((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setStep(2); // Enable step 2 once first countdown is done
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle click for Page 2 (ACM second)
  const handleVisitPage2 = () => {
    if (visited2 || step < 2) return;

    window.open(CONFIG.instagramPage1.url, '_blank', 'noopener,noreferrer');

    setVisited2(true);
    const duration = CONFIG.instagramPage1.countdownSeconds || 8;
    setCountdown2(duration);

    timerRef.current = setInterval(() => {
      setCountdown2((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setStep(3); // Gate complete!
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-8 select-none">
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/30 border border-blue-900/50 text-[10px] font-heading font-extrabold uppercase text-primary-blue tracking-widest mb-3">
          <ShieldCheck className="h-3.5 w-3.5" />
          Gateway Verification Required
        </div>
        <h2 className="text-3xl font-heading font-extrabold text-white tracking-tight">
          Verify Social Attendance
        </h2>
        <p className="text-sm font-sans font-medium text-gray-400 mt-2">
          Before marking attendance, you must visit both of our official Instagram portals and complete the short verification cycles.
        </p>
        {/* DO FOLLOW Banner */}
        <p className="text-sm font-sans font-extrabold text-blue-400 mt-4 uppercase tracking-wider animate-pulse">
          DO FOLLOW THESE PAGES TO PROCEED
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-8">

        {/* Card 1: Vision Forge */}
        <Card
          hoverEffect={step === 1 && !visited1}
          className={`relative border transition-all duration-500 overflow-hidden flex flex-col justify-between h-[280px]
            ${step === 1 ? 'border-primary-blue bg-slate-900/20' : 'border-gray-800/40 bg-gray-950/30 opacity-75'}
            ${visited1 && countdown1 === 0 ? 'border-emerald-900/30 bg-emerald-950/5' : ''}
          `}
        >
          {/* Card Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-linear-to-tr from-pink-500 via-red-500 to-yellow-500 p-0.5 shadow-sm">
                <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                  <img src="/vision_forge_logo.png" alt="Vision Forge" className="w-8 h-auto object-contain" />
                </div>
              </div>
              <div className="text-left">
                <h4 className="font-heading font-extrabold text-sm text-gray-200">
                  {CONFIG.poweredByName}
                </h4>
                <p className="text-xs text-gray-400 font-medium">
                  {CONFIG.instagramPage2.username}
                </p>
              </div>
            </div>

            <Instagram className="h-5 w-5 text-gray-505" />
          </div>

          {/* Social Stats */}
          <div className="grid grid-cols-2 gap-2 text-left py-4 my-2 border-y border-gray-800/50 bg-gray-950/30 rounded-lg px-2">
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold">Followers</p>
              <p className="text-xs font-bold text-gray-300">8.9K+</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold">Domain</p>
              <p className="text-xs font-bold text-gray-300">AI Innovation</p>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="w-full pt-1">
            {countdown1 > 0 ? (
              <div className="space-y-2">
                <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: CONFIG.instagramPage2.countdownSeconds }}
                    className="h-full bg-primary-blue rounded-full"
                  />
                </div>
                <button
                  disabled
                  className="w-full py-2.5 rounded-xl bg-blue-950/20 text-primary-blue border border-blue-900/50 text-xs font-heading font-bold flex items-center justify-center gap-2"
                >
                  <span className="animate-pulse">Verifying follow...</span>
                  <span className="font-mono bg-blue-950/80 px-2 py-0.5 rounded text-[11px] font-extrabold">{countdown1}s</span>
                </button>
              </div>
            ) : visited1 ? (
              <button
                disabled
                className="w-full py-2.5 rounded-xl bg-emerald-950/20 text-emerald-400 border border-emerald-900/50 text-xs font-heading font-bold flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ✓ Page Visited
              </button>
            ) : (
              <Button
                variant="primary"
                onClick={handleVisitPage1}
                disabled={step !== 1}
                className="w-full py-2.5 text-xs rounded-xl"
              >
                Visit profile to follow
              </Button>
            )}
          </div>
        </Card>

        {/* Card 2: ACM Student Chapter */}
        <Card
          hoverEffect={step === 2 && !visited2}
          className={`relative border transition-all duration-500 overflow-hidden flex flex-col justify-between h-[280px]
            ${step === 2 ? 'border-primary-blue bg-slate-900/20' : 'border-gray-800/40 bg-gray-950/30 opacity-75'}
            ${visited2 && countdown2 === 0 ? 'border-emerald-900/30 bg-emerald-950/5' : ''}
            ${step < 2 ? 'pointer-events-none' : ''}
          `}
        >
          {/* Card Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-linear-to-tr from-pink-500 via-red-500 to-yellow-500 p-0.5 shadow-sm">
                <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                  <img src="/acm_logo.png" alt="ACM CEC" className="w-8 h-auto object-contain" />
                </div>
              </div>
              <div className="text-left">
                <h4 className="font-heading font-extrabold text-sm text-gray-200">
                  {CONFIG.organizerName}
                </h4>
                <p className="text-xs text-gray-400 font-medium">
                  {CONFIG.instagramPage1.username}
                </p>
              </div>
            </div>

            <Instagram className="h-5 w-5 text-gray-505" />
          </div>

          {/* Social Stats */}
          <div className="grid grid-cols-2 gap-2 text-left py-4 my-2 border-y border-gray-800/50 bg-gray-950/30 rounded-lg px-2">
            <div>
              <p className="text-[10px] text-gray-505 uppercase font-bold">Followers</p>
              <p className="text-xs font-bold text-gray-303">12.4K+</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-505 uppercase font-bold">Domain</p>
              <p className="text-xs font-bold text-gray-303">Tech Chapter</p>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="w-full pt-1">
            {countdown2 > 0 ? (
              <div className="space-y-2">
                <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: CONFIG.instagramPage1.countdownSeconds }}
                    className="h-full bg-primary-blue rounded-full"
                  />
                </div>
                <button
                  disabled
                  className="w-full py-2.5 rounded-xl bg-blue-950/20 text-primary-blue border border-blue-900/50 text-xs font-heading font-bold flex items-center justify-center gap-2"
                >
                  <span className="animate-pulse">Verifying follow...</span>
                  <span className="font-mono bg-blue-950/80 px-2 py-0.5 rounded text-[11px] font-extrabold">{countdown2}s</span>
                </button>
              </div>
            ) : visited2 ? (
              <button
                disabled
                className="w-full py-2.5 rounded-xl bg-emerald-950/20 text-emerald-400 border border-emerald-900/50 text-xs font-heading font-bold flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ✓ Page Visited
              </button>
            ) : (
              <Button
                variant="primary"
                onClick={handleVisitPage2}
                disabled={step !== 2}
                className="w-full py-2.5 text-xs rounded-xl"
              >
                Visit profile to follow
              </Button>
            )}
          </div>
        </Card>
      </div>

      {/* Global verification status indicators */}
      <div className="max-w-md mx-auto text-center mt-8">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 mb-6 bg-gray-950/50 border border-gray-800/40 rounded-xl px-4 py-2">
          <AlertCircle className="h-4 w-4 text-primary-blue shrink-0" />
          <span>Complete both steps to open the check-in form.</span>
        </div>

        {/* Proceed Trigger */}
        <div>
          <Button
            variant={step === 3 ? 'accent' : 'secondary'}
            disabled={step !== 3}
            onClick={onGateSuccess}
            iconRight={ArrowRight}
            className={`w-full py-3.5 text-sm tracking-widest uppercase transition-all duration-300 font-extrabold rounded-xl
              ${step === 3 ? 'animate-pulse hover:shadow-lg hover:shadow-blue-500/10' : ''}`}
          >
            Continue to Attendance Form
          </Button>
        </div>
      </div>
    </section>
  );
}
