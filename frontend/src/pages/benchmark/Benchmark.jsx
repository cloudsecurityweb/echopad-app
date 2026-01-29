import { useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../../components/layout/Navigation';
import Footer from '../../components/layout/Footer';
import { handleIntercomAction } from '../../utils/intercom';
import BuyNowCTA from '../../components/products/BuyNowCTA';
import { getProductByRoute } from '../../data/products';
import { checkProductOwnership } from '../../utils/productOwnership';
import { useAuth } from '../../contexts/AuthContext';

function Benchmark() {
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
                <a
                  href="/#agents"
                  className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4"
                >
                  <i className="bi bi-arrow-left"></i>
                  Back to Products
                </a>
                <div className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-4">
                  BENCHMARK
                </div>
                {(() => {
                  const product = getProductByRoute('/benchmark');
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
                  Track and Optimize Clinical Performance
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Advanced analytics platform that benchmarks your practice against industry standards and identifies opportunities for improvement.
                </p>

                <div className="space-y-6 mb-8">
                  <div>
                    <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                      <i className="bi bi-briefcase-fill text-teal-500 mr-2"></i>
                      Business Value for Decision Makers
                    </h4>
                    <p className="text-gray-600">
                      For healthcare leaders seeking data-driven insights, Benchmark delivers real-time performance tracking and actionable recommendations to improve clinical outcomes, optimize workflows, and ensure compliance with quality metrics.
                    </p>
                  </div>

                  <div>
                    <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                      <i className="bi bi-info-circle text-teal-500 mr-2"></i>
                      What You See
                    </h4>
                    <p className="text-gray-600">
                      Comprehensive dashboards showing your practice's performance against national benchmarks, with drill-down capabilities to identify specific areas for improvement and automated reporting for stakeholders.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Benefits</h4>
                    <ul className="space-y-2">
                      {[
                        'Real-time performance dashboards',
                        'Industry benchmark comparisons',
                        'Custom KPI tracking',
                        'Automated reporting',
                        'Quality improvement insights',
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
                        { value: '25%', label: 'Improvement in clinical outcomes', icon: 'bi-graph-up-arrow' },
                        { value: '90%', label: 'Data accuracy', icon: 'bi-shield-check' },
                        { value: '50+', label: 'Tracked metrics', icon: 'bi-bar-chart-fill' },
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
                      Quality improvement teams, practice administrators, and healthcare networks focused on data-driven clinical excellence.
                    </p>
                  </div>
                </div>

              </div>

              <div className="lg:col-span-7">
                <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
                  <div className="mb-6">
                    <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
                      PLATFORM PREVIEW
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      Performance Analytics Dashboard
                    </div>
                  </div>

                  {/* Dashboard Preview */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">Clinical Quality Metrics</h4>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Live Data</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4">
                          <div className="text-2xl font-bold text-green-600">92%</div>
                          <div className="text-xs text-gray-600">Patient Satisfaction</div>
                          <div className="text-xs text-green-600 mt-1">+5% vs. benchmark</div>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <div className="text-2xl font-bold text-blue-600">87%</div>
                          <div className="text-xs text-gray-600">Documentation Quality</div>
                          <div className="text-xs text-blue-600 mt-1">+3% vs. benchmark</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Benchmark Comparison</h4>
                      <div className="space-y-3">
                        {[
                          { metric: 'Wait Time', value: 12, benchmark: 18, unit: 'min' },
                          { metric: 'Visit Duration', value: 28, benchmark: 25, unit: 'min' },
                          { metric: 'Follow-up Rate', value: 85, benchmark: 78, unit: '%' },
                        ].map((item, idx) => (
                          <div key={idx} className="bg-white rounded-lg p-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-700">{item.metric}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-gray-900">{item.value}{item.unit}</span>
                                <span className="text-xs text-gray-500">vs {item.benchmark}{item.unit}</span>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${item.value > item.benchmark ? 'bg-green-500' : 'bg-blue-500'}`}
                                style={{ width: `${Math.min((item.value / item.benchmark) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Actionable Insights</h4>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 text-sm">
                          <i className="bi bi-lightbulb-fill text-yellow-500 mt-0.5"></i>
                          <span className="text-gray-700">Peak appointment times show 15% higher no-show rates</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <i className="bi bi-lightbulb-fill text-yellow-500 mt-0.5"></i>
                          <span className="text-gray-700">Documentation completion within 24hrs improved by 18%</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <i className="bi bi-lightbulb-fill text-yellow-500 mt-0.5"></i>
                          <span className="text-gray-700">Patient satisfaction correlates with provider response time</span>
                        </div>
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
                  icon: 'bi-rocket-takeoff',
                  title: 'Quick Deployment',
                  subtitle: 'Start tracking in days, not months',
                  items: [
                    {
                      title: 'Rapid Integration',
                      description: 'Connect to your EHR and PM systems with pre-built integrations',
                    },
                    {
                      title: 'Automated Data Collection',
                      description: 'No manual data entry—metrics are calculated automatically from your systems',
                    },
                    {
                      title: 'Custom Dashboards',
                      description: 'Tailored views for executives, QI teams, and clinical leadership',
                    },
                    {
                      title: 'Training Included',
                      description: 'Comprehensive onboarding ensures your team maximizes platform value',
                    },
                  ],
                },
                {
                  icon: 'bi-people-fill',
                  title: 'Quality Improvement',
                  subtitle: 'Drive measurable clinical excellence',
                  items: [
                    {
                      title: 'Benchmark Against Peers',
                      description: 'Compare performance to similar practices and national standards',
                    },
                    {
                      title: 'Identify Opportunities',
                      description: 'AI-powered insights highlight areas for improvement',
                    },
                    {
                      title: 'Track Initiatives',
                      description: 'Monitor the impact of quality improvement programs in real-time',
                    },
                    {
                      title: 'Regulatory Reporting',
                      description: 'Automated compliance reports for MIPS, HEDIS, and other programs',
                    },
                  ],
                },
                {
                  icon: 'bi-shield-lock-fill',
                  title: 'Data Security',
                  subtitle: 'Enterprise-grade protection',
                  items: [
                    {
                      title: 'HIPAA Compliant',
                      description: 'Full encryption, access controls, and audit logging',
                    },
                    {
                      title: 'SOC 2 Certified',
                      description: 'Annual third-party security audits and compliance verification',
                    },
                    {
                      title: 'Role-Based Access',
                      description: 'Granular permissions ensure users only see relevant data',
                    },
                    {
                      title: 'Data Ownership',
                      description: 'Your data belongs to you—export anytime, no lock-in',
                    },
                  ],
                },
                {
                  icon: 'bi-graph-up-arrow',
                  title: 'Advanced Analytics',
                  subtitle: 'Deep insights, actionable recommendations',
                  items: [
                    {
                      title: '50+ Pre-Built Metrics',
                      description: 'Track everything from patient satisfaction to financial performance',
                    },
                    {
                      title: 'Custom KPI Builder',
                      description: 'Create organization-specific metrics aligned with your goals',
                    },
                    {
                      title: 'Predictive Analytics',
                      description: 'AI forecasts trends and identifies potential issues before they escalate',
                    },
                    {
                      title: 'Automated Reporting',
                      description: 'Scheduled reports delivered to stakeholders on your timeline',
                    },
                  ],
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
                  <ul className="space-y-3">
                    {feature.items.map((item, itemIdx) => (
                      <li
                        key={itemIdx}
                        className={`flex items-start gap-3 pb-3 ${itemIdx < feature.items.length - 1 ? 'border-b border-gray-200' : ''
                          }`}
                      >
                        <i className="bi bi-check-circle-fill text-green-500 text-lg flex-shrink-0 mt-0.5"></i>
                        <div>
                          <strong className="block text-gray-900 mb-1">{item.title}</strong>
                          <span className="text-sm text-gray-600">{item.description}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
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
                  const product = getProductByRoute('/benchmark');
                  if (!product) return null;
                  return (
                    <>
                      <div className="text-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                          Ready to Get Started?
                        </h2>
                        <p className="text-lg text-gray-600 mb-6">
                          Purchase {product.name} directly and start tracking performance metrics today.
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
                  Ready to See Benchmark in Action?
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Schedule a personalized demo and discover how data-driven insights can transform your clinical performance.
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

export default Benchmark;
