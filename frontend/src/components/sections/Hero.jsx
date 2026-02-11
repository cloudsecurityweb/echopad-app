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
    <FullScreenSection id="hero" className="bg-gradient-to-b from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 md:px-4">
        <div className="text-center max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl mx-auto relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass-card px-4 md:px-3 lg:px-4 xl:px-6 2xl:px-7 3xl:px-8 py-1 md:py-1.5 lg:py-2 xl:py-3 2xl:py-3.5 3xl:py-4 rounded-full text-sm md:text-xs 2xl:text-sm 3xl:text-base font-semibold mb-5 md:mb-4 lg:mb-5 xl:mb-6 2xl:mb-8 3xl:mb-10 animate-fade-in-scale">
            <i className="bi bi-lightning-charge-fill text-cyan-500 animate-pulse text-xs md:text-sm 2xl:text-base 3xl:text-lg"></i>
            <span className="text-gray-800">AI-Powered Healthcare Automation</span>
          </div>

          {/* Main Heading with Gradient Text */}
          <h1 className="text-3xl sm:text-4xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl 3xl:text-7xl font-bold mb-4 md:mb-3 lg:mb-4 xl:mb-5 2xl:mb-6 3xl:mb-8 leading-tight animate-fade-in-scale animation-delay-100">
            <span className="text-gray-900">
              AI Agents That Automate
            </span>

            <br />

            <span className="animate-gradient-text">
              Your Entire Clinical Workflow
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-base lg:text-base xl:text-lg 2xl:text-xl 3xl:text-2xl text-gray-600 mb-5 md:mb-4 lg:mb-5 xl:mb-6 2xl:mb-8 3xl:mb-10 max-w-3xl 2xl:max-w-4xl 3xl:max-w-5xl mx-auto animate-fade-in-scale animation-delay-200">
            Transform manual documentation, scheduling, and administrative tasks into automated workflows. Our modular AI agents eliminate repetitive work while improving patient satisfaction.
          </p>

          {/* Features with Glass Cards */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-2 lg:gap-3 xl:gap-4 2xl:gap-5 3xl:gap-6 mb-6 md:mb-5 lg:mb-6 xl:mb-8 2xl:mb-10 3xl:mb-12 animate-fade-in-scale animation-delay-300">
            <div className="flex items-center gap-1.5 md:gap-2 glass-card px-4 md:px-3 lg:px-4 xl:px-5 2xl:px-6 3xl:px-7 py-1 md:py-1.5 lg:py-2 xl:py-3 2xl:py-3.5 3xl:py-4 rounded-xl hover-scale group shadow-sm">
              <i className="bi bi-mic-fill text-cyan-500 text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl group-hover:scale-110 transition-transform"></i>
              <span className="text-gray-800 font-medium text-sm md:text-sm lg:text-base 2xl:text-lg 3xl:text-xl">Real-Time Clinical Documentation</span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2 glass-card px-4 md:px-3 lg:px-4 xl:px-5 2xl:px-6 3xl:px-7 py-1 md:py-1.5 lg:py-2 xl:py-3 2xl:py-3.5 3xl:py-4 rounded-xl hover-scale group shadow-sm">
              <i className="bi bi-headset text-purple-500 text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl group-hover:scale-110 transition-transform"></i>
              <span className="text-gray-800 font-medium text-sm md:text-sm lg:text-base 2xl:text-lg 3xl:text-xl">24/7 Automated Scheduling</span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2 glass-card px-4 md:px-3 lg:px-4 xl:px-5 2xl:px-6 3xl:px-7 py-1 md:py-1.5 lg:py-2 xl:py-3 2xl:py-3.5 3xl:py-4 rounded-xl hover-scale group shadow-sm">
              <i className="bi bi-bell text-pink-500 text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl group-hover:scale-110 transition-transform"></i>
              <span className="text-gray-800 font-medium text-sm md:text-sm lg:text-base 2xl:text-lg 3xl:text-xl">Patient Engagement & Reminders</span>
            </div>
          </div>

          {/* CTA Buttons with Gradients */}
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 xl:gap-5 2xl:gap-6 3xl:gap-7 justify-center mb-4 md:mb-4 lg:mb-5 xl:mb-6 2xl:mb-8 3xl:mb-10 animate-fade-in-scale animation-delay-400">
            <a
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 md:px-5 lg:px-6 xl:px-8 2xl:px-10 3xl:px-12 py-3 md:py-2.5 lg:py-3 xl:py-4 2xl:py-5 3xl:py-6 rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all font-semibold text-sm md:text-sm lg:text-base xl:text-lg 2xl:text-xl 3xl:text-2xl shadow-lg hover:shadow-cyan-500/50 hover:scale-105 hover-glow"
            >
              <i className="bi bi-rocket-takeoff"></i>
              Get Started
            </a>
            <a
              href="/"
              onClick={handleExploreProductsClick}
              className="inline-flex items-center justify-center gap-2 glass-card border-2 border-cyan-500/50 text-gray-800 px-6 md:px-5 lg:px-6 xl:px-8 2xl:px-10 3xl:px-12 py-3 md:py-2.5 lg:py-3 xl:py-4 2xl:py-5 3xl:py-6 rounded-xl hover:bg-cyan-50/50 hover:border-cyan-500 transition-all font-semibold text-sm md:text-sm lg:text-base xl:text-lg 2xl:text-xl 3xl:text-2xl hover:scale-105 shadow-sm"
            >
              <i className="bi bi-grid-3x3-gap"></i>
              Explore Products
            </a>
          </div>

          {/* Metrics */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-5 lg:gap-6 xl:gap-8 2xl:gap-10 3xl:gap-12 animate-fade-in-scale animation-delay-500">
            <div className="text-center">
              <div className="text-sm md:text-sm lg:text-base xl:text-lg 2xl:text-xl 3xl:text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">2+ hours</div>
              <div className="text-xs md:text-xs lg:text-xs xl:text-sm 2xl:text-base 3xl:text-lg text-gray-500">Saved per provider/day</div>
            </div>
            <div className="text-center">
              <div className="text-sm md:text-sm lg:text-base xl:text-lg 2xl:text-xl 3xl:text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">70%</div>
              <div className="text-xs md:text-xs lg:text-xs xl:text-sm 2xl:text-base 3xl:text-lg text-gray-500">Documentation time reduction</div>
            </div>
            <div className="text-center">
              <div className="text-sm md:text-sm lg:text-base xl:text-lg 2xl:text-xl 3xl:text-2xl font-bold bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent">95%</div>
              <div className="text-xs md:text-xs lg:text-xs xl:text-sm 2xl:text-base 3xl:text-lg text-gray-500">Provider satisfaction</div>
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
