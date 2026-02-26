import { useState, useEffect } from 'react';
import { handleIntercomAction } from '../../utils/intercom';

const AnimatedAIScribeDemo = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [typingText, setTypingText] = useState('');
  const [showGrammarText, setShowGrammarText] = useState(false);
  const [medicalTermsVisible, setMedicalTermsVisible] = useState([]);

  const fullTranscription = "Patient reports increased anxiety levels this week";
  const fullGrammarText = "Patient reports increased anxiety levels this week. Sleep patterns have improved with the new coping strategies we discussed. Patient continues to experience moderate generalized anxiety symptoms but demonstrates good engagement with cognitive behavioral therapy techniques. Sleep hygiene has shown measurable improvement since our last session.";
  const medicalTerms = ['anxiety', 'coping strategies', 'generalized anxiety', 'cognitive behavioral therapy', 'sleep hygiene'];

  useEffect(() => {
    // Step 1: Provider Speaking - 4 seconds
    // Step 2: AI Transcription with typing - 3 seconds
    // Step 3: Grammar correction - 5 seconds
    // Total cycle: 12 seconds

    const stepTimeline = [
      { step: 1, duration: 4000 },
      { step: 2, duration: 3000 },
      { step: 3, duration: 5000 },
    ];

    let currentIndex = 0;
    let timeout;

    const runStep = () => {
      const currentStepData = stepTimeline[currentIndex];
      setCurrentStep(currentStepData.step);

      // Reset states
      setTypingText('');
      setShowGrammarText(false);
      setMedicalTermsVisible([]);

      // Step 2 specific: Typing animation
      if (currentStepData.step === 2) {
        let charIndex = 0;
        const typingInterval = setInterval(() => {
          if (charIndex <= fullTranscription.length) {
            setTypingText(fullTranscription.substring(0, charIndex));
            charIndex++;
          } else {
            clearInterval(typingInterval);
          }
        }, 50);
      }

      // Step 3 specific: Grammar text and medical terms animation
      if (currentStepData.step === 3) {
        // Show grammar text immediately
        setTimeout(() => setShowGrammarText(true), 300);
        
        // Animate medical terms appearing one by one
        medicalTerms.forEach((_, index) => {
          setTimeout(() => {
            setMedicalTermsVisible(prev => [...prev, index]);
          }, 800 + (index * 200));
        });
      }

      // Move to next step
      timeout = setTimeout(() => {
        currentIndex = (currentIndex + 1) % stepTimeline.length;
        runStep();
      }, currentStepData.duration);
    };

    runStep();

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl border border-blue-100 p-8 shadow-xl">
      <div className="mb-8 text-center">
        <div className="inline-block bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg uppercase tracking-wider mb-4 shadow-md">
          LIVE DEMO
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Echopad AI Scribe
          </span>
        </h2>
        <h3 className="text-xl md:text-2xl font-semibold text-gray-700 mb-2">
          Behavioral Health Session → Clinical Note
        </h3>
        <p className="text-base text-gray-600 mt-2">Watch AI transform speech into clinical documentation in real-time</p>
      </div>

      {/* Step 1: Provider Speaking */}
      <div className={`mb-6 transition-all duration-500 ${currentStep === 1 ? 'opacity-100 scale-100' : 'opacity-50 scale-98'}`}>
        <div className="flex items-center gap-3 mb-3">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full transition-all duration-300 ${
            currentStep === 1 
              ? 'bg-blue-600 text-white shadow-lg scale-110' 
              : 'bg-gray-200 text-gray-600'
          }`}>
            STEP 1
          </span>
          <span className={`text-sm font-semibold transition-colors ${
            currentStep === 1 ? 'text-gray-900' : 'text-gray-500'
          }`}>
            🎤 Provider Speaking
          </span>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100 transition-all duration-500">
          <style>{`
            @keyframes wave {
              0%, 100% { height: 8px; }
              50% { height: var(--peak-height); }
            }
            .wave-bar {
              animation: wave var(--duration) ease-in-out infinite;
              animation-delay: var(--delay);
              opacity: ${currentStep === 1 ? 1 : 0.3};
            }
          `}</style>
          <div className="flex items-center justify-center gap-1 mb-3 h-12">
            {[...Array(35)].map((_, i) => {
              const peakHeights = [16, 24, 32, 40, 36, 28, 20, 16, 24, 36, 44, 40, 32, 24, 20, 28, 40, 48, 44, 36, 28, 24, 32, 40, 36, 28, 24, 20, 16, 24, 32, 28, 24, 20, 16];
              const duration = 0.6 + (i % 5) * 0.1;
              const delay = i * 0.03;
              return (
                <div
                  key={i}
                  className={`wave-bar w-1 rounded-full transition-all duration-300 ${
                    currentStep === 1 
                      ? 'bg-gradient-to-t from-blue-500 to-blue-400' 
                      : 'bg-gradient-to-t from-gray-400 to-gray-300'
                  }`}
                  style={{
                    '--peak-height': `${peakHeights[i]}px`,
                    '--duration': `${duration}s`,
                    '--delay': `${delay}s`,
                  }}
                ></div>
              );
            })}
          </div>
          <p className="text-sm text-gray-700 italic">
            "Patient reports increased anxiety levels this week. Sleep patterns have improved with the new coping strategies we discussed..."
          </p>
        </div>
      </div>

      {/* Arrow */}
      <div className="flex justify-center mb-6">
        <i className={`bi bi-arrow-down text-2xl transition-colors ${
          currentStep === 2 ? 'text-blue-500' : 'text-gray-400'
        }`}></i>
      </div>

      {/* Step 2: AI Transcription */}
      <div className={`mb-6 transition-all duration-500 ${currentStep === 2 ? 'opacity-100 scale-100' : 'opacity-50 scale-98'}`}>
        <div className="flex items-center gap-3 mb-3">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full transition-all duration-300 ${
            currentStep === 2 
              ? 'bg-blue-600 text-white shadow-lg scale-110' 
              : 'bg-gray-200 text-gray-600'
          }`}>
            STEP 2
          </span>
          <span className={`text-sm font-semibold transition-colors ${
            currentStep === 2 ? 'text-gray-900' : 'text-gray-500'
          }`}>
            ⚡ AI Transcription in Real-Time
          </span>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100 min-h-[60px] transition-all duration-500">
          <div className="text-sm text-gray-700">
            {currentStep === 2 ? (
              <>
                <span>{typingText}</span>
                <span className="animate-pulse">|</span>
              </>
            ) : (
              <span className="text-gray-400">{fullTranscription}</span>
            )}
          </div>
        </div>
      </div>

      {/* Arrow */}
      <div className="flex justify-center mb-6">
        <i className={`bi bi-arrow-down text-2xl transition-colors ${
          currentStep === 3 ? 'text-blue-500' : 'text-gray-400'
        }`}></i>
      </div>

      {/* Step 3: Grammar Corrected & Medical Terms */}
      <div className={`transition-all duration-500 ${currentStep === 3 ? 'opacity-100 scale-100' : 'opacity-50 scale-98'}`}>
        <div className="flex items-center gap-3 mb-3">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full transition-all duration-300 ${
            currentStep === 3 
              ? 'bg-blue-600 text-white shadow-lg scale-110' 
              : 'bg-gray-200 text-gray-600'
          }`}>
            STEP 3
          </span>
          <span className={`text-sm font-semibold transition-colors ${
            currentStep === 3 ? 'text-gray-900' : 'text-gray-500'
          }`}>
            ✨ Polished Clinical Note Ready for EHR
          </span>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100 transition-all duration-500">
          <div className={`flex items-center gap-2 mb-4 transition-all duration-500 ${
            currentStep === 3 ? 'scale-105' : 'scale-100'
          }`}>
            <i className={`bi bi-check-circle-fill text-lg transition-all duration-300 ${
              currentStep === 3 ? 'text-green-500 animate-pulse' : 'text-gray-400'
            }`}></i>
            <span className={`text-sm font-bold transition-colors ${
              currentStep === 3 ? 'text-green-600' : 'text-gray-600'
            }`}>
              ✓ Grammar Corrected
            </span>
          </div>
          <p className={`text-sm mb-4 transition-all duration-500 ${
            currentStep === 3 && showGrammarText ? 'text-gray-700' : 'text-gray-400'
          }`}>
            {fullGrammarText}
          </p>
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex items-center gap-2 mb-3">
              <i className={`bi bi-plus-circle text-lg transition-all duration-300 ${
                currentStep === 3 ? 'text-purple-600' : 'text-gray-400'
              }`}></i>
              <span className={`text-sm font-bold transition-colors ${
                currentStep === 3 ? 'text-purple-700' : 'text-gray-600'
              }`}>
                🏥 Medical Terminology Identified
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {medicalTerms.map((term, idx) => (
                <span 
                  key={idx} 
                  className={`text-xs px-3 py-1 rounded-full transition-all duration-300 ${
                    currentStep === 3 && medicalTermsVisible.includes(idx)
                      ? 'bg-purple-100 text-purple-700 opacity-100 scale-100' 
                      : 'bg-gray-100 text-gray-400 opacity-50 scale-95'
                  }`}
                  style={{
                    transitionDelay: currentStep === 3 ? `${idx * 100}ms` : '0ms'
                  }}
                >
                  {term}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section Below Demo */}
      <div className="mt-8 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-green-200 shadow-lg">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
              <i className="bi bi-rocket-takeoff-fill text-white text-lg"></i>
            </div>
            <h4 className="text-xl md:text-2xl font-bold text-gray-900">
              See It Work For Your Practice
            </h4>
          </div>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Experience firsthand how AI Scribe transforms your clinical workflow. Schedule a personalized demo or start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleIntercomAction('request-demo');
              }}
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-all shadow-md hover:shadow-lg hover:scale-105"
            >
              <i className="bi bi-calendar-check-fill"></i>
              Request a Demo
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleIntercomAction('request-demo');
              }}
              className="inline-flex items-center gap-2 bg-white text-green-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all border-2 border-green-600 hover:border-green-700 shadow-md hover:shadow-lg"
            >
              <i className="bi bi-play-circle-fill"></i>
              Start Free Trial
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedAIScribeDemo;
