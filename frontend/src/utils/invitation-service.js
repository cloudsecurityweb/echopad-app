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
export async function sendInvitation(email, role, productId, getAccessTokenFn) {
  // Validate inputs
  if (!email || !email.trim()) {
    throw new Error('Email is required');
  }

  if (!role) {
    throw new Error('Role is required');
  }

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://echopad-app-service-bwd0bqd7g7ehb5c7.westus2-01.azurewebsites.net';
  const invitationEndpoint = `${API_BASE_URL}/api/invites/user`;

  try {
    const token = await getAccessTokenFn();
    
    const response = await fetch(invitationEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: email.trim(),
        productId: productId ? productId.trim() : null, // Optional product ID
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
  // TODO: Implement when backend API is ready
  throw new Error('Resend invitation not yet implemented');
}

/**
 * Get list of pending invitations (for future implementation)
 * 
 * @param {Function} getAccessTokenFn - Function from useAuth hook to get access token
 * @returns {Promise<Array>} Array of pending invitations
 */
export async function getPendingInvitations(getAccessTokenFn) {
  // TODO: Implement when backend API is ready
  return [];
}

