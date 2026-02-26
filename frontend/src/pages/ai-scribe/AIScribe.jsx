import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../../components/layout/Navigation';
import Footer from '../../components/layout/Footer';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';
import { handleIntercomAction } from '../../utils/intercom';
import BuyNowCTA from '../../components/products/BuyNowCTA';
import { getProductByRoute } from '../../data/products';
import { checkProductOwnership } from '../../utils/productOwnership';
import { useAuth } from '../../contexts/AuthContext';
import AnimatedAIScribeDemo from '../../components/transcription/AnimatedAIScribeDemo';
import BeforeAfterSlider from '../../components/products/BeforeAfterSlider';
import usePageTitle from '../../hooks/usePageTitle';

function AIScribe() {
  const PageTitle = usePageTitle('Echopad AI Scribe');
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [expandedSections, setExpandedSections] = useState({});
  const [typingText, setTypingText] = useState('');
  const typingIndexRef = useRef(0);
  const typingIntervalRef = useRef(null);

  const {
    isCountingDown,
    isRecording,
    recordingSeconds,
    countdownSeconds,
    isProcessing,
    transcription,
    error,
    startRecording,
    stopRecording,
    clearTranscription,
  } = useAudioRecorder();

  // Handle expandable sections
  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Typing effect for transcription
  useEffect(() => {
    if (transcription && !isProcessing) {
      typingIndexRef.current = 0;
      setTypingText('');

      typingIntervalRef.current = setInterval(() => {
        if (typingIndexRef.current < transcription.length) {
          setTypingText(transcription.substring(0, typingIndexRef.current + 1));
          typingIndexRef.current++;
        } else {
          clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
        }
      }, 30);

      return () => {
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
        }
      };
    } else if (!transcription) {
      setTypingText('');
      typingIndexRef.current = 0;
    }
  }, [transcription, isProcessing]);

  // Format timer
  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleIntercomClick = (e, action) => {
    e.preventDefault();
    handleIntercomAction(action);
  };

  const handleViewAllProductsClick = (e) => {
    e.preventDefault();
    navigate('/');
    const headerOffset = 80;
    setTimeout(() => {
      const element = document.querySelector('#agents');
      if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  // Scroll to top when component mounts (instant, no animation)
  useLayoutEffect(() => {
    // Temporarily disable smooth scroll behavior
    const html = document.documentElement;
    const originalScrollBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';

    // Use multiple methods to ensure instant scroll
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);

    // Restore original scroll behavior after a brief moment
    requestAnimationFrame(() => {
      html.style.scrollBehavior = originalScrollBehavior || '';
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {PageTitle}
      <Navigation />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-4 md:px-14 pt-32 pb-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5">
                <a
                  href="/"
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors mb-4 font-semibold hover:gap-3"
                  onClick={handleViewAllProductsClick}
                >
                  <i className="bi bi-arrow-left"></i>
                  View All Products
                </a>
                <div className="text-xl md:text-2xl font-bold text-blue-600 uppercase tracking-wider mb-4">
                  AI SCRIBE
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                  Your Note, Done Before You Leave the Room.
                </h1>

                {/* 3-Second Value Proposition - Smaller Size */}
                <div className="bg-gradient-to-br from-blue-50 via-emerald-50 to-teal-50 border-2 border-blue-300 rounded-xl p-4 mb-6 shadow-lg">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <i className="bi bi-lightning-charge-fill text-white text-xs"></i>
                    </div>
                    <h2 className="text-sm md:text-base font-bold text-gray-900">How It Works in 3 Seconds</h2>
                  </div>
                  <div className="flex items-center justify-center gap-3 md:gap-4 flex-wrap">
                    <div className="flex flex-col items-center gap-1 bg-white px-3 py-2 rounded-lg shadow-md border border-blue-200">
                      <div className="text-2xl">🗣️</div>
                      <div className="text-center">
                        <div className="text-xs font-bold text-gray-900">You Speak</div>
                      </div>
                    </div>
                    <div className="text-xl text-green-600 font-bold">→</div>
                    <div className="flex flex-col items-center gap-1 bg-gradient-to-br from-blue-500 to-cyan-600 px-3 py-2 rounded-lg shadow-lg border border-blue-300">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1">
                        <img src="/assets/images/logos/favicon.svg" alt="EchoPad" className="w-full h-full object-contain" />
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-bold text-white">EchoPad</div>
                      </div>
                    </div>
                    <div className="text-xl text-green-600 font-bold">→</div>
                    <div className="flex flex-col items-center gap-1 bg-white px-3 py-2 rounded-lg shadow-md border border-green-200">
                      <div className="text-2xl">📋</div>
                      <div className="text-center">
                        <div className="text-xs font-bold text-gray-900">Note Ready</div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-lg text-gray-600 mb-8">
                  No typing, no dictation commands—just talk to your patient. Your note is ready before you leave the room.
                </p>



                <div className="space-y-6 mb-8">
                  <div>
                    <h2 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                      <i className="bi bi-briefcase-fill text-teal-500 mr-2"></i>
                      Why Your Practice Needs This
                    </h2>
                    <p className="text-gray-600">
                      Documentation is one of the biggest drains on your day. AI Scribe helps you get notes done during the visit instead of after hours, so you can leave on time, see patients without a charting backlog, and keep documentation accurate for billing—without changing how you talk to patients.
                    </p>
                  </div>

                  <div>
                    <h2 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                      <i className="bi bi-info-circle text-teal-500 mr-2"></i>
                      What You See
                    </h2>
                    <p className="text-gray-600">
                      Your note is ready before you leave the room—no waiting, no follow-up. As you speak naturally, we capture every word, clean up grammar, recognize medical terminology, and structure it into professional documentation.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Key Benefits & Impact</h2>
                    <p className="text-sm text-gray-500 mb-3">Evidence-backed outcomes from pilot practices.</p>
                    <ul className="space-y-2 mb-4">
                      {[
                        'Automatically create clear, accurate clinical notes',
                        'Recognize and structure medical terminology correctly',
                        'Deliver EHR-ready notes within seconds of the visit',
                      ].map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-600">
                          <i className="bi bi-check-circle-fill text-green-500 mt-0.5"></i>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { value: '2+ hours', label: 'Saved per provider/day', source: 'EchoPad pilot, 20+ practices, 2024', icon: 'bi-clock-history' },
                        { value: '70%', label: 'Reduction in charting time', source: 'Customer benchmarks (self-reported)', icon: 'bi-graph-down-arrow' },
                        { value: '99.5%', label: 'Transcription accuracy', source: 'Internal testing, medical dictation', icon: 'bi-shield-check' },
                      ].map((metric, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-4 text-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <i className={`bi ${metric.icon} text-blue-600 text-xl`}></i>
                          </div>
                          <div className="font-bold text-gray-900 mb-1">{metric.value}</div>
                          <div className="text-sm text-gray-600">{metric.label}</div>
                          <div className="text-xs text-gray-500 mt-1" title="Source">{metric.source}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              <div className="lg:col-span-7">
                <AnimatedAIScribeDemo />
              </div>
            </div>
          </div>
        </section>

        {/* What's Different - standalone section */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white" aria-labelledby="whats-different-heading">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 id="whats-different-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 flex items-center justify-center gap-2">
                <i className="bi bi-lightbulb text-teal-500 text-3xl"></i>
                What’s Different
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                No templates to memorize—notes follow your natural conversation, not the other way around. Works with complex encounters, multi-diagnosis visits, and specialty-specific language. You get documentation without the privacy tradeoff. How: audio is processed in real time and not stored.
              </p>
            </div>
          </div>
        </section>

        {/* Before/After Slider Section */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <BeforeAfterSlider />
          </div>
        </section>

        {/* How It Works Section - zoomed out */}
        <section className="py-20 bg-white overflow-visible" aria-labelledby="how-it-works-heading">
          <div className="container mx-auto px-4">
            <div className="origin-center scale-90 md:scale-95 transition-transform duration-500 ease-out">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-5 py-2 rounded-full text-sm font-semibold mb-4 shadow-md">
                  <i className="bi bi-gear-fill text-green-600"></i>
                  Simple Process
                </div>
                <h2 id="how-it-works-heading" className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  How AI Scribe Works
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Three simple steps from patient conversation to EHR-ready documentation
                </p>
              </div>

              <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: '1',
                  icon: 'bi-mic-fill',
                  title: 'Speak Naturally',
                  description: 'Have your normal patient conversation. No special commands, no structured dictation required. Just talk as you always do.',
                  color: 'from-blue-500 to-cyan-500',
                  bgColor: 'from-blue-50 to-cyan-50',
                  iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
                },
                {
                  step: '2',
                  icon: 'bi-cpu-fill',
                  title: 'Your Note Builds as You Speak',
                  description: 'Medical-grade transcription, grammar correction, and automatic medical terminology recognition. Your note is ready the moment you finish.',
                  color: 'from-purple-500 to-pink-500',
                  bgColor: 'from-purple-50 to-pink-50',
                  iconBg: 'bg-gradient-to-br from-purple-500 to-pink-500',
                },
                {
                  step: '3',
                  icon: 'bi-file-earmark-check-fill',
                  title: 'Export to EHR',
                  description: 'Export to your EHR via direct integration—or use one-click copy as a fallback. Get a perfectly formatted clinical note in seconds.',
                  color: 'from-green-500 to-emerald-500',
                  bgColor: 'from-green-50 to-emerald-50',
                  iconBg: 'bg-gradient-to-br from-green-500 to-emerald-500',
                },
              ].map((step, idx) => (
                <div
                  key={idx}
                  className={`relative bg-gradient-to-br ${step.bgColor} rounded-2xl p-5 border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:scale-105 hover:shadow-xl group`}
                >
                  {/* Step Number Badge */}
                  <div className="absolute -top-3 -left-3 w-10 h-10 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-xl font-bold text-gray-900">{step.step}</span>
                  </div>

                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <div className={`w-14 h-14 ${step.iconBg} rounded-xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                      <i className={`bi ${step.icon} text-white text-2xl`}></i>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-700 text-center leading-relaxed">
                    {step.description}
                  </p>

                  {/* Arrow for desktop */}
                  {idx < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <i className="bi bi-arrow-right text-3xl text-gray-400"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>

              {/* Bottom CTA */}
              <div className="mt-12 text-center">
                <p className="text-lg text-gray-600 mb-4">
                  <strong>That's it!</strong> No complex setup, no training required.
                </p>
                <a
                  href="#"
                  onClick={(e) => handleIntercomClick(e, 'request-demo')}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <i className="bi bi-play-circle-fill text-2xl"></i>
                  See It In Action
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Strategic Implementation Section */}
        <section className="py-20 bg-gradient-to-b from-white to-gray-50" aria-labelledby="implementation-guide-heading">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-5 py-2 rounded-full text-sm font-semibold mb-4 shadow-md">
                <i className="bi bi-heart-pulse-fill text-blue-600"></i>
                For Busy Practices
              </div>
              <h2 id="implementation-guide-heading" className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Easy to Start, Built for the Way You Work
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get going quickly without big IT projects—built for real clinical workflows
              </p>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {[
                {
                  id: 'deployment',
                  icon: 'bi-rocket-takeoff',
                  title: 'Get Started Quickly',
                  subtitle: 'Up and running in under a week',
                  items: [
                    {
                      title: 'No IT Required',
                      description: 'No new servers or infrastructure—just sign up and use it.',
                    },
                    {
                      title: 'Works With Your EHR',
                      description: 'Works with Epic, Cerner, Athena, or any EHR via direct integration (HL7/FHIR) or one-click copy',
                    },
                    {
                      title: 'Try With a Few Providers First',
                      description: 'Start with a small group to see how it fits your practice before expanding',
                    },
                    {
                      title: 'Templates for Your Specialty',
                      description: 'Pre-built templates for 20+ specialties or create custom ones for your workflows',
                    },
                  ],
                },
                {
                  id: 'adoption',
                  icon: 'bi-people-fill',
                  title: 'Easy for Your Team',
                  subtitle: 'Providers get going in about a month',
                  items: [
                    {
                      title: 'Short Training',
                      description: 'About 15 minutes to get started—providers can use it from day one.',
                    },
                    {
                      title: 'Champion Program',
                      description: 'Early adopters can help others in your practice get comfortable with it',
                    },
                    {
                      title: 'Support When You Need It',
                      description: 'Dedicated support and help available so adoption goes smoothly',
                    },
                    {
                      title: 'See How It’s Used',
                      description: 'Track usage and time saved per provider so you can see the benefit',
                    },
                  ],
                },
                {
                  id: 'security',
                  icon: 'bi-shield-lock-fill',
                  title: 'Clinical-Grade Security',
                  subtitle: 'HIPAA compliant & patient data protected',
                  items: [
                    {
                      title: 'HIPAA & SOC 2 Certified',
                      description: 'Full HIPAA compliance with BAA included, SOC 2 Type II certified annually',
                    },
                    {
                      title: 'Zero Data Retention',
                      description: 'Your patients\' audio is never stored. How: processed and immediately deleted from our servers.',
                    },
                    {
                      title: 'End-to-End Encryption',
                      description: 'AES-256 encryption in transit and at rest so patient data stays protected',
                    },
                    {
                      title: 'Audit Logging',
                      description: 'Full audit trail of access and changes for compliance and reporting',
                    },
                  ],
                },
                {
                  id: 'roi',
                  icon: 'bi-graph-up-arrow',
                  title: 'How Practices Benefit',
                  subtitle: 'Documentation and billing improve',
                  items: [
                    {
                      title: 'Better Billing Documentation',
                      description: 'Clearer notes support appropriate E&M levels—practices often see 8–12% revenue improvement (from practice benchmarks).',
                    },
                    {
                      title: 'Less Burnout',
                      description: 'When charting happens during the visit, providers report less after-hours work and better satisfaction.',
                    },
                    {
                      title: 'More Time for Patients',
                      description: 'With documentation done sooner, many practices see capacity for 1–2 more patients per day.',
                    },
                  ],
                },
              ].map((section) => (
                <article
                  key={section.id}
                  className="glass-card rounded-2xl p-8 hover-lift shadow-sm"
                  aria-labelledby={`${section.id}-heading`}
                >
                  {/* Section Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center shadow-lg">
                      <i className={`bi ${section.icon} text-white text-2xl`} aria-hidden="true"></i>
                    </div>
                    <div className="flex-1">
                      <h3 id={`${section.id}-heading`} className="text-xl font-bold text-gray-900 mb-1">
                        {section.title}
                      </h3>
                      <p className="text-sm text-blue-600 font-semibold">{section.subtitle}</p>
                    </div>
                  </div>

                  {/* Compact List */}
                  <ul className="space-y-3" role="list">
                    {section.items.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-sm"
                      >
                        <i className="bi bi-check2 text-green-500 text-lg flex-shrink-0 mt-0.5 font-bold" aria-hidden="true"></i>
                        <div className="flex-1">
                          <span className="font-semibold text-gray-900">{item.title}:</span>{' '}
                          <span className="text-gray-600">{item.description}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Perfect For You - Specialty callouts */}
        <section className="py-12 md:py-20 bg-white">
          <div className="container mx-auto px-4 w-full">
            <div className="max-w-4xl mx-auto">
              <div className="rounded-2xl md:rounded-3xl border border-gray-200 bg-white p-6 md:p-10 lg:p-12 shadow-lg shadow-gray-200/60">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
                  Perfect For You
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Built for Your Specialty
                </h2>
                <p className="text-base text-gray-600 mb-6 leading-relaxed">
                  See your practice in AI Scribe. Pre-configured templates so you can start documenting the way you already work.
                </p>
                <ul className="space-y-4" role="list">
                  {[
                    {
                      specialty: 'Behavioral health',
                      icon: 'bi-heart-pulse-fill',
                      sentence: 'Pre-configured templates for therapy notes, progress notes, and treatment plans so you document sessions without the paperwork.',
                    },
                    {
                      specialty: 'Primary care',
                      icon: 'bi-person-hearts',
                      sentence: 'Ready-to-use templates for annual wellness, sick visits, and chronic care management that match how you actually practice.',
                    },
                    {
                      specialty: 'Orthopedics',
                      icon: 'bi-activity',
                      sentence: 'Specialty templates for joint exams, procedures, and post-op follow-ups so your notes are structured and billing-ready.',
                    },
                    {
                      specialty: 'Cardiology',
                      icon: 'bi-heart-pulse',
                      sentence: 'Pre-built templates for stress tests, echo documentation, and cardiac follow-ups that capture the detail you need.',
                    },
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <i className={`bi ${item.icon} text-blue-600 text-lg`} aria-hidden="true"></i>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900">{item.specialty}.</span>{' '}
                        <span className="text-gray-600">{item.sentence}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-gray-500 mt-6">
                  Plus 20+ other specialties with pre-configured templates—or create your own.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Schedule a Demo - Contact-style */}
        <section className="py-12 md:py-20 bg-white">
          <div className="container mx-auto px-4 w-full">
            <div className="max-w-4xl mx-auto">
              <div className="rounded-2xl md:rounded-3xl border border-gray-200 bg-white p-6 md:p-10 lg:p-12 shadow-lg shadow-gray-200/60">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-10">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
                      Get Started
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                      Ready to see AI Scribe in action?
                    </h2>
                    <p className="text-base md:text-lg text-gray-600 mb-2 leading-relaxed">
                      Book a quick walkthrough and leave with a clear automation plan.
                    </p>
                    <p className="text-sm text-gray-500">
                      15-minute call, no obligation.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
                    <a
                      href="#"
                      className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3.5 rounded-xl hover:bg-gray-800 transition-colors font-semibold text-sm shadow-md min-w-[140px]"
                      onClick={(e) => handleIntercomClick(e, 'request-demo')}
                    >
                      <i className="bi bi-chat-dots-fill text-white text-lg" aria-hidden="true" />
                      Book a Demo
                    </a>
                    <a
                      href="/sign-up"
                      className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-6 py-3.5 rounded-xl border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium text-sm min-w-[140px]"
                    >
                      <i className="bi bi-rocket-takeoff text-cyan-500 text-lg" aria-hidden="true" />
                      Get Started
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default AIScribe;
