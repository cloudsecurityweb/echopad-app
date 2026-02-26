import { useLayoutEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../../components/layout/Navigation';
import Footer from '../../components/layout/Footer';
import { handleIntercomAction } from '../../utils/intercom';
import BuyNowCTA from '../../components/products/BuyNowCTA';
import { getProductByRoute } from '../../data/products';
import BeforeAfterSlider from '../../components/products/BeforeAfterSlider';
import usePageTitle from '../../hooks/usePageTitle';

function Aperio() {
  const PageTitle = usePageTitle('Echopad Aperio');
  const navigate = useNavigate();
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
                  APERIO
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                  Fewer Patients Fall Through the Cracks <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Referrals Get Completed, Not Lost</span>
                </h1>

                {/* 3-Second Value Proposition - Smaller Size */}
                <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-300 rounded-xl p-4 mb-6 shadow-lg">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <i className="bi bi-lightning-charge-fill text-white text-xs"></i>
                    </div>
                    <h2 className="text-sm md:text-base font-bold text-gray-900">How It Works in 3 Seconds</h2>
                  </div>
                  <div className="flex items-center justify-center gap-3 md:gap-4 flex-wrap">
                    <div className="flex flex-col items-center gap-1 bg-white px-3 py-2 rounded-lg shadow-md border border-blue-200">
                      <div className="text-2xl">📋</div>
                      <div className="text-center">
                        <div className="text-xs font-bold text-gray-900">Referral Created</div>
                      </div>
                    </div>
                    <div className="text-xl text-blue-600 font-bold">→</div>
                    <div className="flex flex-col items-center gap-1 bg-gradient-to-br from-blue-500 to-purple-600 px-3 py-2 rounded-lg shadow-lg border border-blue-300">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1">
                        <img src="/assets/images/logos/favicon.svg" alt="EchoPad" className="w-full h-full object-contain" />
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-bold text-white">EchoPad</div>
                      </div>
                    </div>
                    <div className="text-xl text-blue-600 font-bold">→</div>
                    <div className="flex flex-col items-center gap-1 bg-white px-3 py-2 rounded-lg shadow-md border border-green-200">
                      <div className="text-2xl">✅</div>
                      <div className="text-center">
                        <div className="text-xs font-bold text-gray-900">Patient Follows Through</div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-lg text-gray-600 mb-8">
                  Fewer patients fall through the cracks. Track every referral to completion with automated follow-up—so patients get the care they need and you close the loop.
                </p>

                {/* Interactive Stats Banner - Light bg */}
                <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-200 rounded-2xl p-5 md:p-6 mb-6 shadow-lg overflow-hidden">
                  <div className="flex flex-col items-center gap-4">
                    {/* Main Content - Real Impact, Real Results - Centered */}
                    <div className="flex flex-col items-center gap-3 md:gap-4 text-center">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                        <i className="bi bi-graph-up-arrow text-blue-600 text-xl md:text-2xl animate-bounce"></i>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs md:text-sm font-semibold uppercase tracking-wide mb-2">
                          Real Impact, Real Results
                        </div>
                        <div className="text-gray-900 text-base md:text-lg lg:text-xl font-bold leading-tight">
                          Fewer Lost Referrals: <span className="text-blue-600">40% Reduction on Average</span>
                        </div>
                      </div>
                    </div>
                    {/* Stats - Below and Centered */}
                    <div className="flex gap-2 md:gap-3 lg:mt-2 justify-center">
                      <div className="bg-white border border-blue-200 px-3 md:px-4 py-2.5 rounded-lg text-center min-w-[90px] md:min-w-[110px] lg:min-w-[130px] shadow-sm">
                        <div className="text-gray-600 text-xs font-medium mb-1">Completion</div>
                        <div className="text-gray-900 font-bold text-sm md:text-base lg:text-lg">60% Faster</div>
                      </div>
                      <div className="bg-white border border-blue-200 px-3 md:px-4 py-2.5 rounded-lg text-center min-w-[90px] md:min-w-[110px] lg:min-w-[130px] shadow-sm">
                        <div className="text-gray-600 text-xs font-medium mb-1">Setup Time</div>
                        <div className="text-gray-900 font-bold text-sm md:text-base lg:text-lg">&lt;2 Weeks</div>
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

              </div>

              <div className="lg:col-span-7">
                <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
                  <div className="mb-6 text-center">
                    <div className="inline-block bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg uppercase tracking-wider mb-4 shadow-md">
                      LIVE DEMO
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                      <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Echopad Aperio
                      </span>
                    </h2>
                    <h3 className="text-xl md:text-2xl font-semibold text-gray-700 mb-2">
                      Referral → Tracking → Completion
                    </h3>
                  </div>

                  {/* Step 1 */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        STEP 1
                      </span>
                      <span className="text-sm font-semibold text-gray-900">Referral Created</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="bg-white rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200">
                          <i className="bi bi-arrow-right-circle text-blue-600"></i>
                          <span className="text-sm font-semibold text-gray-900">Specialist Referral</span>
                        </div>
                        <div className="text-sm text-gray-700 mb-2">
                          <strong>Patient:</strong> John Smith
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-700">
                            <i className="bi bi-person-badge text-blue-600"></i>
                            <span>To: Dr. Martinez (Cardiology)</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <i className="bi bi-clipboard-pulse text-blue-600"></i>
                            <span>Reason: Cardiac evaluation</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-center mb-6">
                    <i className="bi bi-arrow-down text-2xl text-gray-400"></i>
                  </div>

                  {/* Step 2 */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        STEP 2
                      </span>
                      <span className="text-sm font-semibold text-gray-900">Automated Follow-up</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <i className="bi bi-chat-dots-fill text-blue-600"></i>
                            <strong className="text-sm text-gray-900">Patient Reminder</strong>
                          </div>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Day 2</span>
                        </div>
                        <p className="text-sm text-gray-700 italic">
                          "Hi John! Dr. Johnson referred you to Dr. Martinez for cardiac evaluation. Please call to schedule: (555) 123-4567"
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <i className="bi bi-bell-fill text-blue-600"></i>
                            <strong className="text-sm text-gray-900">Status Check</strong>
                          </div>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Day 7</span>
                        </div>
                        <p className="text-sm text-gray-700 italic">
                          "Following up on referral—have you scheduled with Dr. Martinez yet? Reply YES if completed."
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-center mb-6">
                    <i className="bi bi-arrow-down text-2xl text-gray-400"></i>
                  </div>

                  {/* Step 3 */}
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        STEP 3
                      </span>
                      <span className="text-sm font-semibold text-gray-900">Referral Completed</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
                        <i className="bi bi-check-circle-fill text-green-500 text-xl"></i>
                        <span className="font-semibold text-gray-900">Patient Seen by Specialist</span>
                      </div>
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-3">
                          <i className="bi bi-check2 text-green-500"></i>
                          <div>
                            <strong className="block text-sm text-gray-900">Appointment Scheduled</strong>
                            <span className="text-xs text-gray-600">March 15 at 10:00 AM</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <i className="bi bi-check2 text-green-500"></i>
                          <div>
                            <strong className="block text-sm text-gray-900">Patient Attended Visit</strong>
                            <span className="text-xs text-gray-600">Confirmed March 15</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 flex items-center gap-2 text-sm text-blue-700">
                        <i className="bi bi-clipboard-check-fill"></i>
                        <span>Referral complete • Care continuity maintained • Outcome documented</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why It Matters - referral loop story (replaces cookie-cutter value blocks) */}
        <section className="py-20 bg-gradient-to-b from-white to-gray-50" aria-labelledby="why-aperio-heading">
          <div className="container mx-auto px-4">
            <h2 id="why-aperio-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Why Closing the Referral Loop Matters
            </h2>
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <p className="text-lg text-gray-600 leading-relaxed">
                  Fewer patients fall through the cracks. For healthcare leaders facing lost referrals and care coordination gaps, Aperio delivers immediate ROI through improved patient retention, reduced administrative burden, and enhanced care continuity.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  When a referral is created, we automatically track status, send reminders, and ensure patients complete their referred appointments—all without manual staff intervention.
                </p>
                <ul className="space-y-2">
                  {['Fewer patients fall through the cracks—better care continuity', 'Automate referral tracking and follow-up', 'Ensure patients complete specialist appointments', 'Track referral outcomes and measure success'].map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-600">
                      <i className="bi bi-check-circle-fill text-green-500 mt-0.5 flex-shrink-0"></i>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-gray-500">
                  Primary care practices, specialty clinics, and health systems looking to improve referral completion rates and care coordination.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-blue-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Real impact</h3>
                <div className="grid grid-cols-1 gap-6">
                  {[
                    { value: '40%', label: 'Fewer lost referrals', icon: 'bi-graph-down-arrow' },
                    { value: '60%', label: 'Faster referral completion', icon: 'bi-speedometer' },
                    { value: '80%', label: 'Staff time saved', icon: 'bi-clock-history' },
                  ].map((metric, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <i className={`bi ${metric.icon} text-blue-600 text-xl`}></i>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{metric.value}</div>
                        <div className="text-sm text-gray-600">{metric.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Before/After Slider Section */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <BeforeAfterSlider
              title="How Referrals Were Done: Then vs Now"
              subtitle="From fax machines and phone tag to instant digital coordination with complete health records"
              beforeLabel="Old Manual Methods"
              afterLabel="Modern Aperio System"
              beforeTitle="📠 Fax, Phone & Paper Era"
              afterTitle="☁️ Digital Health Records Era"
              beforeItems={[
                { icon: 'bi-printer', text: '<strong>Fax machines</strong> - wait hours for confirmation' },
                { icon: 'bi-telephone', text: '<strong>Phone tag</strong> - 5+ calls per referral' },
                { icon: 'bi-file-earmark-text', text: '<strong>Paper forms</strong> - manually filled, mailed' },
                { icon: 'bi-hourglass-split', text: '<strong>Days/weeks</strong> to complete process' }
              ]}
              afterItems={[
                { icon: 'bi-cloud-check', text: '<strong>EHR integration</strong> - instant digital referral' },
                { icon: 'bi-robot', text: '<strong>AI automation</strong> - zero phone calls needed' },
                { icon: 'bi-shield-lock', text: '<strong>Secure records</strong> - HIPAA-compliant sharing' },
                { icon: 'bi-lightning-charge', text: '<strong>Minutes</strong> - complete referral instantly' }
              ]}
              beforeStat={{ value: '5-7 days', label: 'Average referral time (old way)' }}
              afterStat={{ value: '< 5 min', label: 'With digital Aperio' }}
            />
          </div>
        </section>

        {/* How It Works Section - same style as AIScribe */}
        <section className="py-20 bg-white overflow-visible" aria-labelledby="how-it-works-heading">
          <div className="container mx-auto px-4">
            <div className="origin-center scale-90 md:scale-95 transition-transform duration-500 ease-out">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-5 py-2 rounded-full text-sm font-semibold mb-4 shadow-md">
                  <i className="bi bi-gear-fill text-green-600"></i>
                  Simple Process
                </div>
                <h2 id="how-it-works-heading" className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  How Aperio Works
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Three simple steps from referral creation to patient follow-through
                </p>
              </div>

              <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: '1',
                  icon: 'bi-file-earmark-plus-fill',
                  title: 'Create Referral',
                  description: 'Provider creates referral in EHR. Aperio automatically captures it and initiates tracking—no manual entry needed.',
                  color: 'from-blue-500 to-cyan-500',
                  bgColor: 'from-blue-50 to-cyan-50',
                  iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
                },
                {
                  step: '2',
                  icon: 'bi-robot',
                  title: 'AI Follows Up',
                  description: 'AI sends patient reminders via SMS/email, tracks status, and escalates if needed—all automatically without staff intervention.',
                  color: 'from-purple-500 to-pink-500',
                  bgColor: 'from-purple-50 to-pink-50',
                  iconBg: 'bg-gradient-to-br from-purple-500 to-pink-500',
                },
                {
                  step: '3',
                  icon: 'bi-check-circle-fill',
                  title: 'Patient Completes',
                  description: 'Patient schedules and attends appointment. Status syncs back to EHR automatically. Referral loop closed.',
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
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <i className="bi bi-play-circle-fill text-2xl"></i>
                  See It In Action
                </a>
              </div>
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
                      You lose patients when referrals drop, your staff spends hours tracking status, or completion rates are below what you want. If you checked 2 or more, Aperio is built for you.
                    </p>
                    <p className="text-sm text-gray-500">
                      Multi-specialty practices, primary care networks, and health systems.
                    </p>
                  </div>
                </div>
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
                For Healthcare Leaders
              </div>
              <h2 id="implementation-guide-heading" className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Simple Setup, Powerful Results
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From first demo to live deployment—designed specifically for busy healthcare organizations
              </p>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {[
                {
                  id: 'deployment',
                  icon: 'bi-rocket-takeoff',
                  title: 'Quick Deployment',
                  subtitle: 'Live in less than 2 weeks',
                  items: [
                    {
                      title: 'Zero IT Burden',
                      description: 'Go live without IT—no infrastructure changes or extra resources required.',
                    },
                    {
                      title: 'EHR Agnostic',
                      description: 'Works with Epic, Cerner, Athena, or any EHR via HL7/FHIR integration',
                    },
                    {
                      title: 'Pilot-First Approach',
                      description: 'Start with selected providers to prove ROI before full rollout',
                    },
                    {
                      title: 'Custom Workflows',
                      description: 'Configure reminder timing and escalation rules for your practice',
                    },
                  ],
                },
                {
                  id: 'adoption',
                  icon: 'bi-people-fill',
                  title: 'Staff-Friendly Training',
                  subtitle: '95%+ adoption in 30 days',
                  items: [
                    {
                      title: '15-Minute Training',
                      description: 'Simple onboarding gets care coordinators tracking referrals on day one',
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
                      description: 'Track adoption metrics and completion rates to demonstrate value',
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
                      title: 'Secure Data Sharing',
                      description: 'HIPAA-compliant secure health record sharing and encryption',
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
                      title: 'Fewer Lost Referrals',
                      description: 'Average 40% fewer lost referrals = $350K+ annual revenue retained.',
                    },
                    {
                      title: 'Faster Completion',
                      description: '60% faster referral completion improves patient outcomes and satisfaction',
                    },
                    {
                      title: 'Staff Time Saved',
                      description: '80% reduction in manual follow-up calls saves hours per week',
                    },
                    {
                      title: 'Network Retention',
                      description: 'Keep patients within your healthcare system, improving care continuity',
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
                      Ready to see Aperio in action?
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

export default Aperio;
