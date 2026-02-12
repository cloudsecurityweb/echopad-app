/**
 * Google Analytics initialization and utilities
 */

import { shutdownIntercom } from './intercom';

/** Dev-only logger */
const log = (...args) => {
  if (import.meta.env.DEV) console.log('[Analytics]', ...args);
};

// Initialize Google Analytics
export function initGoogleAnalytics() {
  // Load gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-FJ1Q53VHF5';
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('consent', 'default', {
    'analytics_storage': 'denied',
    'ad_storage': 'denied',
  });
  gtag('config', 'G-FJ1Q53VHF5');
}

/**
 * Track page view
 */
export function trackPageView(path) {
  if (window.gtag) {
    window.gtag('config', 'G-FJ1Q53VHF5', {
      page_path: path,
    });
  }
}

/**
 * Track event
 */
export function trackEvent(action, category, label, value) {
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

/**
 * Enable tracking (Google Analytics only).
 * Intercom boot is now handled by IntercomBootstrap in App.jsx.
 * Called when user accepts cookies.
 */
export function enableTracking() {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('consent', 'update', {
      'analytics_storage': 'granted',
      'ad_storage': 'granted',
    });
  }

  log('Tracking enabled');
}

/**
 * Disable tracking and clear cookies.
 * Called when user declines cookies.
 */
export function disableTracking() {
  // Disable Google Analytics
  if (typeof window.gtag !== 'undefined') {
    window.gtag('consent', 'update', {
      'analytics_storage': 'denied',
      'ad_storage': 'denied',
    });
  }

  // Disable Google Analytics completely
  const GA_MEASUREMENT_ID = 'G-FJ1Q53VHF5';
  window[`ga-disable-${GA_MEASUREMENT_ID}`] = true;

  // Clear any existing tracking cookies
  const cookies = document.cookie.split(';');
  cookies.forEach(function (c) {
    const cookieName = c.trim().split('=')[0];
    if (cookieName.startsWith('_ga') || cookieName.startsWith('_gid') || cookieName.startsWith('_gac')) {
      const domain = window.location.hostname;
      document.cookie = cookieName + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = cookieName + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + domain + ';';
      document.cookie = cookieName + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + domain + ';';
    }
  });

  // Shutdown Intercom session
  shutdownIntercom();

  log('Tracking disabled and cookies cleared');
}
