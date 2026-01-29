import { useState, useLayoutEffect } from 'react';
import Navigation from '../../components/layout/Navigation';
import Footer from '../../components/layout/Footer';
import { handleIntercomAction } from '../../utils/intercom';


function PayerRates() {
    const [expandedSections, setExpandedSections] = useState({});

    const toggleSection = (sectionId) => {
        setExpandedSections((prev) => ({
            ...prev,
            [sectionId]: !prev[sectionId],
        }));
    };

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
            <Navigation />
            <main>
                {/* Hero Section */}
                <section className="pt-32 pb-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-5">
                                <div className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-4">
                                    PAYER RATES
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                    Healthcare Provider Negotiation Intelligence
                                </h1>
                                <p className="text-lg text-gray-600 mb-8">
                                    Actionable insights that hospitals and providers can use to negotiate better reimbursement rates with insurance companies. Walk into negotiations with data, not guesses.
                                </p>

                                <div className="space-y-6 mb-8">
                                    <div>
                                        <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                                            <i className="bi bi-briefcase-fill text-teal-500 mr-2"></i>
                                            Business Value for Healthcare Leaders
                                        </h4>
                                        <p className="text-gray-600">
                                            For CFOs and contracting teams facing fragmented rate data and weak negotiation positions, Benchmark delivers immediate ROI through data-backed rate increases, standardized contracting across networks, and early warning systems for payer rate shifts.
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                                            <i className="bi bi-info-circle text-teal-500 mr-2"></i>
                                            What You Get
                                        </h4>
                                        <p className="text-gray-600">
                                            A unified dashboard showing your rates versus market across all payers, with automated benchmarking that identifies exactly where you're underpaid and what to ask for in negotiations.
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Benefits</h4>
                                        <ul className="space-y-2">
                                            {[
                                                'See how much payers pay competitors',
                                                'Identify underpaid CPT codes instantly',
                                                'Prioritize which codes to negotiate',
                                                'Data-backed asks for every negotiation',
                                                '80% reduction in data gathering time',
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
                                                { value: '10-30x', label: 'Typical ROI', icon: 'bi-graph-up-arrow' },
                                                { value: '80%', label: 'Less data prep time', icon: 'bi-clock-history' },
                                                { value: '$2-5M', label: 'Avg annual recovery', icon: 'bi-currency-dollar' },
                                            ].map((metric, idx) => (
                                                <div key={idx} className="bg-gray-50 rounded-lg p-4 text-center">
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
                                            Hospital systems, health networks, and large provider organizations negotiating payer contracts with limited market intelligence and fragmented rate data.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-7">
                                <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
                                    <div className="mb-6">
                                        <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
                                            EXAMPLE INSIGHT
                                        </div>
                                        <div className="text-lg font-semibold text-gray-900">
                                            Real Negotiation Intelligence in Action
                                        </div>
                                    </div>

                                    {/* The Problem */}
                                    <div className="mb-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                                BEFORE
                                            </span>
                                            <span className="text-sm font-semibold text-gray-900">Your Current Position</span>
                                        </div>
                                        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                                            <p className="text-sm text-gray-700 mb-3">
                                                <strong>CPT 99213</strong> - Office/outpatient visit, established patient
                                            </p>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Your current rate (Blue Cross):</span>
                                                    <span className="font-semibold text-gray-900">$340</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Annual volume:</span>
                                                    <span className="font-semibold text-gray-900">12,500 visits</span>
                                                </div>
                                                <div className="flex justify-between text-red-700 font-semibold">
                                                    <span>Gap vs. market median:</span>
                                                    <span>-18% ($75 below)</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Arrow */}
                                    <div className="flex justify-center mb-6">
                                        <i className="bi bi-arrow-down text-2xl text-gray-400"></i>
                                    </div>

                                    {/* Market Intelligence */}
                                    <div className="mb-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                                BENCHMARK DATA
                                            </span>
                                            <span className="text-sm font-semibold text-gray-900">Arizona Market Analysis</span>
                                        </div>
                                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                            <div className="space-y-3">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-700">Regional median rate:</span>
                                                    <span className="font-semibold text-blue-900">$415</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-700">Top quartile rate:</span>
                                                    <span className="font-semibold text-blue-900">$445</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-700">Competitor average (3 systems):</span>
                                                    <span className="font-semibold text-blue-900">$420</span>
                                                </div>
                                                <div className="bg-blue-100 rounded p-2 mt-3">
                                                    <p className="text-xs text-blue-900 font-medium">
                                                        <i className="bi bi-info-circle mr-1"></i>
                                                        Data covers 87% of Arizona market based on MRF analysis
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Arrow */}
                                    <div className="flex justify-center mb-6">
                                        <i className="bi bi-arrow-down text-2xl text-gray-400"></i>
                                    </div>

                                    {/* Recommendation */}
                                    <div>
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                                RECOMMENDATION
                                            </span>
                                            <span className="text-sm font-semibold text-gray-900">Your Negotiation Strategy</span>
                                        </div>
                                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                            <div className="mb-4">
                                                <p className="text-sm text-gray-700 mb-3">
                                                    <strong className="text-green-900">Target Rate: $415</strong> (market median)
                                                </p>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Current annual revenue:</span>
                                                        <span className="font-semibold text-gray-900">$4,250,000</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">With target rate:</span>
                                                        <span className="font-semibold text-gray-900">$5,187,500</span>
                                                    </div>
                                                    <div className="flex justify-between text-green-700 font-bold text-base pt-2 border-t border-green-200">
                                                        <span>Annual uplift:</span>
                                                        <span>+$937,500</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-white rounded p-3 border border-green-300">
                                                <p className="text-xs text-gray-700 leading-relaxed">
                                                    <i className="bi bi-lightbulb-fill text-yellow-500 mr-1"></i>
                                                    <strong>Negotiation talking point:</strong> "Our current rate for CPT 99213 is $340, which is 18% below the Arizona market median of $415. Based on publicly available MRF data covering 87% of the market, we're requesting alignment to the regional median to ensure sustainable quality care delivery."
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Problems We Solve */}
                {/* <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Problems We Solve
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Transform fragmented data into negotiation power and recover millions in lost revenue
              </p>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: 'bi-puzzle',
                  title: 'Fragmented Data → No Market Intelligence',
                  situations: [
                    'Rate info scattered across payer PDFs, emails, spreadsheets',
                    'Manually mapping CPT codes across 10+ payer formats',
                    '"We have no idea if we\'re under/over market"',
                    'Takes 2-4 weeks just to compile data for ONE negotiation',
                  ],
                  solutions: [
                    'Unified dashboard showing your rates vs. market across all payers',
                    'Automated normalization of CPT codes, units, geographies',
                    'Instant benchmarks: "BCBS pays you 15% below market for orthopedic codes"',
                  ],
                },
                {
                  icon: 'bi-graph-down',
                  title: 'Weak Negotiation Position → Lost Revenue',
                  situations: [
                    'Payer reps come with 50 slides of market data',
                    'You counter with "we need a 3% increase"',
                    'Payer says "the market is only growing 1%"—you have no proof otherwise',
                    'You accept the lower number',
                    'This happens across 10+ payers = $2-5M lost annually',
                  ],
                  solutions: [
                    'Go into negotiation with YOUR data showing:',
                    '• Exact rates competitors are getting',
                    '• How your rates have moved vs. market',
                    '• By payer, by specialty, by CPT code',
                    'Use our scenario modeling: "If we hold at 2.5%, what does that mean to margin?"',
                  ],
                },
                {
                  icon: 'bi-clock-history',
                  title: 'Manual Processes → Wasted Time & Errors',
                  situations: [
                    'Contract renegotiations are manual, ad-hoc',
                    'No standard process, no benchmarking framework',
                    'Different hospitals in your system may negotiate differently',
                    '500+ hours/year on contract analytics',
                  ],
                  solutions: [
                    'Repeatable process: connect to payer data → automated benchmarking → negotiation-ready insights',
                    'Same framework across all hospitals/all payers',
                    '80% reduction in data gathering time (weeks → days)',
                    'Early warning system: alerts when payer rates shift',
                  ],
                },
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center mb-4">
                    <i className={`bi ${item.icon} text-white text-2xl`}></i>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{item.title}</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                      <p className="text-xs font-semibold text-red-900 mb-2 uppercase tracking-wide">Provider's Situation</p>
                      <ul className="space-y-1.5">
                        {item.situations.map((situation, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <i className="bi bi-dash text-red-600 flex-shrink-0 mt-0.5"></i>
                            <span>{situation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <p className="text-xs font-semibold text-green-900 mb-2 uppercase tracking-wide">Our Solution</p>
                      <ul className="space-y-1.5">
                        {item.solutions.map((solution, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <i className="bi bi-check text-green-600 flex-shrink-0 mt-0.5 font-bold"></i>
                            <span>{solution}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section> */}

                {/* Problems We Solve */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Problems We Solve
                            </h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Transform fragmented data into negotiation power and recover millions in lost revenue
                            </p>
                        </div>

                        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    icon: 'bi-puzzle',
                                    title: 'Fragmented Data → No Market Intelligence',
                                    situations: [
                                        'Rate info scattered across payer PDFs, emails, spreadsheets',
                                        'Manually mapping CPT codes across 10+ payer formats',
                                        '"We have no idea if we\'re under/over market"',
                                        'Takes 2-4 weeks just to compile data for ONE negotiation',
                                    ],
                                    solutions: [
                                        'Unified dashboard showing your rates vs. market across all payers',
                                        'Automated normalization of CPT codes, units, geographies',
                                        'Instant benchmarks: "BCBS pays you 15% below market for orthopedic codes"',
                                    ],
                                },
                                {
                                    icon: 'bi-graph-down',
                                    title: 'Weak Negotiation Position → Lost Revenue',
                                    situations: [
                                        'Payer reps come with 50 slides of market data',
                                        'You counter with "we need a 3% increase"',
                                        'Payer says "the market is only growing 1%"—you have no proof otherwise',
                                        'You accept the lower number',
                                        'This happens across 10+ payers = $2-5M lost annually',
                                    ],
                                    solutions: [
                                        'Go into negotiation with YOUR data showing:',
                                        '• Exact rates competitors are getting',
                                        '• How your rates have moved vs. market',
                                        '• By payer, by specialty, by CPT code',
                                        'Use our scenario modeling: "If we hold at 2.5%, what does that mean to margin?"',
                                    ],
                                },
                                {
                                    icon: 'bi-clock-history',
                                    title: 'Manual Processes → Wasted Time & Errors',
                                    situations: [
                                        'Contract renegotiations are manual, ad-hoc',
                                        'No standard process, no benchmarking framework',
                                        'Different hospitals in your system may negotiate differently',
                                        '500+ hours/year on contract analytics',
                                    ],
                                    solutions: [
                                        'Repeatable process: connect to payer data → automated benchmarking → negotiation-ready insights',
                                        'Same framework across all hospitals/all payers',
                                        '80% reduction in data gathering time (weeks → days)',
                                        'Early warning system: alerts when payer rates shift',
                                    ],
                                },
                            ].map((item, idx) => (
                                <div key={idx} className="flex flex-col bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg hover:shadow-xl transition-shadow">
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center mb-4">
                                        <i className={`bi ${item.icon} text-white text-2xl`}></i>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">{item.title}</h3>

                                    <div className="space-y-4 flex-1 flex flex-col">
                                        <div className="bg-red-50 rounded-lg p-4 border border-red-200 flex-1">
                                            <p className="text-xs font-semibold text-red-900 mb-2 uppercase tracking-wide">Provider's Situation</p>
                                            <ul className="space-y-1.5">
                                                {item.situations.map((situation, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                                        <i className="bi bi-dash text-red-600 flex-shrink-0 mt-0.5"></i>
                                                        <span>{situation}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="bg-green-50 rounded-lg p-4 border border-green-200 flex-1">
                                            <p className="text-xs font-semibold text-green-900 mb-2 uppercase tracking-wide">Our Solution</p>
                                            <ul className="space-y-1.5">
                                                {item.solutions.map((solution, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                                        <i className="bi bi-check text-green-600 flex-shrink-0 mt-0.5 font-bold"></i>
                                                        <span>{solution}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>


                {/* Core Product Features */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Core Platform Features
                            </h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Everything you need to negotiate better payer contracts with confidence
                            </p>
                        </div>

                        <div className="max-w-5xl mx-auto space-y-4">
                            {[
                                {
                                    id: 'benchmarking',
                                    icon: 'bi-bar-chart-line',
                                    title: 'Market Rate Benchmarking',
                                    subtitle: 'See exactly where you stand vs. the market',
                                    items: [
                                        {
                                            title: 'Multi-Level Comparisons',
                                            description: 'Your rates vs. regional median, national median, and named competitors by CPT code, service line, and geography',
                                        },
                                        {
                                            title: 'Monthly Updates',
                                            description: 'Automated refreshes as new payer MRF data arrives, keeping your intelligence current',
                                        },
                                        {
                                            title: 'Confidence Scoring',
                                            description: 'Data quality indicators showing market coverage percentage for each benchmark',
                                        },
                                        {
                                            title: 'Historical Trending',
                                            description: 'Track how your position has changed over time relative to market movements',
                                        },
                                    ],
                                },
                                {
                                    id: 'payer',
                                    icon: 'bi-building',
                                    title: 'Payer-Specific Intelligence',
                                    subtitle: 'Detailed insights on every major payer',
                                    items: [
                                        {
                                            title: 'Payer Rate Breakdown',
                                            description: 'What does BCBS pay? Aetna? UnitedHealth? See exact rates by payer and code',
                                        },
                                        {
                                            title: 'Historical Trends',
                                            description: 'How has this payer\'s rate moved over time? Identify patterns and leverage points',
                                        },
                                        {
                                            title: 'Competitive Analysis',
                                            description: 'Who\'s getting better rates from this payer and for which service lines?',
                                        },
                                        {
                                            title: 'Market Share Context',
                                            description: 'Understand payer volume and importance to prioritize negotiation efforts',
                                        },
                                    ],
                                },
                                {
                                    id: 'negotiation',
                                    icon: 'bi-clipboard-data',
                                    title: 'Contract Negotiation Dashboards',
                                    subtitle: 'Real-time decision support through the entire cycle',
                                    items: [
                                        {
                                            title: 'Pre-Negotiation Prep',
                                            description: 'See your positioning, identify leverage points, and quantify the ask before entering talks',
                                        },
                                        {
                                            title: 'Live Scenario Modeling',
                                            description: 'Model different rate scenarios in real-time: "If we hold at 2.5%, what does that mean to margin?"',
                                        },
                                        {
                                            title: 'Post-Negotiation Tracking',
                                            description: 'Monitor implementation, verify rate changes, and measure realized value',
                                        },
                                        {
                                            title: 'Deal Briefs',
                                            description: 'Payer-by-payer negotiation dossiers with concrete, data-backed asks ready to use',
                                        },
                                    ],
                                },
                                {
                                    id: 'monitoring',
                                    icon: 'bi-bell',
                                    title: 'Rate Change Monitoring & Alerts',
                                    subtitle: 'Stay ahead of market shifts',
                                    items: [
                                        {
                                            title: 'Automated Alerts',
                                            description: 'Get notified when payers shift rates in your market or for your key service lines',
                                        },
                                        {
                                            title: 'Trend Analysis',
                                            description: 'Identify emerging patterns before they impact your bottom line',
                                        },
                                        {
                                            title: 'Early Warning System',
                                            description: 'Proactive alerts when rates are moving against you, giving time to strategize',
                                        },
                                        {
                                            title: 'Benchmark Drift Tracking',
                                            description: 'Monitor how your relative position changes even if your rates stay flat',
                                        },
                                    ],
                                },
                            ].map((section) => (
                                <div
                                    key={section.id}
                                    className="bg-white rounded-2xl border-2 border-gray-200 p-6 cursor-pointer hover:border-blue-300 transition-colors"
                                    onClick={() => toggleSection(section.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-15 h-15 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <i className={`bi ${section.icon} text-white text-2xl`}></i>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-1">{section.title}</h4>
                                            <p className="text-sm text-gray-600">{section.subtitle}</p>
                                        </div>
                                        <i
                                            className={`bi bi-chevron-down text-gray-600 text-xl transition-transform ${expandedSections[section.id] ? 'rotate-180' : ''
                                                }`}
                                        ></i>
                                    </div>
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ${expandedSections[section.id] ? 'max-h-[28rem] mt-6' : 'max-h-0'
                                            }`}
                                    >
                                        <ul className="space-y-3">
                                            {section.items.map((item, idx) => (
                                                <li
                                                    key={idx}
                                                    className={`flex items-start gap-3 pb-3 ${idx < section.items.length - 1 ? 'border-b border-gray-200' : ''
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
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Use Cases */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Real-World Use Cases
                            </h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                See how healthcare organizations are recovering millions with data-driven negotiations
                            </p>
                        </div>

                        <div className="max-w-6xl mx-auto space-y-8">
                            {[
                                {
                                    title: 'Large Contract Renegotiation',
                                    scenario: 'Your BCBS contract expires in 60 days. You need a 3% rate increase.',
                                    without: [
                                        'Spend 3 weeks gathering rate data from 10 payers',
                                        'Manual benchmarking with spreadsheets and outdated sources',
                                        'Go into negotiation with limited evidence',
                                        'Payer offers 1% increase; you accept (saves them $2M/year)',
                                        'Missed opportunity: $1.5M in lost revenue over 3 years',
                                    ],
                                    with: [
                                        'Day 1: Dashboard shows BCBS is 8% below regional median',
                                        'Day 2: Scenario model shows 3% increase = $1.2M additional revenue annually',
                                        'Day 5: Negotiation-ready brief with 15 CPT-code-level comparisons',
                                        'Day 30: Close contract at 2.75% increase',
                                        'Captured opportunity: $1.65M in additional revenue over 3 years',
                                    ],
                                    outcome: '$1.65M recovered',
                                    icon: 'bi-file-text',
                                },
                                {
                                    title: 'Health Network Rate Standardization',
                                    scenario: 'You operate 5 hospitals across 2 states. Aetna rates are inconsistent.',
                                    without: [
                                        'Hospital A negotiated 3 years ago; Hospital B negotiated 6 months ago',
                                        'No visibility into rate variance across network',
                                        'Can\'t standardize contracting strategy',
                                        'Each hospital negotiates independently with different results',
                                    ],
                                    with: [
                                        'Dashboard shows each hospital\'s rates vs. market',
                                        'Identifies which hospitals are underpaid by service line',
                                        'Enables standardized re-contracting strategy across network',
                                        'Unified negotiating position leveraging total network volume',
                                    ],
                                    outcome: '$2-3M in underpriced rates recovered',
                                    icon: 'bi-hospital',
                                },
                                {
                                    title: 'Early Warning System',
                                    scenario: 'UnitedHealth wants to cut rates by 2% in next negotiation.',
                                    without: [
                                        'You don\'t know this until they tell you (in the negotiation)',
                                        'No time to prepare counter-arguments or data',
                                        'Forced to react defensively without evidence',
                                        'Accept cuts or risk losing contract',
                                    ],
                                    with: [
                                        'Alert: "UnitedHealth rates shifting 1.5% lower across market"',
                                        'Proactive: You reach out EARLY with data showing your value',
                                        'Prepare quality metrics and patient outcomes documentation',
                                        'Enter negotiation with offense, not defense',
                                    ],
                                    outcome: 'Defended baseline, avoided 2% cut = $800K saved annually',
                                    icon: 'bi-shield-check',
                                },
                            ].map((useCase, idx) => (
                                <div key={idx} className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-lg">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <i className={`bi ${useCase.icon} text-white text-xl`}></i>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{useCase.title}</h3>
                                            <p className="text-gray-600">{useCase.scenario}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                                            <h4 className="text-sm font-bold text-red-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                                                <i className="bi bi-x-circle"></i>
                                                Without PAYER RATES
                                            </h4>
                                            <ul className="space-y-2">
                                                {useCase.without.map((item, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                                        <i className="bi bi-dash text-red-600 flex-shrink-0 mt-1"></i>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                                            <h4 className="text-sm font-bold text-green-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                                                <i className="bi bi-check-circle"></i>
                                                With PAYER RATES
                                            </h4>
                                            <ul className="space-y-2">
                                                {useCase.with.map((item, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                                        <i className="bi bi-check text-green-600 flex-shrink-0 mt-1 font-bold"></i>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="bg-blue-600 rounded-xl p-4 text-center">
                                        <p className="text-white font-bold text-lg">
                                            <i className="bi bi-trophy-fill mr-2"></i>
                                            Outcome: {useCase.outcome}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>


                {/* Pricing & ROI Section */}
                {/* <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Investment & ROI
                            </h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Simple pricing with exceptional returns
                            </p>
                        </div>

                        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-lg">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
                                        <i className="bi bi-tag text-white text-xl"></i>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">Pricing Model</h3>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                                            Annual Platform Subscription
                                        </h4>
                                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                            <div className="text-3xl font-bold text-blue-900 mb-2">$50K - $200K</div>
                                            <p className="text-sm text-gray-700">Based on system size (beds, revenue, or number of payers)</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                                            Optional Services
                                        </h4>
                                        <ul className="space-y-2">
                                            <li className="flex items-start gap-2 text-sm text-gray-700">
                                                <i className="bi bi-check-circle-fill text-green-500 mt-0.5"></i>
                                                <span><strong>Deep-dive engagements:</strong> $25K-75K per targeted negotiation</span>
                                            </li>
                                            <li className="flex items-start gap-2 text-sm text-gray-700">
                                                <i className="bi bi-check-circle-fill text-green-500 mt-0.5"></i>
                                                <span><strong>First-year onboarding:</strong> Custom payer studies and setup</span>
                                            </li>
                                            <li className="flex items-start gap-2 text-sm text-gray-700">
                                                <i className="bi bi-check-circle-fill text-green-500 mt-0.5"></i>
                                                <span><strong>Success-fee option:</strong> Performance-based component available</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="pt-4 border-t border-gray-200">
                                        <p className="text-sm text-gray-600 italic">
                                            <i className="bi bi-shield-check text-blue-600 mr-1"></i>
                                            Not a CLM system or contingency cost-cutting firm—we're your data-driven negotiation intelligence partner
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-lg">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-teal-500 rounded-lg flex items-center justify-center">
                                        <i className="bi bi-graph-up-arrow text-white text-xl"></i>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">Typical ROI</h3>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                                        <div className="text-center mb-4">
                                            <div className="text-4xl font-bold text-green-900 mb-1">10-30x</div>
                                            <p className="text-sm text-gray-700">Return on Investment</p>
                                        </div>
                                        <p className="text-sm text-gray-700 text-center">
                                            Most customers see payback in <strong>3-6 months</strong> on just one successful negotiation
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Example: Mid-Size System</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between pb-2 border-b border-gray-200">
                                                <span className="text-gray-600">Annual platform fee:</span>
                                                <span className="font-semibold text-gray-900">$100,000</span>
                                            </div>
                                            <div className="flex justify-between pb-2 border-b border-gray-200">
                                                <span className="text-gray-600">Avg. recovery (1st year):</span>
                                                <span className="font-semibold text-gray-900">$2,500,000</span>
                                            </div>
                                            <div className="flex justify-between pt-2">
                                                <span className="text-green-700 font-bold">Net benefit:</span>
                                                <span className="text-green-700 font-bold text-lg">$2,400,000</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                        <p className="text-xs text-blue-900 leading-relaxed">
                                            <i className="bi bi-lightbulb-fill text-yellow-500 mr-1"></i>
                                            <strong>Reality check:</strong> If you're negotiating 5+ payer contracts annually and lack systematic market benchmarking, you're likely leaving $2-5M on the table each year.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section> */}

                {/* CTA Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-gradient-to-br from-white-600 to-gray-100 rounded-2xl p-8 md:p-12 shadow-lg text-center text-black">
                                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                    Stop Leaving Money on the Table
                                </h2>
                                <p className="text-lg mb-8 text-gray-600">
                                    Join healthcare systems that are recovering millions through data-driven payer negotiations. See your first benchmark in 60-90 days.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                    <a
                                        href="#"
                                        onClick={(e) => handleIntercomClick(e, 'request-demo')}
                                        className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-medium text-lg shadow-lg"
                                    >
                                        <i className="bi bi-calendar-check"></i>
                                        Schedule a Demo
                                    </a>
                                    <a
                                        href="#"
                                        onClick={(e) => handleIntercomClick(e, 'talk-to-sales')}
                                        className="inline-flex items-center gap-2 bg-blue-700 text-white px-8 py-4 rounded-lg hover:bg-blue-800 transition-colors font-medium text-lg border-2 border-white"
                                    >
                                        <i className="bi bi-chat-dots"></i>
                                        Talk to Sales
                                    </a>
                                </div>
                                <p className="text-sm text-black-600 mt-6">
                                    <i className="bi bi-shield-check mr-1"></i>
                                    No IT burden • 60-90 day implementation • HIPAA compliant
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}

export default PayerRates;