/**
 * Product Feedback Service
 * 
 * Handles submitting product feedback.
 * Currently uses a mock API that simulates the feedback submission process.
 * 
 * TODO: Replace mock implementation with real backend API endpoint when available.
 */

/**
 * Submit product feedback
 * 
 * @param {string} productName - Name of the product
 * @param {number} rating - Rating from 1 to 5
 * @param {string} message - Feedback message
 * @param {Function} getAccessTokenFn - Function from useAuth hook to get access token
 * @returns {Promise<Object>} Response object with success status and feedback data
 * @throws {Error} If feedback submission fails
 */
export async function submitProductFeedback(productName, rating, message, getAccessTokenFn) {
  // Validate inputs
  if (!productName || !productName.trim()) {
    throw new Error('Product name is required');
  }

  if (!rating || rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }

  if (!message || !message.trim()) {
    throw new Error('Message is required');
  }

  if (message.trim().length < 10) {
    throw new Error('Message must be at least 10 characters');
  }

  if (message.trim().length > 2000) {
    throw new Error('Message must be less than 2000 characters');
  }

  // Mock API endpoint - replace with actual endpoint when backend is ready
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
  const feedbackEndpoint = `${API_BASE_URL}/feedback/products`;

  try {
    // TODO: Replace with actual authenticatedApiCall when backend is ready

    // When backend is ready, uncomment and use this:
    /*
    const { authenticatedApiCall } = await import('./auth');
    const response = await authenticatedApiCall(
      feedbackEndpoint,
      {
        method: 'POST',
        body: JSON.stringify({
          productName: productName.trim(),
          rating,
          message: message.trim(),
        }),
      },
      getAccessTokenFn
    );
    */

    // Mock successful response
    return {
      success: true,
      message: 'Feedback submitted successfully',
      data: {
        id: Math.floor(Math.random() * 10000),
        productName: productName.trim(),
        rating,
        message: message.trim(),
        createdAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('Product feedback service error:', error);
    
    // Re-throw with user-friendly message
    if (error.message) {
      throw error;
    }
    
    throw new Error('Failed to submit feedback. Please try again later.');
  }
}
