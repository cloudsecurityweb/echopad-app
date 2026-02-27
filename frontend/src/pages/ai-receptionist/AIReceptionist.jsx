import { useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/layout/Navigation';
import Footer from '../../components/layout/Footer';
import { handleIntercomAction } from '../../utils/intercom';
import BuyNowCTA from '../../components/products/BuyNowCTA';
import { getProductByRoute } from '../../data/products';
import usePageTitle from '../../hooks/usePageTitle';

function AIReceptionist() {
  const PageTitle = usePageTitle('Echopad AI Receptionist');
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
                <div className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-4">
                  AI RECEPTIONIST
                </div>
                {(() => {
                  const product = getProductByRoute('/ai-receptionist');
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
                  24/7 Intelligent Call Handling
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Automate appointment scheduling, patient inquiries, and call routing with conversational AI that never sleeps—handling 100+ calls simultaneously.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="#"
                    onClick={(e) => handleIntercomClick(e, 'request-demo')}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3.5 rounded-full font-bold hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg hover:shadow-cyan-500/50 hover:scale-105"
                  >
                    <i className="bi bi-telephone-fill text-xl"></i>
                    See It In Action
                  </a>
                  <a
                    href="/sign-up"
                    className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-6 py-3.5 rounded-full font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-all hover:scale-105 shadow-sm hover:shadow-md"
                  >
                    Get Started
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
                        Echopad AI Receptionist
                      </span>
                    </h2>
                    <h3 className="text-xl md:text-2xl font-semibold text-gray-700 mb-2">
                      Patient Call → Appointment Booked
                    </h3>
                  </div>

                  {/* Step 1 */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        STEP 1
                      </span>
                      <span className="text-sm font-semibold text-gray-900">Incoming Call</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <i className="bi bi-telephone-fill text-blue-600 text-xl animate-pulse"></i>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">Sarah Johnson</div>
                          <div className="text-sm text-gray-600">2:45 PM • After Hours</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 bg-white rounded-lg p-3">
                        <i className="bi bi-chat-left-quote text-blue-500 text-xl"></i>
                        <p className="text-sm text-gray-700 italic">
                          "Hi, I'd like to schedule an appointment with Dr. Smith for next week."
                        </p>
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
                      <span className="text-sm font-semibold text-gray-900">AI Understanding Request</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <i className="bi bi-check-circle-fill text-green-500"></i>
                        <span className="text-sm text-gray-700">
                          <strong>Intent:</strong> Schedule Appointment
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <i className="bi bi-check-circle-fill text-green-500"></i>
                        <span className="text-sm text-gray-700">
                          <strong>Provider:</strong> Dr. Smith
                        </span>
                      </div>
                      <div className="bg-white rounded-lg p-3 mt-3">
                        <div className="flex items-start gap-2 mb-2">
                          <i className="bi bi-robot text-blue-500"></i>
                          <p className="text-sm text-gray-700">
                            "I can help you schedule with Dr. Smith. I have availability on Tuesday at 10 AM or Thursday at 2 PM. Which works better?"
                          </p>
                        </div>
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
                      <span className="text-sm font-semibold text-gray-900">Appointment Confirmed</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
                        <i className="bi bi-calendar-check text-green-500 text-xl"></i>
                        <span className="font-semibold text-gray-900">Appointment Booked</span>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <strong className="text-gray-700">Patient:</strong>
                          <span className="text-gray-900">Sarah Johnson</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <strong className="text-gray-700">Provider:</strong>
                          <span className="text-gray-900">Dr. Smith</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <strong className="text-gray-700">Date & Time:</strong>
                          <span className="text-gray-900">Tuesday, March 19 at 10:00 AM</span>
                        </div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 flex items-center gap-2 text-sm text-blue-700">
                        <i className="bi bi-bell-fill"></i>
                        <span>Staff notified • Calendar updated • SMS sent to patient</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why 24/7 Matters - single narrative section (replaces cookie-cutter blocks) */}
        <section className="py-20 bg-gradient-to-b from-white to-slate-50" aria-labelledby="why-receptionist-heading">
          <div className="container mx-auto px-4">
            <h2 id="why-receptionist-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Why Practices Choose AI Receptionist
            </h2>
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <p className="text-lg text-gray-600 leading-relaxed">
                  For healthcare leaders facing high call volumes and front-desk staffing costs, AI Receptionist delivers immediate ROI through 24/7 availability, reduced staffing needs, and improved patient satisfaction. Handle 80% of calls automatically while reducing front-desk costs by $60K–$120K annually.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Patients call anytime, day or night. AI answers instantly, understands their request, books appointments, provides information, or escalates to staff—all in natural conversation. No rigid scripts; same experience in Spanish or English. Go live in under a week with your existing phone number and no hardware changes.
                </p>
                <ul className="space-y-2">
                  {['Answer calls 24/7, including after hours', 'Reduce missed calls and lost appointments', 'Automate scheduling and routine requests', 'Free front-desk staff for in-person care'].map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-600">
                      <i className="bi bi-check-circle-fill text-green-500 mt-0.5 flex-shrink-0"></i>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-cyan-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Real impact</h3>
                <div className="grid grid-cols-1 gap-6">
                  {[
                    { value: '80%', label: 'Calls handled automatically', icon: 'bi-telephone' },
                    { value: '0 min', label: 'Average wait time', icon: 'bi-clock-history' },
                    { value: '$60K+', label: 'Annual cost savings', icon: 'bi-currency-dollar' },
                  ].map((metric, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                        <i className={`bi ${metric.icon} text-cyan-600 text-xl`}></i>
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
                  { icon: 'bi-telephone', value: '80%', label: 'Calls Automated' },
                  { icon: 'bi-clock-history', value: '0 min', label: 'Wait Time' },
                  { icon: 'bi-currency-dollar', value: 'Significant', label: 'Annual Savings' },
                  { icon: 'bi-graph-up-arrow', value: '24/7', label: 'Availability' },
                ].map((stat, idx) => (
                  <div key={idx} className="glass-card rounded-xl p-4 hover-lift shadow-sm">
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
                  title: 'Front Desk Cost Reduction',
                  subtitle: 'Staffing efficiency at scale',
                  items: [
                    {
                      title: 'Handle 80% of Call Volume',
                      description: 'Free your front desk from routine call work while patients still get help quickly for questions, appointments, and refills.',
                    },
                    {
                      title: '24/7 Availability',
                      description: 'No more voicemail—patients get instant help outside business hours',
                    },
                    {
                      title: 'Reduce Staffing Needs',
                      description: 'Scale practice growth without proportional front desk hiring',
                    },
                    {
                      title: 'ROI in 90 Days',
                      description: 'Typical practice saves $60K-$120K annually in staffing costs',
                    },
                  ],
                },
                {
                  icon: 'bi-people-fill',
                  title: 'Patient Satisfaction',
                  subtitle: 'Better experience drives retention',
                  items: [
                    {
                      title: 'Zero Hold Time',
                      description: 'Patients connect instantly instead of waiting on hold for 5-15 minutes',
                    },
                    {
                      title: 'Natural Conversations',
                      description: 'Give patients a smoother call experience with natural conversation instead of rigid phone trees.',
                    },
                    {
                      title: 'Consistent Service Quality',
                      description: 'Every patient receives the same high-quality experience, regardless of time or staff availability',
                    },
                    {
                      title: 'Multilingual Support',
                      description: 'Serve diverse populations with 40+ language options',
                    },
                  ],
                },
                {
                  icon: 'bi-shield-lock-fill',
                  title: 'Integration & Security',
                  subtitle: 'Seamless technology adoption',
                  items: [
                    {
                      title: 'EHR/PM Integration',
                      description: 'Appointments book straight into Epic, Cerner, Athena—no double entry',
                    },
                    {
                      title: 'HIPAA Compliant',
                      description: 'Encrypted conversations, secure authentication, complete audit logs',
                    },
                    {
                      title: 'Phone System Compatible',
                      description: 'Use your existing phones—no new hardware or IT changes',
                    },
                    {
                      title: 'Smart Call Routing',
                      description: 'Complex issues automatically escalated to human staff with full context',
                    },
                  ],
                },
                {
                  icon: 'bi-graph-up-arrow',
                  title: 'Performance Analytics',
                  subtitle: 'Data-driven operations',
                  items: [
                    {
                      title: 'Call Volume Insights',
                      description: 'Identify peak times to optimize staff scheduling',
                    },
                    {
                      title: 'Common Question Tracking',
                      description: 'Understand patient needs to improve proactive communication',
                    },
                    {
                      title: 'Appointment Fill Rate',
                      description: 'Monitor same-day scheduling efficiency and cancellation patterns',
                    },
                    {
                      title: 'Staff Productivity',
                      description: 'Measure time saved on routine tasks for better workforce planning',
                    },
                  ],
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="glass-card rounded-2xl p-6 h-full hover-lift shadow-sm"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
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
                  Ready to Transform Your Front Desk?
                </h3>
                <p className="text-blue-100 mb-6 text-lg">
                  Join innovative healthcare organizations already handling 80% of calls automatically
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
    </div>
  );
}

export default AIReceptionist;






