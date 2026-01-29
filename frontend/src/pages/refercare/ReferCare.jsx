import { useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../../components/layout/Navigation';
import Footer from '../../components/layout/Footer';
import { handleIntercomAction } from '../../utils/intercom';
import BuyNowCTA from '../../components/products/BuyNowCTA';
import { getProductByRoute } from '../../data/products';
import BeforeAfterSlider from '../../components/products/BeforeAfterSlider';

function ReferCare() {
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
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-100 to-purple-100 px-6 py-3 rounded-full mb-4">
                    <i className="bi bi-hospital text-blue-600 text-xl"></i>
                    <span className="text-sm font-bold text-blue-700 uppercase tracking-wider">EchoPad</span>
                    <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">ReferCare</span>
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-center">
                  AI-Powered Referral Coordination That <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Closes the Loop</span>
                </h1>
                <p className="text-lg text-gray-600 mb-8 text-center">
                  Streamline referrals, reduce leakage, and ensure patients get the care they need with AI-powered referral coordination.
                </p>

                <div className="space-y-6 mb-8">
                  <div>
                    <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                      <i className="bi bi-briefcase-fill text-teal-500 mr-2"></i>
                      Business Value for Decision Makers
                    </h4>
                    <p className="text-gray-600">
                      For healthcare leaders facing referral leakage and care coordination challenges, ReferCare delivers immediate ROI through improved patient retention, reduced administrative burden, and enhanced care continuity.
                    </p>
                  </div>

                  <div>
                    <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                      <i className="bi bi-info-circle text-teal-500 mr-2"></i>
                      What You See
                    </h4>
                    <p className="text-gray-600">
                      When a referral is created, AI automatically tracks status, sends reminders, and ensures patients complete their referred appointments—all without manual staff intervention.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Benefits</h4>
                    <ul className="space-y-2">
                      {[
                        'Reduce referral leakage and improve care continuity',
                        'Automate referral tracking and follow-up',
                        'Ensure patients complete specialist appointments',
                        'Track referral outcomes and measure success',
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
                        { value: '40%', label: 'Reduction in referral leakage', icon: 'bi-graph-down-arrow' },
                        { value: '60%', label: 'Faster referral completion', icon: 'bi-speedometer' },
                        { value: '80%', label: 'Staff time saved', icon: 'bi-clock-history' },
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
                      Primary care practices, specialty clinics, and health systems looking to improve referral completion rates and care coordination.
                    </p>
                  </div>
                </div>

              </div>

              <div className="lg:col-span-7">
                <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
                  <div className="mb-6 text-center">
                    <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full mb-3">
                      <i className="bi bi-play-circle-fill text-blue-600"></i>
                      <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">LIVE DEMO</span>
                    </div>
                    <div className="mb-2">
                      <span className="text-sm font-bold text-blue-700 uppercase tracking-wider">EchoPad</span>
                      <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ml-2">ReferCare</span>
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      Referral → Tracking → Completion
                    </div>
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

        {/* The Broken Referral System - Past vs Present */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-8 shadow-lg">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-3 bg-red-100 px-5 py-2 rounded-full mb-4">
                    <i className="bi bi-exclamation-triangle-fill text-red-600"></i>
                    <span className="text-sm font-bold text-red-700 uppercase tracking-wider">The Broken Referral System</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                    From Fax Machines & Phone Tag to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Digital Intelligence</span>
                  </h2>
                  <p className="text-lg text-gray-600">
                    See exactly what changed when healthcare moved from manual chaos to AI-powered coordination
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white rounded-xl p-6 border-2 border-red-300">
                    <h3 className="font-bold text-xl text-red-700 mb-4 flex items-center gap-2">
                      <i className="bi bi-x-circle-fill text-red-500"></i>
                      The Old Way (Manual Process)
                    </h3>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start gap-3">
                        <i className="bi bi-printer text-red-500 mt-1 text-xl flex-shrink-0"></i>
                        <span><strong>Fax machines</strong> - send paper referrals that get lost or delayed</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <i className="bi bi-telephone text-red-500 mt-1 text-xl flex-shrink-0"></i>
                        <span><strong>Phone tag</strong> with specialists' offices, wasting hours each week</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <i className="bi bi-file-earmark text-red-500 mt-1 text-xl flex-shrink-0"></i>
                        <span><strong>Paper forms</strong> filled out by hand, physically mailed</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <i className="bi bi-envelope text-red-500 mt-1 text-xl flex-shrink-0"></i>
                        <span><strong>Email attachments</strong> with patient info (major security risk)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <i className="bi bi-folder2-open text-red-500 mt-1 text-xl flex-shrink-0"></i>
                        <span><strong>Physical records</strong> copied, scanned, and sent separately</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <i className="bi bi-question-circle text-red-500 mt-1 text-xl flex-shrink-0"></i>
                        <span><strong>No tracking</strong> - did patient schedule? Unknown for weeks.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <i className="bi bi-hourglass-split text-red-500 mt-1 text-xl flex-shrink-0"></i>
                        <span><strong>Days or weeks</strong> to complete a simple referral</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-xl p-6 border-2 border-green-300">
                    <h3 className="font-bold text-xl text-green-700 mb-4 flex items-center gap-2">
                      <i className="bi bi-check-circle-fill text-green-500"></i>
                      The ReferCare Way (Digital & Intelligent)
                    </h3>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start gap-3">
                        <i className="bi bi-cloud-check text-green-500 mt-1 text-xl flex-shrink-0"></i>
                        <span><strong>EHR integration</strong> - instant digital referral creation from your system</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <i className="bi bi-robot text-green-500 mt-1 text-xl flex-shrink-0"></i>
                        <span><strong>AI automation</strong> - sends patient reminders instantly, no staff needed</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <i className="bi bi-shield-lock text-green-500 mt-1 text-xl flex-shrink-0"></i>
                        <span><strong>HIPAA-compliant</strong> secure health record sharing and encryption</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <i className="bi bi-chat-dots text-green-500 mt-1 text-xl flex-shrink-0"></i>
                        <span><strong>SMS/Email</strong> with secure patient portal links for easy access</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <i className="bi bi-file-medical text-green-500 mt-1 text-xl flex-shrink-0"></i>
                        <span><strong>Complete health records</strong> transferred digitally and securely</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <i className="bi bi-bar-chart-line text-green-500 mt-1 text-xl flex-shrink-0"></i>
                        <span><strong>Real-time tracking</strong> - know exactly where every referral stands</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <i className="bi bi-lightning-charge text-green-500 mt-1 text-xl flex-shrink-0"></i>
                        <span><strong>Minutes, not days</strong> - referral sent and tracked instantly</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                {/* CTA within comparison */}
                <div className="mt-8 pt-8 border-t-2 border-red-300 text-center">
                  <p className="text-lg font-semibold text-gray-900 mb-4">
                    Ready to eliminate fax machines and phone tag from your referral process?
                  </p>
                  <a
                    href="#"
                    onClick={(e) => handleIntercomClick(e, 'request-demo')}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <i className="bi bi-rocket-takeoff-fill"></i>
                    See ReferCare in Action
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Before/After Slider Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <BeforeAfterSlider
              title="How Referrals Were Done: Then vs Now"
              subtitle="From fax machines and phone tag to instant digital coordination with complete health records"
              beforeLabel="Old Manual Methods"
              afterLabel="Modern ReferCare System"
              beforeTitle="📠 Fax, Phone & Paper Era"
              afterTitle="☁ Digital Health Records Era"
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
              afterStat={{ value: '< 5 min', label: 'With digital ReferCare' }}
            />
            
            {/* CTA after slider */}
            <div className="mt-12 text-center">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-8 max-w-3xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Transform Your Referral Process in Minutes
                </h3>
                <p className="text-gray-600 mb-6">
                  Join leading healthcare organizations using EchoPad ReferCare to cut referral time from days to minutes
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="#"
                    onClick={(e) => handleIntercomClick(e, 'request-demo')}
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    <i className="bi bi-calendar-check"></i>
                    Schedule a Demo
                  </a>
                  <a
                    href="#"
                    onClick={(e) => handleIntercomClick(e, 'contact-sales')}
                    className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
                  >
                    <i className="bi bi-chat-dots"></i>
                    Talk to Sales
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Real Use Cases & Behavioral Scenarios */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-5 py-2 rounded-full text-sm font-semibold mb-4">
                <i className="bi bi-lightbulb-fill"></i>
                Real-World Use Cases
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How Healthcare Teams Use <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">ReferCare</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Real scenarios showing how AI referral coordination transforms patient care
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Use Case 1 */}
              <div className="bg-white rounded-2xl border-2 border-blue-200 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <i className="bi bi-heart-pulse-fill text-white text-3xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Cardiology Referral Follow-Through</h3>
                <div className="mb-4">
                  <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                    Primary Care → Cardiology
                  </span>
                </div>
                <p className="text-gray-700 mb-4 text-base">
                  <strong>Scenario:</strong> 58-year-old patient with chest pain needs urgent cardiology consult.
                </p>
                <div className="space-y-2 text-base">
                  <div className="flex items-start gap-2">
                    <i className="bi bi-1-circle-fill text-blue-600 mt-0.5"></i>
                    <span>PCP creates referral in EHR → <strong>ReferCare auto-triggers</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <i className="bi bi-2-circle-fill text-blue-600 mt-0.5"></i>
                    <span>Patient receives SMS with cardiologist contact within <strong>5 minutes</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <i className="bi bi-3-circle-fill text-blue-600 mt-0.5"></i>
                    <span>Automated follow-up at 48 hours: "Have you scheduled?"</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <i className="bi bi-4-circle-fill text-blue-600 mt-0.5"></i>
                    <span>Status syncs to PCP dashboard - <strong>appointment confirmed</strong></span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Outcome:</span>
                    <span className="font-bold text-green-600">✓ Appointment kept</span>
                  </div>
                </div>
              </div>

              {/* Use Case 2 */}
              <div className="bg-white rounded-2xl border-2 border-purple-200 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                  <i className="bi bi-prescription2 text-white text-3xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Behavioral Health Engagement</h3>
                <div className="mb-4">
                  <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                    Primary Care → Mental Health
                  </span>
                </div>
                <p className="text-gray-700 mb-4 text-base">
                  <strong>Scenario:</strong> Patient with depression needs therapy referral but historically high no-show risk.
                </p>
                <div className="space-y-2 text-base">
                  <div className="flex items-start gap-2">
                    <i className="bi bi-1-circle-fill text-purple-600 mt-0.5"></i>
                    <span>ReferCare identifies <strong>high-risk patient</strong> from history</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <i className="bi bi-2-circle-fill text-purple-600 mt-0.5"></i>
                    <span>Sends <strong>empathetic, personalized</strong> outreach via patient's preferred channel</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <i className="bi bi-3-circle-fill text-purple-600 mt-0.5"></i>
                    <span>Escalates to care coordinator if <strong>no response in 72 hours</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <i className="bi bi-4-circle-fill text-purple-600 mt-0.5"></i>
                    <span>Sends appointment reminder 24 hours before visit</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Impact:</span>
                    <span className="font-bold text-green-600">+45% completion rate</span>
                  </div>
                </div>
              </div>

              {/* Use Case 3 */}
              <div className="bg-white rounded-2xl border-2 border-green-200 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center mb-4">
                  <i className="bi bi-arrow-repeat text-white text-3xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Network Leakage Prevention</h3>
                <div className="mb-4">
                  <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                    Multi-Specialty Coordination
                  </span>
                </div>
                <p className="text-gray-700 mb-4 text-base">
                  <strong>Scenario:</strong> Health system losing $500K annually to out-of-network specialist referrals.
                </p>
                <div className="space-y-2 text-base">
                  <div className="flex items-start gap-2">
                    <i className="bi bi-1-circle-fill text-green-600 mt-0.5"></i>
                    <span>ReferCare automatically suggests <strong>in-network specialists</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <i className="bi bi-2-circle-fill text-green-600 mt-0.5"></i>
                    <span>Tracks which specialists have <strong>fastest appointment availability</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <i className="bi bi-3-circle-fill text-green-600 mt-0.5"></i>
                    <span>Dashboards show referral patterns by provider</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <i className="bi bi-4-circle-fill text-green-600 mt-0.5"></i>
                    <span>Alerts when patient schedules <strong>out-of-network</strong></span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">ROI:</span>
                    <span className="font-bold text-green-600">$350K recovered/year</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Behavioral Scenarios */}
            <div className="mt-16 max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  Behavioral Intelligence in Action
                </h3>
                <p className="text-gray-600">
                  ReferCare adapts to patient behavior patterns for maximum engagement
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Scenario 1 */}
                <div className="bg-white rounded-xl border-2 border-blue-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <i className="bi bi-person-check-fill text-blue-600 text-xl"></i>
                    </div>
                    <h4 className="font-bold text-gray-900">High-Engagement Patient</h4>
                  </div>
                  <p className="text-base text-gray-700 mb-3">
                    <strong>Behavior:</strong> Responds to SMS within 1 hour, history of scheduling promptly
                  </p>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-base text-blue-900">
                      <strong>AI Action:</strong> Single SMS with specialist info → monitors for 48 hours → sends confirmation reminder 24 hours before appointment
                    </p>
                  </div>
                </div>

                {/* Scenario 2 */}
                <div className="bg-white rounded-xl border-2 border-orange-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <i className="bi bi-person-x-fill text-orange-600 text-xl"></i>
                    </div>
                    <h4 className="font-bold text-gray-900">Low-Engagement Patient</h4>
                  </div>
                  <p className="text-base text-gray-700 mb-3">
                    <strong>Behavior:</strong> Rarely responds to SMS, history of missed appointments
                  </p>
                  <div className="bg-orange-50 rounded-lg p-3">
                    <p className="text-base text-orange-900">
                      <strong>AI Action:</strong> Multi-channel (SMS + phone call + email) → escalates to care coordinator after 72 hours → offers scheduling assistance
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* CTA after use cases */}
            <div className="mt-12 text-center">
              <div className="bg-white border-2 border-purple-200 rounded-2xl p-8 max-w-3xl mx-auto shadow-lg">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <i className="bi bi-lightbulb-fill text-yellow-500 text-3xl"></i>
                  <h3 className="text-2xl font-bold text-gray-900">
                    See How ReferCare Works for Your Specialty
                  </h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Get a personalized demo tailored to your practice's specific referral challenges
                </p>
                <a
                  href="#"
                  onClick={(e) => handleIntercomClick(e, 'request-demo')}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl"
                >
                  <i className="bi bi-play-circle-fill"></i>
                  Request Custom Demo
                </a>
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
                  { icon: 'bi-clock-history', value: '2 Weeks', label: 'Implementation Time' },
                  { icon: 'bi-graph-up-arrow', value: '40%', label: 'Reduced Leakage' },
                  { icon: 'bi-currency-dollar', value: '$350K+', label: 'Annual ROI' },
                  { icon: 'bi-people', value: '10K+', label: 'Patients Helped' },
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
                  icon: 'bi-arrow-repeat',
                  title: 'Referral Management',
                  subtitle: 'Complete referral lifecycle',
                  items: [
                    {
                      title: 'Automated Tracking',
                      description: 'Monitor referral status from creation to completion automatically',
                    },
                    {
                      title: 'Patient Reminders',
                      description: 'Multi-channel outreach ensures patients follow through',
                    },
                    {
                      title: 'Status Updates',
                      description: 'Real-time visibility into referral progress for staff',
                    },
                    {
                      title: 'Outcome Documentation',
                      description: 'Capture specialist visit results and recommendations',
                    },
                  ],
                },
                {
                  icon: 'bi-graph-up',
                  title: 'Revenue Protection',
                  subtitle: 'Reduce referral leakage',
                  items: [
                    {
                      title: 'Network Retention',
                      description: 'Keep patients within your healthcare system',
                    },
                    {
                      title: 'Completion Rates',
                      description: 'Increase specialist appointment attendance by 40%',
                    },
                    {
                      title: 'Care Coordination',
                      description: 'Ensure patients receive timely specialist care',
                    },
                    {
                      title: 'Quality Metrics',
                      description: 'Improve care coordination scores and patient outcomes',
                    },
                  ],
                },
                {
                  icon: 'bi-shield-check',
                  title: 'Integration & Compliance',
                  subtitle: 'Seamless workflow integration',
                  items: [
                    {
                      title: 'EHR Integration',
                      description: 'Pulls referral data from Epic, Cerner, Athena automatically',
                    },
                    {
                      title: 'HIPAA Compliant',
                      description: 'Secure handling of all patient health information',
                    },
                    {
                      title: 'Bi-Directional Updates',
                      description: 'Status changes sync back to EHR automatically',
                    },
                    {
                      title: 'Custom Workflows',
                      description: 'Configure reminder timing and escalation rules',
                    },
                  ],
                },
                {
                  icon: 'bi-clipboard-data',
                  title: 'Analytics & Insights',
                  subtitle: 'Data-driven optimization',
                  items: [
                    {
                      title: 'Completion Tracking',
                      description: 'Monitor referral completion rates by provider and specialty',
                    },
                    {
                      title: 'Leakage Analysis',
                      description: 'Identify where patients are leaving your network',
                    },
                    {
                      title: 'Time-to-Appointment',
                      description: 'Track how long patients wait for specialist visits',
                    },
                    {
                      title: 'ROI Measurement',
                      description: 'Calculate revenue retained through improved referral management',
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
                      <h4 className="text-xl font-bold text-gray-900 mb-1">{feature.title}</h4>
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
            
            {/* Implementation Timeline */}
            <div className="mt-16 max-w-5xl mx-auto">
              <div className="bg-white rounded-2xl border-2 border-blue-200 p-8 shadow-lg">
                <div className="text-center mb-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    Your ReferCare Deployment Roadmap
                  </h3>
                  <p className="text-gray-600">
                    From planning to full care coordination—a proven implementation path
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      phase: 'Phase 1',
                      title: 'Discovery & Planning',
                      color: 'blue',
                      duration: '1-2 Weeks',
                      icon: 'bi-clipboard-check',
                      tasks: [
                        'Assess current referral workflows and pain points',
                        'Map specialist network and referral patterns',
                        'Configure EHR integration with your system',
                        'Define care coordination protocols',
                        'Set up referral tracking parameters'
                      ]
                    },
                    {
                      phase: 'Phase 2',
                      title: 'Staff Training & Setup',
                      color: 'purple',
                      duration: '1 Week',
                      icon: 'bi-people',
                      tasks: [
                        'Train care coordinators on the platform',
                        'Educate providers on referral workflow',
                        'Set up patient communication templates',
                        'Configure reminder schedules and follow-ups',
                        'Test referral pathways with your team'
                      ]
                    },
                    {
                      phase: 'Phase 3',
                      title: 'Pilot Program',
                      color: 'green',
                      duration: '1-2 Weeks',
                      icon: 'bi-rocket-takeoff',
                      tasks: [
                        'Launch with selected providers and specialties',
                        'Monitor referral completion rates',
                        'Track patient engagement and outcomes',
                        'Gather feedback from staff and specialists',
                        'Refine care coordination workflows'
                      ]
                    },
                    {
                      phase: 'Phase 4',
                      title: 'Full-Scale Deployment',
                      color: 'teal',
                      duration: 'Ongoing',
                      icon: 'bi-graph-up-arrow',
                      tasks: [
                        'Roll out across all providers and specialties',
                        'Measure referral leakage reduction',
                        'Track network retention improvements',
                        'Continuous optimization of workflows',
                        'Regular performance reviews and ROI analysis'
                      ]
                    }
                  ].map((phase, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border-2 border-blue-200 hover:shadow-xl transition-shadow duration-300">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-14 h-14 bg-gradient-to-br from-${phase.color}-500 to-${phase.color}-600 rounded-xl flex items-center justify-center text-white shadow-lg`}>
                          <i className={`bi ${phase.icon} text-2xl`}></i>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`bg-${phase.color}-100 text-${phase.color}-700 px-3 py-1 rounded-full text-xs font-bold`}>
                              {phase.phase}
                            </span>
                            <span className="text-xs text-gray-500">• {phase.duration}</span>
                          </div>
                          <h4 className="text-lg font-bold text-gray-900">{phase.title}</h4>
                        </div>
                      </div>
                      <ul className="space-y-3">
                        {phase.tasks.map((task, taskIdx) => (
                          <li key={taskIdx} className="flex items-start gap-3 text-base text-gray-700">
                            <i className="bi bi-check-circle-fill text-green-500 mt-0.5 flex-shrink-0"></i>
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* CTA */}
            <div className="mt-12 text-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 max-w-3xl mx-auto shadow-2xl">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Ready to Transform Your Referral Process?
                </h3>
                <p className="text-blue-100 mb-6 text-lg">
                  Join innovative healthcare organizations already saving time and reducing referral leakage
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

        {/* Contact Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 md:p-12 shadow-lg text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Ready to See ReferCare in Action?
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Schedule a personalized demo and discover how to reduce referral leakage and improve care coordination.
                </p>
                <a
                  href="#"
                  onClick={(e) => handleIntercomClick(e, 'request-demo')}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
                >
                  <i className="bi bi-check-circle-fill"></i>
                  Request a Demo
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

export default ReferCare;
