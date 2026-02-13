/**
 * User Invitation Service
 * 
 * Handles sending user invitations via email.
 * Currently uses a mock API that simulates the invitation process.
 * 
 * TODO: Replace mock implementation with real backend API endpoint when available.
 */

/**
 * Send an invitation to a user via email (ClientAdmin only)
 * 
 * @param {string} email - Email address of the user to invite
 * @param {string} role - Role to assign to the invited user (should be 'User')
 * @param {string} productId - Product ID to assign to the invited user (optional)
 * @param {Function} getAccessTokenFn - Function from useAuth hook to get access token
 * @returns {Promise<Object>} Response object with success status and message
 * @throws {Error} If invitation fails
 */
export async function sendInvitation(email, role, productId, licenseId, getAccessTokenFn) {
  // Validate inputs
  if (!email || !email.trim()) {
    throw new Error('Email is required');
  }

  if (!role) {
    throw new Error('Role is required');
  }

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const invitationEndpoint = `${API_BASE_URL}/api/invites/user`;

  try {
    let token;
    try {
      token = await getAccessTokenFn();
    } catch (tokenError) {
      // Provide a more user-friendly error message
      if (tokenError.message?.includes('No authentication provider')) {
        throw new Error('You must be signed in to send invitations. Please sign in and try again.');
      }
      throw new Error(`Authentication failed: ${tokenError.message || 'Please sign in and try again.'}`);
    }

    if (!token) {
      throw new Error('No access token available. Please sign in and try again.');
    }

    const response = await fetch(invitationEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: email.trim(),
        productId: productId ? productId.trim() : null, // Optional product ID
        licenseId: licenseId ? licenseId.trim() : null, // Optional license ID
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Failed to send invitation: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Invitation service error:', error);

    // Re-throw with user-friendly message
    if (error.message) {
      throw error;
    }

    throw new Error('Failed to send invitation. Please try again later.');
  }
}

/**
 * Resend an invitation (for future implementation)
 * 
 * @param {string} invitationId - ID of the invitation to resend
 * @param {Function} getAccessTokenFn - Function from useAuth hook to get access token
 * @returns {Promise<Object>} Response object with success status
 */
export async function resendInvitation(invitationId, getAccessTokenFn) {
  if (!invitationId) {
    throw new Error('Invitation ID is required');
  }

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const resendEndpoint = `${API_BASE_URL}/api/invites/${invitationId}/resend`;

  try {
    let token;
    try {
      token = await getAccessTokenFn();
    } catch (tokenError) {
      if (tokenError.message?.includes('No authentication provider')) {
        throw new Error('You must be signed in to resend invitations.');
      }
      throw new Error(`Authentication failed: ${tokenError.message}`);
    }

    const response = await fetch(resendEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Failed to resend invitation: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Resend invitation error:', error);
    if (error.message) {
      throw error;
    }
    throw new Error('Failed to resend invitation. Please try again later.');
  }
}

/**
 * Get list of pending invitations (for future implementation)
 * 
 * @param {Function} getAccessTokenFn - Function from useAuth hook to get access token
 * @returns {Promise<Array>} Array of pending invitations
 */
export async function getPendingInvitations(getAccessTokenFn) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const pendingEndpoint = `${API_BASE_URL}/api/invites/pending`;

  try {
    const token = await getAccessTokenFn();

    const response = await fetch(pendingEndpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Failed to get pending invitations: ${response.status}`);
    }

    return data.data.invites;
  } catch (error) {
    console.error('Get pending invitations error:', error);
    throw new Error('Failed to get pending invitations. Please try again later.');
  }
}

