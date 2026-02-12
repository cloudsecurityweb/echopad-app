import ProductCard from '../products/ProductCard';
import FullScreenSection from '../layout/FullScreenSection';

function AgentsOverview() {
  const featuredProducts = [
    {
      icon: 'bi-mic-fill',
      title: 'AI Scribe',
      description: 'Real-time clinical documentation that cuts charting time by 70%',
      link: '/ai-scribe',
      featured: true,
    },
    {
      icon: 'bi-graph-up-arrow',
      title: 'Insights',
      description: 'Healthcare financial intelligence & benchmarking across all 50 states',
      link: '/echopad-insights',
      featured: true,
    },
    {
      icon: 'bi-arrow-left-right',
      title: 'Aperio',
      description: 'Streamline referral management and patient care coordination',
      link: '/aperio',
      featured: true,
    },
  ];

  const upcomingProducts = [
    {
      icon: 'bi-file-earmark-text',
      title: 'AI Document Manager',
      description: 'Transform transcripts into formatted medical notes instantly',
      link: '/ai-docman',
      comingSoon: true,
    },
    {
      icon: 'bi-person-workspace',
      title: 'AI Medical Assistant',
      description: 'Full-session intelligence with EHR-ready chart outputs',
      link: '/ai-medical-assistant',
      comingSoon: true,
    },
  ];

  const operationalAgents = [
    {
      icon: 'bi-headset',
      title: 'AI Receptionist',
      description: '24/7 call handling, appointment scheduling, and patient triage',
      link: '/ai-receptionist',
    },
    {
      icon: 'bi-briefcase',
      title: 'AI Admin Assistant',
      description: 'Automate forms, scheduling, emails, and operational workflows',
      link: '/ai-admin-assistant',
    },
    {
      icon: 'bi-bell',
      title: 'AI Patient Reminders',
      description: 'Automated, personalized reminders for appointments, procedures, medications, and care coordination',
      link: '/ai-reminders',
    },
  ];

  return (
    <>
      {/* Section 1: Explore the Echopad Suite + value props */}
      <FullScreenSection id="agents" className="bg-white">
        <div className="container mx-auto px-4 w-full">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Explore the Echopad Suite
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Choose the agents you need—deploy them individually or as a complete suite. Each agent
              solves a specific problem: documentation overload, scheduling bottlenecks, patient
              no-shows, or administrative chaos. Plug into your EHR in days, not months. No tech
              team required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="flex items-start gap-3 glass-card p-4 rounded-xl hover-lift shadow-sm">
              <i className="bi bi-currency-dollar text-cyan-500 text-2xl flex-shrink-0"></i>
              <div>
                <strong className="block text-gray-900 mb-0.5 text-sm md:text-base">
                  Reduce costs by 60%
                </strong>
                <span className="text-gray-600 text-xs md:text-sm">
                  Cut administrative overhead dramatically
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3 glass-card p-4 rounded-xl hover-lift shadow-sm">
              <i className="bi bi-graph-up-arrow text-green-500 text-2xl flex-shrink-0"></i>
              <div>
                <strong className="block text-gray-900 mb-0.5 text-sm md:text-base">
                  Increase revenue by 15-20%
                </strong>
                <span className="text-gray-600 text-xs md:text-sm">
                  Recover billable time and reduce no-shows
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3 glass-card p-4 rounded-xl hover-lift shadow-sm">
              <i className="bi bi-people text-purple-500 text-2xl flex-shrink-0"></i>
              <div>
                <strong className="block text-gray-900 mb-0.5 text-sm md:text-base">
                  Improve retention by 40%
                </strong>
                <span className="text-gray-600 text-xs md:text-sm">
                  Reduce provider and staff burnout
                </span>
              </div>
            </div>
          </div>
        </div>
      </FullScreenSection>

      {/* Section 2: Clinical Efficiency Suite — Featured + Early Access */}
      <FullScreenSection id="agents-clinical" className="bg-gray-50" centered={false} scrollable>
        <div className="container mx-auto px-4 py-6 w-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <i className="bi bi-heart-pulse-fill text-white text-xl"></i>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                Clinical Efficiency Suite
              </h3>
              <p className="text-sm text-gray-600">
                Reduce provider burnout and improve clinical documentation quality
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <i className="bi bi-star-fill text-purple-500"></i>
              Featured Products
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredProducts.map((agent, index) => (
                <ProductCard key={index} {...agent} />
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <i className="bi bi-clock-history text-amber-500"></i>
              Early Access
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingProducts.map((agent, index) => (
                <ProductCard key={index} {...agent} />
              ))}
            </div>
          </div>
        </div>
      </FullScreenSection>

      {/* Section 3: Operational Excellence & Patient Engagement Suite */}
      <FullScreenSection id="agents-operational" className="bg-white">
        <div className="container mx-auto px-4 w-full">
          <div className="flex items-center gap-3 mb-8 max-w-3xl">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <i className="bi bi-gear-fill text-white text-xl"></i>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                Operational Excellence & Patient Engagement Suite
              </h3>
              <p className="text-sm text-gray-600">
                Optimize operations and improve patient throughput
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {operationalAgents.map((agent, index) => (
              <ProductCard key={index} {...agent} />
            ))}
          </div>
        </div>
      </FullScreenSection>
    </>
  );
}

export default AgentsOverview;
