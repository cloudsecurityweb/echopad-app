import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useMsal, useIsAuthenticated, useAccount } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { useGoogleLogin } from '@react-oauth/google';
import { loginRequest, signUpRequest, loginSelectAccountRequest } from '../config/authConfig';
import { googleScopes } from '../config/googleAuthConfig';
import { getRolesFromToken, getUserInfoFromToken, getOIDFromToken } from '../utils/tokenDecoder';

import { authRef } from '../api/auth';

const AuthContext = createContext(null);

/**
 * Detect "user not registered" / "sign up first" API error for consistent handling.
 * @param {Response} response - Fetch response
 * @param {Object} errorData - Parsed JSON body
 * @returns {boolean}
 */
function isUserNotRegisteredError(response, errorData) {
  if (!response || (response.status !== 401 && response.status !== 404)) return false;
  const err = errorData?.error?.toLowerCase?.() || '';
  const msg = (errorData?.message || '').toLowerCase();
  return (
    err === 'user not registered' ||
    err === 'user not found' ||
    msg.includes('sign up first')
  );
}

export function AuthProvider({ children }) {
  const { instance, accounts, inProgress } = useMsal();
  const isMicrosoftAuthenticated = useIsAuthenticated();
  const account = useAccount();
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  
  // User profile from backend
  const [userProfile, setUserProfile] = useState(null);
  
  // Token roles (from Entra ID token) - for immediate role detection
  const [tokenRoles, setTokenRoles] = useState([]);
  
  // User OID (Object ID) from Entra ID token - unique user identifier
  const [userOID, setUserOID] = useState(null);
  
  // Google authentication state
  const [googleToken, setGoogleToken] = useState(null);
  const [googleUser, setGoogleUser] = useState(null);
  const [authProvider, setAuthProvider] = useState(null); // 'microsoft' | 'google' | 'email' | 'magic' | null
  
  // Magic link authentication state
  const [magicToken, setMagicToken] = useState(null);
  
  // Email/password authentication state
  const [emailPasswordToken, setEmailPasswordToken] = useState(null);
  // Email/password refresh token (for Electron redirect; not persisted long-term)
  const [emailPasswordRefreshToken, setEmailPasswordRefreshToken] = useState(null);

  // When true, app should redirect to sign-up (e.g. Google user not in DB)
  const [userNotRegisteredRedirect, setUserNotRegisteredRedirect] = useState(false);

  // Guard to prevent repeated OID-based profile fetches
  const fetchedOIDRef = useRef(null);
  const googleProfileFetchedRef = useRef(false);
  // Token set in onSuccess before state flushes; syncGoogleUserProfile can use it when SignIn calls sync right after login
  const pendingGoogleTokenRef = useRef(null);

  const hasMicrosoftAccount = accounts.length > 0;
  const isMsalIdle = inProgress === InteractionStatus.None;

  // Check if user is authenticated (Microsoft, Google, Email/Password, or Magic Link)
  const isAuthenticated = isMicrosoftAuthenticated || hasMicrosoftAccount || (googleToken !== null && googleUser !== null) || (userProfile !== null && authProvider === 'email') || (magicToken !== null && authProvider === 'magic');

  // Key for persisting non-token-based auth (email/password) across refreshes
  const EMAIL_SESSION_KEY = 'echopad_email_auth_session';
  // Token in localStorage so new tabs (e.g. Electron callback) can reuse it; cleared on logout
  const EMAIL_TOKEN_LOCAL_KEY = 'echopad_email_token';
  // Refresh token in sessionStorage only (for Electron redirect in same session); cleared on logout
  const EMAIL_REFRESH_TOKEN_SESSION_KEY = 'echopad_email_refresh_token';

  // Initialize - check if user is already authenticated
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for Microsoft authentication
        if (accounts.length > 0) {
          // Ensure MSAL active account is set for consistent hooks
          instance.setActiveAccount(accounts[0]);
          try {
            const response = await instance.acquireTokenSilent({
              ...loginRequest,
              account: accounts[0],
            });
            setAccessToken(response.accessToken);
            setAuthProvider('microsoft');
            
            // Extract roles and OID from token immediately
            if (response.accessToken) {
              const roles = getRolesFromToken(response.accessToken);
              setTokenRoles(roles);
              const oid = getOIDFromToken(response.accessToken);
              setUserOID(oid);
              const userInfo = getUserInfoFromToken(response.accessToken);
              if (userInfo) {
                console.log('🔐 [AUTH] Token decoded - Roles:', roles, '| OID:', oid, '| User:', userInfo.email);
              }
            }
          } catch (error) {
            console.warn('Failed to acquire Microsoft token silently:', error);
          }
        }
        
        // Check for Google authentication in sessionStorage
        const storedGoogleToken = sessionStorage.getItem('google_id_token');
        const storedGoogleUser = sessionStorage.getItem('google_user');
        if (storedGoogleToken && storedGoogleUser) {
          try {
            setGoogleToken(storedGoogleToken);
            setGoogleUser(JSON.parse(storedGoogleUser));
            setAuthProvider('google');
          } catch (error) {
            console.warn('Failed to restore Google authentication:', error);
            sessionStorage.removeItem('google_id_token');
            sessionStorage.removeItem('google_user');
          }
        }
        
        // Check for Email/Password authentication in localStorage
        // This is a lightweight, non-token-based session used only for client-side routing
        try {
          const storedEmailSession = localStorage.getItem(EMAIL_SESSION_KEY);
          if (storedEmailSession) {
            const parsedSession = JSON.parse(storedEmailSession);
            if (parsedSession?.authProvider === 'email' && parsedSession?.userProfile) {
              setUserProfile(parsedSession.userProfile);
              setAuthProvider('email');
              if (parsedSession.userOID) {
                setUserOID(parsedSession.userOID);
              }
              console.log('🔐 [AUTH] Restored email/password session from localStorage for:', parsedSession.userProfile?.user?.email);
            }
          }
        } catch (error) {
          console.warn('Failed to restore email/password authentication:', error);
          try {
            localStorage.removeItem(EMAIL_SESSION_KEY);
          } catch {
            // ignore storage cleanup errors
          }
        }
        
        // Check for Magic link authentication in sessionStorage
        const storedMagicToken = sessionStorage.getItem('magic_token');
        if (storedMagicToken) {
          try {
            setMagicToken(storedMagicToken);
            setAuthProvider('magic');
          } catch (error) {
            console.warn('Failed to restore Magic authentication:', error);
            sessionStorage.removeItem('magic_token');
          }
        }
        
        // Check for Email/password authentication token: sessionStorage (current tab) then localStorage (new tab e.g. Electron)
        let storedEmailPasswordToken = sessionStorage.getItem('email_password_token');
        if (!storedEmailPasswordToken) {
          const fromLocal = localStorage.getItem(EMAIL_TOKEN_LOCAL_KEY);
          if (fromLocal) {
            storedEmailPasswordToken = fromLocal;
            try {
              sessionStorage.setItem('email_password_token', fromLocal);
            } catch {
              // ignore
            }
          }
        }
        if (storedEmailPasswordToken) {
          try {
            setEmailPasswordToken(storedEmailPasswordToken);
            // Only set authProvider to 'email' if we also have userProfile
            // Otherwise, we'll restore it from localStorage session
            const storedEmailSession = localStorage.getItem(EMAIL_SESSION_KEY);
            if (storedEmailSession) {
              const parsedSession = JSON.parse(storedEmailSession);
              if (parsedSession?.authProvider === 'email' && parsedSession?.userProfile) {
                setUserProfile(parsedSession.userProfile);
                setAuthProvider('email');
                if (parsedSession.userOID) {
                  setUserOID(parsedSession.userOID);
                }
              }
            }
          } catch (error) {
            console.warn('Failed to restore Email/password token:', error);
            sessionStorage.removeItem('email_password_token');
            try {
              localStorage.removeItem(EMAIL_TOKEN_LOCAL_KEY);
            } catch {
              // ignore
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [instance, accounts]);

  const login = useCallback(async (loginType = 'popup') => {
    try {
      setIsLoading(true);
      let response;

      if (loginType === 'popup') {
        response = await instance.loginPopup(loginSelectAccountRequest);
      } else {
        response = await instance.loginRedirect(loginSelectAccountRequest);
        // For redirect, we don't get response immediately
        return;
      }

      // Get access token after login
      if (response && response.account) {
        instance.setActiveAccount(response.account);
        try {
          const tokenResponse = await instance.acquireTokenSilent({
            ...loginRequest,
            account: response.account,
          });
          setAccessToken(tokenResponse.accessToken);
          setAuthProvider('microsoft');
          
          // Extract roles and OID from token immediately
          if (tokenResponse.accessToken) {
            const roles = getRolesFromToken(tokenResponse.accessToken);
            setTokenRoles(roles);
            const oid = getOIDFromToken(tokenResponse.accessToken);
            setUserOID(oid);
            const userInfo = getUserInfoFromToken(tokenResponse.accessToken);
            if (userInfo && !oid) {
              console.error('[LOGIN] No OID in token - user identification may fail');
            }
          }
          
          // Clear Google auth if switching providers
          setGoogleToken(null);
          setGoogleUser(null);
          sessionStorage.removeItem('google_id_token');
          sessionStorage.removeItem('google_user');
        } catch (error) {
          console.warn('Failed to acquire token after login:', error);
        }
      }

      return response;
    } catch (error) {
      console.error('Microsoft login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [instance]);

  /**
   * Sign up with Microsoft (shows account selection)
   * Uses signUpRequest with prompt: "select_account" to force account picker
   */
  const signUp = useCallback(async (loginType = 'popup') => {
    try {
      setIsLoading(true);
      let response;

      if (loginType === 'popup') {
        response = await instance.loginPopup(signUpRequest);
      } else {
        response = await instance.loginRedirect(signUpRequest);
        // For redirect, we don't get response immediately
        return;
      }

      // Get access token after sign-up
      if (response && response.account) {
        instance.setActiveAccount(response.account);
        try {
          const tokenResponse = await instance.acquireTokenSilent({
            ...signUpRequest,
            account: response.account,
          });
          setAccessToken(tokenResponse.accessToken);
          setAuthProvider('microsoft');
          
          // Extract roles and OID from token immediately
          if (tokenResponse.accessToken) {
            const roles = getRolesFromToken(tokenResponse.accessToken);
            setTokenRoles(roles);
            const oid = getOIDFromToken(tokenResponse.accessToken);
            setUserOID(oid);
            const userInfo = getUserInfoFromToken(tokenResponse.accessToken);
            if (userInfo && !oid) {
              console.error('[SIGNUP] No OID in token - user identification may fail');
            }
          }
          
          // Clear Google auth if switching providers
          setGoogleToken(null);
          setGoogleUser(null);
          sessionStorage.removeItem('google_id_token');
          sessionStorage.removeItem('google_user');
        } catch (error) {
          console.warn('Failed to acquire token after sign-up:', error);
        }
      }

      return response;
    } catch (error) {
      console.error('Microsoft sign-up error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [instance]);

  // Google login handler
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        
        // Get user info from Google using the access token
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        
        if (!userInfoResponse.ok) {
          throw new Error('Failed to fetch user info from Google');
        }
        
        const userInfo = await userInfoResponse.json();
        
        // Store Google authentication
        // Note: tokenResponse.access_token is the access token
        // For backend verification, the backend can verify this token using Google's tokeninfo endpoint
        // or we can get the ID token if needed (requires additional configuration)
        const token = tokenResponse.access_token;
        pendingGoogleTokenRef.current = token; // So sync can run before state flushes
        setGoogleToken(token);
        setGoogleUser(userInfo);
        setAuthProvider('google');
        
        // Store in sessionStorage for persistence
        sessionStorage.setItem('google_id_token', token);
        sessionStorage.setItem('google_user', JSON.stringify(userInfo));
        
        // Clear Microsoft auth if switching providers
        setAccessToken(null);
        if (accounts.length > 0) {
          try {
            await instance.logoutPopup({ account: accounts[0] });
          } catch (error) {
            // Ignore logout errors
          }
        }
        
        // Send token to backend for verification and user creation/retrieval
        // The backend should verify the token using Google's tokeninfo endpoint:
        // https://oauth2.googleapis.com/tokeninfo?access_token=TOKEN
        // try {
        //   const backendResponse = await fetch('/api/auth/verify', {
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'application/json',
        //       'Authorization': `Bearer ${tokenResponse.access_token}`,
        //     },
        //     body: JSON.stringify({
        //       provider: 'google',
        //       token: tokenResponse.access_token,
        //       userInfo: userInfo,
        //     }),
        //   });
          
        //   if (!backendResponse.ok) {
        //     console.warn('Backend verification failed, but continuing with local auth');
        //   }
        // } catch (error) {
        //   console.warn('Failed to verify token with backend:', error);
        //   // Continue with local authentication even if backend verification fails
        // }
      } catch (error) {
        console.error('Google login error:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google OAuth error:', error);
      setIsLoading(false);
      throw error;
    },
    flow: 'implicit', // Use implicit flow for direct token access (SPA-friendly)
    scope: googleScopes.join(' '),
  });

  const logout = useCallback(async (logoutType = 'local', options = {}) => {
    const redirectTo = options?.redirectTo ?? '/';

    try {
      setIsLoading(true);
      
      // Logout from Microsoft if authenticated
      if (authProvider === 'microsoft' && accounts.length > 0) {
        // Clear local state first for immediate logout
        setAccessToken(null);
        setUserProfile(null);
        setTokenRoles([]);
        setUserOID(null);
        setAuthProvider(null);
        
        // Clear MSAL cache to remove tokens
        instance.clearCache();
        
        // Option 1: Local logout only (fast, no Microsoft page) - default
        if (logoutType === 'local') {
          // Just redirect - user stays logged into Microsoft but logged out of our app
          window.location.href = redirectTo;
          return;
        }
        
        // Option 2: Full Microsoft logout (shows account selection page)
        if (logoutType === 'microsoft') {
          const currentAccount = account || accounts[0];
          await instance.logoutRedirect({
            account: currentAccount,
            postLogoutRedirectUri: window.location.origin + (redirectTo.startsWith('/') ? redirectTo : '/'),
          });
          // For redirect, MSAL handles navigation, so return early
          return;
        }
      }
      
      // Logout from Google if authenticated
      if (authProvider === 'google') {
        setGoogleToken(null);
        setGoogleUser(null);
        sessionStorage.removeItem('google_id_token');
        sessionStorage.removeItem('google_user');
      }
      
      // Logout from Magic link if authenticated
      if (authProvider === 'magic') {
        setMagicToken(null);
        sessionStorage.removeItem('magic_token');
      }
      
      // Logout from Email/Password if authenticated
      if (authProvider === 'email') {
        setEmailPasswordToken(null);
        try {
          sessionStorage.removeItem('email_password_token');
          localStorage.removeItem(EMAIL_TOKEN_LOCAL_KEY);
        } catch {
          // ignore
        }
      }
      
      // Logout from Email/Password - just clear local state and persisted session
      if (authProvider === 'email') {
        setUserProfile(null);
        setUserOID(null);
        setEmailPasswordToken(null);
        setEmailPasswordRefreshToken(null);
        try {
          localStorage.removeItem(EMAIL_SESSION_KEY);
          localStorage.removeItem(EMAIL_TOKEN_LOCAL_KEY);
          sessionStorage.removeItem('email_password_token');
          sessionStorage.removeItem(EMAIL_REFRESH_TOKEN_SESSION_KEY);
        } catch {
          // ignore storage errors
        }
      }
      
      // Reset provider
      setAuthProvider(null);
      
      // Redirect to landing page (or custom path) after successful logout
      window.location.href = redirectTo;
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state and redirect
      setUserProfile(null);
      setTokenRoles([]);
      setUserOID(null);
      setAuthProvider(null);
      window.location.href = redirectTo;
    } finally {
      setIsLoading(false);
    }
  }, [instance, account, accounts, authProvider]);

  /**
   * Clear Google auth only (token, user, sessionStorage). Use when user is not registered
   * so they stay on Sign In page and can go to Sign Up.
   */
  const clearGoogleAuth = useCallback(() => {
    setGoogleToken(null);
    setGoogleUser(null);
    pendingGoogleTokenRef.current = null;
    if (authProvider === 'google') {
      setAuthProvider(null);
      setUserProfile(null);
    }
    sessionStorage.removeItem('google_id_token');
    sessionStorage.removeItem('google_user');
    googleProfileFetchedRef.current = false;
  }, [authProvider]);

  const getAccessToken = useCallback(async () => {
    // Return token based on current provider
    if (authProvider === 'email') {
      if (!emailPasswordToken) {
        throw new Error('No email/password token available');
      }
      return emailPasswordToken;
    }
    
    if (authProvider === 'magic') {
      if (!magicToken) {
        throw new Error('No magic token available');
      }
      return magicToken;
    }
    
    if (authProvider === 'google') {
      if (!googleToken) {
        throw new Error('No Google token available');
      }
      return googleToken;
    }
    
    if (authProvider === 'microsoft') {
      if (!account && accounts.length === 0) {
        throw new Error('No Microsoft account available');
      }

      const currentAccount = account || accounts[0];

      try {
        // Try to get token silently first
        const response = await instance.acquireTokenSilent({
          ...loginRequest,
          account: currentAccount,
        });
        setAccessToken(response.accessToken);
        
        // Update token roles and OID when token is refreshed
        if (response.accessToken) {
          const roles = getRolesFromToken(response.accessToken);
          setTokenRoles(roles);
          const oid = getOIDFromToken(response.accessToken);
          setUserOID(oid);
        }
        
        return response.accessToken;
      } catch (error) {
        // If silent acquisition fails, try interactive
        console.warn('Silent token acquisition failed, trying interactive:', error);
        try {
          const response = await instance.acquireTokenPopup({
            ...loginRequest,
            account: currentAccount,
          });
          setAccessToken(response.accessToken);
          
          // Update token roles when token is refreshed
          if (response.accessToken) {
            const roles = getRolesFromToken(response.accessToken);
            setTokenRoles(roles);
          }
          
          return response.accessToken;
        } catch (interactiveError) {
          console.error('Interactive token acquisition failed:', interactiveError);
          throw interactiveError;
        }
      }
    }
    
    throw new Error('No authentication provider available');
  }, [instance, account, accounts, authProvider, googleToken, emailPasswordToken, magicToken]);

  authRef.getAccessToken = getAccessToken;

  /**
   * Fetch current user profile from backend (/api/auth/me)
   * This is the source of truth for user role and profile
   * 
   * @returns {Promise<Object>} User profile data from backend
   */
  const fetchCurrentUser = useCallback(async () => {
    try {
      const token = await getAccessToken();
      
      // Validate token exists
      if (!token) {
        throw new Error('No access token available. Please sign in again.');
      }
      
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://echopad-app-service-bwd0bqd7g7ehb5c7.westus2-01.azurewebsites.net';
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        if (isUserNotRegisteredError(response, errorData)) {
          const err = new Error(errorData.message || 'User account not found. Please sign up first.');
          err.code = 'USER_NOT_REGISTERED';
          throw err;
        }
        throw new Error(errorData.message || `Failed to fetch user: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        setUserProfile(data.data);
        
        // CRITICAL: Extract OID from backend profile (user.id is the OID)
        // This ensures ClientAdmin users have OID available even when token roles are missing
        // Backend always uses OID as user.id for Microsoft-authenticated users (same as SuperAdmin)
        if (data.data.user?.id && authProvider === 'microsoft') {
          const backendOID = data.data.user.id;
          // Only update if we don't already have OID or if backend OID is different
          if (!userOID || userOID !== backendOID) {
            console.log('🔐 [AUTH] OID extracted from backend profile:', backendOID.substring(0, 8) + '...');
            setUserOID(backendOID);
          }
        }
        
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      throw error;
    }
  }, [getAccessToken]);

  // Auto-fetch user role from database when OID is available but roles are empty
  // This must be after fetchCurrentUser is defined
  useEffect(() => {
    const fetchRoleByOID = async () => {
      // Only fetch if:
      // 1. OID is available
      // 2. Token roles are empty
      // 3. User profile is not already loaded
      // 4. We have an access token (Microsoft auth)
      // 5. We haven't already fetched for this OID (idempotent guard)
      if (userOID && tokenRoles.length === 0 && !userProfile && accessToken && authProvider === 'microsoft' && fetchedOIDRef.current !== userOID) {
        // Mark this OID as fetched to prevent repeated calls
        fetchedOIDRef.current = userOID;
        console.log('🔍 [AUTH] OID available but no roles in token. Fetching role from database using OID...');
        try {
          // Fetch user profile from backend (uses OID-first lookup)
          const profile = await fetchCurrentUser();
          if (profile?.user?.role) {
            console.log('✅ [AUTH] Role fetched from database using OID:', profile.user.role);
            console.log('   User:', profile.user.email, '| Role:', profile.user.role);
          } else {
            console.warn('⚠️ [AUTH] User profile fetched but no role found. User may need to be created in database.');
          }
        } catch (fetchError) {
          console.warn('⚠️ [AUTH] Failed to fetch user profile by OID:', fetchError);
          // Reset the guard on error so we can retry if needed
          fetchedOIDRef.current = null;
          // User might not exist in database yet - this is OK for first-time login
          // They will be created when they sign in or sign up
        }
      }
    };

    fetchRoleByOID();
  }, [userOID, tokenRoles, userProfile, accessToken, authProvider, fetchCurrentUser]);

  // Reset fetch guard when OID changes (new user login)
  useEffect(() => {
    if (userOID && fetchedOIDRef.current !== userOID) {
      fetchedOIDRef.current = null;
    }
  }, [userOID]);

  // When Google-authenticated but no profile (e.g. landed on dashboard from old flow), try fetch; if user not registered, clear Google and set redirect flag
  useEffect(() => {
    const tryFetchGoogleProfile = async () => {
      if (
        authProvider !== 'google' ||
        !googleToken ||
        userProfile !== null ||
        googleProfileFetchedRef.current
      ) {
        return;
      }
      googleProfileFetchedRef.current = true;
      try {
        await fetchCurrentUser();
      } catch (err) {
        googleProfileFetchedRef.current = false;
        if (err?.code === 'USER_NOT_REGISTERED') {
          clearGoogleAuth();
          setUserNotRegisteredRedirect(true);
        }
      }
    };
    tryFetchGoogleProfile();
  }, [authProvider, googleToken, userProfile, fetchCurrentUser, clearGoogleAuth]);

  /**
   * Sync user profile with backend
   * Calls /api/auth/sign-in or /api/auth/sign-up based on isSignUp flag
   * 
   * @param {boolean} isSignUp - If true, calls sign-up endpoint; otherwise sign-in
   * @param {Object} signUpData - Optional data for sign-up (organizationName, organizerName, email)
   * @returns {Promise<Object>} User profile data from backend
   */
  const syncUserProfile = useCallback(async (isSignUp = false, signUpData = null) => {
    // Check if we have Microsoft authentication
    // Handle timing issues where authProvider state hasn't updated yet after signUp
    const hasMicrosoftAuth = authProvider === 'microsoft' || 
                             accounts.length > 0 || 
                             account !== null ||
                             isMicrosoftAuthenticated;
    
    if (!hasMicrosoftAuth) {
      throw new Error('User profile sync is only available for Microsoft authentication');
    }

    try {
      const currentAccount = account || accounts[0];
      if (!currentAccount) {
        throw new Error('No Microsoft account available. Please sign in again.');
      }

      let idToken;
      try {
        const tokenResponse = await instance.acquireTokenSilent({
          ...loginRequest,
          account: currentAccount,
        });
        idToken = tokenResponse.idToken || tokenResponse.accessToken;
        if (tokenResponse.accessToken) {
          setAccessToken(tokenResponse.accessToken);
          const roles = getRolesFromToken(tokenResponse.accessToken);
          setTokenRoles(roles);
          const oid = getOIDFromToken(tokenResponse.accessToken);
          setUserOID(oid);
        }
      } catch (silentError) {
        console.warn('Silent token acquisition failed, trying interactive:', silentError);
        const tokenResponse = await instance.acquireTokenPopup({
          ...loginRequest,
          account: currentAccount,
        });
        idToken = tokenResponse.idToken || tokenResponse.accessToken;
        if (tokenResponse.accessToken) {
          setAccessToken(tokenResponse.accessToken);
          const roles = getRolesFromToken(tokenResponse.accessToken);
          setTokenRoles(roles);
        }
      }

      if (!idToken) {
        throw new Error('No ID token available. Please sign in again.');
      }

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://echopad-app-service-bwd0bqd7g7ehb5c7.westus2-01.azurewebsites.net';
      const endpoint = isSignUp ? `${API_BASE_URL}/api/auth/sign-up` : `${API_BASE_URL}/api/auth/sign-in`;

      const body = {
        provider: 'microsoft',
        token: idToken,
        ...(signUpData || {}),
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        const errorMessage = errorData.message || errorData.error || `Backend request failed: ${response.status}`;
        console.error('🔐 [AUTH] Sign-in/sign-up failed:', {
          status: response.status,
          error: errorData.error,
          message: errorMessage,
          endpoint,
          hasToken: !!idToken,
          tokenPreview: idToken ? idToken.substring(0, 20) + '...' : 'no token',
        });
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        setUserProfile(data.data);
        
        // CRITICAL: Extract OID from backend profile (user.id is the OID)
        // This ensures ClientAdmin users have OID available even when token roles are missing
        // Backend always uses OID as user.id for Microsoft-authenticated users (same as SuperAdmin)
        if (data.data.user?.id && authProvider === 'microsoft') {
          const backendOID = data.data.user.id;
          // Always update OID from backend (backend is source of truth)
          if (!userOID || userOID !== backendOID) {
            console.log('🔐 [AUTH] OID extracted from backend profile (sign-in/sign-up):', backendOID.substring(0, 8) + '...');
            setUserOID(backendOID);
          }
        }
        
        // After sign-in/sign-up, fetch fresh profile from /api/auth/me to ensure we have latest role from DB
        try {
          const freshProfile = await fetchCurrentUser();
          if (freshProfile) {
            return freshProfile;
          }
        } catch (fetchError) {
          if (import.meta.env.DEV) {
            console.warn('Failed to fetch fresh user profile:', fetchError);
          }
        }
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to sync user profile');
      }
    } catch (error) {
      console.error('Failed to sync user profile:', error);
      throw error;
    }
  }, [authProvider, accounts, account, isMicrosoftAuthenticated, instance, loginRequest, fetchCurrentUser]);

  // Auto-sync user profile once MSAL is ready and we have a Microsoft account
  // This replaces the immediate sync calls in SignIn/SignUp that caused timing issues
  // Note: This will attempt sign-in first; if user doesn't exist, they need to use sign-up flow
  const autoSyncAttemptedRef = useRef(false);
  useEffect(() => {
    const autoSyncProfile = async () => {
      // Only sync if:
      // 1. MSAL is idle (ready)
      // 2. We have Microsoft accounts
      // 3. We have an access token
      // 4. authProvider is set to microsoft
      // 5. User profile is not already loaded
      // 6. We haven't already attempted sync for this session (idempotent)
      if (
        isMsalIdle &&
        accounts.length > 0 &&
        accessToken &&
        authProvider === 'microsoft' &&
        !userProfile &&
        !isLoading &&
        !autoSyncAttemptedRef.current
      ) {
        autoSyncAttemptedRef.current = true;
        try {
          console.log('🔄 [AUTH] Auto-syncing user profile after MSAL ready...');
          await syncUserProfile(false); // false = sign-in, not sign-up
        } catch (syncError) {
          // Reset guard on error so we can retry if needed
          autoSyncAttemptedRef.current = false;
          // Silently fail - user might not exist in DB yet, will be created on first sign-in/sign-up
          if (import.meta.env.DEV) {
            console.warn('⚠️ [AUTH] Auto-sync failed (user may not exist yet):', syncError.message);
          }
        }
      }
    };

    autoSyncProfile();
  }, [isMsalIdle, accounts.length, accessToken, authProvider, userProfile, isLoading, syncUserProfile]);

  // Reset auto-sync guard when user logs out or authProvider changes
  useEffect(() => {
    if (!authProvider || authProvider !== 'microsoft') {
      autoSyncAttemptedRef.current = false;
    }
  }, [authProvider]);

  /**
   * Sync Google user profile with backend
   * Calls /api/auth/sign-in or /api/auth/sign-up based on isSignUp flag
   * 
   * @param {boolean} isSignUp - If true, calls sign-up endpoint; otherwise sign-in
   * @param {Object} signUpData - Optional data for sign-up (organizationName, organizerName, email)
   * @returns {Promise<Object>} User profile data from backend
   */
  const syncGoogleUserProfile = useCallback(async (isSignUp = false, signUpData = null) => {
    const tokenToUse = googleToken ?? pendingGoogleTokenRef.current;
    if (!tokenToUse) {
      throw new Error('Google user profile sync requires Google authentication');
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://echopad-app-service-bwd0bqd7g7ehb5c7.westus2-01.azurewebsites.net';
      const endpoint = isSignUp ? `${API_BASE_URL}/api/auth/sign-up` : `${API_BASE_URL}/api/auth/sign-in`;

      const body = {
        provider: 'google',
        token: tokenToUse,
        ...(signUpData || {}),
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        const errorMessage = errorData.message || errorData.error || `Backend request failed: ${response.status}`;
        console.error('🔐 [AUTH] Google sign-in/sign-up failed:', {
          status: response.status,
          error: errorData.error,
          message: errorMessage,
          endpoint,
          hasToken: !!tokenToUse,
          tokenPreview: tokenToUse ? tokenToUse.substring(0, 20) + '...' : 'no token',
        });
        if (isUserNotRegisteredError(response, errorData)) {
          pendingGoogleTokenRef.current = null;
          const err = new Error(errorMessage);
          err.code = 'USER_NOT_REGISTERED';
          throw err;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      pendingGoogleTokenRef.current = null; // Clear after successful use

      if (data.success && data.data) {
        setUserProfile(data.data);
        
        // Note: Google auth doesn't use OID (uses sub claim), but we can still extract user.id if available
        // For Microsoft auth, user.id is always the OID
        if (data.data.user?.id && authProvider === 'microsoft') {
          const backendOID = data.data.user.id;
          if (!userOID || userOID !== backendOID) {
            console.log('🔐 [AUTH] OID extracted from backend profile (Google sync):', backendOID.substring(0, 8) + '...');
            setUserOID(backendOID);
          }
        }
        
        // After sign-in/sign-up, fetch fresh profile from /api/auth/me to ensure we have latest role from DB
        try {
          const freshProfile = await fetchCurrentUser();
          if (freshProfile) {
            return freshProfile;
          }
        } catch (fetchError) {
          if (import.meta.env.DEV) {
            console.warn('Failed to fetch fresh user profile:', fetchError);
          }
        }
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to sync Google user profile');
      }
    } catch (error) {
      console.error('Failed to sync Google user profile:', error);
      throw error;
    }
  }, [authProvider, googleToken, fetchCurrentUser]);

  /**
   * Sign up with email and password
   * 
   * @param {Object} signUpData - { organizationName, organizerName, email, password }
   * @returns {Promise<Object>} Response data
   */
  const signUpEmailPassword = useCallback(async (signUpData) => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://echopad-app-service-bwd0bqd7g7ehb5c7.westus2-01.azurewebsites.net';
      const response = await fetch(`${API_BASE_URL}/api/auth/sign-up-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signUpData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `Sign up failed: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Email/password sign up error:', error);
      throw error;
    }
  }, []);

  /**
   * Sign in with email and password
   * 
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} User profile data
   */
  const signInEmailPassword = useCallback(async (credentials) => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://echopad-app-service-bwd0bqd7g7ehb5c7.westus2-01.azurewebsites.net';
      const response = await fetch(`${API_BASE_URL}/api/auth/sign-in-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `Sign in failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        console.log('🔐 [AUTH] Email/password sign-in response:', {
          email: data.data.user?.email,
          role: data.data.user?.role,
          id: data.data.user?.id?.substring(0, 8) + '...',
          hasToken: !!data.data.sessionToken,
        });
        
        setUserProfile(data.data);
        setAuthProvider('email'); // Set provider to email
        
        // Extract and store session token if provided
        const sessionToken = data.data.sessionToken;
        if (sessionToken) {
          setEmailPasswordToken(sessionToken);
          // Store in sessionStorage (current tab) and localStorage (so new tabs e.g. Electron can reuse)
          try {
            sessionStorage.setItem('email_password_token', sessionToken);
            localStorage.setItem(EMAIL_TOKEN_LOCAL_KEY, sessionToken);
            console.log('💾 [AUTH] Stored email/password session token');
          } catch (storageError) {
            console.warn('Failed to store email/password token:', storageError);
          }
        } else {
          console.warn('⚠️ [AUTH] No session token received from email/password sign-in');
        }

        // Store refresh token for Electron redirect (sessionStorage only; not long-term)
        const refreshTokenFromBackend = data.data.refreshToken;
        if (refreshTokenFromBackend) {
          setEmailPasswordRefreshToken(refreshTokenFromBackend);
          try {
            sessionStorage.setItem(EMAIL_REFRESH_TOKEN_SESSION_KEY, refreshTokenFromBackend);
          } catch (storageError) {
            console.warn('Failed to store email/password refresh token:', storageError);
          }
        }
        
        // For email/password auth, user.id may not be OID, but we can still extract it if available
        // For Microsoft auth, user.id is always the OID
        if (data.data.user?.id) {
          // Store user ID (may be OID for Microsoft auth, or generated ID for email/password)
          // Only update if we don't have it yet
          if (!userOID) {
            console.log('🔐 [AUTH] User ID extracted from backend profile (email/password):', data.data.user.id.substring(0, 8) + '...');
            setUserOID(data.data.user.id);
          }
        }
        
        // Persist minimal email/password session so refresh keeps the user logged in
        // This does NOT store the password or any tokens, only profile + identifiers
        try {
          const sessionPayload = {
            authProvider: 'email',
            userProfile: data.data,
            userOID: data.data.user?.id || null,
          };
          localStorage.setItem(EMAIL_SESSION_KEY, JSON.stringify(sessionPayload));
          console.log('💾 [AUTH] Persisted email/password session to localStorage for:', data.data.user?.email);
        } catch (storageError) {
          console.warn('Failed to persist email/password session:', storageError);
        }
        
        // Email/password users now have tokens, so we can call /api/auth/me if needed
        // But the sign-in response already contains the upgraded role (if upgrade happened)
        // So we just use the response directly - no need to fetch again
        console.log('✅ [AUTH] Email/password sign-in complete with session token');
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to sign in');
      }
    } catch (error) {
      console.error('Email/password sign in error:', error);
      throw error;
    }
  }, [fetchCurrentUser]);

  /**
   * Set magic link session token
   * Called after accepting a magic link invitation
   * 
   * @param {string} token - Magic session token
   */
  const setMagicSession = useCallback((token) => {
    setMagicToken(token);
    setAuthProvider('magic');
    sessionStorage.setItem('magic_token', token);
  }, []);

  const clearUserNotRegisteredRedirect = useCallback(() => {
    setUserNotRegisteredRedirect(false);
  }, []);

  // True only when we can actually obtain a token for Electron redirect (avoids redirect with error when session restored from localStorage but token was in sessionStorage and is missing, e.g. new tab from Electron)
  const hasTokenForElectronRedirect =
    (authProvider === 'microsoft' && (account || accounts?.length > 0)) ||
    (authProvider === 'google' && !!googleToken) ||
    (authProvider === 'email' && !!emailPasswordToken) ||
    (authProvider === 'magic' && !!magicToken);

  const value = {
    isAuthenticated,
    hasTokenForElectronRedirect,
    isLoading: isLoading || !isMsalIdle,
    isAuthReady: isMsalIdle,
    account: account || accounts[0] || null,
    accounts,
    accessToken,
    login,
    signUp,
    logout,
    getAccessToken,
    // User profile
    userProfile,
    syncUserProfile,
    syncGoogleUserProfile,
    fetchCurrentUser, // Fetch current user from /api/auth/me (source of truth for role)
    // Token roles (from Entra ID token) - for immediate role detection
    tokenRoles, // Array of role names from token (e.g., ['SuperAdmin'])
    // User OID (Object ID) from Entra ID token - unique user identifier
    userOID, // OID string (e.g., 'a1b2c3d4-e5f6-7890-abcd-ef1234567890')
    // Email/password authentication
    signUpEmailPassword,
    signInEmailPassword,
    emailPasswordRefreshToken,
    // Google authentication
    loginWithGoogle,
    googleToken,
    googleUser,
    authProvider,
    // Magic link authentication
    setMagicSession,
    magicToken,
    // User not registered (e.g. Google sign-in without sign-up)
    clearGoogleAuth,
    userNotRegisteredRedirect,
    clearUserNotRegisteredRedirect,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
