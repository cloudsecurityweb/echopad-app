import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consentGiven = localStorage.getItem('cookieConsent');
    
    if (!consentGiven) {
      // Small delay for better UX
      setTimeout(() => {
        setShowBanner(true);
        setTimeout(() => setIsVisible(true), 100);
      }, 1000);
    }
  }, []);

  const handleAccept = () => {
    // Store consent
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    
    // Enable analytics/tracking
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'cookie_consent_accepted',
      consent_date: new Date().toISOString()
    });
    
    // Trigger any deferred analytics initialization
    if (window.initializeAnalytics) {
      window.initializeAnalytics();
    }
    
    // Hide banner with animation
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300);
  };

  const handleDecline = () => {
    // Store decline
    localStorage.setItem('cookieConsent', 'declined');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    
    // Ensure no tracking is enabled
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'cookie_consent_declined',
      consent_date: new Date().toISOString()
    });
    
    // Hide banner with animation
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300);
  };

  if (!showBanner) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 border-t-2 border-blue-500 shadow-2xl">
        <div className="container mx-auto px-4 py-4 md:py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Cookie Icon and Message */}
            <div className="flex items-start gap-3 flex-1">
              <div className="flex-shrink-0 mt-1">
                <i className="bi bi-shield-check text-blue-400 text-2xl"></i>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-base md:text-lg mb-1">
                  We Value Your Privacy
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                  By clicking "Accept All," you consent to our use of cookies. You can manage your preferences or decline. 
                  <Link 
                    to="/privacy-policy" 
                    className="text-blue-400 hover:text-blue-300 underline ml-1"
                    aria-label="Learn more about our privacy policy"
                  >
                    Learn more
                  </Link>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <button
                onClick={handleDecline}
                className="px-6 py-2.5 bg-transparent border-2 border-gray-400 text-white rounded-lg hover:bg-gray-800 hover:border-gray-300 transition-all font-medium text-sm whitespace-nowrap"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all font-medium text-sm shadow-lg hover:shadow-blue-500/50 whitespace-nowrap"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CookieConsent;
