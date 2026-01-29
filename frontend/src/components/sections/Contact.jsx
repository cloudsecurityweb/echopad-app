import { handleIntercomAction } from '../../utils/intercom';

function Contact() {
  const handleIntercomClick = (e, action) => {
    e.preventDefault();
    handleIntercomAction(action);
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl border border-gray-200/80 bg-gradient-to-br from-white via-white to-cyan-50/40 p-10 md:p-14 shadow-sm">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="text-center md:text-left md:max-w-2xl">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
                  Get Started
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  Ready to see Echopad in action?
                </h2>
                <p className="text-lg text-gray-600">
                  Book a quick walkthrough and leave with a clear automation plan.
                </p>
                <p className="text-sm text-gray-500 mt-3">15-minute call, no obligation.</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-end gap-4">
                <a
                  href="#"
                  className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-7 py-3 rounded-xl hover:bg-gray-800 transition-colors font-semibold w-full sm:w-52 shadow-sm"
                  onClick={(e) => handleIntercomClick(e, 'request-demo')}
                >
                  <i className="bi bi-chat-dots"></i>
                  Book a Demo
                </a>
                <a
                  href="/sign-up"
                  className="inline-flex items-center justify-center gap-2 text-gray-700 px-3 py-2 rounded-lg hover:text-gray-900 transition-colors font-medium w-full sm:w-52"
                >
                  <i className="bi bi-rocket-takeoff"></i>
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
