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
        <div className="glass-card rounded-xl shadow-sm overflow-hidden min-h-[520px] md:min-h-[640px] lg:min-h-[760px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 pb-8 px-6">
            {/* Left Column - Content */}
            <div>
              <div className="text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent uppercase tracking-wider mb-2">
                {label}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{title}</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">{intro}</p>

              {sections.map((section, index) => (
                <div key={index} className="mb-8">
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{section.title}</h4>
                  {section.content && <p className="text-gray-600 mb-4 leading-relaxed">{section.content}</p>}
                  {section.items && (
                    <ul className="space-y-3">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-3 text-gray-600">
                          <i className="bi bi-check-circle-fill text-green-500 mt-1 flex-shrink-0"></i>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.processSteps && (
                    <div className="space-y-4">
                      {section.processSteps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 shadow-lg">
                            {stepIndex + 1}
                          </div>
                          <div>
                            <strong className="block text-gray-900 mb-1">{step.title}</strong>
                            <p className="text-gray-600">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <a 
                href="#" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
                onClick={(e) => handleIntercomClick(e, 'request-demo')}
              >
                See It In Action
              </a>
            </div>

            {/* Right Column - Visualization */}
            {visualization && (
              <div className="rounded-2xl p-6 bg-gray-50 border border-gray-200">
                <div className="mb-6">
                  <div className="text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent uppercase tracking-wider mb-2">
                    LIVE DEMO
                  </div>
                  <div className="text-lg font-bold text-gray-900">{visualization.title}</div>
                </div>

                {visualization.steps && visualization.steps.map((step, index) => (
                  <div key={index}>
                    <div className="mb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg">
                          STEP {index + 1}
                        </span>
                        <span className="font-semibold text-gray-900">{step.title}</span>
                      </div>
                      <div className="glass-card rounded-xl p-4 border border-gray-200 bg-gray-50">
                        {step.content}
                      </div>
                    </div>
                    {index < visualization.steps.length - 1 && (
                      <div className="flex justify-center my-4">
                        <i className="bi bi-arrow-down text-cyan-500 text-2xl animate-pulse"></i>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;
