function ROI() {
  return (
    <section id="roi" className="py-8 md:py-10 lg:py-12 xl:py-16 2xl:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="glass-card rounded-3xl p-4 md:p-5 lg:p-6 xl:p-8 2xl:p-10 3xl:p-14 shadow-xl relative overflow-hidden border border-gray-200">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-white to-purple-50 opacity-80"></div>
            <div className="absolute -top-24 -right-20 w-64 h-64 rounded-full bg-cyan-200/40 blur-3xl"></div>
            <div className="absolute -bottom-24 -left-20 w-72 h-72 rounded-full bg-purple-200/40 blur-3xl"></div>

            <div className="relative z-10 flex flex-col gap-3 md:gap-4 lg:gap-6 xl:gap-8 2xl:gap-10">
              <div className="text-center">
                <div className="text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent uppercase tracking-widest mb-1.5 md:mb-2 lg:mb-3">
                  ROI Snapshot
                </div>
                <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-gray-900 mb-1.5 md:mb-2 lg:mb-3">
                  Deploy in 30 days. See ROI in 60.
                </h2>
                <p className="text-xs md:text-sm lg:text-base xl:text-lg text-gray-600">
                  A clear, measurable lift for a 10-provider practice.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3 lg:gap-4 xl:gap-5">
                <div className="glass-card rounded-2xl p-2.5 md:p-3 lg:p-4 xl:p-5 2xl:p-6 text-center hover-lift shadow-sm">
                  <div className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 xl:w-12 xl:h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-1.5 md:mb-2 lg:mb-3 xl:mb-4 shadow-md">
                    <i className="bi bi-currency-dollar text-white text-sm md:text-base lg:text-lg xl:text-xl"></i>
                  </div>
                  <div className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent mb-0.5 md:mb-1 lg:mb-2">$180K</div>
                  <p className="text-xs md:text-sm text-gray-600">Annual savings from reduced overtime and better billing capture</p>
                </div>
                <div className="glass-card rounded-2xl p-2.5 md:p-3 lg:p-4 xl:p-5 2xl:p-6 text-center hover-lift shadow-sm">
                  <div className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 xl:w-12 xl:h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-1.5 md:mb-2 lg:mb-3 xl:mb-4 shadow-md">
                    <i className="bi bi-graph-up-arrow text-white text-sm md:text-base lg:text-lg xl:text-xl"></i>
                  </div>
                  <div className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent mb-0.5 md:mb-1 lg:mb-2">60%</div>
                  <p className="text-xs md:text-sm text-gray-600">Reduction in administrative overhead</p>
                </div>
                <div className="glass-card rounded-2xl p-2.5 md:p-3 lg:p-4 xl:p-5 2xl:p-6 text-center hover-lift shadow-sm">
                  <div className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 xl:w-12 xl:h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-1.5 md:mb-2 lg:mb-3 xl:mb-4 shadow-md">
                    <i className="bi bi-people text-white text-sm md:text-base lg:text-lg xl:text-xl"></i>
                  </div>
                  <div className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent mb-0.5 md:mb-1 lg:mb-2">40%</div>
                  <p className="text-xs md:text-sm text-gray-600">Improvement in patient throughput efficiency</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm md:text-base lg:text-lg xl:text-xl font-semibold text-gray-900 text-center mb-2 md:mb-3 lg:mb-4 xl:mb-6">Implementation Timeline</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1.5 md:gap-2 lg:gap-3 xl:gap-4">
                  <div className="glass-card rounded-xl p-2.5 md:p-3 lg:p-4 xl:p-5 text-center hover-lift shadow-sm">
                    <div className="text-xs md:text-sm lg:text-base xl:text-lg font-semibold text-gray-900 mb-0.5 md:mb-1">Week 1</div>
                    <p className="text-xs md:text-sm text-gray-600">Onboarding & Configuration</p>
                  </div>
                  <div className="glass-card rounded-xl p-2.5 md:p-3 lg:p-4 xl:p-5 text-center hover-lift shadow-sm">
                    <div className="text-xs md:text-sm lg:text-base xl:text-lg font-semibold text-gray-900 mb-0.5 md:mb-1">Week 2</div>
                    <p className="text-xs md:text-sm text-gray-600">Staff Training (2 hours)</p>
                  </div>
                  <div className="glass-card rounded-xl p-2.5 md:p-3 lg:p-4 xl:p-5 text-center hover-lift shadow-sm">
                    <div className="text-xs md:text-sm lg:text-base xl:text-lg font-semibold text-gray-900 mb-0.5 md:mb-1">Week 3</div>
                    <p className="text-xs md:text-sm text-gray-600">Pilot with 3 Providers</p>
                  </div>
                  <div className="glass-card rounded-xl p-2.5 md:p-3 lg:p-4 xl:p-5 text-center hover-lift shadow-sm">
                    <div className="text-xs md:text-sm lg:text-base xl:text-lg font-semibold text-gray-900 mb-0.5 md:mb-1">Week 4</div>
                    <p className="text-xs md:text-sm text-gray-600">Full Deployment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ROI;
