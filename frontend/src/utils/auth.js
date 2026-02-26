/**
 * Authentication Utility Functions
 * 
 * Helper functions for token management and authenticated API calls.
 */

/** sessionStorage key for desktop redirect payload (redirectUri, token, name, email) after sign-in */
export const DESKTOP_REDIRECT_KEY = 'echopad_desktop_redirect';

/**
 * Get access token for API calls
 * This function uses the auth context to get a valid access token.
 * 
 * @param {Function} getAccessToken - Function from useAuth hook to get access token
 * @returns {Promise<string>} Access token string
 */
export async function getAccessToken(getAccessTokenFn) {
  try {
    const token = await getAccessTokenFn();
    return token;
  } catch (error) {
    console.error('Failed to get access token:', error);
    throw error;
  }
}

/**
 * Make an authenticated fetch request
 * Automatically includes the access token in the Authorization header.
 * 
 * @param {string} url - API endpoint URL
 * @param {Object} options - Fetch options (method, body, headers, etc.)
 * @param {Function} getAccessTokenFn - Function from useAuth hook to get access token
 * @returns {Promise<Response>} Fetch response
 */
export async function authenticatedFetch(url, options = {}, getAccessTokenFn) {
  try {
    // Get access token
    const token = await getAccessToken(getAccessTokenFn);

    console.log('Making authenticated request to:', url);
    console.log('using token:', token);  
    
    // Merge headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    };

    // Make the request
    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log('Received response with status:', response);

    // Handle token expiration or unauthorized
    if (response.status === 401) {
      // Token might be expired, try to refresh
      console.warn('Unauthorized response, token may be expired');
      throw new Error('Unauthorized - token may be expired');
    }

    return response;
  } catch (error) {
    console.error('Authenticated fetch error:', error);
    throw error;
  }
}

/**
 * Make an authenticated API call and parse JSON response
 * 
 * @param {string} url - API endpoint URL
 * @param {Object} options - Fetch options
 * @param {Function} getAccessTokenFn - Function from useAuth hook to get access token
 * @returns {Promise<Object>} Parsed JSON response
 */
export async function authenticatedApiCall(url, options = {}, getAccessTokenFn) {
  const response = await authenticatedFetch(url, options, getAccessTokenFn);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API call failed: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return response.json();
}

/**
 * Check if token is expired (basic check)
 * Note: This is a simple check. The actual validation should be done by the backend.
 * 
 * @param {string} token - JWT token
 * @returns {boolean} True if token appears to be expired
 */
export function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    if (!exp) return false;
    
    // Check if token expires in less than 5 minutes
    const expirationTime = exp * 1000;
    const currentTime = Date.now();
    const bufferTime = 5 * 60 * 1000; // 5 minutes buffer
    
    return expirationTime < (currentTime + bufferTime);
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // Assume expired if we can't parse
  }
}
