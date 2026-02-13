/**
 * Google OAuth 2.0 Authentication Configuration
 * 
 * This file contains the Google OAuth configuration for Google Sign-In.
 * 
 * Configuration is loaded from .env.js file (via window.ENV) with fallback to Vite environment variables
 * (import.meta.env) and then default values.
 * 
 * ⚠️ SECURITY WARNING:
 * Authentication credentials should be configured in .env.js, which is excluded from version control.
 * Never commit .env.js with real Client IDs.
 * 
 * Required Environment Variables:
 * - VITE_GOOGLE_CLIENT_ID: Google OAuth 2.0 Client ID
 */

/**
 * Google OAuth Configuration Object
 * 
 * This configuration is used by @react-oauth/google to authenticate users with Google.
 * 
 * Priority: window.ENV > import.meta.env > default values
 */
export const googleAuthConfig = {
  /**
   * Google OAuth 2.0 Client ID
   * 
   * Get this from Google Cloud Console:
   * 1. Go to https://console.cloud.google.com/
   * 2. Select your project
   * 3. Navigate to: APIs & Services → Credentials
   * 4. Create OAuth 2.0 Client ID (Web application type)
   * 5. Copy the Client ID
   * 
   * Priority: window.ENV?.GOOGLE_CLIENT_ID > import.meta.env.VITE_GOOGLE_CLIENT_ID > default
   */
  clientId: (typeof window !== 'undefined' && window.ENV?.GOOGLE_CLIENT_ID) || 
            import.meta.env.VITE_GOOGLE_CLIENT_ID || 
            '488125049568-9uv1vj5qr4spkohvfo8792nonrfc1puu.apps.googleusercontent.com',
};

/**
 * Google OAuth Scopes
 * 
 * Scopes define the permissions requested from the user.
 * - openid: Required for OpenID Connect
 * - email: Access to user's email address
 * - profile: Access to user's basic profile information
 */
export const googleScopes = [
  'openid',
  'email',
  'profile',
];




