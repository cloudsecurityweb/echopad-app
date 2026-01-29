import ProductCard from '../products/ProductCard';

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
      title: 'ReferCare',
      description: 'Streamline referral management and patient care coordination',
      link: '/ai-agent/refercare',
      featured: true,
    },
  ];

  const upcomingProducts = [
    {
      icon: 'bi-file-earmark-text',
      title: 'AI Document Manager',
      description: 'Transform transcripts into formatted medical notes instantly',
      link: '/ai-agent/ai-docman',
      comingSoon: true,
    },
    {
      icon: 'bi-person-workspace',
      title: 'AI Medical Assistant',
      description: 'Full-session intelligence with EHR-ready chart outputs',
      link: '/ai-agent/ai-medical-assistant',
      comingSoon: true,
    },
  ];

  const operationalAgents = [
    {
      icon: 'bi-headset',
      title: 'AI Receptionist',
      description: '24/7 call handling, appointment scheduling, and patient triage',
      link: '/ai-agent/ai-receptionist',
    },
    {
      icon: 'bi-briefcase',
      title: 'AI Admin Assistant',
      description: 'Automate forms, scheduling, emails, and operational workflows',
      link: '/ai-agent/ai-admin-assistant',
    },
    {
      icon: 'bi-bell',
      title: 'AI Patient Reminders',
      description: 'Automated, personalized reminders for appointments, procedures, medications, and care coordination',
      link: '/ai-agent/ai-reminders',
    },
  ];

  return (
    <section id="agents" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16 animate-fade-in-scale">
          <div className="text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent uppercase tracking-wider mb-4">
            COMPREHENSIVE AI SOLUTIONS
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Explore the Echopad Suite
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Choose the agents you need—deploy them individually or as a complete suite. Each agent solves a specific problem: documentation overload, scheduling bottlenecks, patient no-shows, or administrative chaos. Plug into your EHR in days, not months. No tech team required.
          </p>

          {/* Value Props */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="flex items-start gap-3 glass-card p-5 rounded-xl hover-lift shadow-sm">
              <i className="bi bi-currency-dollar text-cyan-500 text-2xl flex-shrink-0"></i>
              <div>
                <strong className="block text-gray-900 mb-1">Reduce costs by 60%</strong>
                <span className="text-gray-600 text-sm">Cut administrative overhead dramatically</span>
              </div>
            </div>
            <div className="flex items-start gap-3 glass-card p-5 rounded-xl hover-lift shadow-sm">
              <i className="bi bi-graph-up-arrow text-green-500 text-2xl flex-shrink-0"></i>
              <div>
                <strong className="block text-gray-900 mb-1">Increase revenue by 15-20%</strong>
                <span className="text-gray-600 text-sm">Recover billable time and reduce no-shows</span>
              </div>
            </div>
            <div className="flex items-start gap-3 glass-card p-5 rounded-xl hover-lift shadow-sm">
              <i className="bi bi-people text-purple-500 text-2xl flex-shrink-0"></i>
              <div>
                <strong className="block text-gray-900 mb-1">Improve retention by 40%</strong>
                <span className="text-gray-600 text-sm">Reduce provider and staff burnout</span>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Efficiency Suite */}
        <div className="mb-16 animate-fade-in-scale animation-delay-200">
          <div className="flex items-start gap-4 mb-10">
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <i className="bi bi-heart-pulse-fill text-white text-2xl"></i>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Clinical Efficiency Suite</h3>
              <p className="text-gray-600 text-lg">Reduce provider burnout and improve clinical documentation quality</p>
            </div>
          </div>

          {/* Featured Products */}
          <div className="mb-10">
            <h4 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <i className="bi bi-star-fill text-purple-500"></i>
              Featured Products
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((agent, index) => (
                <ProductCard key={index} {...agent} />
              ))}
            </div>
          </div>

          {/* Coming Soon Products */}
          <div>
            <h4 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <i className="bi bi-clock-history text-amber-500"></i>
              Coming Soon
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {upcomingProducts.map((agent, index) => (
                <ProductCard key={index} {...agent} />
              ))}
            </div>
          </div>
        </div>

        {/* Operational Excellence & Patient Engagement Suite */}
        <div className="animate-fade-in-scale animation-delay-300">
          <div className="flex items-start gap-4 mb-10">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <i className="bi bi-gear-fill text-white text-2xl"></i>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Operational Excellence & Patient Engagement Suite</h3>
              <p className="text-gray-600 text-lg">Optimize operations and improve patient throughput</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {operationalAgents.map((agent, index) => (
              <ProductCard key={index} {...agent} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AgentsOverview;

