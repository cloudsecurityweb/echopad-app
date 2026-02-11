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
      className={`fixed bottom-4 left-4 right-4 sm:right-auto z-50 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
      }`}
    >
      <div className="w-full sm:max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl">
        <div className="px-4 py-4 sm:px-5 sm:py-5">
          <div className="flex flex-col gap-4">
            {/* Cookie Icon and Message */}
            <div className="flex items-start gap-3 flex-1">
              <div className="flex-shrink-0 mt-1">
                <i className="bi bi-shield-check text-blue-600 text-xl"></i>
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 font-semibold text-base mb-1">
                  We Value Your Privacy
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.
                  By clicking "Accept All," you consent to our use of cookies. You can manage your preferences or decline.
                  <Link 
                    to="/privacy-policy" 
                    className="text-blue-600 hover:text-blue-700 underline ml-1"
                  >
                    Learn more
                  </Link>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <button
                onClick={handleDecline}
                className="px-4 py-2.5 bg-white border border-slate-300 text-gray-700 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all font-medium text-sm whitespace-nowrap"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-sm shadow-lg whitespace-nowrap"
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
