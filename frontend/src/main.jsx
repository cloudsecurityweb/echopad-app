import React from 'react'
import ReactDOM from 'react-dom/client'
import { PublicClientApplication } from '@azure/msal-browser'
import App from './App.jsx'
import { msalConfig } from './config/authConfig.js'

// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Initialize MSAL with error handling and timeout
const initMSAL = async () => {
  try {
    // Set a timeout to prevent indefinite waiting
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('MSAL initialization timeout')), 5000)
    );
    
    await Promise.race([
      msalInstance.initialize(),
      timeoutPromise
    ]);
    
    return msalInstance;
  } catch (error) {
    console.error('MSAL initialization failed:', error);
    // Return the instance anyway - it may still work for some operations
    // The app will render, but MSAL features may be limited
    return msalInstance;
  }
};

// Render the app immediately, MSAL will initialize in the background
const root = ReactDOM.createRoot(document.getElementById('root'));

// Start MSAL initialization but don't block rendering
initMSAL().then((instance) => {
  root.render(
    <React.StrictMode>
      <App msalInstance={instance} />
    </React.StrictMode>,
  );
}).catch((error) => {
  console.error('Failed to initialize MSAL, rendering app anyway:', error);
  // Render app even if MSAL fails completely
  root.render(
    <React.StrictMode>
      <App msalInstance={msalInstance} />
    </React.StrictMode>,
  );
});
