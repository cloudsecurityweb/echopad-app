import { useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../../components/layout/Navigation';
import Footer from '../../components/layout/Footer';
import { handleIntercomAction } from '../../utils/intercom';
import BuyNowCTA from '../../components/products/BuyNowCTA';
import { getProductByRoute } from '../../data/products';
import { checkProductOwnership } from '../../utils/productOwnership';
import { useAuth } from '../../contexts/AuthContext';

function AIMedicalAssistant() {
  const { isAuthenticated, isLoading } = useAuth();
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
                  AI MEDICAL ASSISTANT
                </div>
                {(() => {
                  const product = getProductByRoute('/ai-medical-assistant');
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
                      <div className="relative inline-flex items-center gap-3 bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 border-2 border-cyan-200/50 rounded-2xl px-6 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-400/20 to-purple-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10 flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse-glow">
                            <i className="bi bi-lightning-charge-fill text-white text-xl"></i>
                          </div>
                        </div>
                        <div className="relative z-10">
                          <div className="text-xs font-semibold text-cyan-600 uppercase tracking-wider mb-1">
                            ROI Promise
                          </div>
                          <div className="text-2xl md:text-3xl lg:text-4xl font-bold">
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
                  Complete Visit Documentation
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Record entire patient sessions and automatically generate comprehensive, EHR-ready charts with structured clinical data.
                </p>

                <div className="space-y-6 mb-8">
                  <div>
                    <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                      <i className="bi bi-briefcase-fill text-teal-500 mr-2"></i>
                      Business Value for Decision Makers
                    </h4>
                    <p className="text-gray-600">
                      For healthcare leaders facing documentation burden and provider burnout, AI Medical Assistant delivers immediate ROI through complete visit capture, automated clinical data extraction, and seamless EHR integration. Reduce documentation time by 80% while improving billing accuracy and compliance.
                    </p>
                  </div>

                  <div>
                    <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                      <i className="bi bi-info-circle text-teal-500 mr-2"></i>
                      What You See
                    </h4>
                    <p className="text-gray-600">
                      Press record to capture the full patient-provider conversation. AI extracts chief complaints, symptoms, diagnoses, and treatment plans, then outputs structured EHR fields ready for direct integration.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Benefits</h4>
                    <ul className="space-y-2">
                      {[
                        'Capture full patient visits and generate complete clinical documentation',
                        'Automatically create HPI, assessment, and treatment plans',
                        'Reduce missing or incomplete encounter notes',
                        'Prepare structured, EHR-ready data for faster chart completion',
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
                        { value: '80%', label: 'Reduction in documentation time', icon: 'bi-clock-history' },
                        { value: '100%', label: 'Visit data captured', icon: 'bi-check-circle' },
                        { value: '95%', label: 'EHR integration accuracy', icon: 'bi-shield-check' },
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
                      Primary care, urgent care, and specialty clinics that need comprehensive visit documentation with minimal provider input.
                    </p>
                  </div>
                </div>

              </div>

              <div className="lg:col-span-7">
                <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
                  <div className="mb-6">
                    <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
                      LIVE DEMO
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      Patient Visit → Complete EHR Chart
                    </div>
                  </div>

                  {/* Step 1 */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        STEP 1
                      </span>
                      <span className="text-sm font-semibold text-gray-900">Session Recording</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                        <div className="relative">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                          <div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75"></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">Recording Session</span>
                        <span className="ml-auto text-sm font-mono text-gray-600">15:34</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                          <div>
                            <strong className="text-sm text-gray-900">Provider:</strong>
                            <p className="text-sm text-gray-700">"Tell me about your symptoms"</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                          <div>
                            <strong className="text-sm text-gray-900">Patient:</strong>
                            <p className="text-sm text-gray-700">"I've had a persistent cough for 3 weeks and mild fever"</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                          <div>
                            <strong className="text-sm text-gray-900">Provider:</strong>
                            <p className="text-sm text-gray-700">"Any chest pain or shortness of breath?"</p>
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
                      <span className="text-sm font-semibold text-gray-900">AI Extracting Clinical Data</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <i className="bi bi-check-circle-fill text-green-500"></i>
                        <span className="text-sm text-gray-700">Chief Complaint Identified</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <i className="bi bi-check-circle-fill text-green-500"></i>
                        <span className="text-sm text-gray-700">Symptoms Catalogued</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm text-gray-700">Generating Diagnosis...</span>
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
                      <span className="text-sm font-semibold text-gray-900">EHR-Ready Structured Output</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                      <div className="border-b border-gray-200 pb-3">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Chief Complaint</div>
                        <div className="text-sm text-gray-900">Persistent cough, 3 weeks duration</div>
                      </div>
                      <div className="border-b border-gray-200 pb-3">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">HPI</div>
                        <div className="text-sm text-gray-900">
                          Patient presents with 3-week history of persistent cough accompanied by mild intermittent fever...
                        </div>
                      </div>
                      <div className="border-b border-gray-200 pb-3">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Assessment</div>
                        <div className="text-sm text-gray-900">Suspected upper respiratory infection (J06.9)</div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Plan</div>
                        <div className="text-sm text-gray-900">Prescribe antibiotic course, follow-up in 1 week</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Strategic Implementation Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Strategic Implementation Guide for Healthcare Leaders
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Everything you need to know to make an informed decision and ensure successful deployment
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {[
                {
                  icon: 'bi-file-medical',
                  title: 'Full Visit Capture',
                  subtitle: 'Complete documentation from start to finish',
                  description: 'Records complete patient-provider conversations with speaker identification and timestamps. Every clinical detail captured automatically.',
                },
                {
                  icon: 'bi-code-square',
                  title: 'ICD-10 Coding',
                  subtitle: 'Automated diagnosis coding',
                  description: 'Automatically suggests appropriate ICD-10 codes based on documented conditions and symptoms for accurate billing.',
                },
                {
                  icon: 'bi-arrow-left-right',
                  title: 'EHR Integration',
                  subtitle: 'Bidirectional sync',
                  description: 'Pulls patient history from EHR and pushes completed documentation back seamlessly with structured data fields.',
                },
                {
                  icon: 'bi-shield-lock',
                  title: 'Secure Storage',
                  subtitle: 'HIPAA-compliant',
                  description: 'All recordings encrypted and stored securely with automatic deletion after documentation completion.',
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border-2 border-gray-200 p-6 h-full"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-15 h-15 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className={`bi ${feature.icon} text-white text-2xl`}></i>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-gray-700">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Buy Now Section */}
        <section className="py-20 bg-gradient-to-br from-cyan-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl border-2 border-cyan-200 p-8 md:p-12 shadow-lg">
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
                            <div className="inline-flex items-baseline gap-2 bg-gradient-to-r from-cyan-50 to-blue-50 px-6 py-3 rounded-lg border border-cyan-200">
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
                                  <div className="w-full px-6 py-4 bg-green-50 border-2 border-green-200 text-green-800 rounded-lg font-medium text-center">
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

        {/* Contact Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 md:p-12 shadow-lg text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Ready to See AI Medical Assistant in Action?
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Schedule a personalized demo and discover how AI Medical Assistant can transform your documentation workflow.
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

export default AIMedicalAssistant;






