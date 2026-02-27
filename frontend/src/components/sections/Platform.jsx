function Platform() {
  const features = [
    {
      icon: 'bi-diagram-3-fill',
      title: 'Keep Your Current EHR',
      description: 'Avoid expensive rip-and-replace projects. We connect to Epic, Cerner, Athena, MEDITECH, and other major systems.',
    },
    {
      icon: 'bi-shield-lock-fill',
      title: 'Your Data Is Protected',
      description: 'HIPAA-aligned workflows, SOC 2 Type II controls, and BAA support. Encryption in transit and at rest, with data-handling policies defined per deployment.',
    },
    {
      icon: 'bi-sliders',
      title: 'Fits Your Workflow',
      description: 'Configure each solution to match your templates, documentation style, and how your practice runs.',
    },
    {
      icon: 'bi-lightning-charge-fill',
      title: 'Your Note When You Need It',
      description: 'Results are ready when you are—no waiting. Built for reliability so you can count on it every day.',
    },
    {
      icon: 'bi-arrow-up-right-circle-fill',
      title: 'Grows with You',
      description: 'From one provider to many. Most practices are live in about 30 days; we support multi-location when you scale.',
    },
    {
      icon: 'bi-cpu-fill',
      title: 'Trust the Note Before You Sign',
      description: 'Get consistent, clinical-grade documentation that is ready for review with fewer rewrites.',
    },
  ];

  return (
    <section id="platform" className="relative py-16 md:py-20 scroll-mt-20 flex flex-col justify-center bg-gradient-to-b from-white via-blue-50/30 to-white overflow-hidden">
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-cyan-200/20 blur-3xl"></div>
      <div className="absolute -bottom-28 -left-24 w-80 h-80 rounded-full bg-blue-200/15 blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 pb-3 border-b border-gray-200">Keep your EHR and reduce admin load across charting, scheduling, and operations.</h2>
          <p className="text-sm text-gray-600">Start with outcomes first, then layer in secure integrations that fit how your practice already works.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {features.map((feature, index) => (
            <div key={index} className="animate-fade-in-scale" style={{ animationDelay: `${index * 80}ms` }}>
              <div className="glass-card p-4 rounded-xl hover-lift shadow-sm h-full">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mb-3 shadow-lg">
                  <i className={`bi ${feature.icon} text-white text-lg`}></i>
                </div>
                <h4 className="text-base font-bold text-gray-900 mb-1">{feature.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Platform;
