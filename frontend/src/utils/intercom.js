/**
 * Intercom initialization and utilities
 */

const INTERCOM_APP_ID = 'w7x3pqgr';

/**
 * Initialize Intercom
 */
export function initIntercom() {
  window.INTERCOM_APP_ID = INTERCOM_APP_ID;
  window.intercomSettings = {
    api_base: "https://api-iam.intercom.io",
    app_id: INTERCOM_APP_ID,
  };

  // Intercom loader function
  (function() {
    var w = window;
    var ic = w.Intercom;
    if (typeof ic === "function") {
      ic('reattach_activator');
      ic('update', w.intercomSettings);
    } else {
      var d = document;
      var i = function() {
        i.c(arguments);
      };
      i.q = [];
      i.c = function(args) {
        i.q.push(args);
      };
      w.Intercom = i;
      var l = function() {
        var s = d.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = 'https://widget.intercom.io/widget/' + INTERCOM_APP_ID;
        var x = d.getElementsByTagName('script')[0];
        x.parentNode.insertBefore(s, x);
      };
      if (document.readyState === 'complete') {
        l();
      } else if (w.attachEvent) {
        w.attachEvent('onload', l);
      } else {
        w.addEventListener('load', l, false);
      }
    }
  })();
}

/**
 * Show Intercom messenger
 */
export function showIntercom() {
  if (window.Intercom) {
    window.Intercom('show');
  }
}

/**
 * Hide Intercom messenger
 */
export function hideIntercom() {
  if (window.Intercom) {
    window.Intercom('hide');
  }
}

/**
 * Handle Intercom action from data attributes
 */
export function handleIntercomAction(action) {
  if (window.Intercom) {
    let message = '';
    
    switch (action) {
      case 'show-roi':
        message = "Hi! I'd like to calculate the ROI for Echopad AI at my practice. Can you help me understand the potential savings and benefits?";
        break;
      case 'request-demo':
        message = "Hi! I'd like to request a demo of Echopad AI to see how it can help our practice.";
        break;
      default:
        message = "Hi! I'd like to learn more about Echopad AI.";
    }
    
    window.Intercom('showNewMessage', message);
  } else {
    // Fallback - scroll to contact form if available
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

/**
 * Open Intercom with form data
 * @param {Object} formData - Form data object with name, email, organization, role, providers, ehr, message
 */
export function openIntercomWithFormData(formData) {
  if (typeof window.Intercom !== 'undefined') {
    // Update Intercom user data
    window.Intercom('update', {
      name: formData.name,
      email: formData.email,
      company: {
        name: formData.organization
      },
      role: formData.role,
      providers_count: formData.providers,
      ehr_system: formData.ehr,
      custom_launcher_selector: '#intercom-launcher'
    });
    
    // Open messenger with pre-filled message
    const message = formData.message 
      ? `Hi! I'd like to request a demo. ${formData.message}` 
      : `Hi! I'd like to request a demo for Echopad AI. We have ${formData.providers || 'multiple'} providers and use ${formData.ehr || 'an EHR system'}.`;
    
    window.Intercom('showNewMessage', message);
  } else {
    // Fallback if Intercom is not loaded
    console.log('Demo request submitted:', formData);
  }
}

/**
 * Open Intercom with specific message based on action
 * @param {string} action - Action type ('show-roi', 'request-demo', etc.)
 */
export function openIntercomWithMessage(action) {
  if (typeof window.Intercom !== 'undefined') {
    let message = '';
    
    switch(action) {
      case 'show-roi':
        message = "Hi! I'd like to calculate the ROI for Echopad AI at my practice. Can you help me understand the potential savings and benefits?";
        break;
      case 'request-demo':
        message = "Hi! I'd like to request a demo of Echopad AI to see how it can help our practice.";
        break;
      default:
        message = "Hi! I'd like to learn more about Echopad AI.";
    }
    
    window.Intercom('showNewMessage', message);
  } else {
    // Fallback - scroll to contact form
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

/**
 * Make Intercom functions globally available
 */
if (typeof window !== 'undefined') {
  window.openIntercomChat = function(message) {
    if (typeof window.Intercom !== 'undefined') {
      if (message) {
        window.Intercom('showNewMessage', message);
      } else {
        window.Intercom('show');
      }
    }
  };
}






