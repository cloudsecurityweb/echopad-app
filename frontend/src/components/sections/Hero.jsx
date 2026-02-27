import { useEffect, useState } from 'react';
import FullScreenSection from '../layout/FullScreenSection';

function Hero() {
  const [isHipaaModalOpen, setIsHipaaModalOpen] = useState(false);

  useEffect(() => {
    if (!isHipaaModalOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsHipaaModalOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isHipaaModalOpen]);

  const handleExploreProductsClick = (e) => {
    e.preventDefault();
    const headerOffset = 80;
    const element = document.querySelector('#agents');
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <FullScreenSection id="hero" className="bg-gradient-to-b from-blue-50 via-white to-purple-50 min-h-[100vh] flex flex-col justify-center">
      <div className="container mx-auto px-4 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto relative z-10">
          {/* Top badges: outcomes-first, no jargon */}
          <div className="flex flex-wrap justify-center items-center gap-2 mb-4 animate-fade-in-scale mt-8">
            <div className="relative inline-flex">
              <span className="absolute inset-0 rounded-full border border-emerald-300/80 animate-ping pointer-events-none"></span>
              <button
                type="button"
                className="relative inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-full text-sm font-semibold hover:bg-emerald-100 transition-colors shadow-sm"
                aria-label="HIPAA Compliant"
                onClick={() => setIsHipaaModalOpen(true)}
              >
                <i className="bi bi-shield-fill-check text-emerald-600"></i>
                <span>HIPAA Compliant</span>
              </button>
            </div>
          </div>

          {/* Main Heading — physician pain point: time and paperwork */}
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-cyan-700 mb-2 animate-fade-in-scale animation-delay-100">
            Spend less time charting and more time with patients
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight animate-fade-in-scale animation-delay-100">
            <span className="text-gray-900">One AI Platform for </span>
            <span className="animate-gradient-text">Your Entire Medical Practice.</span>
          </h1>

          {/* Subtitle — plain language, trust signals: EHR, HIPAA, setup speed */}
          <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-2xl mx-auto animate-fade-in-scale animation-delay-200">
            Charting, phones, scheduling, reminders, and admin in one place. Works with your existing EHR-no rip-and-replace. HIPAA compliant with BAA included. Most practices go live in about 30 days with guided onboarding.
          </p>

          {/* Feature pills — what you get, not how it works */}
          <div className="flex flex-wrap justify-center gap-2 mb-6 animate-fade-in-scale animation-delay-300">
            <div className="flex items-center gap-2 glass-card px-3 py-2 rounded-xl hover-scale group shadow-sm">
              <i className="bi bi-mic-fill text-cyan-500 group-hover:scale-110 transition-transform"></i>
              <span className="text-gray-800 font-medium text-sm">Clinical Documentation</span>
            </div>
            <div className="flex items-center gap-2 glass-card px-3 py-2 rounded-xl hover-scale group shadow-sm">
              <i className="bi bi-headset text-purple-500 group-hover:scale-110 transition-transform"></i>
              <span className="text-gray-800 font-medium text-sm">24/7 Scheduling</span>
            </div>
            <div className="flex items-center gap-2 glass-card px-3 py-2 rounded-xl hover-scale group shadow-sm">
              <i className="bi bi-bell text-pink-500 group-hover:scale-110 transition-transform"></i>
              <span className="text-gray-800 font-medium text-sm">Patient Reminders</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6 animate-fade-in-scale animation-delay-400">
            <a
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-full hover:from-cyan-400 hover:to-blue-500 transition-all font-semibold text-sm shadow-lg hover:scale-105"
            >
              <i className="bi bi-rocket-takeoff"></i>
              Get Started
            </a>
            <a
              href="/"
              onClick={handleExploreProductsClick}
              className="inline-flex items-center justify-center gap-2 glass-card border-2 border-cyan-500/50 text-gray-800 px-6 py-3 rounded-full hover:bg-cyan-50/50 hover:border-cyan-500 transition-all font-semibold text-sm hover:scale-105 shadow-sm"
            >
              <i className="bi bi-grid-3x3-gap"></i>
              Explore products
            </a>
          </div>

          {/* Trusted by — social proof above the fold */}
          
        </div>
      </div>

      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="floating-element element-1"></div>
        <div className="floating-element element-2"></div>
        <div className="floating-element element-3"></div>
      </div>

      {isHipaaModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/55 backdrop-blur-sm flex items-center justify-center p-3 sm:px-4"
          onClick={() => setIsHipaaModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="hipaa-modal-title"
        >
          <div
            className="w-full max-w-2xl max-h-[88vh] overflow-y-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 p-4 sm:p-6 md:p-8 animate-fade-in-scale"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  Compliance Overview
                </div>
                <h3 id="hipaa-modal-title" className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                  HIPAA Compliant by Design
                </h3>
              </div>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full w-9 h-9 inline-flex items-center justify-center transition-colors"
                onClick={() => setIsHipaaModalOpen(false)}
                aria-label="Close HIPAA details"
              >
                <i className="bi bi-x-lg text-lg"></i>
              </button>
            </div>

            <p className="text-sm sm:text-base text-gray-700 mb-5 leading-relaxed">
              Echopad is built for healthcare teams that need strong privacy controls from day one. You can adopt AI confidently while protecting PHI and maintaining auditability.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                <div className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center mb-2">
                  <i className="bi bi-file-earmark-check text-emerald-600"></i>
                </div>
                <div className="font-semibold text-gray-900 text-sm">BAA Support</div>
                <p className="text-xs text-gray-600 mt-1">Contract support for covered entities and business associates.</p>
              </div>
              <div className="rounded-2xl border border-cyan-100 bg-cyan-50/60 p-4">
                <div className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center mb-2">
                  <i className="bi bi-lock-fill text-cyan-600"></i>
                </div>
                <div className="font-semibold text-gray-900 text-sm">Encryption</div>
                <p className="text-xs text-gray-600 mt-1">Data protected in transit and at rest with modern controls.</p>
              </div>
              <div className="rounded-2xl border border-violet-100 bg-violet-50/60 p-4">
                <div className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center mb-2">
                  <i className="bi bi-clipboard2-data-fill text-violet-600"></i>
                </div>
                <div className="font-semibold text-gray-900 text-sm">Audit Trail</div>
                <p className="text-xs text-gray-600 mt-1">Access and activity logging for accountability and review.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">PHI-safe workflows</span>
              <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">Role-based access</span>
              <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">Security best practices</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <button
                type="button"
                className="inline-flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-2.5 rounded-full font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all w-full sm:w-auto"
                onClick={() => setIsHipaaModalOpen(false)}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </FullScreenSection>
  );
}

export default Hero;
