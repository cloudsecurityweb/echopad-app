import { useLayoutEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../../components/layout/Navigation';
import Footer from '../../components/layout/Footer';
import { handleIntercomAction } from '../../utils/intercom';
import BuyNowCTA from '../../components/products/BuyNowCTA';
import BeforeAfterSlider from '../../components/products/BeforeAfterSlider';
import { getProductByRoute } from '../../data/products';
import { checkProductOwnership } from '../../utils/productOwnership';
import { useAuth } from '../../contexts/AuthContext';
import usePageTitle from '../../hooks/usePageTitle';

function AIMedicalAssistant() {
  const { isAuthenticated, isLoading } = useAuth();
  const PageTitle = usePageTitle('Echopad AI Medical Assistant');
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
        {/* Hero Section - Clinical Workflow Design */}
        <section className="px-4 md:px-14 pt-32 pb-20 bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50">
          <div className="container mx-auto px-4">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm text-teal-400 hover:text-teal-600 transition-colors mb-6 font-semibold hover:gap-3"
              onClick={handleViewAllProductsClick}
            >
              <i className="bi bi-arrow-left"></i>
              View All Products
            </a>

            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-500 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  <i className="bi bi-heart-pulse-fill"></i>
                  AI MEDICAL ASSISTANT
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4">
                  Complete Visit
                  <span className="block bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    Documentation
                  </span>
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                  Record entire patient sessions and automatically generate comprehensive, EHR-ready charts with structured clinical data.
                </p>

                {/* Clinical Metrics */}
                <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
                  <div className="bg-white rounded-xl px-6 py-3 shadow-lg border-2 border-teal-100">
                    <div className="text-3xl font-bold text-teal-400">80%</div>
                    <div className="text-sm text-gray-600">Time Reduction</div>
                  </div>
                  <div className="bg-white rounded-xl px-6 py-3 shadow-lg border-2 border-emerald-100">
                    <div className="text-3xl font-bold text-emerald-400">100%</div>
                    <div className="text-sm text-gray-600">Visit Capture</div>
                  </div>
                  <div className="bg-white rounded-xl px-6 py-3 shadow-lg border-2 border-cyan-100">
                    <div className="text-3xl font-bold text-cyan-400">95%</div>
                    <div className="text-sm text-gray-600">EHR Accuracy</div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                  <a
                    href="#"
                    onClick={(e) => handleIntercomClick(e, 'request-demo')}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-teal-400 to-emerald-400 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-teal-500 hover:to-emerald-500 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                  >
                    <i className="bi bi-calendar-check text-xl"></i>
                    Book a Demo
                  </a>
                  <a
                    href="#"
                    onClick={(e) => handleIntercomClick(e, 'sign-up')}
                    className="inline-flex items-center justify-center gap-2 bg-white text-teal-400 px-8 py-4 rounded-xl font-bold text-lg hover:bg-teal-50 transition-all border-2 border-teal-300 shadow-lg hover:shadow-xl"
                  >
                    <i className="bi bi-rocket-takeoff text-xl"></i>
                    Get Started
                  </a>
                </div>
              </div>

              {/* Visit Process Timeline */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-teal-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Complete Visit Documentation Process</h3>

                <div className="space-y-6">
                  {/* Recording Phase */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-300 to-emerald-400 rounded-full flex items-center justify-center shadow-lg">
                        <i className="bi bi-mic-fill text-white text-xl"></i>
                      </div>
                    </div>
                    <div className="flex-1 bg-teal-50 rounded-xl p-4 border-2 border-teal-100">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-teal-400 text-white text-xs font-semibold px-2 py-1 rounded">PHASE 1</span>
                        <span className="font-semibold text-gray-900">Session Recording</span>
                        <span className="ml-auto text-sm text-gray-500">0:00 - 15:34</span>
                      </div>
                      <p className="text-gray-700 text-sm">Full patient-provider conversation captured with speaker identification</p>
                    </div>
                  </div>

                  {/* AI Processing Phase */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-300 to-cyan-400 rounded-full flex items-center justify-center shadow-lg">
                        <i className="bi bi-cpu-fill text-white text-xl"></i>
                      </div>
                    </div>
                    <div className="flex-1 bg-emerald-50 rounded-xl p-4 border-2 border-emerald-100">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-emerald-400 text-white text-xs font-semibold px-2 py-1 rounded">PHASE 2</span>
                        <span className="font-semibold text-gray-900">AI Data Extraction</span>
                        <span className="ml-auto text-sm text-gray-500">15:34 - 15:37</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-700">
                          <i className="bi bi-check-circle-fill text-emerald-400"></i>
                          Chief Complaint
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <i className="bi bi-check-circle-fill text-emerald-400"></i>
                          Symptoms
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <i className="bi bi-check-circle-fill text-emerald-400"></i>
                          Diagnosis
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <i className="bi bi-check-circle-fill text-emerald-400"></i>
                          Treatment Plan
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* EHR Output Phase */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-300 to-teal-400 rounded-full flex items-center justify-center shadow-lg">
                        <i className="bi bi-file-earmark-medical-fill text-white text-xl"></i>
                      </div>
                    </div>
                    <div className="flex-1 bg-cyan-50 rounded-xl p-4 border-2 border-cyan-100">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-cyan-400 text-white text-xs font-semibold px-2 py-1 rounded">PHASE 3</span>
                        <span className="font-semibold text-gray-900">EHR-Ready Chart Generated</span>
                        <span className="ml-auto text-sm text-gray-500">15:37</span>
                      </div>
                      <p className="text-gray-700 text-sm mb-2">Complete structured documentation with:</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-gray-700">• HPI</div>
                        <div className="text-gray-700">• Assessment</div>
                        <div className="text-gray-700">• Plan</div>
                        <div className="text-gray-700">• ICD-10 Codes</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Clinical Data Extraction Showcase */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                What Gets Captured Automatically
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Every clinical detail from your patient visit, structured and ready for EHR
              </p>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: 'bi-chat-dots', title: 'Chief Complaint', bgClass: 'from-teal-50 to-teal-100', borderClass: 'border-teal-100 hover:border-teal-300', iconClass: 'from-teal-300 to-teal-400' },
                { icon: 'bi-list-ul', title: 'HPI', bgClass: 'from-emerald-50 to-emerald-100', borderClass: 'border-emerald-100 hover:border-emerald-300', iconClass: 'from-emerald-300 to-emerald-400' },
                { icon: 'bi-clipboard-pulse', title: 'Assessment', bgClass: 'from-cyan-50 to-cyan-100', borderClass: 'border-cyan-100 hover:border-cyan-300', iconClass: 'from-cyan-300 to-cyan-400' },
                { icon: 'bi-calendar-check', title: 'Treatment Plan', bgClass: 'from-teal-50 to-teal-100', borderClass: 'border-teal-100 hover:border-teal-300', iconClass: 'from-teal-300 to-teal-400' },
                { icon: 'bi-code-square', title: 'ICD-10 Codes', bgClass: 'from-emerald-50 to-emerald-100', borderClass: 'border-emerald-100 hover:border-emerald-300', iconClass: 'from-emerald-300 to-emerald-400' },
                { icon: 'bi-file-medical', title: 'Structured Data', bgClass: 'from-cyan-50 to-cyan-100', borderClass: 'border-cyan-100 hover:border-cyan-300', iconClass: 'from-cyan-300 to-cyan-400' },
                { icon: 'bi-person-check', title: 'Vital Signs', bgClass: 'from-teal-50 to-teal-100', borderClass: 'border-teal-100 hover:border-teal-300', iconClass: 'from-teal-300 to-teal-400' },
                { icon: 'bi-prescription', title: 'Medications', bgClass: 'from-emerald-50 to-emerald-100', borderClass: 'border-emerald-100 hover:border-emerald-300', iconClass: 'from-emerald-300 to-emerald-400' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="glass-card rounded-xl p-6 hover-lift shadow-sm text-center"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${item.iconClass} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                    <i className={`bi ${item.icon} text-white text-2xl`}></i>
                  </div>
                  <h3 className="font-bold text-gray-900">{item.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-20 bg-gradient-to-br from-teal-50 to-emerald-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Complete Clinical Documentation Solution
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                {
                  icon: 'bi-clock-history',
                  title: '80% Time Reduction',
                  description: 'Reduce documentation time from 20-30 minutes to just 4-6 minutes per visit',
                  color: 'from-teal-300 to-emerald-400',
                },
                {
                  icon: 'bi-check-circle',
                  title: '100% Visit Capture',
                  description: 'Every clinical detail captured automatically—nothing missed',
                  color: 'from-emerald-300 to-cyan-400',
                },
                {
                  icon: 'bi-file-earmark-medical',
                  title: 'EHR Integration',
                  description: 'Structured data ready for direct integration with any EHR system',
                  color: 'from-cyan-300 to-teal-400',
                },
                {
                  icon: 'bi-code-square',
                  title: 'ICD-10 Coding',
                  description: 'Automated diagnosis coding for accurate billing',
                  color: 'from-teal-300 to-emerald-400',
                },
                {
                  icon: 'bi-shield-check',
                  title: 'HIPAA Compliant',
                  description: 'Zero data retention, end-to-end encryption, SOC 2 certified',
                  color: 'from-emerald-300 to-cyan-400',
                },
                {
                  icon: 'bi-graph-up-arrow',
                  title: 'Improved Billing',
                  description: 'Better documentation leads to 8-12% revenue increase',
                  color: 'from-cyan-300 to-teal-400',
                },
              ].map((benefit, idx) => (
                <div
                  key={idx}
                  className="glass-card rounded-2xl p-6 hover-lift shadow-sm"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${benefit.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                    <i className={`bi ${benefit.icon} text-white text-2xl`}></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
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
                      Perfect For Your Practice
                    </h2>
                    <p className="text-base md:text-lg text-gray-600 mb-2 leading-relaxed">
                      Ideal for primary care, urgent care, and specialty clinics that need comprehensive visit documentation—reduce documentation time by 80% and focus on patient care.
                    </p>
                    <p className="text-sm text-gray-500">
                      Complete documentation for routine visits, follow-ups, and annual exams.
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

        {/* Buy Now Section */}
        <section className="py-20 bg-gradient-to-br from-cyan-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl border-2 border-cyan-100 p-8 md:p-12 shadow-lg">
                {(() => {
                  const product = getProductByRoute('/ai-medical-assistant');
                  if (!product) return null;
                  return (
                    <>
                      <div className="text-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                          Ready to Get Started?
                        </h2>
                        <p className="text-lg text-gray-600 mb-6">
                          Purchase {product.name} directly and start reducing documentation time by 80%.
                        </p>
                        {!isLoading && isAuthenticated && (
                          <div className="mb-6">
                            <div className="inline-flex items-baseline gap-2 bg-gradient-to-r from-cyan-50 to-blue-50 px-6 py-3 rounded-lg border border-cyan-100">
                              <span className="text-4xl font-bold text-gray-900">{product.price}</span>
                              <span className="text-sm text-gray-600">{product.pricePeriod}</span>
                            </div>
                          </div>
                        )}
                        <div className="max-w-md mx-auto">
                          {!isLoading && !isAuthenticated ? (
                            <Link
                              to={`/sign-in?redirect=${encodeURIComponent(window.location.pathname)}`}
                              className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all text-base font-medium shadow-lg hover:shadow-cyan-500/50"
                            >
                              <i className="bi bi-lock-fill"></i>
                              Sign in to view pricing
                            </Link>
                          ) : !isLoading && isAuthenticated ? (
                            (() => {
                              const ownership = checkProductOwnership(product.id);
                              if (ownership) {
                                return (
                                  <div className="w-full px-6 py-4 bg-green-50 border-2 border-green-100 text-green-600 rounded-lg font-medium text-center">
                                    <i className="bi bi-check-circle-fill mr-2 text-xl"></i>
                                    You own this product
                                  </div>
                                );
                              }
                              return (
                                <BuyNowCTA
                                  stripePaymentLink={product.stripePaymentLink}
                                  productName={product.name}
                                  size="lg"
                                  fullWidth={true}
                                />
                              );
                            })()
                          ) : null}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                        {product.metrics.map((metric, idx) => (
                          <div key={idx} className="text-center">
                            <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                            <div className="text-sm text-gray-600">{metric.label}</div>
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
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
                      Ready to see AI Medical Assistant in action?
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
                  onClick={(e) => handleIntercomClick(e, 'request-demo')}
                  className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3.5 rounded-xl hover:bg-gray-800 font-semibold text-sm shadow-md min-w-[140px] transition-colors"
                >
                  <i className="bi bi-chat-dots-fill text-white text-lg"></i>
                  Book a Demo
                </a>
                <a
                  href="#"
                  onClick={(e) => handleIntercomClick(e, 'sign-up')}
                  className="inline-flex items-center gap-2 bg-white text-gray-700 px-6 py-3.5 rounded-xl border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 font-medium text-sm min-w-[140px]"
                >
                  <i className="bi bi-rocket-takeoff text-cyan-500 text-lg"></i>
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

export default AIMedicalAssistant;






