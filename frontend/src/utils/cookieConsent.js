/**
 * Cookie Consent Utility
 * Ensures GDPR compliance by preventing any tracking before user consent
 */

/** Dev-only logger */
const log = (...args) => {
  if (import.meta.env.DEV) console.log('[Cookie Consent]', ...args);
};

// Check if user has given consent
export const hasConsent = () => {
  const consent = localStorage.getItem('cookieConsent');
  return consent === 'accepted';
};

// Check if user has declined consent
export const hasDeclined = () => {
  const consent = localStorage.getItem('cookieConsent');
  return consent === 'declined';
};

// Check if user has made any consent choice
export const hasConsentChoice = () => {
  return localStorage.getItem('cookieConsent') !== null;
};

// Get consent status
export const getConsentStatus = () => {
  return localStorage.getItem('cookieConsent');
};

// Get consent date
export const getConsentDate = () => {
  return localStorage.getItem('cookieConsentDate');
};

// Clear consent (for testing or user request)
export const clearConsent = () => {
  localStorage.removeItem('cookieConsent');
  localStorage.removeItem('cookieConsentDate');
};

// Initialize analytics only if consent is given
export const initializeAnalyticsIfConsented = () => {
  if (!hasConsent()) {
    log('Analytics blocked - no user consent');
    return false;
  }
  
  log('User has consented - initializing analytics');
  
  // Initialize Google Analytics (if configured)
  if (window.gtag && typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      'analytics_storage': 'granted',
      'ad_storage': 'granted'
    });
  }
  
  // Initialize Google Tag Manager (if configured)
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'consent_granted',
      consent_type: 'all'
    });
  }
  
  return true;
};

// Block analytics if consent is not given
export const blockAnalyticsIfNoConsent = () => {
  if (hasConsent()) {
    return false; // Don't block
  }
  
  // Block Google Analytics
  if (window.gtag && typeof window.gtag === 'function') {
    window.gtag('consent', 'default', {
      'analytics_storage': 'denied',
      'ad_storage': 'denied',
      'functionality_storage': 'denied',
      'personalization_storage': 'denied',
      'security_storage': 'granted' // Always allow security cookies
    });
  }
  
  // Block Google Tag Manager
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'consent_default',
      consent_type: 'denied'
    });
  }
  
  log('Analytics blocked - awaiting user consent');
  return true; // Blocked
};

// Safe localStorage wrapper that respects consent
export const setAnalyticsCookie = (key, value) => {
  if (!hasConsent()) {
    log('Attempted to set analytics cookie without consent:', key);
    return false;
  }
  
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error('[Cookie Consent] Error setting cookie:', error);
    return false;
  }
};

// Safe localStorage getter
export const getAnalyticsCookie = (key) => {
  if (!hasConsent()) {
    return null;
  }
  
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error('[Cookie Consent] Error getting cookie:', error);
    return null;
  }
};

// Track event only if consent is given
export const trackEvent = (eventName, eventData = {}) => {
  if (!hasConsent()) {
    log('Event tracking blocked:', eventName);
    return false;
  }
  
  // Send to Google Analytics
  if (window.gtag && typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventData);
  }
  
  // Send to Google Tag Manager
  if (window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...eventData
    });
  }
  
  return true;
};

// Initialize consent management on page load
export const initializeConsentManagement = () => {
  // Block analytics by default
  blockAnalyticsIfNoConsent();
  
  // If user has previously consented, initialize analytics
  if (hasConsent()) {
    initializeAnalyticsIfConsented();
  }
};
