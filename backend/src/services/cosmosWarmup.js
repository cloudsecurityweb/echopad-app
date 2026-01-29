/**
 * Cosmos DB Warmup Service
 * 
 * Keeps Cosmos DB serverless account warm by sending periodic lightweight requests
 * This prevents cold starts that can take 30-60+ seconds
 */

import { getDatabase, getContainer, isConfigured } from '../config/cosmosClient.js';

let warmupInterval = null;
let isWarmingUp = false;

/**
 * Perform a lightweight warmup operation
 * Reads the database metadata (very fast, no data transfer)
 */
async function performWarmup() {
  if (!isConfigured() || isWarmingUp) {
    return;
  }

  try {
    isWarmingUp = true;
    const db = getDatabase();
    if (db) {
      // Read database metadata - this is very lightweight and keeps connection warm
      await db.read();
    }
  } catch (error) {
    // Silently fail - warmup is best effort
    console.debug('Warmup operation failed (non-critical):', error.message);
  } finally {
    isWarmingUp = false;
  }
}

/**
 * Start periodic warmup to keep Cosmos DB warm
 * Runs every 5 minutes to prevent cold starts
 */
export function startWarmup(intervalMinutes = 5) {
  if (warmupInterval) {
    console.log('⚠️  Warmup already running');
    return;
  }

  if (!isConfigured()) {
    console.log('⚠️  Cosmos DB not configured, skipping warmup');
    return;
  }

  const intervalMs = intervalMinutes * 60 * 1000;
  
  console.log(`🔥 Starting Cosmos DB warmup (every ${intervalMinutes} minutes)`);
  
  // Perform initial warmup
  performWarmup();
  
  // Set up periodic warmup
  warmupInterval = setInterval(() => {
    performWarmup();
  }, intervalMs);
}

/**
 * Stop the warmup interval
 */
export function stopWarmup() {
  if (warmupInterval) {
    clearInterval(warmupInterval);
    warmupInterval = null;
    console.log('🛑 Stopped Cosmos DB warmup');
  }
}

/**
 * Perform an immediate warmup (useful before important operations)
 */
export async function warmupNow() {
  await performWarmup();
}
