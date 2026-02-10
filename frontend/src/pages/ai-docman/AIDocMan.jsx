import { useLayoutEffect } from 'react';
import Navigation from '../../components/layout/Navigation';
import Footer from '../../components/layout/Footer';
import { handleIntercomAction } from '../../utils/intercom';
import BeforeAfterSlider from '../../components/products/BeforeAfterSlider';
import usePageTitle from '../../hooks/usePageTitle';

function AIDocMan() {
  const PageTitle = usePageTitle('Echopad AI Document Manager');
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
      {PageTitle}
      <Navigation />
      <main>
        {/* Hero Section - Document Focused Design */}
        <section className="px-4 md:px-14 pt-32 pb-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
          <div className="container mx-auto px-4">
            <a
              href="/#agents"
              className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-600 transition-colors mb-6 font-semibold hover:gap-3"
            >
              <i className="bi bi-arrow-left"></i>
              View All Products
            </a>

            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-500 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <i className="bi bi-file-earmark-text-fill"></i>
                AI DOCUMENT MANAGER
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4">
                Transform Transcripts in
                <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  3 Seconds
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Turn messy dictation into perfectly formatted SOAP notes, H&Ps, and discharge summaries—instantly.
              </p>

              {/* Speed Metrics */}
              <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
                <div className="bg-white rounded-xl px-6 py-3 shadow-lg border-2 border-indigo-100">
                  <div className="text-3xl font-bold text-indigo-400">3 sec</div>
                  <div className="text-sm text-gray-600">Processing Time</div>
                </div>
                <div className="bg-white rounded-xl px-6 py-3 shadow-lg border-2 border-purple-100">
                  <div className="text-3xl font-bold text-purple-400">60 min</div>
                  <div className="text-sm text-gray-600">Saved Daily</div>
                </div>
                <div className="bg-white rounded-xl px-6 py-3 shadow-lg border-2 border-pink-100">
                  <div className="text-3xl font-bold text-pink-400">95%</div>
                  <div className="text-sm text-gray-600">Accuracy</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <a
                  href="#"
                  onClick={(e) => handleIntercomClick(e, 'request-demo')}
                  className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-400 to-purple-400 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-indigo-500 hover:to-purple-500 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  <i className="bi bi-calendar-check text-xl"></i>
                  Schedule a Demo
                </a>
                <a
                  href="#"
                  onClick={(e) => handleIntercomClick(e, 'sign-up')}
                  className="inline-flex items-center justify-center gap-3 bg-white text-indigo-400 px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all border-2 border-indigo-300 shadow-lg hover:shadow-xl"
                >
                  <i className="bi bi-rocket-takeoff text-xl"></i>
                  Start Free Trial
                </a>
              </div>
            </div>

            {/* Before/After Document Comparison */}
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-indigo-100">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">See the Transformation</h3>
                  <p className="text-gray-600">Raw transcript → Perfectly formatted SOAP note</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Before */}
                  <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-100">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 bg-red-300 rounded-full"></div>
                      <span className="font-semibold text-red-500">Before: Raw Transcript</span>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-red-100">
                      <p className="text-sm text-gray-700 leading-relaxed font-mono">
                        patient came in today complaining of chest pain started 2 days ago worse with exertion denies shortness of breath vital signs BP 140/90 pulse 88 regular exam unremarkable EKG normal troponin negative...
                      </p>
                    </div>
                    <div className="mt-4 text-center">
                      <div className="text-2xl font-bold text-red-400">15-30 min</div>
                      <div className="text-sm text-gray-600">Manual formatting time</div>
                    </div>
                  </div>

                  {/* After */}
                  <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-100">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 bg-green-300 rounded-full"></div>
                      <span className="font-semibold text-green-500">After: Formatted SOAP Note</span>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-green-100">
                      <div className="space-y-3 text-sm">
                        <div>
                          <strong className="text-gray-900 block mb-1">SUBJECTIVE:</strong>
                          <p className="text-gray-700">Patient presents with chest pain that began 2 days ago...</p>
                        </div>
                        <div>
                          <strong className="text-gray-900 block mb-1">OBJECTIVE:</strong>
                          <p className="text-gray-700">BP 140/90, Pulse 88, EKG normal...</p>
                        </div>
                        <div>
                          <strong className="text-gray-900 block mb-1">ASSESSMENT:</strong>
                          <p className="text-gray-700">Atypical chest pain, likely musculoskeletal...</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <div className="text-2xl font-bold text-green-400">3 sec</div>
                      <div className="text-sm text-gray-600">AI formatting time</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Template Gallery Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                50+ Professional Templates
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Pre-built templates for every specialty and document type
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-6xl mx-auto mb-12">
              {[
                { name: 'SOAP Note', icon: 'bi-file-medical', color: 'from-indigo-300 to-purple-400' },
                { name: 'H&P', icon: 'bi-file-earmark-medical', color: 'from-purple-300 to-pink-400' },
                { name: 'Discharge', icon: 'bi-file-check', color: 'from-pink-300 to-rose-400' },
                { name: 'Progress', icon: 'bi-file-text', color: 'from-rose-300 to-red-400' },
                { name: 'DAP Note', icon: 'bi-file-earmark-text', color: 'from-red-300 to-orange-400' },
                { name: 'BIRP', icon: 'bi-file-earmark', color: 'from-orange-300 to-amber-400' },
              ].map((template, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border-2 border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${template.color} rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    <i className={`bi ${template.icon} text-white text-xl`}></i>
                  </div>
                  <div className="text-center text-sm font-semibold text-gray-700">{template.name}</div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <p className="text-gray-600 mb-4">Plus custom templates for any specialty</p>
              <a
                href="#"
                onClick={(e) => handleIntercomClick(e, 'request-demo')}
                className="inline-flex items-center gap-2 text-indigo-400 font-semibold hover:text-indigo-600"
              >
                View All Templates
                <i className="bi bi-arrow-right"></i>
              </a>
            </div>
          </div>
        </section>

        {/* Process Timeline Section */}
        <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Simple 3-Step Process
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                From messy transcript to perfectly formatted document in seconds
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline Line */}
                <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 transform -translate-y-1/2"></div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                  {[
                    {
                      step: '1',
                      title: 'Paste Transcript',
                      description: 'Copy and paste any raw transcript or dictation',
                      icon: 'bi-clipboard',
                      borderClass: 'border-indigo-100 hover:border-indigo-300',
                      iconClass: 'from-indigo-300 to-indigo-400',
                      badgeClass: 'bg-indigo-50 text-indigo-500',
                    },
                    {
                      step: '2',
                      title: 'Choose Template',
                      description: 'Select from 50+ templates or use custom',
                      icon: 'bi-list-check',
                      borderClass: 'border-purple-100 hover:border-purple-300',
                      iconClass: 'from-purple-300 to-purple-400',
                      badgeClass: 'bg-purple-50 text-purple-500',
                    },
                    {
                      step: '3',
                      title: 'Get Formatted',
                      description: 'Receive perfectly formatted document instantly',
                      icon: 'bi-file-check',
                      borderClass: 'border-pink-100 hover:border-pink-300',
                      iconClass: 'from-pink-300 to-pink-400',
                      badgeClass: 'bg-pink-50 text-pink-500',
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="relative">
                      <div className={`bg-white rounded-2xl p-6 shadow-xl border-2 ${item.borderClass} transition-all`}>
                        <div className={`w-16 h-16 bg-gradient-to-br ${item.iconClass} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                          <i className={`bi ${item.icon} text-white text-2xl`}></i>
                        </div>
                        <div className="text-center mb-2">
                          <span className={`inline-block ${item.badgeClass} px-3 py-1 rounded-full text-sm font-bold`}>
                            STEP {item.step}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{item.title}</h3>
                        <p className="text-gray-600 text-center text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features Grid */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Why Healthcare Teams Choose AI Document Manager
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                {
                  icon: 'bi-lightning-charge-fill',
                  title: 'Lightning Fast',
                  description: '3-second processing vs 15-30 minutes manual formatting',
                  color: 'from-yellow-400 to-orange-500',
                },
                {
                  icon: 'bi-shield-check',
                  title: 'HIPAA Compliant',
                  description: 'Zero data retention, end-to-end encryption, SOC 2 certified',
                  color: 'from-green-400 to-emerald-500',
                },
                {
                  icon: 'bi-file-earmark-text',
                  title: '50+ Templates',
                  description: 'Pre-built for every specialty with custom template support',
                  color: 'from-indigo-400 to-purple-500',
                },
                {
                  icon: 'bi-clock-history',
                  title: 'Save 60 Min/Day',
                  description: 'Per assistant—that\'s 5 hours per week per person',
                  color: 'from-blue-400 to-cyan-500',
                },
                {
                  icon: 'bi-check-circle',
                  title: '95% Accuracy',
                  description: 'Consistent formatting with built-in compliance checks',
                  color: 'from-purple-400 to-pink-500',
                },
                {
                  icon: 'bi-plug',
                  title: 'EHR Ready',
                  description: 'Works with any EHR via copy-paste or direct integration',
                  color: 'from-pink-400 to-rose-500',
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border-2 border-gray-200 hover:border-indigo-200 hover:shadow-xl transition-all group"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <i className={`bi ${feature.icon} text-white text-2xl`}></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ROI Calculator Section */}
        <section className="py-20 bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Calculate Your Time Savings
              </h2>
              <p className="text-xl text-indigo-50 mb-8 max-w-2xl mx-auto">
                See how much time your team could save with AI Document Manager
              </p>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/20 max-w-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div>
                    <div className="text-4xl font-bold mb-2">60 min</div>
                    <div className="text-indigo-50">Saved per assistant/day</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold mb-2">5 hrs</div>
                    <div className="text-indigo-50">Saved per assistant/week</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold mb-2">20 hrs</div>
                    <div className="text-indigo-50">Saved per assistant/month</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="#"
                    onClick={(e) => handleIntercomClick(e, 'request-demo')}
                    className="inline-flex items-center justify-center gap-3 bg-white text-indigo-500 px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                  >
                    <i className="bi bi-calculator text-2xl"></i>
                    Calculate Your ROI
                  </a>
                  <a
                    href="#"
                    onClick={(e) => handleIntercomClick(e, 'sign-up')}
                    className="inline-flex items-center justify-center gap-3 bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-800 transition-all border-2 border-white/30 shadow-xl"
                  >
                    <i className="bi bi-rocket-takeoff text-2xl"></i>
                    Start Free Trial
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-gray-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Save 60 Minutes Daily?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join healthcare teams using AI Document Manager to eliminate manual formatting and improve documentation quality
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <a
                  href="#"
                  onClick={(e) => handleIntercomClick(e, 'request-demo')}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  <i className="bi bi-calendar-check text-2xl"></i>
                  Schedule a Demo
                </a>
                <a
                  href="#"
                  onClick={(e) => handleIntercomClick(e, 'sign-up')}
                  className="inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl"
                >
                  <i className="bi bi-rocket-takeoff text-2xl"></i>
                  Start Free Trial
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto pt-8 border-t border-gray-700">
                {[
                  { icon: 'bi-shield-check', text: 'HIPAA Compliant' },
                  { icon: 'bi-lightning-charge', text: '3-Second Processing' },
                  { icon: 'bi-headset', text: '24/7 Support' },
                ].map((feature, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <i className={`bi ${feature.icon} text-3xl text-indigo-300`}></i>
                    <span className="font-semibold text-gray-300">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default AIDocMan;






