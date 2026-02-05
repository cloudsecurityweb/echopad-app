/**
 * Token Diagnostics Utility
 * 
 * Helps diagnose token issues by comparing ID token vs Access token
 * and verifying token claims
 */

/**
 * Compare ID token vs Access token to diagnose role issues
 * @param {Object} msalInstance - MSAL instance
 * @param {Object} account - MSAL account object
 * @param {Object} loginRequest - Login request config
 * @returns {Promise<Object>} Diagnostic information
 */
export async function diagnoseTokenIssue(msalInstance, account, loginRequest) {
  const diagnostics = {
    account: account ? {
      username: account.username,
      name: account.name,
      homeAccountId: account.homeAccountId,
    } : null,
    idToken: null,
    accessToken: null,
    comparison: {
      hasIdToken: false,
      hasAccessToken: false,
      rolesInIdToken: [],
      rolesInAccessToken: [],
      idTokenAud: null,
      accessTokenAud: null,
      issue: null,
    },
  };

  try {
    // Get ID token from account
    if (account && account.idTokenClaims) {
      diagnostics.idToken = {
        claims: account.idTokenClaims,
        roles: account.idTokenClaims.roles || [],
        aud: account.idTokenClaims.aud,
      };
      diagnostics.comparison.hasIdToken = true;
      diagnostics.comparison.rolesInIdToken = diagnostics.idToken.roles;
      diagnostics.comparison.idTokenAud = diagnostics.idToken.aud;
    }

    // Get Access token
    try {
      const tokenResponse = await msalInstance.acquireTokenSilent({
        ...loginRequest,
        account: account,
      });

      if (tokenResponse && tokenResponse.accessToken) {
        // Decode access token
        const payload = JSON.parse(
          atob(
            tokenResponse.accessToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
          )
        );

        diagnostics.accessToken = {
          raw: tokenResponse.accessToken.substring(0, 50) + '...',
          payload: payload,
          roles: payload.roles || [],
          aud: payload.aud,
          exp: payload.exp,
          iat: payload.iat,
        };
        diagnostics.comparison.hasAccessToken = true;
        diagnostics.comparison.rolesInAccessToken = diagnostics.accessToken.roles;
        diagnostics.comparison.accessTokenAud = diagnostics.accessToken.aud;
      }
    } catch (tokenError) {
      diagnostics.comparison.issue = `Failed to acquire access token: ${tokenError.message}`;
    }

    // Diagnose the issue
    if (!diagnostics.comparison.hasAccessToken) {
      diagnostics.comparison.issue = 'No access token acquired. Check scope configuration.';
    } else if (diagnostics.comparison.rolesInAccessToken.length === 0) {
      diagnostics.comparison.issue = 'Access token has no roles. Verify:';
      diagnostics.comparison.issue += '\n  1. App roles defined in BACKEND API app (not frontend SPA)';
      diagnostics.comparison.issue += '\n  2. User has app role assigned in Backend API Enterprise Application';
      diagnostics.comparison.issue += '\n  3. Token aud matches Backend API Client ID';
      diagnostics.comparison.issue += '\n  4. User signed out and signed in after role assignment';
    } else if (diagnostics.comparison.rolesInIdToken.length > 0) {
      diagnostics.comparison.issue = 'WARNING: Roles found in ID token but not access token. You should read from access token.';
    } else {
      diagnostics.comparison.issue = 'Token looks correct. Roles found in access token.';
    }

  } catch (error) {
    diagnostics.comparison.issue = `Diagnostic error: ${error.message}`;
  }

  return diagnostics;
}

/**
 * Log diagnostic information to console
 * @param {Object} diagnostics - Diagnostic object from diagnoseTokenIssue
 */
export function logTokenDiagnostics(diagnostics) {
  console.group('🔍 Token Diagnostics');
  
  console.log('Account:', diagnostics.account);
  
  if (diagnostics.idToken) {
    console.group('ID Token (should NOT have roles)');
    console.log('Audience:', diagnostics.idToken.aud);
    console.log('Roles:', diagnostics.idToken.roles);
    console.log('Claims:', diagnostics.idToken.claims);
    console.groupEnd();
  } else {
    console.warn('No ID token found');
  }

  if (diagnostics.accessToken) {
    console.group('Access Token (SHOULD have roles)');
    console.log('Audience:', diagnostics.accessToken.aud);
    console.log('Roles:', diagnostics.accessToken.roles);
    console.log('Expires:', new Date(diagnostics.accessToken.exp * 1000));
    console.log('Payload keys:', Object.keys(diagnostics.accessToken.payload));
    console.groupEnd();
  } else {
    console.error('❌ No access token found!');
  }

  console.group('Comparison');
  console.log('Roles in ID Token:', diagnostics.comparison.rolesInIdToken);
  console.log('Roles in Access Token:', diagnostics.comparison.rolesInAccessToken);
  console.log('ID Token Audience:', diagnostics.comparison.idTokenAud);
  console.log('Access Token Audience:', diagnostics.comparison.accessTokenAud);
  console.groupEnd();

  console.group('Issue');
  console.log(diagnostics.comparison.issue);
  console.groupEnd();

  console.groupEnd();
}

/**
 * Quick diagnostic - check if we're reading the right token
 * Call this in browser console after login
 */
export function quickDiagnostic() {
  return `
To diagnose token issues, run this in browser console:

import { diagnoseTokenIssue, logTokenDiagnostics } from './utils/tokenDiagnostics';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from './config/authConfig';

const { instance, accounts } = useMsal();
const diagnostics = await diagnoseTokenIssue(instance, accounts[0], loginRequest);
logTokenDiagnostics(diagnostics);
  `.trim();
}
