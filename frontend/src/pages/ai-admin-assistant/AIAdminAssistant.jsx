import { useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../../components/layout/Navigation';
import Footer from '../../components/layout/Footer';
import { handleIntercomAction } from '../../utils/intercom';
import BuyNowCTA from '../../components/products/BuyNowCTA';
import { getProductByRoute } from '../../data/products';

function AIAdminAssistant() {
  const handleIntercomClick = (e, action) => {
    e.preventDefault();
    handleIntercomAction(action);
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
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="px-4 md:px-14 pt-32 pb-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5">
                <div className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-4">
                  AI ADMIN ASSISTANT
                </div>
                {(() => {
                  const product = getProductByRoute('/ai-admin-assistant');
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
                  Automated Operational Workflows
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Eliminate repetitive administrative tasks with intelligent automation that handles forms, emails, and scheduling—freeing staff for high-value work.
                </p>

                <div className="space-y-6 mb-8">
                  <div>
                    <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                      <i className="bi bi-briefcase-fill text-teal-500 mr-2"></i>
                      Business Value for Decision Makers
                    </h4>
                    <p className="text-gray-600">
                      For healthcare leaders facing administrative overhead and staff burnout, AI Admin Assistant delivers immediate ROI through automated workflows, reduced manual data entry, and improved operational efficiency. Automate 60% of administrative tasks while freeing staff to focus on patient care and strategic initiatives.
                    </p>
                  </div>

                  <div>
                    <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                      <i className="bi bi-info-circle text-teal-500 mr-2"></i>
                      What You See
                    </h4>
                    <p className="text-gray-600">
                      Emails arrive, forms are submitted, referrals come in. AI reads them, extracts key information, updates systems, drafts responses, and notifies the right people—all automatically.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Benefits</h4>
                    <ul className="space-y-2">
                      {[
                        'Automate referrals, forms, and routine administrative tasks',
                        'Reduce time spent on manual data entry and follow-ups',
                        'Speed up internal workflows and task completion',
                        'Improve coordination between clinical and administrative teams',
                      ].map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-600">
                          <i className="bi bi-check-circle-fill text-green-500 mt-0.5"></i>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                      <i className="bi bi-graph-up text-teal-500 mr-2"></i>
                      Impact Metrics
                    </h4>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      {[
                        { value: '3+ hours', label: 'Saved per admin/day', icon: 'bi-clock-history' },
                        { value: '60%', label: 'Tasks automated', icon: 'bi-robot' },
                        { value: '12 sec', label: 'Average processing time', icon: 'bi-lightning-charge' },
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
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Perfect For</h4>
                    <p className="text-gray-600">
                      Practices with high administrative burden, referral coordination, or staff struggling with repetitive data entry tasks.
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
                        Echopad AI Admin Assistant
                      </span>
                    </h2>
                    <h3 className="text-xl md:text-2xl font-semibold text-gray-700 mb-2">
                      Referral Email → Processed & Scheduled
                    </h3>
                  </div>

                  {/* Step 1 */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        STEP 1
                      </span>
                      <span className="text-sm font-semibold text-gray-900">Incoming Referral Email</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start gap-3 mb-3 pb-3 border-b border-gray-200">
                        <i className="bi bi-envelope-fill text-blue-600 text-xl"></i>
                        <div className="flex-1">
                          <div className="text-sm text-gray-700 mb-1">
                            <strong>From:</strong> Dr. Martinez (Cardiology)
                          </div>
                          <div className="text-sm text-gray-700">
                            <strong>Subject:</strong> Patient Referral - Urgent
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-sm text-gray-700">
                          "I'm referring John Smith (DOB: 05/12/1975) for endocrinology consultation. Patient has uncontrolled diabetes and needs urgent evaluation. Please schedule within 2 weeks."
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
                      <span className="text-sm font-semibold text-gray-900">AI Extracting Information</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-lg p-3 flex items-center gap-3">
                          <i className="bi bi-person text-blue-600 text-xl"></i>
                          <div>
                            <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Patient</div>
                            <div className="text-sm font-semibold text-gray-900">John Smith</div>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 flex items-center gap-3">
                          <i className="bi bi-calendar text-blue-600 text-xl"></i>
                          <div>
                            <div className="text-xs font-semibold text-gray-500 uppercase mb-1">DOB</div>
                            <div className="text-sm font-semibold text-gray-900">05/12/1975</div>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 flex items-center gap-3">
                          <i className="bi bi-stethoscope text-blue-600 text-xl"></i>
                          <div>
                            <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Specialty</div>
                            <div className="text-sm font-semibold text-gray-900">Endocrinology</div>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 flex items-center gap-3">
                          <i className="bi bi-exclamation-triangle text-orange-600 text-xl"></i>
                          <div>
                            <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Priority</div>
                            <div className="text-sm font-semibold text-gray-900">Urgent (2 weeks)</div>
                          </div>
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
                      <span className="text-sm font-semibold text-gray-900">Tasks Completed</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <i className="bi bi-check-circle-fill text-green-500"></i>
                        <span className="text-sm text-gray-700">Patient record created in system</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <i className="bi bi-check-circle-fill text-green-500"></i>
                        <span className="text-sm text-gray-700">Appointment scheduled: March 20 at 2:00 PM</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <i className="bi bi-check-circle-fill text-green-500"></i>
                        <span className="text-sm text-gray-700">Confirmation sent to referring physician</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <i className="bi bi-check-circle-fill text-green-500"></i>
                        <span className="text-sm text-gray-700">Patient notification sent via SMS</span>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 flex items-center gap-2 text-sm text-blue-700 mt-3">
                        <i className="bi bi-bell-fill"></i>
                        <span>Admin team notified • Completed in 12 seconds</span>
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
                  { icon: 'bi-clock-history', value: '3+ hours', label: 'Saved per day' },
                  { icon: 'bi-robot', value: '60%', label: 'Tasks Automated' },
                  { icon: 'bi-lightning-charge', value: '12 sec', label: 'Processing Time' },
                  { icon: 'bi-graph-up-arrow', value: '24/7', label: 'Availability' },
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
                  icon: 'bi-envelope-fill',
                  title: 'Email Automation',
                  subtitle: 'Smart drafting and routing',
                  description: 'Automatically drafts responses to common inquiries, routes emails to appropriate staff, and manages follow-ups.',
                },
                {
                  icon: 'bi-file-earmark-check',
                  title: 'Form Processing',
                  subtitle: 'Automated data entry',
                  description: 'Extracts data from submitted forms and automatically populates relevant systems, eliminating manual data entry.',
                },
                {
                  icon: 'bi-calendar-check',
                  title: 'Schedule Coordination',
                  subtitle: 'Automated scheduling',
                  description: 'Manages appointment scheduling, rescheduling, and cancellations with automated notifications to all parties.',
                },
                {
                  icon: 'bi-graph-up',
                  title: '60% Time Savings',
                  subtitle: 'Efficiency gains',
                  description: 'Administrative staff save 60% of time previously spent on routine tasks, allowing focus on high-value work.',
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
                      <h4 className="text-xl font-bold text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-sm text-blue-600 font-semibold">{feature.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-base text-gray-700 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
            
            {/* CTA */}
            <div className="mt-12 text-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 max-w-3xl mx-auto shadow-2xl">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Ready to Automate Your Administrative Workflows?
                </h3>
                <p className="text-blue-100 mb-6 text-lg">
                  Join innovative healthcare organizations already automating 60% of administrative tasks
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

export default AIAdminAssistant;






