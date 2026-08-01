import React from 'react';
import { motion } from 'framer-motion';
import { Check, Calendar, ArrowRight, ShieldCheck, Download, Award } from 'lucide-react';
import { CONFIG } from '../config/config';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

/**
 * Premium Success Confirmation Page with digital ticket/badge receipt.
 */
export function SuccessScreen({ submittedData }) {
  // Use submitted data or fallback to defaults
  const studentName = submittedData?.fullName || "Student Name";
  const rollNumber = submittedData?.rollNumber || "Roll Number";
  const timestamp = submittedData?.timestamp || new Date().toLocaleString();

  // Tick drawing transition parameters
  const drawTick = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay: 0.2, type: "spring", duration: 0.8, bounce: 0 },
        opacity: { delay: 0.2, duration: 0.2 }
      }
    }
  };

  // Client-side Canvas dynamic certificate builder
  const handleDownloadCertificate = () => {
    // Wait for the signature font to be fully loaded in the browser context
    document.fonts.ready.then(() => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = '/certificate_template.png';
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw certificate background layout
        ctx.drawImage(img, 0, 0);
        
        // Dynamic font sizing to prevent long names from overflowing
        let fontSize = 54;
        if (studentName.length > 15) {
          fontSize = Math.max(36, 54 - (studentName.length - 15) * 1.2);
        }
        
        // Configure typography: Use Playfair Display italic font for a formal, premium certificate tone
        ctx.font = `italic 500 ${fontSize}px "Playfair Display", Georgia, serif`;
        ctx.fillStyle = '#470700'; // Match the exact maroon theme color of the title
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        
        // Exact name coordinates (centered horizontally on the template line at X=584, slightly above the line Y=386)
        const x = 584;
        const y = 378;
        
        ctx.fillText(studentName, x, y);
        
        // Create downlaod trigger
        const link = document.createElement('a');
        link.download = `Certificate_${studentName.replace(/\s+/g, '_')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      };

      img.onerror = () => {
        alert("Certificate template not found. Please verify public/certificate_template.png exists.");
      };
    });
  };

  return (
    <section className="max-w-2xl mx-auto px-4 py-8 select-none flex flex-col items-center">
      
      {/* Animated Circular Check Mark */}
      <div className="mb-6 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="h-20 w-20 rounded-full bg-emerald-950/20 border border-emerald-900/50 flex items-center justify-center shadow-lg shadow-emerald-500/10"
        >
          <svg
            className="w-10 h-10 text-emerald-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.path
              variants={drawTick}
              initial="hidden"
              animate="visible"
              d="M20 6L9 17L4 12"
            />
          </svg>
        </motion.div>
      </div>

      {/* Primary Success Headers */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center max-w-md mx-auto mb-8"
      >
        <h2 className="text-3xl font-heading font-extrabold text-white tracking-tight">
          Attendance Confirmed
        </h2>
        <p className="text-sm font-sans font-medium text-gray-400 mt-2">
          Your attendance record has been verified and registered inside the official event sheet.
        </p>
      </motion.div>

      {/* Ticket Pass Receipt */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
        className="w-full max-w-sm"
      >
        <Card hoverEffect={true} className="border border-gray-800/40 shadow-3xl relative overflow-hidden p-0! rounded-2xl">
          {/* Top header block */}
          <div className="bg-linear-to-r from-primary-blue to-indigo-600 px-6 py-5 text-left text-white relative">
            {/* Vector watermark */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-15">
              <Award className="h-20 w-20 text-white" />
            </div>
            
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/20 border border-white/10 text-[9px] font-heading font-extrabold uppercase tracking-widest text-white mb-2">
              Verified Entry Pass
            </div>
            <h4 className="font-heading font-extrabold text-lg tracking-tight leading-tight">
              {CONFIG.eventName}
            </h4>
            <p className="text-[10px] text-blue-100 font-bold uppercase tracking-wider mt-0.5">
              {CONFIG.collegeName}
            </p>
          </div>

          {/* Ticket metadata fields */}
          <div className="p-6 space-y-4 text-left bg-slate-900/40">
            {/* Student Name */}
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Attendee</p>
              <p className="text-sm font-extrabold text-gray-100 mt-0.5">{studentName}</p>
            </div>

            {/* University Roll Number */}
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Roll Number</p>
              <p className="text-sm font-extrabold text-gray-100 mt-0.5">{rollNumber}</p>
            </div>

            {/* Verification Timestamp */}
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Check-in timestamp</p>
              <p className="text-xs font-mono font-bold text-gray-200 mt-0.5">{timestamp}</p>
            </div>
          </div>

          {/* Ticket Dashed divider */}
          <div className="relative h-px bg-dashed bg-gray-800 w-full">
            <div className="absolute -left-3 -top-2 w-4 h-4 bg-[#030712] border-r border-gray-800/50 rounded-full" />
            <div className="absolute -right-3 -top-2 w-4 h-4 bg-[#030712] border-l border-gray-800/50 rounded-full" />
          </div>

          {/* Ticket footer block */}
          <div className="px-6 py-4 bg-gray-950/40 border-t border-gray-800/30 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span className="text-[10px] uppercase font-heading font-extrabold tracking-widest">
                Database Synced
              </span>
            </div>
            
            <div className="text-[10px] text-gray-400 font-sans font-semibold uppercase tracking-wider">
              Verified Attendee
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Massive Download Certificate Button */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
        className="w-full max-w-sm mt-8"
      >
        <Button
          onClick={handleDownloadCertificate}
          variant="primary"
          iconRight={Download}
          className="w-full py-4 text-sm uppercase tracking-widest font-extrabold rounded-xl shadow-lg shadow-blue-500/25 cursor-pointer hover:shadow-xl hover:shadow-blue-500/35 transition-all duration-300"
        >
          Download Certificate
        </Button>
      </motion.div>

      {/* Directives for next steps */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 text-center"
      >
        <p className="text-xs font-sans font-medium text-gray-400 select-none">
          Thank you for joining. You can now download your digital attendance certificate.
        </p>
      </motion.div>
    </section>
  );
}
