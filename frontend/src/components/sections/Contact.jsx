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
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-cyan-50/40 p-6 md:p-8 shadow-sm">
            <div className="text-center">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Ready to see Echopad in action?</h2>
              <p className="text-sm text-gray-600 mb-6">15-minute walkthrough, no obligation.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="#"
                  className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors font-semibold text-sm w-full sm:w-auto shadow-sm"
                  onClick={(e) => handleIntercomClick(e, 'request-demo')}
                >
                  <i className="bi bi-chat-dots"></i>
                  Book a Demo
                </a>
                <a
                  href="/sign-up"
                  className="inline-flex items-center justify-center gap-2 text-gray-700 px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors font-medium text-sm w-full sm:w-auto"
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
