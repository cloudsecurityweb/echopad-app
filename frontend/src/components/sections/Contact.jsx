import { handleIntercomAction } from '../../utils/intercom';
import FullScreenSection from '../layout/FullScreenSection';

function Contact() {
  const handleIntercomClick = (e, action) => {
    e.preventDefault();
    handleIntercomAction(action);
  };

  return (
    <FullScreenSection id="contact" className="bg-white">
      <div className="container mx-auto px-4 w-full">
        <div className="max-w-4xl mx-auto">
          {/* Get Started CTA Card - centered, elevated shadow */}
          <div className="rounded-2xl md:rounded-3xl border border-gray-200 bg-white p-6 md:p-10 lg:p-12 shadow-lg shadow-gray-200/60">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-10">
              {/* Left: Label, headline, description, small print */}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
                  Get Started
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 pb-3 border-b border-gray-200">
                  Ready to see Echopad in action?
                </h2>
                <p className="text-base md:text-lg text-gray-600 mb-2 leading-relaxed">
                  Book a quick walkthrough and leave with a clear automation plan.
                </p>
                <p className="text-sm text-gray-500">
                  15-minute call, no obligation.
                </p>
              </div>
              {/* Right: Primary + secondary buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
                <a
                  href="#"
                  className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3.5 rounded-full hover:bg-gray-800 transition-all hover:scale-105 font-semibold text-sm shadow-md hover:shadow-lg min-w-[140px]"
                  onClick={(e) => handleIntercomClick(e, 'request-demo')}
                >
                  <i className="bi bi-chat-dots-fill text-white text-lg" aria-hidden="true" />
                  Book a Demo
                </a>
                <a
                  href="/sign-up"
                  className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-6 py-3.5 rounded-full border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all hover:scale-105 font-medium text-sm shadow-sm hover:shadow-md min-w-[140px]"
                >
                  <i className="bi bi-rocket-takeoff text-cyan-500 text-lg" aria-hidden="true" />
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FullScreenSection>
  );
}

export default Contact;
