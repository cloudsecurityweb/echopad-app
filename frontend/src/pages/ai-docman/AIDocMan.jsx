import { useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../../components/layout/Navigation';
import Footer from '../../components/layout/Footer';
import { handleIntercomAction } from '../../utils/intercom';
import BuyNowCTA from '../../components/products/BuyNowCTA';
import { getProductByRoute } from '../../data/products';
import { checkProductOwnership } from '../../utils/productOwnership';
import { useAuth } from '../../contexts/AuthContext';

function AIDocMan() {
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
        <section className="px-4 md:px-14 pt-32 pb-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5">
                <div className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-4">
                  AI DOCUMENT MANAGER
                </div>
                {(() => {
                  const product = getProductByRoute('/ai-docman');
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
                  Instant Document Formatting
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Drop in messy transcripts and get back perfectly formatted SOAP notes, H&Ps, and discharge summaries—ready to paste into your EHR.
                </p>

                <div className="space-y-6 mb-8">
                  <div>
                    <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                      <i className="bi bi-briefcase-fill text-teal-500 mr-2"></i>
                      Business Value for Decision Makers
                    </h4>
                    <p className="text-gray-600">
                      For healthcare leaders facing documentation backlogs and administrative overhead, AI Document Manager delivers immediate ROI through reduced transcription costs, faster document turnaround, and improved compliance. Deploy instantly with zero training required—your team can start using it today.
                    </p>
                  </div>

                  <div>
                    <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                      <i className="bi bi-info-circle text-teal-500 mr-2"></i>
                      What You See
                    </h4>
                    <p className="text-gray-600">
                      Paste any raw transcript, select your template (SOAP note, H&P, discharge summary), and watch AI instantly organize it into professional, compliant medical documentation.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Benefits</h4>
                    <ul className="space-y-2">
                      {[
                        'Convert raw transcripts into structured SOAP, H&P, and discharge notes',
                        'Save up to 60 minutes per day for medical assistants and scribes',
                        'Ensure consistent formatting across all clinical documents',
                        'Produce EHR-ready notes without manual editing',
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
                        { value: '60 min', label: 'Saved per assistant/day', icon: 'bi-clock-history' },
                        { value: '95%', label: 'Formatting accuracy', icon: 'bi-check-circle' },
                        { value: '3 sec', label: 'Processing time', icon: 'bi-lightning-charge' },
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
                      Medical assistants, scribes, and practices that need to quickly convert dictation or notes into properly formatted medical documents.
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
                      Raw Transcript → Formatted SOAP Note
                    </div>
                  </div>

                  {/* Step 1 */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        STEP 1
                      </span>
                      <span className="text-sm font-semibold text-gray-900">Raw Transcript Input</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        patient came in today complaining of chest pain started 2 days ago worse with exertion denies shortness of breath vital signs BP 140/90 pulse 88 regular exam unremarkable EKG normal troponin negative...
                      </p>
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
                      <span className="text-sm font-semibold text-gray-900">Template Selection</span>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1 bg-blue-50 border-2 border-blue-500 rounded-lg p-3 flex items-center justify-center gap-2">
                        <i className="bi bi-check-circle-fill text-blue-600"></i>
                        <span className="text-sm font-semibold text-gray-900">SOAP Note</span>
                      </div>
                      <div className="flex-1 bg-gray-50 border-2 border-gray-200 rounded-lg p-3 flex items-center justify-center">
                        <span className="text-sm font-semibold text-gray-700">H&P</span>
                      </div>
                      <div className="flex-1 bg-gray-50 border-2 border-gray-200 rounded-lg p-3 flex items-center justify-center">
                        <span className="text-sm font-semibold text-gray-700">Discharge Summary</span>
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
                      <span className="text-sm font-semibold text-gray-900">Formatted SOAP Note Output</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                      <div>
                        <strong className="text-gray-900 block mb-2">SUBJECTIVE:</strong>
                        <p className="text-sm text-gray-700">
                          Patient presents with chief complaint of chest pain that began 2 days ago. Pain worsens with exertion. Patient denies shortness of breath.
                        </p>
                      </div>
                      <div>
                        <strong className="text-gray-900 block mb-2">OBJECTIVE:</strong>
                        <p className="text-sm text-gray-700">
                          Vital Signs: BP 140/90, Pulse 88 (regular)<br />
                          Physical Exam: Unremarkable<br />
                          Diagnostics: EKG normal, Troponin negative
                        </p>
                      </div>
                      <div>
                        <strong className="text-gray-900 block mb-2">ASSESSMENT:</strong>
                        <p className="text-sm text-gray-700">
                          Atypical chest pain, likely musculoskeletal in origin
                        </p>
                      </div>
                      <div>
                        <strong className="text-gray-900 block mb-2">PLAN:</strong>
                        <p className="text-sm text-gray-700">
                          Follow-up in 1 week. Monitor symptoms. Return if worsening.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Strategic Implementation Section */}
        <section className="py-20 bg-white">
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
                  icon: 'bi-file-earmark-text',
                  title: '50+ Templates',
                  subtitle: 'Pre-built for every specialty',
                  description: 'SOAP, DAP, BIRP, H&P, discharge summaries, progress notes, and custom templates for any specialty. Each template follows industry best practices and regulatory requirements.',
                },
                {
                  icon: 'bi-lightning-charge',
                  title: 'Instant Processing',
                  subtitle: 'Results in under 3 seconds',
                  description: 'Transform transcripts instantly with no waiting. Process individual documents or batches of up to 50 transcripts simultaneously for maximum efficiency.',
                },
                {
                  icon: 'bi-clipboard-check',
                  title: 'Quality Assurance',
                  subtitle: 'Built-in compliance checks',
                  description: 'Automatic validation for completeness, proper formatting, and compliance standards before export. Ensures every document meets regulatory requirements.',
                },
                {
                  icon: 'bi-cloud-download',
                  title: 'Multiple Export Options',
                  subtitle: 'Flexible integration',
                  description: 'Export as PDF, Word, plain text, or directly integrate with your EHR system. Custom branding options available for all document formats.',
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
                  const product = getProductByRoute('/ai-docman');
                  if (!product) return null;
                  return (
                    <>
                      <div className="text-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                          Ready to Get Started?
                        </h2>
                        <p className="text-lg text-gray-600 mb-6">
                          Purchase {product.name} directly and start saving 60 minutes per assistant daily.
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
                  Ready to See AI Document Manager in Action?
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Schedule a personalized demo and discover how AI Document Manager can save your team 60 minutes per day on formatting.
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

export default AIDocMan;






