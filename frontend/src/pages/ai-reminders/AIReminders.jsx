import { useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/layout/Navigation';
import Footer from '../../components/layout/Footer';
import { handleIntercomAction } from '../../utils/intercom';
import BuyNowCTA from '../../components/products/BuyNowCTA';
import { getProductByRoute } from '../../data/products';
import usePageTitle from '../../hooks/usePageTitle';

function AIReminders() {
  const PageTitle = usePageTitle('Echopad AI Reminders');
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
    <>
      {PageTitle}
      <Navigation />
      <main>
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
                <div className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-4">
                  AI PATIENT REMINDERS
                </div>
                {(() => {
                  const product = getProductByRoute('/ai-reminders');
                  if (!product?.usp) return null;

                  const parseUSP = (text) => {
                    const parts = [];
                    const regex = /(\d+[%+]?|\d+\s*(hours?|minutes?|%|calls?|%))/gi;
                    let lastIndex = 0;
                    let match;

                    while ((match = regex.exec(text)) !== null) {
                      if (match.index > lastIndex) {
                        parts.push({ text: text.substring(lastIndex, match.index), isNumber: false });
                      }
                      parts.push({ text: match[0], isNumber: true });
                      lastIndex = regex.lastIndex;
                    }

                    if (lastIndex < text.length) {
                      parts.push({ text: text.substring(lastIndex), isNumber: false });
                    }

                    if (parts.length === 0) {
                      return [{ text, isNumber: false }];
                    }

                    return parts;
                  };

                  const uspParts = parseUSP(product.usp);

                  return (
                    <div className="mb-8 animate-fade-in-scale">
                      <div className="relative flex items-center gap-3 bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 border-2 border-cyan-200/50 rounded-2xl px-6 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group overflow-hidden min-w-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-400/20 to-purple-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10 flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse-glow">
                            <i className="bi bi-lightning-charge-fill text-white text-xl"></i>
                          </div>
                        </div>
                        <div className="relative z-10 min-w-0 flex-1">
                          <div className="text-xs font-semibold text-cyan-600 uppercase tracking-wider mb-1 break-words">
                            ROI Promise
                          </div>
                          <div className="text-xl md:text-2xl lg:text-3xl font-bold break-words whitespace-normal">
                            {uspParts.map((part, idx) => {
                              if (part.isNumber) {
                                return (
                                  <span key={idx} className="animate-gradient-text bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600">
                                    {part.text}
                                  </span>
                                );
                              }
                              return <span key={idx} className="text-gray-800">{part.text}</span>;
                            })}
                          </div>
                        </div>
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse opacity-75"></div>
                        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse opacity-60" style={{ animationDelay: '0.5s' }}></div>
                      </div>
                    </div>
                  );
                })()}
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Personalized Care Coordination
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Automated, intelligent reminders that reduce no-shows by 30% and improve patient compliance across the entire care continuum.
                </p>

                <div className="space-y-6 mb-8">
                  <div>
                    <h2 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                      <i className="bi bi-briefcase-fill text-teal-500 mr-2"></i>
                      Business Value for Decision Makers
                    </h2>
                    <p className="text-gray-600">
                      For healthcare leaders facing no-show revenue loss and patient engagement challenges, AI Patient Reminders delivers immediate ROI through reduced missed appointments, improved medication adherence, and enhanced patient satisfaction. Recover $50K-$200K annually per provider in lost revenue while improving quality metrics.
                    </p>
                  </div>

                  <div>
                    <h2 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                      <i className="bi bi-info-circle text-teal-500 mr-2"></i>
                      What You See
                    </h2>
                    <p className="text-gray-600">
                      When appointments are scheduled, AI creates personalized reminder sequences via SMS, email, and voice. Patients confirm attendance, and you track compliance in real-time.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Key Benefits</h2>
                    <ul className="space-y-2">
                      {[
                        'Reduce no-shows and last-minute cancellations',
                        'Send clear appointment and preparation reminders',
                        'Improve patient compliance with care instructions',
                        'Automatically confirm attendance without staff involvement',
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
                        { value: '30%', label: 'Reduction in no-shows', icon: 'bi-graph-down-arrow' },
                        { value: '40%', label: 'Improvement in compliance', icon: 'bi-check-circle' },
                        { value: '$50K+', label: 'Revenue recovered annually', icon: 'bi-currency-dollar' },
                      ].map((metric, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <i className={`bi ${metric.icon} text-blue-600 text-xl`}></i>
                          </div>
                          <div className="font-bold text-gray-900 mb-1">{metric.value}</div>
                          <div className="text-sm text-gray-600">{metric.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Perfect For</h2>
                    <p className="text-gray-600">
                      Any practice struggling with no-shows, medication non-compliance, or patient engagement challenges.
                    </p>
                  </div>
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
                        Echopad AI Reminders
                      </span>
                    </h2>
                    <h3 className="text-xl md:text-2xl font-semibold text-gray-700 mb-2">
                      Appointment → Reminders → Confirmation
                    </h3>
                  </div>

                  {/* Step 1 */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        STEP 1
                      </span>
                      <span className="text-sm font-semibold text-gray-900">Upcoming Appointment</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="bg-white rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200">
                          <i className="bi bi-calendar-event text-blue-600"></i>
                          <span className="text-sm font-semibold text-gray-900">Follow-up Appointment</span>
                        </div>
                        <div className="text-sm text-gray-700 mb-2">
                          <strong>Patient:</strong> Maria Garcia
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-700">
                            <i className="bi bi-person-badge text-blue-600"></i>
                            <span>Dr. Johnson</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <i className="bi bi-clock text-blue-600"></i>
                            <span>March 25, 2025 at 2:30 PM</span>
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
                      <span className="text-sm font-semibold text-gray-900">Personalized Reminders</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <i className="bi bi-chat-dots-fill text-blue-600"></i>
                            <strong className="text-sm text-gray-900">SMS Reminder</strong>
                          </div>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">3 days before</span>
                        </div>
                        <p className="text-sm text-gray-700 italic">
                          "Hi Maria! Reminder: You have an appointment with Dr. Johnson on March 25 at 2:30 PM. Reply YES to confirm."
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <i className="bi bi-envelope-fill text-blue-600"></i>
                            <strong className="text-sm text-gray-900">Email Reminder</strong>
                          </div>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">1 day before</span>
                        </div>
                        <p className="text-sm text-gray-700 italic">
                          "Your appointment is tomorrow at 2:30 PM. Please bring your insurance card and arrive 15 minutes early."
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
                      <span className="text-sm font-semibold text-gray-900">Patient Confirmation</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
                        <i className="bi bi-check-circle-fill text-green-500 text-xl"></i>
                        <span className="font-semibold text-gray-900">Patient Confirmed Attendance</span>
                      </div>
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-3">
                          <i className="bi bi-check2 text-green-500"></i>
                          <div>
                            <strong className="block text-sm text-gray-900">SMS Sent</strong>
                            <span className="text-xs text-gray-600">March 22 at 9:00 AM</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <i className="bi bi-check2 text-green-500"></i>
                          <div>
                            <strong className="block text-sm text-gray-900">Patient Replied "YES"</strong>
                            <span className="text-xs text-gray-600">March 22 at 9:15 AM</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 flex items-center gap-2 text-sm text-blue-700">
                        <i className="bi bi-bell-fill"></i>
                        <span>Clinic notified • No-show risk: LOW • Calendar confirmed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Strategic Implementation Section */}
        <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-5 py-2 rounded-full mb-4">
                <i className="bi bi-shield-check text-blue-600"></i>
                <span className="text-sm font-bold text-blue-700 uppercase tracking-wider">Implementation Roadmap</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Strategic Implementation Guide for <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Healthcare Leaders</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
                Everything you need to know to make an informed decision and ensure successful deployment in your organization
              </p>

              {/* Key Stats Banner */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
                {[
                  { icon: 'bi-graph-down-arrow', value: '30%', label: 'No-Show Reduction' },
                  { icon: 'bi-check-circle', value: '40%', label: 'Compliance Boost' },
                  { icon: 'bi-currency-dollar', value: '$50K+', label: 'Revenue Recovered' },
                  { icon: 'bi-chat-dots', value: '24/7', label: 'Automated Reminders' },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-4 shadow-lg border-2 border-blue-100">
                    <i className={`bi ${stat.icon} text-3xl text-blue-600 mb-2 block`}></i>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {[
                {
                  icon: 'bi-rocket-takeoff',
                  title: 'No-Show Reduction Impact',
                  subtitle: 'Measurable revenue recovery',
                  items: [
                    {
                      title: 'Reduce No-Shows by 40-50%',
                      description: 'Multi-channel reminders via SMS, voice, email ensure patients remember',
                    },
                    {
                      title: 'Recover $50K-$200K Annually',
                      description: 'Per provider in lost revenue from missed appointments',
                    },
                    {
                      title: 'Fill Last-Minute Cancellations',
                      description: 'Automated waitlist management maximizes schedule utilization',
                    },
                    {
                      title: 'Improve Provider Utilization',
                      description: 'Better attendance = more patients seen without extending hours',
                    },
                  ],
                },
                {
                  icon: 'bi-people-fill',
                  title: 'Patient Engagement',
                  subtitle: 'Communication that works',
                  items: [
                    {
                      title: 'Multi-Channel Outreach',
                      description: 'SMS, voice calls, email—reach patients how they prefer',
                    },
                    {
                      title: 'Two-Way Confirmation',
                      description: 'Patients can confirm/cancel with simple reply—no phone calls needed',
                    },
                    {
                      title: 'Preventive Care Reminders',
                      description: 'Annual physicals, screenings, vaccinations—improve quality metrics',
                    },
                    {
                      title: 'Medication Adherence',
                      description: 'Refill reminders reduce gaps in chronic disease management',
                    },
                  ],
                },
                {
                  icon: 'bi-shield-lock-fill',
                  title: 'Compliance & Integration',
                  subtitle: 'Seamless technology fit',
                  items: [
                    {
                      title: 'TCPA Compliant',
                      description: 'Proper consent management for automated calls and texts',
                    },
                    {
                      title: 'EHR/PM Integration',
                      description: 'Pulls appointment data directly from Epic, Cerner, Athena automatically',
                    },
                    {
                      title: 'Customizable Timing',
                      description: 'Set reminder cadence—7 days, 3 days, 24 hours, 2 hours before appointment',
                    },
                    {
                      title: 'Opt-Out Management',
                      description: 'Automated handling of patient communication preferences',
                    },
                  ],
                },
                {
                  icon: 'bi-graph-up-arrow',
                  title: 'Analytics & Optimization',
                  subtitle: 'Continuous improvement',
                  items: [
                    {
                      title: 'Channel Effectiveness',
                      description: 'Track which reminder method works best for your patient population',
                    },
                    {
                      title: 'Timing Optimization',
                      description: 'Identify optimal reminder timing to maximize attendance',
                    },
                    {
                      title: 'Provider Comparison',
                      description: 'Benchmark no-show rates across providers and specialties',
                    },
                    {
                      title: 'Revenue Impact Reports',
                      description: 'Calculate recovered revenue from reduced no-shows',
                    },
                  ],
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border-2 border-blue-200 p-6 h-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <i className={`bi ${feature.icon} text-white text-2xl`}></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-sm text-blue-600 font-semibold">{feature.subtitle}</p>
                    </div>
                  </div>
                  <ul className="space-y-4">
                    {feature.items.map((item, itemIdx) => (
                      <li
                        key={itemIdx}
                        className={`flex items-start gap-3 pb-4 ${itemIdx < feature.items.length - 1 ? 'border-b border-gray-200' : ''
                          }`}
                      >
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <i className="bi bi-check2 text-green-600 font-bold"></i>
                        </div>
                        <div>
                          <strong className="block text-gray-900 mb-2 text-base">{item.title}</strong>
                          <span className="text-base text-gray-600 leading-relaxed">{item.description}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-12 text-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 max-w-3xl mx-auto shadow-2xl">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Ready to Reduce No-Shows and Boost Revenue?
                </h3>
                <p className="text-blue-100 mb-6 text-lg">
                  Join innovative healthcare organizations already recovering $50K+ annually with automated reminders
                </p>
                <a
                  href="#"
                  onClick={(e) => handleIntercomClick(e, 'request-demo')}
                  className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-bold text-lg shadow-xl"
                >
                  <i className="bi bi-rocket-takeoff-fill"></i>
                  Start Your Implementation Today
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}

export default AIReminders;






