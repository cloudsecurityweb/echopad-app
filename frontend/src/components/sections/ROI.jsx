import FullScreenSection from '../layout/FullScreenSection';

function ROI() {
  return (
    <FullScreenSection id="roi" className="bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl 2xl:max-w-5xl 3xl:max-w-6xl mx-auto origin-center" style={{ transform: 'scale(0.92)' }}>
          <div className="glass-card rounded-3xl p-3 md:p-4 lg:p-5 xl:p-6 2xl:p-8 shadow-xl relative overflow-hidden border border-gray-200">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-white to-purple-50 opacity-80"></div>
            <div className="absolute -top-24 -right-20 w-64 h-64 rounded-full bg-cyan-200/40 blur-3xl"></div>
            <div className="absolute -bottom-24 -left-20 w-72 h-72 rounded-full bg-purple-200/40 blur-3xl"></div>

            <div className="relative z-10 flex flex-col gap-2 md:gap-3 lg:gap-4 xl:gap-5 2xl:gap-6">
              <div className="text-center">
                <div className="text-xs md:text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent uppercase tracking-widest mb-1 md:mb-1.5 lg:mb-2">
                  ROI Snapshot
                </div>
                <h2 className="text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-bold text-gray-900 mb-1 md:mb-1.5 lg:mb-2 pb-3 border-b border-gray-200 inline-block">
                  Organization-wide rollout in under less than 7 days. See measurable ROI in 30-60 days.
                </h2>
                <p className="text-xs md:text-sm lg:text-base text-gray-600">
                  Typical impact by practice size. Sources are listed next to each claim; results vary by implementation and baseline workflow.
                </p>
              </div>

              {/* 10-provider practice */}
              <div>
                <h3 className="text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">10-provider practice</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3 lg:gap-4">
                  <div className="glass-card rounded-2xl p-3 md:p-4 lg:p-5 xl:p-6 min-h-[160px] md:min-h-[180px] text-center hover-lift shadow-sm">
                    <div className="w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-1 md:mb-2 lg:mb-2.5 shadow-md">
                      <i className="bi bi-currency-dollar text-white text-xs md:text-sm lg:text-base xl:text-lg"></i>
                    </div>
                    <div className="text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent mb-0.5 md:mb-1">$180K</div>
                    <p className="text-xs md:text-sm text-gray-600">Annual savings from reduced overtime and better billing capture</p>
                  </div>
                  <div className="glass-card rounded-2xl p-3 md:p-4 lg:p-5 xl:p-6 min-h-[160px] md:min-h-[180px] text-center hover-lift shadow-sm">
                    <div className="w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-1 md:mb-2 lg:mb-2.5 shadow-md">
                      <i className="bi bi-graph-up-arrow text-white text-xs md:text-sm lg:text-base xl:text-lg"></i>
                    </div>
                    <div className="text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent mb-0.5 md:mb-1">Up to 60%</div>
                    <p className="text-xs md:text-sm text-gray-600">Less time spent on admin tasks</p>
                  </div>
                  <div className="glass-card rounded-2xl p-3 md:p-4 lg:p-5 xl:p-6 min-h-[160px] md:min-h-[180px] text-center hover-lift shadow-sm">
                    <div className="w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-1 md:mb-2 lg:mb-2.5 shadow-md">
                      <i className="bi bi-people text-white text-xs md:text-sm lg:text-base xl:text-lg"></i>
                    </div>
                    <div className="text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent mb-0.5 md:mb-1">Up to 40%</div>
                    <p className="text-xs md:text-sm text-gray-600">Better retention and lower burnout risk</p>
                  </div>
                </div>
              </div>

              {/* Small practice (1–3 providers) */}
              <div>
                <h3 className="text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">Small practice (1–3 providers)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3 lg:gap-4">
                  <div className="glass-card rounded-2xl p-3 md:p-4 lg:p-5 xl:p-6 min-h-[160px] md:min-h-[180px] text-center hover-lift shadow-sm border border-cyan-100">
                    <div className="w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-1 md:mb-2 lg:mb-2.5 shadow-md">
                      <i className="bi bi-currency-dollar text-white text-xs md:text-sm lg:text-base xl:text-lg"></i>
                    </div>
                    <div className="text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent mb-0.5 md:mb-1">$45K–$55K</div>
                    <p className="text-xs md:text-sm text-gray-600">Annual savings from reduced overtime and better billing capture</p>
                  </div>
                  <div className="glass-card rounded-2xl p-3 md:p-4 lg:p-5 xl:p-6 min-h-[160px] md:min-h-[180px] text-center hover-lift shadow-sm border border-cyan-100">
                    <div className="w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-1 md:mb-2 lg:mb-2.5 shadow-md">
                      <i className="bi bi-graph-up-arrow text-white text-xs md:text-sm lg:text-base xl:text-lg"></i>
                    </div>
                    <div className="text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent mb-0.5 md:mb-1">Up to 60%</div>
                    <p className="text-xs md:text-sm text-gray-600">Less time spent on admin tasks</p>
                  </div>
                  <div className="glass-card rounded-2xl p-3 md:p-4 lg:p-5 xl:p-6 min-h-[160px] md:min-h-[180px] text-center hover-lift shadow-sm border border-cyan-100">
                    <div className="w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-1 md:mb-2 lg:mb-2.5 shadow-md">
                      <i className="bi bi-people text-white text-xs md:text-sm lg:text-base xl:text-lg"></i>
                    </div>
                    <div className="text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent mb-0.5 md:mb-1">Up to 40%</div>
                    <p className="text-xs md:text-sm text-gray-600">Better retention and lower burnout risk</p>
                  </div>
                </div>
              </div>

                <div>
                <h3 className="text-sm md:text-base lg:text-lg xl:text-xl font-semibold text-gray-900 text-center mb-1.5 md:mb-2 lg:mb-3 xl:mb-4">Start your new and improved Agentic journey in 4 simple steps</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1.5 md:gap-2 lg:gap-3">
                  <div className="glass-card rounded-xl p-3 md:p-4 lg:p-5 xl:p-5 min-h-[130px] md:min-h-[145px] text-center hover-lift shadow-sm">
                    <div className="text-xs md:text-sm lg:text-base xl:text-lg font-semibold text-gray-900 mb-0.5 md:mb-1">Step 1</div>
                    <p className="text-xs md:text-sm text-gray-600">Sign up</p>
                  </div>
                  <div className="glass-card rounded-xl p-3 md:p-4 lg:p-5 xl:p-5 min-h-[130px] md:min-h-[145px] text-center hover-lift shadow-sm">
                    <div className="text-xs md:text-sm lg:text-base xl:text-lg font-semibold text-gray-900 mb-0.5 md:mb-1">Step 2</div>
                    <p className="text-xs md:text-sm text-gray-600">Familiarize yourself with the tool (less than 15 min)</p>
                  </div>
                  <div className="glass-card rounded-xl p-3 md:p-4 lg:p-5 xl:p-5 min-h-[130px] md:min-h-[145px] text-center hover-lift shadow-sm">
                    <div className="text-xs md:text-sm lg:text-base xl:text-lg font-semibold text-gray-900 mb-0.5 md:mb-1">Step 3</div>
                    <p className="text-xs md:text-sm text-gray-600">Bring your team together</p>
                  </div>
                  <div className="glass-card rounded-xl p-3 md:p-4 lg:p-5 xl:p-5 min-h-[130px] md:min-h-[145px] text-center hover-lift shadow-sm">
                    <div className="text-xs md:text-sm lg:text-base xl:text-lg font-semibold text-gray-900 mb-0.5 md:mb-1">Step 4</div>
                    <p className="text-xs md:text-sm text-gray-600">Allow agents to simplify your work</p>
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
