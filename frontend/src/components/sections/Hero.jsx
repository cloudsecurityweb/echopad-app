import FullScreenSection from '../layout/FullScreenSection';

function Hero() {
  const handleExploreProductsClick = (e) => {
    e.preventDefault();
    const headerOffset = 80;
    const element = document.querySelector('#agents');
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <FullScreenSection id="hero" fullHeight className="bg-gradient-to-b from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass-card px-3 py-1.5 rounded-full text-sm font-semibold mb-4 animate-fade-in-scale">
            <i className="bi bi-lightning-charge-fill text-cyan-500 animate-pulse"></i>
            <span className="text-gray-800">AI-Powered Healthcare Automation</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight animate-fade-in-scale animation-delay-100">
            <span className="text-gray-900">AI Agents That Automate </span>
            <span className="animate-gradient-text">Your Entire Clinical Workflow</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-2xl mx-auto animate-fade-in-scale animation-delay-200">
            Transform documentation, scheduling, and admin tasks into automated workflows. Modular AI agents—deploy individually or as a suite.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-6 animate-fade-in-scale animation-delay-300">
            <div className="flex items-center gap-2 glass-card px-3 py-2 rounded-xl hover-scale group shadow-sm">
              <i className="bi bi-mic-fill text-cyan-500 group-hover:scale-110 transition-transform"></i>
              <span className="text-gray-800 font-medium text-sm">Clinical Documentation</span>
            </div>
            <div className="flex items-center gap-2 glass-card px-3 py-2 rounded-xl hover-scale group shadow-sm">
              <i className="bi bi-headset text-purple-500 group-hover:scale-110 transition-transform"></i>
              <span className="text-gray-800 font-medium text-sm">24/7 Scheduling</span>
            </div>
            <div className="flex items-center gap-2 glass-card px-3 py-2 rounded-xl hover-scale group shadow-sm">
              <i className="bi bi-bell text-pink-500 group-hover:scale-110 transition-transform"></i>
              <span className="text-gray-800 font-medium text-sm">Patient Reminders</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6 animate-fade-in-scale animation-delay-400">
            <a
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all font-semibold text-sm shadow-lg hover:scale-105"
            >
              <i className="bi bi-rocket-takeoff"></i>
              Get Started
            </a>
            <a
              href="/"
              onClick={handleExploreProductsClick}
              className="inline-flex items-center justify-center gap-2 glass-card border-2 border-cyan-500/50 text-gray-800 px-6 py-3 rounded-xl hover:bg-cyan-50/50 hover:border-cyan-500 transition-all font-semibold text-sm hover:scale-105 shadow-sm"
            >
              <i className="bi bi-grid-3x3-gap"></i>
              Explore Products
            </a>
          </div>

          {/* Metrics - compact */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 animate-fade-in-scale animation-delay-500">
            <div className="text-center">
              <div className="text-base font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">2+ hrs</div>
              <div className="text-xs text-gray-500">Saved/day</div>
            </div>
            <div className="text-center">
              <div className="text-base font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">70%</div>
              <div className="text-xs text-gray-500">Less charting</div>
            </div>
            <div className="text-center">
              <div className="text-base font-bold bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent">95%</div>
              <div className="text-xs text-gray-500">Satisfaction</div>
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
    </FullScreenSection>
  );
}

export default Hero;
