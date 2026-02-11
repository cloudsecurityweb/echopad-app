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
    <section id="agents" className="py-8 md:py-10 lg:py-12 xl:py-16 2xl:py-20 3xl:py-24 scroll-mt-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-4xl 2xl:max-w-5xl 3xl:max-w-6xl mx-auto mb-5 md:mb-6 lg:mb-8 xl:mb-12 2xl:mb-16 3xl:mb-20 animate-fade-in-scale">
          <div className="text-xs 2xl:text-sm 3xl:text-base font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent uppercase tracking-wider mb-1.5 md:mb-2 lg:mb-3 xl:mb-4 2xl:mb-5">
            COMPREHENSIVE AI SOLUTIONS
          </div>
          <h2 className="text-xl md:text-2xl lg:text-2xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl font-bold text-gray-900 mb-2 md:mb-3 lg:mb-4 xl:mb-6 2xl:mb-8">
            Explore the Echopad Suite
          </h2>
          <p className="text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl 3xl:text-2xl text-gray-600 mb-3 md:mb-4 lg:mb-5 xl:mb-6 2xl:mb-8">
            Choose the agents you need—deploy them individually or as a complete suite. Each agent solves a specific problem: documentation overload, scheduling bottlenecks, patient no-shows, or administrative chaos. Plug into your EHR in days, not months. No tech team required.
          </p>

          {/* Value Props */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 md:gap-2 lg:gap-3 xl:gap-4 2xl:gap-5 3xl:gap-6 mt-3 md:mt-4 lg:mt-6 xl:mt-8 2xl:mt-10">
            <div className="flex items-start gap-1.5 md:gap-2 2xl:gap-3 glass-card p-2.5 md:p-3 lg:p-4 xl:p-5 2xl:p-6 3xl:p-8 rounded-xl hover-lift shadow-sm">
              <i className="bi bi-currency-dollar text-cyan-500 text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl flex-shrink-0"></i>
              <div>
                <strong className="block text-gray-900 mb-0.5 md:mb-1 text-xs md:text-sm 2xl:text-base 3xl:text-lg">Reduce costs by 60%</strong>
                <span className="text-gray-600 text-xs md:text-sm 2xl:text-base 3xl:text-lg">Cut administrative overhead dramatically</span>
              </div>
            </div>
            <div className="flex items-start gap-1.5 md:gap-2 2xl:gap-3 glass-card p-2.5 md:p-3 lg:p-4 xl:p-5 2xl:p-6 3xl:p-8 rounded-xl hover-lift shadow-sm">
              <i className="bi bi-graph-up-arrow text-green-500 text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl flex-shrink-0"></i>
              <div>
                <strong className="block text-gray-900 mb-0.5 md:mb-1 text-xs md:text-sm 2xl:text-base 3xl:text-lg">Increase revenue by 15-20%</strong>
                <span className="text-gray-600 text-xs md:text-sm 2xl:text-base 3xl:text-lg">Recover billable time and reduce no-shows</span>
              </div>
            </div>
            <div className="flex items-start gap-1.5 md:gap-2 2xl:gap-3 glass-card p-2.5 md:p-3 lg:p-4 xl:p-5 2xl:p-6 3xl:p-8 rounded-xl hover-lift shadow-sm">
              <i className="bi bi-people text-purple-500 text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl flex-shrink-0"></i>
              <div>
                <strong className="block text-gray-900 mb-0.5 md:mb-1 text-xs md:text-sm 2xl:text-base 3xl:text-lg">Improve retention by 40%</strong>
                <span className="text-gray-600 text-xs md:text-sm 2xl:text-base 3xl:text-lg">Reduce provider and staff burnout</span>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Efficiency Suite */}
        <div className="mb-6 md:mb-8 lg:mb-10 xl:mb-12 2xl:mb-16 3xl:mb-20 animate-fade-in-scale animation-delay-200">
          <div className="flex items-start gap-2 md:gap-3 lg:gap-4 2xl:gap-5 3xl:gap-6 mb-3 md:mb-4 lg:mb-6 xl:mb-8 2xl:mb-10 3xl:mb-12">
            <div className="w-9 h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 3xl:w-20 3xl:h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <i className="bi bi-heart-pulse-fill text-white text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl"></i>
            </div>
            <div>
              <h3 className="text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl font-bold text-gray-900 mb-0.5 md:mb-1 lg:mb-2 2xl:mb-3">Clinical Efficiency Suite</h3>
              <p className="text-gray-600 text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl 3xl:text-2xl">Reduce provider burnout and improve clinical documentation quality</p>
            </div>
          </div>

          {/* Featured Products */}
          <div className="mb-5 md:mb-6 lg:mb-8 xl:mb-10 2xl:mb-12 3xl:mb-14">
            <h4 className="text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl font-semibold text-gray-800 mb-2 md:mb-3 lg:mb-4 xl:mb-6 2xl:mb-8 flex items-center gap-1.5 md:gap-2 2xl:gap-3">
              <i className="bi bi-star-fill text-purple-500"></i>
              Featured Products
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4 xl:gap-5 2xl:gap-6 3xl:gap-8">
              {featuredProducts.map((agent, index) => (
                <ProductCard key={index} {...agent} />
              ))}
            </div>
          </div>

          {/* Early Access Products */}
          <div>
            <h4 className="text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl font-semibold text-gray-800 mb-2 md:mb-3 lg:mb-4 xl:mb-6 2xl:mb-8 flex items-center gap-1.5 md:gap-2 2xl:gap-3">
              <i className="bi bi-clock-history text-amber-500"></i>
              Early Access
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 md:gap-3 lg:gap-4 xl:gap-5 2xl:gap-6 3xl:gap-8">
              {upcomingProducts.map((agent, index) => (
                <ProductCard key={index} {...agent} />
              ))}
            </div>
          </div>
        </div>

        {/* Operational Excellence & Patient Engagement Suite */}
        <div className="animate-fade-in-scale animation-delay-300">
          <div className="flex items-start gap-2 md:gap-3 lg:gap-4 2xl:gap-5 3xl:gap-6 mb-3 md:mb-4 lg:mb-6 xl:mb-8 2xl:mb-10 3xl:mb-12">
            <div className="w-9 h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 3xl:w-20 3xl:h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <i className="bi bi-gear-fill text-white text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl"></i>
            </div>
            <div>
              <h3 className="text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl font-bold text-gray-900 mb-0.5 md:mb-1 lg:mb-2 2xl:mb-3">Operational Excellence & Patient Engagement Suite</h3>
              <p className="text-gray-600 text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl 3xl:text-2xl">Optimize operations and improve patient throughput</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4 xl:gap-5 2xl:gap-6 3xl:gap-8">
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
