/**
 * Transcription Metrics Model Schema
 *
 * Stores per-transcription usage metrics for analytics and billing.
 * Partition key: /tenantId (multi-tenant isolation).
 */

/**
 * Valid metric statuses
 */
export const METRIC_STATUS = {
    SUCCESS: "SUCCESS",
    FAILED: "FAILED",
};

/**
 * Create a new transcription metrics document
 * @param {Object} data
 * @param {string} data.id - Unique metric ID (e.g. "metric_<uuid>")
 * @param {string} data.tenantId - Tenant ID (partition key)
 * @param {string} data.userId - User who performed the transcription
 * @param {string} data.clientId - Organization / client ID
 * @param {string} [data.transcriptionId] - Optional ref to transcriptionHistory doc
 * @param {number} data.audioDurationSeconds - Audio length in seconds
 * @param {number} data.processingTimeSeconds - Server-side processing time
 * @param {number} data.wordCount - Word count of transcribed text
 * @param {number} data.characterCount - Character count of transcribed text
 * @param {string} data.modelUsed - Model name (e.g. "whisper-large-v3")
 * @param {string} data.language - Detected / requested language code
 * @param {string} data.status - "SUCCESS" or "FAILED"
 * @returns {Object} Metrics document ready for Cosmos DB
 */
export function createMetricsEntry(data) {
    const now = new Date();
    const audioDurationMinutes = (data.audioDurationSeconds || 0) / 60;
    const avgWordsPerMinute =
        audioDurationMinutes > 0
            ? Math.round((data.wordCount || 0) / audioDurationMinutes)
            : 0;

    return {
        id: data.id,
        tenantId: data.tenantId,
        userId: data.userId,
        clientId: data.clientId,
        transcriptionId: data.transcriptionId || null,
        audioDurationSeconds: data.audioDurationSeconds || 0,
        audioDurationMinutes: Math.round(audioDurationMinutes * 100) / 100,
        processingTimeSeconds: data.processingTimeSeconds || 0,
        wordCount: data.wordCount || 0,
        characterCount: data.characterCount || 0,
        averageWordsPerMinute: avgWordsPerMinute,
        modelUsed: data.modelUsed || "unknown",
        language: data.language || "en",
        status: data.status || METRIC_STATUS.SUCCESS,
        createdAt: data.createdAt || now.toISOString(),
    };
}

/**
 * Validate metrics data before persisting
 * @param {Object} data - Metrics data to validate
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export function validateMetricsEntry(data) {
    const errors = [];

    if (!data.id) errors.push("id is required");
    if (!data.tenantId) errors.push("tenantId is required");
    if (!data.userId) errors.push("userId is required");
    if (!data.clientId) errors.push("clientId is required");

    if (data.audioDurationSeconds !== undefined && typeof data.audioDurationSeconds !== "number") {
        errors.push("audioDurationSeconds must be a number");
    }
    if (data.processingTimeSeconds !== undefined && typeof data.processingTimeSeconds !== "number") {
        errors.push("processingTimeSeconds must be a number");
    }
    if (data.wordCount !== undefined && typeof data.wordCount !== "number") {
        errors.push("wordCount must be a number");
    }
    if (data.characterCount !== undefined && typeof data.characterCount !== "number") {
        errors.push("characterCount must be a number");
    }
    if (data.status && !Object.values(METRIC_STATUS).includes(data.status)) {
        errors.push(`status must be one of: ${Object.values(METRIC_STATUS).join(", ")}`);
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}
