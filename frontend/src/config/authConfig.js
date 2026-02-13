/**
 * Microsoft Entra ID (Azure AD) Authentication Configuration
 * 
 * This file contains the MSAL configuration for Microsoft Entra ID authentication.
 * 
 * Configuration is loaded from .env.js file (via window.ENV) with fallback to Vite environment variables
 * (import.meta.env) and then default values.
 * 
 * ⚠️ SECURITY WARNING:
 * Authentication credentials should be configured in .env.js, which is excluded from version control.
 * Never commit .env.js with real Client IDs and Tenant ID.
 * 
 * Required Environment Variables:
 * - VITE_MSAL_CLIENT_ID: Frontend SPA Application (Client) ID
 *   Default: d4ea5537-8b2a-4b88-9dbd-80bf02596c1a
 * - VITE_MSAL_TENANT_ID: Azure AD Tenant ID
 *   Default: 502d9d81-2020-456b-b113-b84108acf846
 * - VITE_API_CLIENT_ID: Backend API Application (Client) ID
 *   Default: d4ea5537-8b2a-4b88-9dbd-80bf02596c1a
 * 
 * Azure Configuration:
 * - Frontend SPA Client ID: d4ea5537-8b2a-4b88-9dbd-80bf02596c1a
 * - Backend API Client ID: d4ea5537-8b2a-4b88-9dbd-80bf02596c1a
 * - Tenant ID: 502d9d81-2020-456b-b113-b84108acf846
 * - Authority: https://login.microsoftonline.com/common
 */

import { LogLevel } from "@azure/msal-browser";

/**
 * MSAL Configuration Object
 * 
 * This configuration is used by MSAL to authenticate users with Microsoft Entra ID.
 * 
 * Priority: window.ENV > import.meta.env > default values
 */
export const msalConfig = {
  auth: {
    clientId: (typeof window !== 'undefined' && window.ENV?.MSAL_CLIENT_ID) || 
              import.meta.env.VITE_MSAL_CLIENT_ID || 
              'd4ea5537-8b2a-4b88-9dbd-80bf02596c1a', // Frontend SPA Client ID
    authority: "https://login.microsoftonline.com/common",
    redirectUri: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173',
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
    },
  },
};

/**
 * Login Request Configuration
 * 
 * Scopes define the permissions requested from the user.
 * The API scope should match the scope exposed by your backend API.
 * 
 * IMPORTANT: To include app roles in the token:
 * 1. The scope must be for the BACKEND API (not the frontend SPA)
 * 2. The backend API must have app roles defined
 * 3. Optional claims must be configured in Entra ID to include roles
 * 
 * MSAL uses OAuth 2.0 Authorization Code Flow with PKCE:
 * - Step 1: User redirected to /authorize endpoint (handled by MSAL)
 * - Step 2: User authenticates and consents
 * - Step 3: Authorization code returned to app
 * - Step 4: Code exchanged for access token at /token endpoint (handled by MSAL)
 * - Step 5: Access token includes roles claim if configured correctly
 * 
 * Note: This scope is hardcoded. To change it, update the scope value directly in this file.
 * 
 * No prompt parameter - allows SSO for sign-in flows.
 */
export const loginRequest = {
  authority: "https://login.microsoftonline.com/common", // Allow both work/school and personal Microsoft accounts
  // Request token for backend API - this ensures audience (aud) matches backend AZURE_CLIENT_ID
  // Using api://{clientId}/.default requests all permissions the app has been granted
  scopes: [`api://d4ea5537-8b2a-4b88-9dbd-80bf02596c1a/.default`],
};

/**
 * Sign-Up Request Configuration
 * 
 * Same as loginRequest but includes prompt: "select_account" to force account selection.
 * This ensures users see all available accounts when signing up, allowing them to choose
 * which Microsoft account to use.
 */
export const signUpRequest = {
  authority: "https://login.microsoftonline.com/common", // Allow both work/school and personal Microsoft accounts
  scopes: [`api://d4ea5537-8b2a-4b88-9dbd-80bf02596c1a/.default`],
  prompt: "select_account" // Force account selection
};

/**
 * Login Request Configuration with Account Selection
 * 
 * Same as loginRequest but includes prompt: "select_account" to force account selection.
 * This ensures users see all available accounts when signing in, allowing them to choose
 * which Microsoft account to use instead of automatically using the last logged-in account.
 */
export const loginSelectAccountRequest = {
  authority: "https://login.microsoftonline.com/common", // Allow both work/school and personal Microsoft accounts
  scopes: [`api://d4ea5537-8b2a-4b88-9dbd-80bf02596c1a/.default`],
  prompt: "select_account" // Force account selection
};
