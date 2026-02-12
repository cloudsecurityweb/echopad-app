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
                  Real-Time Clinical Documentation
                </h1>

                {/* 3-Second Value Proposition - Smaller Size */}
                <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-300 rounded-xl p-4 mb-6 shadow-lg">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
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
                  Listen to patient conversations and watch as AI instantly converts speech into perfect clinical notes—saving 2+ hours per provider daily.
                </p>

                {/* Interactive Stats Banner */}
                <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-2xl p-5 md:p-6 mb-6 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.02] animate-gradient-x overflow-hidden">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 min-w-0">
                    <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                        <i className="bi bi-graph-up-arrow text-white text-xl md:text-2xl animate-bounce"></i>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-white/80 text-xs md:text-sm font-semibold uppercase tracking-wide mb-1 break-words">
                          Real Impact, Real Results
                        </div>
                        <div className="text-white text-lg md:text-xl lg:text-2xl font-bold break-words whitespace-normal">
                          Average Saved: <span className="text-yellow-300">10+ Hours/Week</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 md:gap-3 flex-shrink-0">
                      <div className="bg-white/20 backdrop-blur-sm px-3 md:px-4 py-2 rounded-lg min-w-[80px] md:min-w-[100px] text-center">
                        <div className="text-white/80 text-xs whitespace-nowrap">Accuracy</div>
                        <div className="text-white font-bold text-base md:text-lg">99.5%</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm px-3 md:px-4 py-2 rounded-lg min-w-[80px] md:min-w-[100px] text-center">
                        <div className="text-white/80 text-xs whitespace-nowrap">Setup Time</div>
                        <div className="text-white font-bold text-base md:text-lg">&lt;7 Days</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons After Stats Banner */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <a
                    href="#"
                    onClick={(e) => handleIntercomClick(e, 'request-demo')}
                    className="inline-flex items-center justify-center gap-3 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-base hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <i className="bi bi-calendar-check text-xl"></i>
                    Schedule a Demo
                  </a>
                  <a
                    href="#"
                    onClick={(e) => handleIntercomClick(e, 'sign-up')}
                    className="inline-flex items-center justify-center gap-3 bg-white text-blue-600 px-6 py-3 rounded-xl font-bold text-base hover:bg-gray-50 transition-all border-2 border-blue-600 hover:border-blue-700"
                  >
                    <i className="bi bi-person-plus text-xl"></i>
                    Start Free Trial
                  </a>
                </div>

                <div className="space-y-6 mb-8">
                  <div>
                    <h2 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                      <i className="bi bi-briefcase-fill text-teal-500 mr-2"></i>
                      Business Value for Decision Makers
                    </h2>
                    <p className="text-gray-600">
                      For healthcare leaders facing provider burnout and documentation backlogs, AI Scribe delivers immediate ROI through reduced overtime costs, improved billing accuracy, and enhanced provider satisfaction. Deploy in days, not months with zero disruption to clinical workflows.
                    </p>
                  </div>

                  <div>
                    <h2 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                      <i className="bi bi-info-circle text-teal-500 mr-2"></i>
                      What You See
                    </h2>
                    <p className="text-gray-600">
                      As you speak naturally during patient sessions, AI Scribe captures every word, cleans up the grammar, recognizes medical terminology, and structures it into professional documentation—all in real-time.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Key Benefits</h2>
                    <ul className="space-y-2">
                      {[
                        'Reduce provider charting time by up to 70%',
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
                  </div>

                  <div>
                    <h2 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                      <i className="bi bi-graph-up text-teal-500 mr-2"></i>
                      Impact Metrics
                    </h2>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      {[
                        { value: '2+ hours', label: 'Saved per provider/day', icon: 'bi-clock-history' },
                        { value: '70%', label: 'Reduction in charting time', icon: 'bi-graph-down-arrow' },
                        { value: '99.5%', label: 'Transcription accuracy', icon: 'bi-shield-check' },
                      ].map((metric, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-4 text-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <i className={`bi ${metric.icon} text-blue-600 text-xl`}></i>
                          </div>
                          <div className="font-bold text-gray-900 mb-1">{metric.value}</div>
                          <div className="text-sm text-gray-600">{metric.label}</div>
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

        {/* Before/After Slider Section */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <BeforeAfterSlider />
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-white" aria-labelledby="how-it-works-heading">
          <div className="container mx-auto px-4">
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

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
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
                  title: 'AI Processes',
                  description: 'Our AI listens in real-time, transcribes with 99.5% accuracy, corrects grammar, and recognizes medical terminology automatically.',
                  color: 'from-purple-500 to-pink-500',
                  bgColor: 'from-purple-50 to-pink-50',
                  iconBg: 'bg-gradient-to-br from-purple-500 to-pink-500',
                },
                {
                  step: '3',
                  icon: 'bi-file-earmark-check-fill',
                  title: 'Copy to EHR',
                  description: 'Get a perfectly formatted clinical note in seconds. Copy and paste directly into your EHR. Done.',
                  color: 'from-green-500 to-emerald-500',
                  bgColor: 'from-green-50 to-emerald-50',
                  iconBg: 'bg-gradient-to-br from-green-500 to-emerald-500',
                },
              ].map((step, idx) => (
                <div
                  key={idx}
                  className={`relative bg-gradient-to-br ${step.bgColor} rounded-3xl p-8 border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:scale-105 hover:shadow-xl group`}
                >
                  {/* Step Number Badge */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-white border-4 border-gray-200 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-gray-900">{step.step}</span>
                  </div>

                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className={`w-20 h-20 ${step.iconBg} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                      <i className={`bi ${step.icon} text-white text-3xl`}></i>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                    {step.title}
                  </h3>
                  <p className="text-gray-700 text-center leading-relaxed">
                    {step.description}
                  </p>

                  {/* Arrow for desktop */}
                  {idx < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <i className="bi bi-arrow-right text-4xl text-gray-400"></i>
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
        </section>

        {/* Strategic Implementation Section */}
        <section className="py-20 bg-gradient-to-b from-white to-gray-50" aria-labelledby="implementation-guide-heading">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-5 py-2 rounded-full text-sm font-semibold mb-4 shadow-md">
                <i className="bi bi-heart-pulse-fill text-blue-600"></i>
                For Physicians & Healthcare Leaders
              </div>
              <h2 id="implementation-guide-heading" className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Simple Setup, Powerful Results
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From first demo to live deployment—designed specifically for busy clinical practices
              </p>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {[
                {
                  id: 'deployment',
                  icon: 'bi-rocket-takeoff',
                  title: 'Quick Deployment',
                  subtitle: 'Live in less than 7 days',
                  items: [
                    {
                      title: 'Zero IT Burden',
                      description: 'Cloud-based deployment requires no infrastructure changes or IT resources',
                    },
                    {
                      title: 'EHR Agnostic',
                      description: 'Works with Epic, Cerner, Athena, or any EHR via copy-paste or HL7/FHIR integration',
                    },
                    {
                      title: 'Pilot-First Approach',
                      description: 'Start with 3-5 providers to prove ROI before full rollout',
                    },
                    {
                      title: 'Customizable Templates',
                      description: 'Pre-built templates for 20+ specialties or create custom templates for your workflows',
                    },
                  ],
                },
                {
                  id: 'adoption',
                  icon: 'bi-people-fill',
                  title: 'Physician-Friendly Training',
                  subtitle: '95%+ provider adoption in 30 days',
                  items: [
                    {
                      title: '15-Minute Training',
                      description: 'Simple onboarding gets providers documenting on day one—no complex learning curve',
                    },
                    {
                      title: 'Champion Program',
                      description: 'Early adopters become advocates, driving peer adoption through demonstrated success',
                    },
                    {
                      title: 'Ongoing Support',
                      description: 'Dedicated success manager and 24/7 technical support ensure smooth adoption',
                    },
                    {
                      title: 'Usage Analytics',
                      description: 'Track adoption metrics and time savings per provider to demonstrate value',
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
                      description: 'Audio is processed in real-time and immediately deleted—nothing stored on our servers',
                    },
                    {
                      title: 'End-to-End Encryption',
                      description: 'AES-256 encryption in transit and at rest with enterprise key management',
                    },
                    {
                      title: 'Audit Logging',
                      description: 'Complete audit trail of all access and modifications for compliance reporting',
                    },
                  ],
                },
                {
                  id: 'roi',
                  icon: 'bi-graph-up-arrow',
                  title: 'Real Cost Savings',
                  subtitle: 'See immediate financial impact',
                  items: [
                    {
                      title: 'Time Savings per Provider',
                      description: 'Average 2.3 hours saved daily = 11.5 hours per week per provider',
                    },
                    {
                      title: 'Improved Billing Accuracy',
                      description: 'Better documentation = higher E&M level justification = 8-12% revenue increase',
                    },
                    {
                      title: 'Provider Satisfaction',
                      description: '95% provider satisfaction leads to improved retention and reduced burnout costs',
                    },
                    {
                      title: 'Patient Throughput',
                      description: 'See 1-2 additional patients daily with time saved on documentation',
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

        {/* Perfect For You - Contact-style */}
        <section className="py-12 md:py-20 bg-white">
          <div className="container mx-auto px-4 w-full">
            <div className="max-w-4xl mx-auto">
              <div className="rounded-2xl md:rounded-3xl border border-gray-200 bg-white p-6 md:p-10 lg:p-12 shadow-lg shadow-gray-200/60">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-10">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
                      Perfect For You
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                      Perfect For You If...
                    </h2>
                    <p className="text-base md:text-lg text-gray-600 mb-2 leading-relaxed">
                      You spend more than 30 minutes charting per day, want more face-time with patients, or your documentation backlog keeps growing. If you checked 2 or more, AI Scribe is built for you.
                    </p>
                    <p className="text-sm text-gray-500">
                      Behavioral health, primary care, and specialty practices.
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
