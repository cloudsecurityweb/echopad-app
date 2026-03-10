import { randomUUID } from "crypto";
import { getContainer } from "../config/cosmosClient.js";
import {
    createMetricsEntry,
    validateMetricsEntry,
} from "../models/transcriptionMetrics.js";

const CONTAINER_NAME = "transcriptionMetrics";

/**
 * Store a single transcription metrics document
 * @param {Object} data - Raw metrics payload
 * @returns {Promise<Object>} Created metrics document
 */
export async function recordMetrics(data) {
    const container = getContainer(CONTAINER_NAME);
    if (!container) {
        throw new Error("Cosmos DB container not available");
    }

    const id = `metric_${randomUUID()}`;
    const docData = { ...data, id };

    const validation = validateMetricsEntry(docData);
    if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
    }

    const doc = createMetricsEntry(docData);
    await container.items.create(doc);
    return doc;
}

// ===== AGGREGATION HELPERS =====================================================

/**
 * Build a WHERE clause with optional date filters
 * @param {Object} baseParams - Initial query parameters
 * @param {Object} filters - { from, to }
 * @returns {{ clause: string, params: Array }}
 */
function buildDateFilter(baseParams, filters = {}) {
    let clause = "";
    const params = [...baseParams];

    if (filters.from) {
        clause += " AND c.createdAt >= @from";
        params.push({ name: "@from", value: filters.from });
    }
    if (filters.to) {
        clause += " AND c.createdAt <= @to";
        params.push({ name: "@to", value: filters.to });
    }

    return { clause, params };
}

/**
 * Run a Cosmos SQL query and return all results
 */
async function queryAll(query, parameters) {
    const container = getContainer(CONTAINER_NAME);
    if (!container) {
        throw new Error("Cosmos DB container not available");
    }
    const { resources } = await container.items
        .query({ query, parameters })
        .fetchAll();
    return resources;
}

// ===== USER METRICS ============================================================

/**
 * Get aggregated metrics for a single user
 * @param {string} tenantId
 * @param {string} userId
 * @param {Object} filters - { from, to }
 */
export async function getUserMetrics(tenantId, userId, filters = {}) {
    const baseParams = [
        { name: "@tenantId", value: tenantId },
        { name: "@userId", value: userId },
    ];
    const { clause, params } = buildDateFilter(baseParams, filters);

    // Summary aggregation
    const summaryQuery = `
    SELECT
      COUNT(1) AS totalTranscriptions,
      SUM(c.audioDurationMinutes) AS totalMinutesTranscribed,
      SUM(c.wordCount) AS totalWordsTranscribed,
      AVG(c.processingTimeSeconds) AS averageProcessingTime,
      AVG(c.wordCount) AS averageWordsPerTranscription
    FROM c
    WHERE c.tenantId = @tenantId AND c.userId = @userId AND c.status = 'SUCCESS'${clause}
  `;
    const [summary] = await queryAll(summaryQuery, params);

    // Last 7 days daily breakdown
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const last7Params = [
        ...baseParams,
        { name: "@last7", value: sevenDaysAgo.toISOString() },
    ];
    const last7Query = `
    SELECT
      SUBSTRING(c.createdAt, 0, 10) AS day,
      COUNT(1) AS count,
      SUM(c.audioDurationMinutes) AS minutes
    FROM c
    WHERE c.tenantId = @tenantId AND c.userId = @userId AND c.status = 'SUCCESS'
      AND c.createdAt >= @last7
    GROUP BY SUBSTRING(c.createdAt, 0, 10)
  `;
    const last7Days = await queryAll(last7Query, last7Params);

    // Last 30 days daily breakdown
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const last30Params = [
        ...baseParams,
        { name: "@last30", value: thirtyDaysAgo.toISOString() },
    ];
    const last30Query = `
    SELECT
      SUBSTRING(c.createdAt, 0, 10) AS day,
      COUNT(1) AS count,
      SUM(c.audioDurationMinutes) AS minutes
    FROM c
    WHERE c.tenantId = @tenantId AND c.userId = @userId AND c.status = 'SUCCESS'
      AND c.createdAt >= @last30
    GROUP BY SUBSTRING(c.createdAt, 0, 10)
  `;
    const last30Days = await queryAll(last30Query, last30Params);

    return {
        summary: {
            totalTranscriptions: summary?.totalTranscriptions || 0,
            totalMinutesTranscribed: Math.round((summary?.totalMinutesTranscribed || 0) * 100) / 100,
            totalWordsTranscribed: summary?.totalWordsTranscribed || 0,
            averageProcessingTime: Math.round((summary?.averageProcessingTime || 0) * 100) / 100,
            averageWordsPerTranscription: Math.round(summary?.averageWordsPerTranscription || 0),
        },
        trends: {
            last7Days,
            last30Days,
        },
    };
}

