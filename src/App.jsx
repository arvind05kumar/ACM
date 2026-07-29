import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CONFIG } from './config/config';
import { LoadingScreen } from './components/LoadingScreen';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { EventCard } from './components/EventCard';

import { InstagramGate } from './components/InstagramGate';
import { AttendanceForm } from './components/AttendanceForm';
import { SuccessScreen } from './components/SuccessScreen';

import './App.css';

/**
 * Main Application Layout & State Controller.
 */
function App() {
  // Application states: 'LOADING' | 'LANDING' | 'GATE' | 'FORM' | 'SUCCESS'
  const [appState, setAppState] = useState('LOADING');
  const [submittedData, setSubmittedData] = useState(null);

  // Transition layout configurations for sub-pages
  const pageTransition = {
    initial: { opacity: 0, y: 15 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    },
    exit: { 
      opacity: 0, 
      y: -15,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-blue-100 selection:text-primary-blue">
      {/* 1. Backdrop Grid and Radial Spots */}
      <div className="bg-grid-pattern" />
      <div className="bg-radial-glow" />

      {/* 2. Loading Phase Pre-loader */}
      <AnimatePresence mode="wait">
        {appState === 'LOADING' && (
          <LoadingScreen key="loader" onFinished={() => setAppState('LANDING')} />
        )}
      </AnimatePresence>

      {/* 3. Primary Application Header (Rendered after pre-loader finishes) */}
      {appState !== 'LOADING' && <Header />}

      {/* 4. Screen Router Area */}
      {appState !== 'LOADING' && (
        <main className="flex-grow w-full max-w-7xl mx-auto py-8">
          <AnimatePresence mode="wait">
            
            {/* Screen 1: Home Landing Page */}
            {appState === 'LANDING' && (
              <motion.div
                key="landing"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageTransition}
                className="space-y-6"
              >
                <Hero onEnterPortal={() => setAppState('GATE')} />
                <EventCard />
              </motion.div>
            )}

            {/* Screen 2: Instagram Verification Gate */}
            {appState === 'GATE' && (
              <motion.div
                key="gate"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageTransition}
              >
                <InstagramGate onGateSuccess={() => setAppState('FORM')} />
              </motion.div>
            )}

            {/* Screen 3: Registration/Attendance Form */}
            {appState === 'FORM' && (
              <motion.div
                key="form"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageTransition}
              >
                <AttendanceForm 
                  onFormSuccess={(data) => {
                    setSubmittedData(data);
                    setAppState('SUCCESS');
                  }} 
                />
              </motion.div>
            )}

            {/* Screen 4: Registration Success Badge */}
            {appState === 'SUCCESS' && (
              <motion.div
                key="success"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageTransition}
              >
                <SuccessScreen submittedData={submittedData} />
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      )}

      {/* 5. Primary Application Footer */}
      {appState !== 'LOADING' && <Footer />}
    </div>
  );
}

export default App;
