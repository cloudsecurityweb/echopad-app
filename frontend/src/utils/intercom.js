/**
 * Intercom integration utilities
 *
 * - App ID sourced from environment variable (VITE_INTERCOM_APP_ID)
 * - Identity Verification via server-side HMAC (user_hash)
 * - Single boot guard to prevent double-initialization
 * - Intercom is always available (not consent-gated)
 */

const INTERCOM_APP_ID = import.meta.env.VITE_INTERCOM_APP_ID;

/** Dev-only logger */
const log = (...args) => {
  if (import.meta.env.DEV) console.log('[Intercom]', ...args);
};

/** Module-level boot guard */
let isBooted = false;

// ---------------------------------------------------------------------------
// Script loading (idempotent)
// ---------------------------------------------------------------------------

/**
 * Load the Intercom widget script tag.
 * Does NOT boot Intercom — call `bootIntercom()` separately after auth.
 */
export function loadIntercomScript() {
  if (!INTERCOM_APP_ID) {
    log('VITE_INTERCOM_APP_ID is not set — skipping script load');
    return;
  }

  // Already loaded
  if (typeof window.Intercom === 'function') {
    log('Script already loaded');
    return;
  }

  // Stub Intercom so calls before script loads are queued
  const w = window;
  const i = function () { i.c(arguments); };
  i.q = [];
  i.c = function (args) { i.q.push(args); };
  w.Intercom = i;

  // Set base settings (no boot yet)
  w.intercomSettings = {
    api_base: 'https://api-iam.intercom.io',
    app_id: INTERCOM_APP_ID,
  };

  // Inject the widget script
  const s = document.createElement('script');
  s.type = 'text/javascript';
  s.async = true;
  s.src = `https://widget.intercom.io/widget/${INTERCOM_APP_ID}`;
  const x = document.getElementsByTagName('script')[0];
  if (x && x.parentNode) {
    x.parentNode.insertBefore(s, x);
  } else {
    document.head.appendChild(s);
  }

  log('Widget script injected');
}

// ---------------------------------------------------------------------------
// Boot / shutdown
// ---------------------------------------------------------------------------

/**
 * Boot Intercom in anonymous (visitor) mode.
 * Shows the launcher icon for unauthenticated users (lead capture, support).
 */
export function bootIntercomAnonymous() {
  if (!window.Intercom || !INTERCOM_APP_ID) {
    log('Cannot boot anonymous — Intercom script not loaded or App ID missing');
    return;
  }
  if (isBooted) {
    log('Already booted — skipping anonymous boot');
    return;
  }

  window.Intercom('boot', {
    api_base: 'https://api-iam.intercom.io',
    app_id: INTERCOM_APP_ID,
  });

  isBooted = true;
  log('Booted in anonymous (visitor) mode');
}

/**
 * Boot Intercom with verified identity.
 * Shuts down any existing session first so the identity transition is clean.
 * @param {{ appId: string, user: { id: string, name: string, email: string }, userHash: string }} data
 */
export function bootIntercom({ appId, user, userHash }) {
  if (!window.Intercom) {
    log('Cannot boot — Intercom script not loaded');
    return;
  }

  // Shut down the previous (anonymous or stale) session before rebooting
  // with a verified identity — Intercom recommends this on identity change.
  if (isBooted) {
    window.Intercom('shutdown');
    isBooted = false;
    log('Shut down previous session before identity boot');
  }

  window.Intercom('boot', {
    api_base: 'https://api-iam.intercom.io',
    app_id: appId || INTERCOM_APP_ID,
    user_id: user.id,
    name: user.name,
    email: user.email,
    user_hash: userHash,
  });

  isBooted = true;
  log('Booted with identity verification for', user.email);
}

/**
 * Shutdown Intercom session and optionally reboot in anonymous mode.
 * @param {{ rebootAnonymous?: boolean }} options
 */
export function shutdownIntercom({ rebootAnonymous = false } = {}) {
  if (window.Intercom) {
    window.Intercom('shutdown');
    log('Shutdown');
  }
  isBooted = false;

  if (rebootAnonymous) {
    bootIntercomAnonymous();
  }
}

// ---------------------------------------------------------------------------
// Messenger helpers
// ---------------------------------------------------------------------------

/**
 * Show the Intercom messenger.
 */
export function showIntercom() {
  if (!window.Intercom) return;
  window.Intercom('show');
}

/**
 * Hide the Intercom messenger.
 */
export function hideIntercom() {
  if (!window.Intercom) return;
  window.Intercom('hide');
}

/**
 * Handle an Intercom action from UI buttons (e.g. "request-demo", "show-roi").
 * Falls back to scrolling to the #contact section when Intercom is unavailable.
 */
export function handleIntercomAction(action) {
  if (!window.Intercom) {
    // Fallback — scroll to contact form
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
    return;
  }

  let message = '';

  switch (action) {
    case 'show-roi':
      message =
        "Hi! I'd like to calculate the ROI for Echopad AI at my practice. Can you help me understand the potential savings and benefits?";
      break;
    case 'request-demo':
      message =
        "Hi! I'd like to request a demo of Echopad AI to see how it can help our practice.";
      break;
    default:
      message = "Hi! I'd like to learn more about Echopad AI.";
  }

  window.Intercom('showNewMessage', message);
}

// ---------------------------------------------------------------------------
// Form data helper (with input sanitization)
// ---------------------------------------------------------------------------

/** Trim and cap a string value. */
function sanitizeInput(value, maxLength = 500) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

/** Basic email format check. */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Open Intercom with enriched form data.
 * @param {Object} formData - { name, email, organization, role, providers, ehr, message }
 */
export function openIntercomWithFormData(formData) {
  if (!window.Intercom) {
    log('Cannot open — Intercom not loaded');
    return;
  }

  const email = sanitizeInput(formData.email, 254);
  if (email && !isValidEmail(email)) {
    log('Invalid email format — skipping Intercom update');
    return;
  }

  // Update Intercom with sanitized visitor data
  window.Intercom('update', {
    name: sanitizeInput(formData.name, 200),
    email,
    company: {
      name: sanitizeInput(formData.organization, 200),
    },
    role: sanitizeInput(formData.role, 100),
    providers_count: formData.providers,
    ehr_system: sanitizeInput(formData.ehr, 200),
  });

  // Build and show a pre-filled message
  const userMessage = sanitizeInput(formData.message);
  const message = userMessage
    ? `Hi! I'd like to request a demo. ${userMessage}`
    : `Hi! I'd like to request a demo for Echopad AI. We have ${formData.providers || 'multiple'} providers and use ${sanitizeInput(formData.ehr) || 'an EHR system'}.`;

  window.Intercom('showNewMessage', message);
}
