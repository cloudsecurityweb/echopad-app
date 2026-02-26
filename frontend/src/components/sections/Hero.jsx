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
    <FullScreenSection id="hero" className="bg-gradient-to-b from-blue-50 via-white to-purple-50 min-h-[72vh] flex flex-col justify-center">
      <div className="container mx-auto px-4 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto relative z-10">
          {/* Top badges: HIPAA + product badge — visible above the fold */}
          <div className="flex flex-wrap justify-center items-center gap-2 mb-4 animate-fade-in-scale mt-8">
            <a
              href="#platform"
              className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-full text-sm font-semibold hover:bg-emerald-100 transition-colors shadow-sm"
              aria-label="HIPAA Compliant"
            >
              <i className="bi bi-shield-fill-check text-emerald-600"></i>
              <span>HIPAA Compliant</span>
            </a>
            <span className="text-gray-300 hidden sm:inline">|</span>
            <div className="inline-flex items-center gap-2 glass-card px-3 py-1.5 rounded-full text-sm font-semibold">
              <i className="bi bi-lightning-charge-fill text-cyan-500 animate-pulse"></i>
              <span className="text-gray-800">Notes done before the patient leaves. Fewer no-shows. Less admin.</span>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight animate-fade-in-scale animation-delay-100">
            <span className="text-gray-900">Spend Less Time on Charts and Admin, </span>
            <span className="animate-gradient-text">More Time with Patients</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-2xl mx-auto animate-fade-in-scale animation-delay-200">
            Your note is done before you leave the room. Phones get answered 24/7. Fewer no-shows. Deploy one tool or the full suite—each plugs into your EHR.
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

          {/* Trusted by — above the fold */}
          <p className="text-xs sm:text-sm text-gray-500 mb-6 animate-fade-in-scale animation-delay-400">
            Trusted by <span className="font-semibold text-gray-700">50+ practices</span> across family medicine, multi-specialty, and health systems
          </p>

          {/* Trust / differentiators - no duplicate product stats */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 animate-fade-in-scale animation-delay-500 text-sm">
            <div className="text-center">
              <div className="font-semibold text-gray-800">Modular</div>
              <div className="text-xs text-gray-500">Deploy one agent or the full suite</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-800">HIPAA-ready</div>
              <div className="text-xs text-gray-500">BAA included, SOC 2 Type II</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-800">Deploy in 30 days</div>
              <div className="text-xs text-gray-500">Consistent 30-day rollout</div>
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