// ===== CLIENT METRICS ==========================================================

/**
 * Get aggregated metrics for all users in an organization
 * @param {string} tenantId
 * @param {string} clientId - Organization ID
 * @param {Object} filters - { from, to }
 */
export async function getClientMetrics(tenantId, clientId, filters = {}) {
    const baseParams = [
        { name: "@tenantId", value: tenantId },
        { name: "@clientId", value: clientId },
    ];
    const { clause, params } = buildDateFilter(baseParams, filters);

    // Overall summary
    const summaryQuery = `
    SELECT
      COUNT(1) AS totalTranscriptions,
      SUM(c.audioDurationMinutes) AS totalMinutesTranscribed,
      SUM(c.wordCount) AS totalWordsTranscribed,
      AVG(c.processingTimeSeconds) AS averageProcessingTime,
      AVG(c.wordCount) AS averageWordsPerTranscription
    FROM c
    WHERE c.tenantId = @tenantId AND c.clientId = @clientId AND c.status = 'SUCCESS'${clause}
  `;
    const [summary] = await queryAll(summaryQuery, params);

    // Breakdown per user
    const perUserQuery = `
    SELECT
      c.userId,
      COUNT(1) AS totalTranscriptions,
      SUM(c.audioDurationMinutes) AS totalMinutes,
      SUM(c.wordCount) AS totalWords
    FROM c
    WHERE c.tenantId = @tenantId AND c.clientId = @clientId AND c.status = 'SUCCESS'${clause}
    GROUP BY c.userId
  `;
    const breakdownByUser = await queryAll(perUserQuery, params);

    // Breakdown per day
    const perDayQuery = `
    SELECT
      SUBSTRING(c.createdAt, 0, 10) AS day,
      COUNT(1) AS count,
      SUM(c.audioDurationMinutes) AS minutes
    FROM c
    WHERE c.tenantId = @tenantId AND c.clientId = @clientId AND c.status = 'SUCCESS'${clause}
    GROUP BY SUBSTRING(c.createdAt, 0, 10)
  `;
    const breakdownByDay = await queryAll(perDayQuery, params);

    // Breakdown per model
    const perModelQuery = `
    SELECT
      c.modelUsed,
      COUNT(1) AS count,
      SUM(c.audioDurationMinutes) AS minutes
    FROM c
    WHERE c.tenantId = @tenantId AND c.clientId = @clientId AND c.status = 'SUCCESS'${clause}
    GROUP BY c.modelUsed
  `;
    const breakdownByModel = await queryAll(perModelQuery, params);

  return {
    summary: {
      totalTranscriptions: summary?.totalTranscriptions || 0,
      totalMinutesTranscribed: Math.round((summary?.totalMinutesTranscribed || 0) * 100) / 100,
      totalWordsTranscribed: summary?.totalWordsTranscribed || 0,
      averageProcessingTime: Math.round((summary?.averageProcessingTime || 0) * 100) / 100,
      averageWordsPerTranscription: Math.round(summary?.averageWordsPerTranscription || 0),
    },
    breakdown: {
      byUser: breakdownByUser,
      byDay: breakdownByDay,
      byModel: breakdownByModel,
    },
  };
}

