import FullScreenSection from '../layout/FullScreenSection';

function ROI() {
  return (
    <FullScreenSection id="roi" className="bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl mx-auto">
          <div className="glass-card rounded-3xl p-4 md:p-5 lg:p-6 xl:p-8 2xl:p-10 3xl:p-14 shadow-xl relative overflow-hidden border border-gray-200">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100/70 opacity-80"></div>
            <div className="absolute -top-24 -right-20 w-64 h-64 rounded-full bg-slate-200/30 blur-3xl"></div>
            <div className="absolute -bottom-24 -left-20 w-72 h-72 rounded-full bg-slate-300/25 blur-3xl"></div>

            <div className="relative z-10 flex flex-col gap-3 md:gap-4 lg:gap-6 xl:gap-8 2xl:gap-10 3xl:gap-12">
              <div className="text-center">
                <div className="text-xs 2xl:text-sm 3xl:text-base font-semibold text-blue-700 uppercase tracking-widest mb-1.5 md:mb-2 lg:mb-3 2xl:mb-4">
                  ROI Snapshot
                </div>
                <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl font-bold text-gray-900 mb-1.5 md:mb-2 lg:mb-3 2xl:mb-4">
                  Deploy in 30 days. See ROI in 60.
                </h2>
                <p className="text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl 3xl:text-2xl text-gray-600">
                  A clear, measurable lift for a 10-provider practice.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3 lg:gap-4 xl:gap-5 2xl:gap-6 3xl:gap-8">
                <div className="glass-card rounded-2xl p-2.5 md:p-3 lg:p-4 xl:p-5 2xl:p-6 3xl:p-8 text-center hover-lift shadow-sm">
                  <div className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 3xl:w-16 3xl:h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-1.5 md:mb-2 lg:mb-3 xl:mb-4 2xl:mb-5 3xl:mb-6 shadow-md">
                    <i className="bi bi-currency-dollar text-white text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl"></i>
                  </div>
                  <div className="text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl font-bold text-gray-900 mb-0.5 md:mb-1 lg:mb-2 2xl:mb-3">$180K</div>
                  <p className="text-xs md:text-sm 2xl:text-base 3xl:text-lg text-gray-600">Annual savings from reduced overtime and better billing capture</p>
                </div>
                <div className="glass-card rounded-2xl p-2.5 md:p-3 lg:p-4 xl:p-5 2xl:p-6 3xl:p-8 text-center hover-lift shadow-sm">
                  <div className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 3xl:w-16 3xl:h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-1.5 md:mb-2 lg:mb-3 xl:mb-4 2xl:mb-5 3xl:mb-6 shadow-md">
                    <i className="bi bi-graph-up-arrow text-white text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl"></i>
                  </div>
                  <div className="text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl font-bold text-gray-900 mb-0.5 md:mb-1 lg:mb-2 2xl:mb-3">60%</div>
                  <p className="text-xs md:text-sm 2xl:text-base 3xl:text-lg text-gray-600">Reduction in administrative overhead</p>
                </div>
                <div className="glass-card rounded-2xl p-2.5 md:p-3 lg:p-4 xl:p-5 2xl:p-6 3xl:p-8 text-center hover-lift shadow-sm">
                  <div className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 3xl:w-16 3xl:h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-1.5 md:mb-2 lg:mb-3 xl:mb-4 2xl:mb-5 3xl:mb-6 shadow-md">
                    <i className="bi bi-people text-white text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl"></i>
                  </div>
                  <div className="text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl font-bold text-gray-900 mb-0.5 md:mb-1 lg:mb-2 2xl:mb-3">40%</div>
                  <p className="text-xs md:text-sm 2xl:text-base 3xl:text-lg text-gray-600">Improvement in patient throughput efficiency</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl font-semibold text-gray-900 text-center mb-2 md:mb-3 lg:mb-4 xl:mb-6 2xl:mb-8 3xl:mb-10">Implementation Timeline</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1.5 md:gap-2 lg:gap-3 xl:gap-4 2xl:gap-5 3xl:gap-6">
                  <div className="glass-card rounded-xl p-2.5 md:p-3 lg:p-4 xl:p-5 2xl:p-6 3xl:p-8 text-center hover-lift shadow-sm">
                    <div className="text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl 3xl:text-2xl font-semibold text-gray-900 mb-0.5 md:mb-1 2xl:mb-2">Week 1</div>
                    <p className="text-xs md:text-sm 2xl:text-base 3xl:text-lg text-gray-600">Onboarding & Configuration</p>
                  </div>
                  <div className="glass-card rounded-xl p-2.5 md:p-3 lg:p-4 xl:p-5 2xl:p-6 3xl:p-8 text-center hover-lift shadow-sm">
                    <div className="text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl 3xl:text-2xl font-semibold text-gray-900 mb-0.5 md:mb-1 2xl:mb-2">Week 2</div>
                    <p className="text-xs md:text-sm 2xl:text-base 3xl:text-lg text-gray-600">Staff Training (2 hours)</p>
                  </div>
                  <div className="glass-card rounded-xl p-2.5 md:p-3 lg:p-4 xl:p-5 2xl:p-6 3xl:p-8 text-center hover-lift shadow-sm">
                    <div className="text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl 3xl:text-2xl font-semibold text-gray-900 mb-0.5 md:mb-1 2xl:mb-2">Week 3</div>
                    <p className="text-xs md:text-sm 2xl:text-base 3xl:text-lg text-gray-600">Pilot with 3 Providers</p>
                  </div>
                  <div className="glass-card rounded-xl p-2.5 md:p-3 lg:p-4 xl:p-5 2xl:p-6 3xl:p-8 text-center hover-lift shadow-sm">
                    <div className="text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl 3xl:text-2xl font-semibold text-gray-900 mb-0.5 md:mb-1 2xl:mb-2">Week 4</div>
                    <p className="text-xs md:text-sm 2xl:text-base 3xl:text-lg text-gray-600">Full Deployment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FullScreenSection>
  );
}

export default ROI;
