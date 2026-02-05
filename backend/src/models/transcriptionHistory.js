/**
 * Transcription History Model Schema
 *
 * Represents a saved transcription from AI Scribe, tagged with the user who saved it.
 */

/**
 * Create a new transcription document
 * @param {Object} data - Transcription data
 * @param {string} data.id - Unique transcription ID
 * @param {string} data.tenantId - Tenant ID (partition key)
 * @param {string} data.userId - User ID who saved the transcription
 * @param {string} data.text - Transcription text content
 * @param {string} [data.createdAt] - Creation timestamp (ISO string)
 * @returns {Object} Transcription document
 */
export function createTranscription(data) {
  const now = new Date();

  return {
    id: data.id,
    tenantId: data.tenantId,
    userId: data.userId,
    text: data.text,
    createdAt: data.createdAt || now.toISOString(),
  };
}

/**
 * Validate transcription data (for create)
 * @param {Object} data - Transcription data to validate
 * @returns {Object} Validation result with isValid and errors
 */
export function validateTranscription(data) {
  const errors = [];

  if (!data.id) errors.push("id is required");
  if (!data.tenantId) errors.push("tenantId is required");
  if (!data.userId) errors.push("userId is required");
  if (data.text === undefined || data.text === null) {
    errors.push("text is required");
  } else if (typeof data.text !== "string") {
    errors.push("text must be a string");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
