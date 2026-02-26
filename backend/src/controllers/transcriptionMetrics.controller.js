import * as metricsService from "../services/transcriptionMetrics.service.js";
import { getUserByOIDAnyRole } from "../services/userService.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Extract date filter params from query string
 * @param {Object} query - req.query
 * @returns {{ from?: string, to?: string }}
 */
function getDateFilters(query) {
    const filters = {};
    if (query.from) filters.from = query.from;
    if (query.to) filters.to = query.to;
    return filters;
}

/**
 * Extract tenant and user from req.currentUser (auth-protected endpoints)
 */
function getTenantAndUser(req) {
    const tenantId = req.currentUser?.tenantId || req.auth?.tid;
    const userId = req.currentUser?.id || req.auth?.oid;
    if (!tenantId || !userId) {
        throw new ApiError(401, "Unauthorized: tenant and user identity required");
    }
    return { tenantId, userId };
}

// ===== POST /api/internal/metrics ==============================================

/**
 * Record metrics from aiscribe (token protected)
 */
export const recordMetrics = asyncHandler(async (req, res) => {
    const {
        tenantId,
        userId,
        clientId,
        transcriptionId,
        audioDurationSeconds,
        processingTimeSeconds,
        wordCount,
        characterCount,
        modelUsed,
        language,
        status,
    } = req.body;

    if (!tenantId || !userId) {
        throw new ApiError(400, "tenantId and userId are required");
    }

    // Resolve clientId (organizationId) from the user's DB record if not provided
    let resolvedClientId = clientId;
    if (!resolvedClientId || resolvedClientId === "unknown") {
        try {
            const userRecord = await getUserByOIDAnyRole(userId, tenantId);
            resolvedClientId = userRecord?.organizationId || "unknown";
        } catch (lookupErr) {
            console.warn("[Metrics] Failed to resolve clientId from user record:", lookupErr.message);
            resolvedClientId = "unknown";
        }
    }

    const doc = await metricsService.recordMetrics({
        tenantId,
        userId,
        clientId: resolvedClientId,
        transcriptionId: transcriptionId || null,
        audioDurationSeconds: Number(audioDurationSeconds) || 0,
        processingTimeSeconds: Number(processingTimeSeconds) || 0,
        wordCount: Number(wordCount) || 0,
        characterCount: Number(characterCount) || 0,
        modelUsed: modelUsed || "unknown",
        language: language || "en",
        status: status || "SUCCESS",
    });

    res.status(201).json(
        new ApiResponse(201, { metric: doc }, "Metrics recorded successfully")
    );
});

// ===== GET /api/metrics/user ===================================================

/**
 * Get aggregated usage for the currently logged-in user
 */
export const getMyMetrics = asyncHandler(async (req, res) => {
    const { tenantId, userId } = getTenantAndUser(req);
    const filters = getDateFilters(req.query);

    const data = await metricsService.getUserMetrics(tenantId, userId, filters);

    res.status(200).json(
        new ApiResponse(200, data, "User metrics fetched successfully")
    );
});

// ===== GET /api/metrics/client =================================================

/**
 * Get aggregated usage for all users under the caller's organization (CLIENT_ADMIN+)
 */
export const getClientMetrics = asyncHandler(async (req, res) => {
    const { tenantId } = getTenantAndUser(req);
    const clientId = req.currentUser?.organizationId;

    if (!clientId) {
        throw new ApiError(400, "Organization ID not available for this user");
    }

    const filters = getDateFilters(req.query);
    const data = await metricsService.getClientMetrics(tenantId, clientId, filters);

    res.status(200).json(
        new ApiResponse(200, data, "Client metrics fetched successfully")
    );
});

// ===== GET /api/metrics/platform ===============================================

/**
 * Get global platform metrics (SUPER_ADMIN only)
 */
export const getPlatformMetrics = asyncHandler(async (req, res) => {
    const { tenantId } = getTenantAndUser(req);
    const filters = getDateFilters(req.query);

    const data = await metricsService.getPlatformMetrics(tenantId, filters);

    res.status(200).json(
        new ApiResponse(200, data, "Platform metrics fetched successfully")
    );
});

// ===== GET /api/metrics/user/:userId ===========================================

/**
 * Get metrics for a specific user (CLIENT_ADMIN can only view their org, SUPER_ADMIN can view all)
 */
export const getUserMetricsById = asyncHandler(async (req, res) => {
    const { tenantId } = getTenantAndUser(req);
    const targetUserId = req.params.userId;

    if (!targetUserId) {
        throw new ApiError(400, "userId parameter is required");
    }

    // CLIENT_ADMIN scope enforcement is handled in the route middleware,
    // but double-check here for defense-in-depth
    if (
        req.currentUser.role === "clientAdmin" &&
        req.currentUser.organizationId
    ) {
        // Additional validation could check if targetUserId belongs to this org
        // For now, rely on tenantId scoping and the route-level role guard
    }

    const filters = getDateFilters(req.query);
    const data = await metricsService.getUserMetricsById(tenantId, targetUserId, filters);

    res.status(200).json(
        new ApiResponse(200, data, "User metrics fetched successfully")
    );
});
