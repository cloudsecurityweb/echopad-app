import { handleIntercomAction } from '../../utils/intercom';
import FullScreenSection from '../layout/FullScreenSection';

function Contact() {
  const handleIntercomClick = (e, action) => {
    e.preventDefault();
    handleIntercomAction(action);
  };

  return (
    <FullScreenSection id="contact" className="bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl mx-auto">
          <div className="rounded-2xl border border-gray-200/80 bg-gradient-to-br from-white via-white to-cyan-50/40 p-4 md:p-5 lg:p-6 xl:p-8 2xl:p-10 3xl:p-14 shadow-sm">
            <div className="flex flex-col gap-3 md:gap-4 lg:gap-6 xl:gap-8 2xl:gap-10 3xl:gap-12 md:flex-row md:items-center md:justify-between">
              <div className="text-center md:text-left md:max-w-2xl 2xl:max-w-3xl 3xl:max-w-4xl">
                <div className="text-xs 2xl:text-sm 3xl:text-base font-semibold text-gray-500 uppercase tracking-widest mb-1.5 md:mb-2 lg:mb-3 2xl:mb-4">
                  Get Started
                </div>
                <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl font-bold text-gray-900 mb-1.5 md:mb-2 lg:mb-3 2xl:mb-4">
                  Ready to see Echopad in action?
                </h2>
                <p className="text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl 3xl:text-2xl text-gray-600">
                  Book a quick walkthrough and leave with a clear automation plan.
                </p>
                <p className="text-xs md:text-sm 2xl:text-base 3xl:text-lg text-gray-500 mt-1.5 md:mt-2 lg:mt-3 2xl:mt-4">15-minute call, no obligation.</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-end gap-1.5 md:gap-2 lg:gap-3 xl:gap-4 2xl:gap-5">
                <a
                  href="#"
                  className="inline-flex items-center justify-center gap-1.5 md:gap-2 bg-gray-900 text-white px-4 md:px-5 lg:px-6 xl:px-7 2xl:px-8 3xl:px-10 py-1.5 md:py-2 lg:py-2.5 xl:py-3 2xl:py-3.5 3xl:py-4 rounded-xl hover:bg-gray-800 transition-colors font-semibold text-xs md:text-sm lg:text-base 2xl:text-lg 3xl:text-xl w-full sm:w-52 2xl:w-60 3xl:w-72 shadow-sm"
                  onClick={(e) => handleIntercomClick(e, 'request-demo')}
                >
                  <i className="bi bi-chat-dots"></i>
                  Book a Demo
                </a>
                <a
                  href="/sign-up"
                  className="inline-flex items-center justify-center gap-1.5 md:gap-2 text-gray-700 px-2.5 md:px-3 2xl:px-4 3xl:px-5 py-1.5 md:py-2 2xl:py-2.5 3xl:py-3 rounded-lg hover:text-gray-900 transition-colors font-medium text-xs md:text-sm lg:text-base 2xl:text-lg 3xl:text-xl w-full sm:w-52 2xl:w-60 3xl:w-72"
                >
                  <i className="bi bi-rocket-takeoff"></i>
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
