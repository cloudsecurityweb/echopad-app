import { handleIntercomAction } from '../../utils/intercom';

function ProductDetail({ 
  id, 
  label, 
  title, 
  intro, 
  sections, 
  visualization,
}) {
  const handleIntercomClick = (e, action) => {
    e.preventDefault();
    handleIntercomAction(action);
  };

  return (
    <section 
      id={id} 
      className="product-detail-section bg-white mb-4"
    >
      <div className="container mx-auto px-4">
        <div className="glass-card rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 gap-3 md:gap-5 lg:gap-6 pt-3 md:pt-4 pb-5 md:pb-6 px-4 md:px-6">
            {/* Left Column - Content */}
            <div>
              <div className="text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent uppercase tracking-wider mb-2">
                {label}
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">{title}</h2>
              <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-5 leading-relaxed">{intro}</p>

              {sections.map((section, index) => (
                <div key={index} className="mb-4 md:mb-5">
                  <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-2">{section.title}</h4>
                  {section.content && <p className="text-sm md:text-base text-gray-600 mb-2 md:mb-3 leading-relaxed">{section.content}</p>}
                  {section.items && (
                    <ul className="space-y-1.5 md:space-y-2">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2 md:gap-3 text-sm md:text-base text-gray-600">
                          <i className="bi bi-check-circle-fill text-green-500 mt-0.5 md:mt-1 flex-shrink-0"></i>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.processSteps && (
                    <div className="space-y-2 md:space-y-3">
                      {section.processSteps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex gap-2.5 md:gap-3">
                          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 shadow-lg text-sm md:text-base">
                            {stepIndex + 1}
                          </div>
                          <div>
                            <strong className="block text-gray-900 mb-0.5 text-sm md:text-base">{step.title}</strong>
                            <p className="text-xs md:text-sm text-gray-600">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <a 
                href="#" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 md:px-6 py-2.5 md:py-3 rounded-xl font-semibold text-sm md:text-base shadow-lg"
                onClick={(e) => handleIntercomClick(e, 'request-demo')}
              >
                See It In Action
              </a>
            </div>

            {/* Right Column - Visualization */}
            {visualization && (
              <div className="rounded-2xl p-4 md:p-5 lg:p-6 bg-gray-50 border border-gray-200">
                <div className="mb-4 md:mb-6 text-center">
                  <div className="inline-block bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg uppercase tracking-wider mb-4 shadow-md">
                    LIVE DEMO
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                    <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {title}
                    </span>
                  </h2>
                  {visualization.title && (
                    <h3 className="text-xl md:text-2xl font-semibold text-gray-700 mb-4">
                      {visualization.title}
                    </h3>
                  )}
                </div>

                {visualization.steps && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                    {visualization.steps.map((step, index) => (
                      <div
                        key={index}
                        className="glass-card rounded-xl p-3 md:p-4 border border-gray-200 bg-gray-50 h-full flex flex-col items-center text-center"
                      >
                        <div className="flex items-center justify-center gap-2 md:gap-3 mb-2 md:mb-3">
                          <span className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold px-2 md:px-3 py-1 md:py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                            STEP {index + 1}
                          </span>
                          <span className="font-semibold text-sm md:text-base text-gray-900 truncate max-w-[11rem] md:max-w-[12rem]">
                            {step.title}
                          </span>
                        </div>
                        <div className="text-xs md:text-sm text-gray-700 flex-1 flex items-center justify-center w-full">
                          {step.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;
