function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden bg-gradient-to-b from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-5xl mx-auto relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass-card px-6 py-3 rounded-full text-sm font-semibold mb-8 lg:mt-14 mt-4 animate-fade-in-scale">
            <i className="bi bi-lightning-charge-fill text-cyan-500 animate-pulse"></i>
            <span className="text-gray-800">AI-Powered Healthcare Automation</span>
          </div>

          {/* Main Heading with Gradient Text */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in-scale animation-delay-100">
            <span className="text-gray-900">AI Agents That Automate</span>
            <br />
            <span className="animate-gradient-text">Your Entire Clinical Workflow</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto animate-fade-in-scale animation-delay-200">
            Transform manual documentation, scheduling, and administrative tasks into automated workflows. Our modular AI agents eliminate repetitive work while improving patient satisfaction.
          </p>

          {/* Features with Glass Cards */}
          <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-in-scale animation-delay-300">
            <div className="flex items-center gap-3 glass-card px-5 py-3 rounded-xl hover-scale group shadow-sm">
              <i className="bi bi-mic-fill text-cyan-500 text-xl group-hover:scale-110 transition-transform"></i>
              <span className="text-gray-800 font-medium">Real-Time Clinical Documentation</span>
            </div>
            <div className="flex items-center gap-3 glass-card px-5 py-3 rounded-xl hover-scale group shadow-sm">
              <i className="bi bi-headset text-purple-500 text-xl group-hover:scale-110 transition-transform"></i>
              <span className="text-gray-800 font-medium">24/7 Automated Scheduling</span>
            </div>
            <div className="flex items-center gap-3 glass-card px-5 py-3 rounded-xl hover-scale group shadow-sm">
              <i className="bi bi-bell text-pink-500 text-xl group-hover:scale-110 transition-transform"></i>
              <span className="text-gray-800 font-medium">Patient Engagement & Reminders</span>
            </div>
          </div>

          {/* CTA Buttons with Gradients */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center mb-16 animate-fade-in-scale animation-delay-400">
            <a
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all font-semibold text-lg shadow-lg hover:shadow-cyan-500/50 hover:scale-105 hover-glow"
            >
              <i className="bi bi-rocket-takeoff"></i>
              Get Started
            </a>
            <a
              href="#agents" 
              className="inline-flex items-center justify-center gap-2 glass-card border-2 border-cyan-500/50 text-gray-800 px-8 py-4 rounded-xl hover:bg-cyan-50/50 hover:border-cyan-500 transition-all font-semibold text-lg hover:scale-105 shadow-sm"
            >
              <i className="bi bi-grid-3x3-gap"></i>
              Explore Products
            </a>
          </div>

          {/* Metrics with Glass Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-fade-in-scale animation-delay-500">
            <div className="glass-card p-6 rounded-2xl hover-lift shadow-sm">
              <div className="text-5xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent mb-2">2+ hours</div>
              <div className="text-gray-600">Saved per provider/day</div>
            </div>
            <div className="glass-card p-6 rounded-2xl hover-lift shadow-sm">
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent mb-2">70%</div>
              <div className="text-gray-600">Documentation time reduction</div>
            </div>
            <div className="glass-card p-6 rounded-2xl hover-lift shadow-sm">
              <div className="text-5xl font-bold bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent mb-2">95%</div>
              <div className="text-gray-600">Provider satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="floating-element element-1"></div>
        <div className="floating-element element-2"></div>
        <div className="floating-element element-3"></div>
      </div>
    </section>
  );
}

export default Hero;
