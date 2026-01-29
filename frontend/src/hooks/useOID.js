/**
 * Custom React Hook for accessing User OID (Object ID)
 * 
 * This hook provides a consistent way to access the user's OID (Object ID) from Entra ID
 * across the application. It combines OID from multiple sources with priority:
 * 1. OID from AuthContext (extracted from access token) - most reliable
 * 2. OID from MSAL account (from ID token) - fallback
 * 
 * @returns {string|null} User OID or null if not available
 * 
 * @example
 * ```javascript
 * import { useOID } from '../hooks/useOID';
 * 
 * function MyComponent() {
 *   const oid = useOID();
 *   
 *   if (!oid) {
 *     return <div>Not authenticated</div>;
 *   }
 *   
 *   return (
 *     <div>
 *       <p>User ID: {oid}</p>
 *       <button onClick={() => makeApiCall(oid)}>Call API</button>
 *     </div>
 *   );
 * }
 * ```
 */
import { useAuth } from '../contexts/AuthContext';
import { useAccount } from '@azure/msal-react';

export function useOID() {
  const { userOID, authProvider } = useAuth();
  const account = useAccount();
  
  // Priority: 1. Context OID (from access token) - most reliable
  //           2. Account OID (from ID token) - fallback for Microsoft auth
  //           3. null - not authenticated
  
  if (userOID) {
    return userOID;
  }
  
  // Fallback to MSAL account OID for Microsoft authentication
  if (authProvider === 'microsoft' && account?.idTokenClaims?.oid) {
    return account.idTokenClaims.oid;
  }
  
  // For Google auth, OID is not available (Google uses sub claim, but we don't extract it)
  // For email/password auth, OID comes from backend user profile
  // In these cases, userOID should be set from backend response
  
  return null;
}

/**
 * Hook that returns OID with loading state
 * Useful when you need to wait for OID to be available
 * 
 * @returns {Object} { oid: string|null, isLoading: boolean }
 * 
 * @example
 * ```javascript
 * const { oid, isLoading } = useOIDWithLoading();
 * 
 * if (isLoading) {
 *   return <div>Loading...</div>;
 * }
 * 
 * if (!oid) {
 *   return <div>Not authenticated</div>;
 * }
 * ```
 */
export function useOIDWithLoading() {
  const { userOID, isLoading, authProvider } = useAuth();
  const account = useAccount();
  
  const oid = userOID || (authProvider === 'microsoft' && account?.idTokenClaims?.oid) || null;
  
  return {
    oid,
    isLoading: isLoading && !oid, // Loading if auth is loading and OID not yet available
  };
}
