import { useLayoutEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../../components/layout/Navigation';
import Footer from '../../components/layout/Footer';
import { handleIntercomAction } from '../../utils/intercom';
import { useAuth } from '../../contexts/AuthContext';
import usePageTitle from '../../hooks/usePageTitle';

function EchoPadInsights() {
  const { isAuthenticated, isLoading } = useAuth();
  const PageTitle = usePageTitle('Echopad Insights');
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
    <div className="min-h-screen flex flex-col">
      {PageTitle}
      <Navigation />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-4 md:px-14 pt-32 pb-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-6">
                <a
                  href="/"
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors mb-4 font-semibold hover:gap-3"
                  onClick={handleViewAllProductsClick}
                >
                  <i className="bi bi-arrow-left"></i>
                  View All Products
                </a>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-3">
                  Insights
                </h1>
                <p className="text-xl md:text-2xl text-gray-700 font-semibold mb-6">
                  Are you being underpaid? We show you where.
                </p>

                <p className="text-base text-gray-600 mb-8">
                  One simple dashboard shows exactly where insurers are short-paying you and how much you could recover—no spreadsheets, no jargon.
                </p>

                {/* Interactive Stats Banner - Light bg */}
                <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 border-2 border-purple-200 rounded-2xl p-5 md:p-6 mb-6 shadow-lg overflow-hidden">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 min-w-0">
                    <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <i className="bi bi-cash-stack text-purple-600 text-xl md:text-2xl animate-bounce"></i>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-gray-600 text-xs md:text-sm font-semibold uppercase tracking-wide mb-1 break-words">
                          What practices find
                        </div>
                        <div className="text-gray-900 text-lg md:text-xl lg:text-2xl font-bold break-words whitespace-normal">
                          Often <span className="text-purple-600">$500K+</span> to recover per year
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Mid-size multi-specialty groups; from customer recovery data.</div>
                      </div>
                    </div>
                    <div className="flex gap-2 md:gap-3 flex-shrink-0">
                      <div className="bg-white border border-purple-200 px-3 md:px-4 py-2 rounded-lg min-w-[80px] md:min-w-[100px] text-center shadow-sm">
                        <div className="text-gray-600 text-xs whitespace-nowrap">Coverage</div>
                        <div className="text-gray-900 font-bold text-base md:text-lg">All 50 States</div>
                      </div>
                      <div className="bg-white border border-purple-200 px-3 md:px-4 py-2 rounded-lg min-w-[80px] md:min-w-[100px] text-center shadow-sm">
                        <div className="text-gray-600 text-xs whitespace-nowrap">Setup</div>
                        <div className="text-gray-900 font-bold text-base md:text-lg">&lt;1 Week</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons After Stats Banner */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <a
                    href="#"
                    onClick={(e) => handleIntercomClick(e, 'request-demo')}
                    className="inline-flex items-center justify-center gap-3 bg-purple-600 text-white px-6 py-3 rounded-full font-bold text-base hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <i className="bi bi-calendar-check text-xl"></i>
                    Request a Demo
                  </a>
                </div>

                <div className="space-y-6 mb-8">
                  <div>
                    <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                      <i className="bi bi-briefcase-fill text-purple-500 mr-2"></i>
                      For Healthcare Leaders & CFOs
                    </h4>
                    <p className="text-gray-600">
                      Stop negotiating blind. See where you're underpaid, get the leverage to negotiate better contracts—backed by real market insights from nationwide payer data.
                    </p>
                  </div>

                  <div>
                    <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                      <i className="bi bi-info-circle text-purple-500 mr-2"></i>
                      What You Get
                    </h4>
                    <p className="text-gray-600">
                      See where you're underpaid across payers and regions. Get insights on your rates against peers, identify underpayments by procedure code, and discover hidden revenue opportunities—all in one dashboard. We keep the data current so your view is always up to date.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Benefits</h4>
                    <ul className="space-y-2">
                      {[
                        'Identify underpayments across all payer contracts',
                        'Get insights against regional and specialty peers',
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
                        { value: '$500K+', label: 'Underpayments identified', attribution: 'Mid-size practices; customer recovery data', icon: 'bi-cash-stack' },
                          { value: 'All 50', label: 'States covered', attribution: 'Nationwide payer data', icon: 'bi-geo-alt' },
                        { value: '100%', label: 'Data transparency', attribution: 'Platform capability', icon: 'bi-shield-check' },
                      ].map((metric, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-4 text-center">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <i className={`bi ${metric.icon} text-purple-600 text-xl`}></i>
                          </div>
                          <div className="font-bold text-gray-900 mb-1">{metric.value}</div>
                          <div className="text-sm text-gray-600">{metric.label}</div>
                          {metric.attribution && <div className="text-xs text-gray-500 mt-1" title="Source">{metric.attribution}</div>}
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
                    <p className="text-sm text-gray-600">Three steps to see where you're underpaid and what to do about it</p>
                  </div>

                  {/* Step-by-Step Flow */}
                  <div className="space-y-6">
                    {/* Step 1: Compare your pay vs everyone else */}
                    <div className="relative">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-md">
                          1
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900 mb-2">Compare What You Get Paid vs Everyone Else</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            We compare your reimbursement to what other practices get from the same payers—across all 50 states. You see real rates others are paid, not estimates, so you know exactly where you stand.
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
                                <span className="text-xs text-gray-600">Data stays current</span>
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

                    {/* Step 2: See where you're underpaid */}
                    <div className="relative">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-md">
                          2
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900 mb-2">See Where You're Underpaid</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            We highlight gaps by payer and by procedure—so you see exactly which contracts and codes are leaving money on the table and by how much.
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

                    {/* Step 3: Take action */}
                    <div className="relative">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-md">
                          3
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900 mb-2">Take Action</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Get a clear list of what to do next, with estimated revenue impact. Negotiate with payers using real numbers—not guesswork.
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
                                  <div className="text-xs text-gray-400">Example outcome; results vary.</div>
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
                                  <div className="text-xs text-gray-400">e.g. 8–10 provider primary care group.</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Total Impact Summary - Light bg */}
                  <div className="mt-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-600 font-medium mb-1">Total Revenue Opportunity</div>
                        <div className="text-3xl font-bold text-gray-900">$635K+</div>
                        <div className="text-xs text-gray-500 mt-1">Example: 12-provider multi-specialty group; results vary by practice.</div>
                      </div>
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <i className="bi bi-graph-up-arrow text-blue-600 text-3xl"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Below Visualization - Light bg */}
            <div className="text-center mt-12">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Ready to Discover Your Revenue Opportunities?
                </h3>
                <p className="text-gray-700 text-lg mb-6 max-w-2xl mx-auto">
                  See exactly how much revenue you're leaving on the table. Get started with a free analysis.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="#"
                    onClick={(e) => handleIntercomClick(e, 'request-demo')}
                    className="inline-flex items-center justify-center gap-3 bg-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <i className="bi bi-calendar-check text-2xl"></i>
                    Get Free Analysis
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
                Everything you need to identify underpayments, get performance insights, and negotiate better contracts
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: 'bi-bar-chart-line',
                  title: 'Multi-Payer Insights',
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

        {/* Use Cases Section - Focused on primary buyer: practices & medical groups */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Built for Practices & Medical Groups
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Insights is designed for practice owners and medical group leaders who want to stop leaving money on the table—without hiring expensive consultants.
              </p>
            </div>

            {/* Primary persona: dominant single block */}
            <div className="max-w-4xl mx-auto mb-10">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-8 md:p-10 shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="bi bi-people-fill text-white text-2xl"></i>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-purple-600 uppercase tracking-wide">Primary audience</span>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Medical Groups & Practices</h3>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Common challenges we solve:</h4>
                  <ul className="space-y-2">
                    {[
                      'Limited resources to analyze complex payer contracts',
                      'Difficulty getting clear insights against peer practices',
                      'Time-consuming manual rate comparisons',
                      'Uncertainty about where you\'re underpaid before renegotiations',
                    ].map((challenge, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700">
                        <i className="bi bi-x-circle text-red-500 mt-0.5 flex-shrink-0"></i>
                        <span>{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white border border-purple-200 rounded-xl p-5">
                  <h4 className="text-sm font-semibold text-purple-900 mb-2">How EchoPad Helps</h4>
                  <p className="text-gray-700">
                    Automated insights and prioritized action items help practice administrators and owners focus on high-impact negotiations. See where you're underpaid across payers, get peer insights, and negotiate with data-backed leverage—without hiring expensive consultants.
                  </p>
                </div>
              </div>
            </div>

            {/* Secondary: Enterprise CTA - one small section */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                <p className="text-gray-700 mb-3">
                  <strong>Hospital systems, RCM teams, or consultants?</strong> We offer tailored solutions for enterprise and advisory use cases.
                </p>
                <Link
                  to="/echopad-insights/enterprise"
                  className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors"
                >
                  Explore Insights for Enterprise
                  <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Capabilities Section - Light bg */}
        <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50 border-y border-purple-200">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Know Exactly Where You're Underpaid
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                The most extensive healthcare pricing view—your underpayment intelligence stays current
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { value: 'Billions', label: 'Data Points Analyzed', icon: 'bi-database' },
                { value: 'All Major', label: 'Payers Included', icon: 'bi-building' },
                { value: '50 States', label: 'Nationwide Coverage', icon: 'bi-geo-alt' },
                { value: 'Your view stays current', label: 'Data updates', icon: 'bi-arrow-repeat' }
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-16 h-16 bg-white border border-purple-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <i className={`bi ${stat.icon} text-purple-600 text-3xl`}></i>
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Additional CTA */}
            <div className="text-center mt-12">
              <a
                href="#"
                onClick={(e) => handleIntercomClick(e, 'request-demo')}
                className="inline-flex items-center justify-center gap-3 bg-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                <i className="bi bi-rocket-takeoff text-2xl"></i>
                Start Optimizing Revenue Today
              </a>
            </div>
          </div>
        </section>

        {/* How We Get the Data - technical details, secondary */}
        <section className="py-16 bg-white border-t border-gray-200" id="how-we-get-the-data">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                How We Get the Data
              </h2>
              <p className="text-gray-600 mb-4">
                You see where you are being underpaid using real negotiated-rate insights, not surveys or guesses. For teams that want the details, the data comes from payer-published machine-readable files (MRFs), refreshed across major payers and all 50 states.
              </p>
              <p className="text-gray-600">
                No proprietary data sharing is required from your side to see market insights. For personalized underpayment analysis, you can optionally upload your data securely; we never use it for any purpose other than your own insights.
              </p>
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
                Get answers to help you get the most from your underpayment intelligence
              </p>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  category: 'Data Source',
                  question: 'Where does your rate data come from?',
                  answer: 'We use publicly available data that payers publish—actual negotiated rates, not surveys or estimates. For technical details (including how we source and update the data), see the How We Get the Data section above.',
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
                  answer: 'You can browse market insights with zero data sharing. Personalized insights require optional secure data upload.',
                  icon: 'bi-shield-check',
                  color: 'purple'
                },
                {
                  category: 'Accuracy',
                  question: 'What makes your data reliable?',
                  answer: 'We use actual negotiated rates from payer-published data—the same numbers payers are required to make public—so you see real market rates, not estimates.',
                  icon: 'bi-patch-check',
                  color: 'teal'
                },
                {
                  category: 'Usage',
                  question: 'Can I use this in negotiations?',
                  answer: 'Yes. You get templates, talking points, and exportable reports for payer discussions.',
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

        {/* Final CTA - Contact-style */}
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
                      Stop Leaving Money on the Table
                    </h2>
                    <p className="text-base md:text-lg text-gray-600 mb-2 leading-relaxed">
                      Discover how much revenue you're missing. Get your free underpayment analysis today.
                    </p>
                    <p className="text-sm text-gray-500">
                      No credit card required · Free underpayment analysis · Setup in &lt;1 week
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
                    <a
                      href="#"
                      className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3.5 rounded-full hover:bg-gray-800 transition-all hover:scale-105 font-semibold text-sm shadow-md hover:shadow-lg min-w-[140px]"
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

      </main>
      <Footer />
    </div>
  );
}

export default EchoPadInsights;
