function Platform() {
  const features = [
    {
      icon: 'bi-diagram-3-fill',
      title: 'EHR-Agnostic Integration',
      description: 'Works with Epic, Cerner, Athena, MEDITECH, and all major EHR systems. HL7/FHIR compatible with no API development required.',
    },
    {
      icon: 'bi-shield-lock-fill',
      title: 'Enterprise Security & Compliance',
      description: 'HIPAA-compliant, SOC 2 Type II certified, BAA available. End-to-end encryption with zero data retention policy.',
    },
    {
      icon: 'bi-sliders',
      title: 'Fully Customizable Workflows',
      description: 'Configure each AI agent to match your unique clinical workflows, templates, and documentation standards.',
    },
    {
      icon: 'bi-lightning-charge-fill',
      title: 'Real-Time Processing',
      description: 'Instant AI-powered processing with no delays. Results available immediately with 99.9% uptime SLA.',
    },
    {
      icon: 'bi-arrow-up-right-circle-fill',
      title: 'Scalable Architecture',
      description: 'Deploy in 7 days. Scales from solo practitioners to large healthcare organizations with multi-location support.',
    },
    {
      icon: 'bi-cpu-fill',
      title: 'Advanced AI Models',
      description: 'Powered by state-of-the-art medical AI that continuously learns and improves accuracy over time.',
    },
  ];

  return (
    <section id="platform" className="relative py-8 md:py-10 lg:py-12 xl:py-16 2xl:py-20 bg-gradient-to-b from-white via-slate-50/60 to-white overflow-hidden">
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-slate-200/25 blur-3xl"></div>
      <div className="absolute -bottom-28 -left-24 w-80 h-80 rounded-full bg-slate-300/15 blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-5 md:mb-6 lg:mb-8 xl:mb-12 2xl:mb-16 animate-fade-in-scale">
          <div className="text-xs font-semibold text-blue-700 uppercase tracking-widest mb-1.5 md:mb-2 lg:mb-3">
            The Echopad AI Platform
          </div>
          <h2 className="text-xl md:text-2xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-gray-900 mb-2 md:mb-3 lg:mb-4 xl:mb-5">
            Built on a Unified, EHR-Agnostic Platform
          </h2>
          <p className="text-xs md:text-sm lg:text-base xl:text-lg text-gray-600">
            Every Echopad AI agent runs on one secure platform. Integrate with your EHR, tailor workflows, and scale across locations with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4 xl:gap-5 2xl:gap-6">
          {features.map((feature, index) => (
            <div key={index} className="animate-fade-in-scale" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="glass-card p-2.5 md:p-3 lg:p-4 xl:p-5 2xl:p-6 rounded-2xl hover-lift shadow-sm h-full">
                <div className="w-9 h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-2 md:mb-3 lg:mb-4 xl:mb-5 shadow-lg">
                  <i className={`bi ${feature.icon} text-white text-sm md:text-base lg:text-lg xl:text-xl`}></i>
                </div>
                <h4 className="text-sm md:text-base lg:text-lg xl:text-xl font-bold text-gray-900 mb-1.5 md:mb-2 lg:mb-3">{feature.title}</h4>
                <p className="text-xs md:text-sm lg:text-base text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Platform;
