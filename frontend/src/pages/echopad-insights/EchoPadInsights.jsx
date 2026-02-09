import { useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../../components/layout/Navigation';
import Footer from '../../components/layout/Footer';
import { handleIntercomAction } from '../../utils/intercom';
import { useAuth } from '../../contexts/AuthContext';
import usePageTitle from '../../hooks/usePageTitle';

function EchoPadInsights() {
  const { isAuthenticated, isLoading } = useAuth();
  const PageTitle = usePageTitle('Echopad Insights');

  const handleIntercomClick = (e, action) => {
    e.preventDefault();
    handleIntercomAction(action);
  };

  // Scroll to top when component mounts (instant, no animation)
  useLayoutEffect(() => {
    const html = document.documentElement;
    const originalScrollBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';

    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);

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
              <div className="lg:col-span-6">
                <a
                  href="/#agents"
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors mb-4 font-semibold hover:gap-3"
                >
                  <i className="bi bi-arrow-left"></i>
                  View All Products
                </a>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-3">
                  Insights
                </h1>
                <p className="text-xl md:text-2xl text-gray-700 font-semibold mb-6">
                  Healthcare Financial Intelligence & Benchmarking
                </p>

                <p className="text-base text-gray-600 mb-8">
                  Aggregate multi-payer data nationwide to identify underpayments, benchmark performance against peers, and optimize clinical and financial outcomes—all in one powerful platform.
                </p>

                {/* Interactive Stats Banner */}
                <div className="bg-gradient-to-r from-purple-500 via-blue-500 to-teal-600 rounded-2xl p-5 md:p-6 mb-6 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.02] animate-gradient-x overflow-hidden">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 min-w-0">
                    <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                        <i className="bi bi-cash-stack text-white text-xl md:text-2xl animate-bounce"></i>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-white/80 text-xs md:text-sm font-semibold uppercase tracking-wide mb-1 break-words">
                          Revenue Intelligence
                        </div>
                        <div className="text-white text-lg md:text-xl lg:text-2xl font-bold break-words whitespace-normal">
                          Identify: <span className="text-yellow-300">$500K+</span> Annually
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 md:gap-3 flex-shrink-0">
                      <div className="bg-white/20 backdrop-blur-sm px-3 md:px-4 py-2 rounded-lg min-w-[80px] md:min-w-[100px] text-center">
                        <div className="text-white/80 text-xs whitespace-nowrap">Coverage</div>
                        <div className="text-white font-bold text-base md:text-lg">All 50 States</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm px-3 md:px-4 py-2 rounded-lg min-w-[80px] md:min-w-[100px] text-center">
                        <div className="text-white/80 text-xs whitespace-nowrap">Setup</div>
                        <div className="text-white font-bold text-base md:text-lg">&lt;1 Week</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons After Stats Banner */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <a
                    href="#"
                    onClick={(e) => handleIntercomClick(e, 'request-demo')}
                    className="inline-flex items-center justify-center gap-3 bg-purple-600 text-white px-6 py-3 rounded-xl font-bold text-base hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <i className="bi bi-calendar-check text-xl"></i>
                    Request a Demo
                  </a>
                  <a
                    href="#"
                    onClick={(e) => handleIntercomClick(e, 'sign-up')}
                    className="inline-flex items-center justify-center gap-3 bg-white text-purple-600 px-6 py-3 rounded-xl font-bold text-base hover:bg-gray-50 transition-all border-2 border-purple-600 hover:border-purple-700"
                  >
                    <i className="bi bi-play-circle text-xl"></i>
                    See How It Works
                  </a>
                </div>

                <div className="space-y-6 mb-8">
                  <div>
                    <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                      <i className="bi bi-briefcase-fill text-purple-500 mr-2"></i>
                      For Healthcare Leaders & CFOs
                    </h4>
                    <p className="text-gray-600">
                      Stop negotiating blind. Insights aggregates nationwide payer data, identifies where you're underpaid, and gives you the leverage to negotiate better contracts—backed by real market benchmarks.
                    </p>
                  </div>

                  <div>
                    <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                      <i className="bi bi-info-circle text-purple-500 mr-2"></i>
                      What You Get
                    </h4>
                    <p className="text-gray-600">
                      Real-time access to multi-payer reimbursement data across all 50 states. Benchmark your rates against regional peers, identify underpayments by CPT code, and discover hidden revenue opportunities—all in an intuitive dashboard.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Benefits</h4>
                    <ul className="space-y-2">
                      {[
                        'Identify underpayments across all payer contracts',
                        'Benchmark against regional and specialty peers',
                        'Negotiate with data-backed leverage',
                        'Discover hidden revenue opportunities',
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
                      <i className="bi bi-graph-up text-purple-500 mr-2"></i>
                      Impact Metrics
                    </h4>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      {[
                        { value: '$500K+', label: 'Underpayments identified', icon: 'bi-cash-stack' },
                        { value: 'All 50', label: 'States covered', icon: 'bi-geo-alt' },
                        { value: '100%', label: 'Data transparency', icon: 'bi-shield-check' },
                      ].map((metric, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-4 text-center">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <i className={`bi ${metric.icon} text-purple-600 text-xl`}></i>
                          </div>
                          <div className="font-bold text-gray-900 mb-1">{metric.value}</div>
                          <div className="text-sm text-gray-600">{metric.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              <div className="lg:col-span-6">
                {/* Step-by-Step Flow Visualization */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xl">
                  <div className="text-center mb-6">
                    <div className="inline-block bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg uppercase tracking-wider mb-4 shadow-md">
                      LIVE DEMO
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                      <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Insights
                      </span>
                    </h2>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">How It Works</h3>
                    <p className="text-sm text-gray-600">Simple 3-step process to unlock revenue insights</p>
                  </div>

                  {/* Step-by-Step Flow */}
                  <div className="space-y-6">
                    {/* Step 1: Aggregate Price Transparency Data */}
                    <div className="relative">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-md">
                          1
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900 mb-2">Aggregate Machine-Readable Files (MRFs)</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            We aggregate negotiated rate data from major payers' machine-readable files across all 50 states—compliant with federal price transparency mandates.
                          </p>
                          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-xs text-gray-700">
                                <i className="bi bi-check-circle-fill text-blue-500"></i>
                                <span className="font-medium">UnitedHealthcare (UHC)</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-700">
                                <i className="bi bi-check-circle-fill text-blue-500"></i>
                                <span className="font-medium">Anthem Blue Cross Blue Shield</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-700">
                                <i className="bi bi-check-circle-fill text-blue-500"></i>
                                <span className="font-medium">Aetna (CVS Health)</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-700">
                                <i className="bi bi-check-circle-fill text-blue-500"></i>
                                <span className="font-medium">Cigna & Humana</span>
                              </div>
                              <div className="flex items-center justify-between mt-2 pt-2 border-t border-blue-100">
                                <span className="text-xs text-gray-600">Live MRF Data</span>
                                <div className="flex items-center gap-1">
                                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                  <span className="text-xs font-semibold text-emerald-600">Active</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Connector Line */}
                      <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 to-purple-300"></div>
                    </div>

                    {/* Step 2: Analyze & Benchmark */}
                    <div className="relative">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-md">
                          2
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900 mb-2">Analyze & Benchmark</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Our AI compares your rates against nationwide benchmarks, identifying underpayments by payer and CPT code.
                          </p>
                          <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-700 font-medium">Aetna vs. Market Average</span>
                                <span className="text-red-600 font-bold">-16% Below</span>
                              </div>
                              <div className="h-6 bg-gray-100 rounded overflow-hidden relative">
                                <div className="absolute inset-0 flex">
                                  <div className="bg-rose-400 w-[42%]" title="Your Rate"></div>
                                  <div className="bg-gray-200 w-[8%]"></div>
                                  <div className="bg-emerald-400 w-[50%]" title="Market Average"></div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-xs font-bold text-white drop-shadow">Your Rate vs Market</span>
                                </div>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-rose-600">Your: $84</span>
                                <span className="text-emerald-600">Market: $100</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Connector Line */}
                      <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gradient-to-b from-purple-300 to-emerald-300"></div>
                    </div>

                    {/* Step 3: Take Action */}
                    <div className="relative">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-md">
                          3
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900 mb-2">Take Action</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Get actionable recommendations with projected revenue impact. Negotiate contracts backed by real data.
                          </p>
                          <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                            <div className="space-y-3">
                              <div className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm">
                                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <i className="bi bi-check-circle-fill text-emerald-600 text-xl"></i>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-semibold text-gray-900">Renegotiate Aetna Contract</div>
                                  <div className="text-xs text-gray-600">Priority: High</div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <div className="text-sm font-bold text-emerald-600">+$240K</div>
                                  <div className="text-xs text-gray-500">Est. Annual</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <i className="bi bi-file-text-fill text-blue-600 text-xl"></i>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-semibold text-gray-900">Review CPT 99213/14 Rates</div>
                                  <div className="text-xs text-gray-600">Priority: Medium</div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <div className="text-sm font-bold text-blue-500">+$150K</div>
                                  <div className="text-xs text-gray-500">Est. Annual</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Total Impact Summary */}
                  <div className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-5 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm opacity-90 mb-1">Total Revenue Opportunity</div>
                        <div className="text-3xl font-bold">$635K+</div>
                      </div>
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <i className="bi bi-graph-up-arrow text-3xl"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Below Visualization */}
            <div className="text-center mt-12">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Ready to Discover Your Revenue Opportunities?
                </h3>
                <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
                  See exactly how much revenue you're leaving on the table. Get started with a free analysis.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="#"
                    onClick={(e) => handleIntercomClick(e, 'request-demo')}
                    className="inline-flex items-center justify-center gap-3 bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <i className="bi bi-calendar-check text-2xl"></i>
                    Get Free Analysis
                  </a>
                  <a
                    href="#"
                    onClick={(e) => handleIntercomClick(e, 'sign-up')}
                    className="inline-flex items-center justify-center gap-3 bg-purple-800 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-900 transition-all shadow-lg hover:shadow-xl hover:scale-105 border-2 border-white/20"
                  >
                    <i className="bi bi-chat-dots text-2xl"></i>
                    Talk to an Expert
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Powerful Features for Revenue Optimization
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Everything you need to identify underpayments, benchmark performance, and negotiate better contracts
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: 'bi-bar-chart-line',
                  title: 'Multi-Payer Benchmarking',
                  description: 'Compare your reimbursement rates against market averages from UHC, Anthem, Aetna, Cigna, and more across all 50 states.',
                  color: 'blue'
                },
                {
                  icon: 'bi-search',
                  title: 'CPT-Level Analysis',
                  description: 'Drill down to individual CPT codes to identify which procedures are underpaid and by how much.',
                  color: 'purple'
                },
                {
                  icon: 'bi-geo-alt-fill',
                  title: 'Geographic Insights',
                  description: 'Understand regional rate variations and optimize your negotiation strategy based on local market data.',
                  color: 'green'
                },
                {
                  icon: 'bi-graph-up-arrow',
                  title: 'Revenue Recovery Tools',
                  description: 'Automated identification of underpayments with estimated recovery amounts and priority rankings.',
                  color: 'orange'
                },
                {
                  icon: 'bi-shield-check',
                  title: 'Contract Negotiation Support',
                  description: 'Data-backed negotiation templates and talking points to maximize contract value.',
                  color: 'teal'
                },
                {
                  icon: 'bi-file-earmark-bar-graph',
                  title: 'Custom Reports',
                  description: 'Generate executive summaries and detailed reports for CFOs, finance teams, and payer negotiations.',
                  color: 'indigo'
                }
              ].map((feature, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                  <div className={`w-14 h-14 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                    <i className={`bi ${feature.icon} text-${feature.color}-600 text-2xl`}></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Who Benefits from Insights?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Healthcare organizations of all sizes use our platform to optimize revenue
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: 'Hospital Systems & Health Networks',
                  icon: 'bi-hospital',
                  challenges: [
                    'Managing contracts with multiple payers across regions',
                    'Identifying underpayments across thousands of CPT codes',
                    'Preparing for payer contract renegotiations'
                  ],
                  solution: 'Insights provides system-wide visibility into payer performance, helping CFOs identify $500K+ in annual underpayments and negotiate better rates.'
                },
                {
                  title: 'Medical Groups & Practices',
                  icon: 'bi-people-fill',
                  challenges: [
                    'Limited resources to analyze complex payer contracts',
                    'Difficulty benchmarking against peer practices',
                    'Time-consuming manual rate comparisons'
                  ],
                  solution: 'Automated benchmarking and prioritized action items help practice administrators focus on high-impact negotiations without hiring expensive consultants.'
                },
                {
                  title: 'Revenue Cycle Management Teams',
                  icon: 'bi-cash-coin',
                  challenges: [
                    'Tracking underpayments across multiple clients',
                    'Proving value to leadership with data',
                    'Staying current with market rate changes'
                  ],
                  solution: 'Real-time MRF data and custom reporting make it easy to demonstrate ROI and recover revenue for your organization or clients.'
                },
                {
                  title: 'Healthcare Consultants & Advisors',
                  icon: 'bi-briefcase',
                  challenges: [
                    'Accessing reliable market benchmark data',
                    'Supporting multiple clients with contract negotiations',
                    'Providing evidence-based recommendations'
                  ],
                  solution: 'White-label reports and nationwide benchmarking data enable consultants to deliver premium advisory services backed by real market intelligence.'
                }
              ].map((useCase, idx) => (
                <div key={idx} className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-8 shadow-lg">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className={`bi ${useCase.icon} text-purple-600 text-2xl`}></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{useCase.title}</h3>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Common Challenges:</h4>
                    <ul className="space-y-2">
                      {useCase.challenges.map((challenge, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <i className="bi bi-x-circle text-red-500 mt-0.5 flex-shrink-0"></i>
                          <span>{challenge}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-purple-900 mb-2">How EchoPad Helps:</h4>
                    <p className="text-sm text-gray-700">{useCase.solution}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platform Capabilities Section */}
        <section className="py-20 bg-gradient-to-br from-purple-600 to-blue-600">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Comprehensive Revenue Intelligence Platform
              </h2>
              <p className="text-lg text-white/90 max-w-3xl mx-auto">
                Access the most extensive healthcare pricing database with real-time insights
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { value: 'Billions', label: 'Data Points Analyzed', icon: 'bi-database' },
                { value: 'All Major', label: 'Payers Included', icon: 'bi-building' },
                { value: '50 States', label: 'Nationwide Coverage', icon: 'bi-geo-alt' },
                { value: 'Real-Time', label: 'MRF Data Updates', icon: 'bi-arrow-repeat' }
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className={`bi ${stat.icon} text-white text-3xl`}></i>
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-white/90">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Additional CTA */}
            <div className="text-center mt-12">
              <a
                href="#"
                onClick={(e) => handleIntercomClick(e, 'request-demo')}
                className="inline-flex items-center justify-center gap-3 bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                <i className="bi bi-rocket-takeoff text-2xl"></i>
                Start Optimizing Revenue Today
              </a>
            </div>
          </div>
        </section>

        {/* FAQ Section - Redesigned */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Common Questions About Revenue Intelligence
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Get answers to help you understand how our platform works
              </p>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  category: 'Data Source',
                  question: 'How do you access payer rate data?',
                  answer: 'We aggregate publicly available machine-readable files (MRFs) published by payers as required by federal price transparency mandates.',
                  icon: 'bi-database',
                  color: 'blue'
                },
                {
                  category: 'Implementation',
                  question: 'How long does setup take?',
                  answer: 'Most organizations are operational in less than one week with minimal IT involvement required.',
                  icon: 'bi-clock',
                  color: 'green'
                },
                {
                  category: 'Privacy',
                  question: 'Do I need to share my data?',
                  answer: 'You can browse market benchmarks with zero data sharing. Personalized insights require optional secure data upload.',
                  icon: 'bi-shield-check',
                  color: 'purple'
                },
                {
                  category: 'Accuracy',
                  question: 'What makes your data reliable?',
                  answer: 'Our data comes directly from payer MRFs—actual negotiated rates, not surveys or estimates.',
                  icon: 'bi-patch-check',
                  color: 'teal'
                },
                {
                  category: 'Usage',
                  question: 'Can I use this in negotiations?',
                  answer: 'Yes. The platform includes templates, talking points, and exportable reports for payer discussions.',
                  icon: 'bi-chat-square-text',
                  color: 'orange'
                },
                {
                  category: 'Security',
                  question: 'Is my information protected?',
                  answer: 'Bank-level encryption, HIPAA compliance, and strict data privacy policies protect your information.',
                  icon: 'bi-lock',
                  color: 'red'
                }
              ].map((faq, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4 mb-3">
                    <div className={`w-12 h-12 bg-${faq.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <i className={`bi ${faq.icon} text-${faq.color}-600 text-xl`}></i>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">{faq.category}</div>
                      <h3 className="text-lg font-bold text-gray-900">{faq.question}</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed ml-16">{faq.answer}</p>
                </div>
              ))}
            </div>

            {/* FAQ CTA */}
            <div className="text-center mt-12">
              <p className="text-gray-600 mb-4">Still have questions?</p>
              <a
                href="#"
                onClick={(e) => handleIntercomClick(e, 'sign-up')}
                className="inline-flex items-center justify-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors"
              >
                <i className="bi bi-chat-dots text-xl"></i>
                Chat with our team
              </a>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Stop Leaving Money on the Table
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Discover how much revenue you're missing. Get your free underpayment analysis today.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <a
                  href="#"
                  onClick={(e) => handleIntercomClick(e, 'request-demo')}
                  className="inline-flex items-center justify-center gap-3 bg-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <i className="bi bi-calendar-check text-2xl"></i>
                  Schedule Your Demo
                </a>
                <a
                  href="#"
                  onClick={(e) => handleIntercomClick(e, 'sign-up')}
                  className="inline-flex items-center justify-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <i className="bi bi-play-circle text-2xl"></i>
                  See It In Action
                </a>
              </div>

              <div className="flex items-center justify-center gap-8 text-gray-400 text-sm">
                <div className="flex items-center gap-2">
                  <i className="bi bi-check-circle-fill text-green-500"></i>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="bi bi-check-circle-fill text-green-500"></i>
                  <span>Free underpayment analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="bi bi-check-circle-fill text-green-500"></i>
                  <span>Setup in &lt;1 week</span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}

export default EchoPadInsights;
