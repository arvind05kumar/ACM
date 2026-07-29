import React from 'react';
import { Calendar, Clock, MapPin, Award, CheckCircle, ShieldAlert } from 'lucide-react';
import { CONFIG } from '../config/config';
import { Card } from './ui/Card';

/**
 * Premium Event Details Dashboard Card.
 */
export function EventCard() {
  const speakerCount = CONFIG.speakers.length;

  return (
    <div className="max-w-4xl mx-auto px-4 mb-12 select-none">
      <Card hoverEffect={true} delay={0.2} className="relative overflow-hidden">
        {/* Glow corner accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-blue-500/10 to-transparent pointer-events-none rounded-tr-2xl" />
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left section: Event Header and Branding details */}
          <div className="md:col-span-7 space-y-4 text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-950/30 border border-blue-900/40 text-[10px] font-heading font-extrabold uppercase text-primary-blue tracking-wider">
              Official ACM Portal
            </div>
            
            <h3 className="text-2xl md:text-3xl font-heading font-extrabold text-white tracking-tight">
              {CONFIG.eventName}
            </h3>
            
            <p className="text-sm font-sans font-medium text-gray-400 leading-relaxed">
              Welcome to the check-in portal. Verify attendance below to receive official credentials, certificates, and access event resources.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-gray-400 font-sans">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Live Attendance Active
              </span>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1">
                <Award className="h-3.5 w-3.5 text-indigo-400" />
                Certificate Eligible
              </span>
            </div>
          </div>

          {/* Right section: Quick Grid specs */}
          <div className="md:col-span-5 border-t md:border-t-0 md:border-l border-gray-800/40 pt-6 md:pt-0 md:pl-8 space-y-4 text-left">
            <h4 className="text-xs font-heading font-semibold text-gray-500 uppercase tracking-widest pl-1 mb-2">
              Event Blueprint
            </h4>

            <div className="space-y-3.5">
              {/* Organizer Detail */}
              <div className="flex items-start gap-2.5">
                <Award className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-500 leading-none">Organizer</p>
                  <p className="text-xs font-bold text-gray-200 mt-0.5">{CONFIG.organizerName}</p>
                </div>
              </div>

              {/* Speaker Count Detail */}
              <div className="flex items-start gap-2.5">
                <Calendar className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-500 leading-none">Keynote Speakers</p>
                  <p className="text-xs font-bold text-gray-200 mt-0.5">{speakerCount} Experts</p>
                </div>
              </div>

              {/* Powered By Detail */}
              <div className="flex items-start gap-2.5">
                <Clock className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-500 leading-none">Platform Integrator</p>
                  <p className="text-xs font-bold text-gray-200 mt-0.5">{CONFIG.poweredByName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
