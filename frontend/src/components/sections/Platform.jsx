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
    <section id="platform" className="relative py-20 bg-gradient-to-b from-white via-blue-50/30 to-white overflow-hidden">
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-cyan-200/20 blur-3xl"></div>
      <div className="absolute -bottom-28 -left-24 w-80 h-80 rounded-full bg-blue-200/15 blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16 animate-fade-in-scale">
          <div className="text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent uppercase tracking-widest mb-3">
            The Echopad AI Platform
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">
            Built on a Unified, EHR-Agnostic Platform
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            Every Echopad AI agent runs on one secure platform. Integrate with your EHR, tailor workflows, and scale across locations with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="glass-card p-6 rounded-2xl border border-gray-200/70 hover-lift group animate-fade-in-scale shadow-sm" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-lg">
                <i className={`bi ${feature.icon} text-white text-xl`}></i>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-cyan-600 transition-colors">{feature.title}</h4>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Platform;