// ===== PLATFORM METRICS ========================================================

/**
 * Get global platform metrics (super admin)
 * @param {string} tenantId
 * @param {Object} filters - { from, to }
 */
export async function getPlatformMetrics(tenantId, filters = {}) {
  const baseParams = [];
  const { clause, params } = buildDateFilter(baseParams, filters);

    // Overall totals
    const summaryQuery = `
    SELECT
      COUNT(1) AS totalTranscriptions,
      SUM(c.audioDurationMinutes) AS totalMinutesTranscribed,
      SUM(c.wordCount) AS totalWordsTranscribed,
      AVG(c.processingTimeSeconds) AS averageProcessingTime,
      AVG(c.wordCount) AS averageWordsPerTranscription
    FROM c
    WHERE c.status = 'SUCCESS'${clause}
  `;
    const [summary] = await queryAll(summaryQuery, params);

    // Active users (distinct userId)
    const activeUsersQuery = `
    SELECT DISTINCT VALUE c.userId
    FROM c
    WHERE c.status = 'SUCCESS'${clause}
  `;
    const activeUserIds = await queryAll(activeUsersQuery, params);

    // Top clients by transcription count
    const topClientsQuery = `
    SELECT
      c.clientId,
      COUNT(1) AS totalTranscriptions,
      SUM(c.audioDurationMinutes) AS totalMinutes
    FROM c
    WHERE c.status = 'SUCCESS'${clause}
    GROUP BY c.clientId
  `;
    const topClients = await queryAll(topClientsQuery, params);
    // Sort descending by totalTranscriptions
    topClients.sort((a, b) => (b.totalTranscriptions || 0) - (a.totalTranscriptions || 0));

    // Daily growth trend (last 30 days)
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const trendParams = [
        ...baseParams,
        { name: "@trendFrom", value: thirtyDaysAgo.toISOString() },
    ];
    const trendQuery = `
    SELECT
      SUBSTRING(c.createdAt, 0, 10) AS day,
      COUNT(1) AS count,
      SUM(c.audioDurationMinutes) AS minutes
    FROM c
    WHERE c.status = 'SUCCESS'
      AND c.createdAt >= @trendFrom
    GROUP BY SUBSTRING(c.createdAt, 0, 10)
  `;
    const growthTrend = await queryAll(trendQuery, trendParams);

    // Usage per model
    const perModelQuery = `
    SELECT
      c.modelUsed,
      COUNT(1) AS count,
      SUM(c.audioDurationMinutes) AS minutes
    FROM c
    WHERE c.status = 'SUCCESS'${clause}
    GROUP BY c.modelUsed
  `;
    const usageByModel = await queryAll(perModelQuery, params);

  return {
    summary: {
      totalTranscriptions: summary?.totalTranscriptions || 0,
      totalMinutesTranscribed: Math.round((summary?.totalMinutesTranscribed || 0) * 100) / 100,
      totalWordsTranscribed: summary?.totalWordsTranscribed || 0,
      averageProcessingTime: Math.round((summary?.averageProcessingTime || 0) * 100) / 100,
      averageWordsPerTranscription: Math.round(summary?.averageWordsPerTranscription || 0),
      activeUsers: activeUserIds.length,
    },
    breakdown: {
      topClients: topClients.slice(0, 20),
      byModel: usageByModel,
    },
    trends: {
      daily: growthTrend,
    },
  };
}

// ===== ADMIN USER LOOKUP =======================================================

/**
 * Get metrics for a specific user (admin endpoint)
 * @param {string} tenantId
 * @param {string} userId
 * @param {Object} filters - { from, to }
 */
export async function getUserMetricsById(tenantId, userId, filters = {}) {
    return getUserMetrics(tenantId, userId, filters);
}
