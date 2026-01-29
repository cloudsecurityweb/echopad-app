/**
 * OID (Object ID) Utility Functions
 * 
 * Utilities for working with Microsoft Entra ID Object IDs (OID)
 * OID is the immutable, unique identifier for each user in Entra ID
 */

/**
 * Validate OID format (GUID format)
 * @param {string} oid - Object ID to validate
 * @returns {boolean} True if OID is in valid GUID format
 */
export function validateOID(oid) {
  if (!oid || typeof oid !== 'string') {
    return false;
  }
  
  // GUID format: 8-4-4-4-12 hexadecimal characters
  // Example: a1b2c3d4-e5f6-7890-abcd-ef1234567890
  const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return guidRegex.test(oid);
}

/**
 * Normalize OID format
 * Ensures OID is in correct format (lowercase, trimmed)
 * @param {string} oid - Object ID to normalize
 * @returns {string|null} Normalized OID or null if invalid
 */
export function normalizeOID(oid) {
  if (!oid || typeof oid !== 'string') {
    return null;
  }
  
  const trimmed = oid.trim();
  
  if (!validateOID(trimmed)) {
    return null;
  }
  
  // Return lowercase for consistency
  return trimmed.toLowerCase();
}

/**
 * Extract OID from various sources
 * @param {Object} source - Source object (token payload, user object, etc.)
 * @returns {string|null} OID or null if not found
 */
export function extractOID(source) {
  if (!source) {
    return null;
  }
  
  // Try oid first (most common in Entra ID tokens)
  if (source.oid) {
    return normalizeOID(source.oid);
  }
  
  // Try sub as fallback (some tokens use sub instead of oid)
  if (source.sub) {
    return normalizeOID(source.sub);
  }
  
  // Try id field (database user records)
  if (source.id) {
    return normalizeOID(source.id);
  }
  
  return null;
}

/**
 * Check if two OIDs are equal (case-insensitive)
 * @param {string} oid1 - First OID
 * @param {string} oid2 - Second OID
 * @returns {boolean} True if OIDs match
 */
export function oidsEqual(oid1, oid2) {
  if (!oid1 || !oid2) {
    return false;
  }
  
  const normalized1 = normalizeOID(oid1);
  const normalized2 = normalizeOID(oid2);
  
  if (!normalized1 || !normalized2) {
    return false;
  }
  
  return normalized1 === normalized2;
}

/**
 * Format OID for logging (masked for security)
 * @param {string} oid - Object ID
 * @returns {string} Masked OID for logging
 */
export function formatOIDForLogging(oid) {
  if (!oid || typeof oid !== 'string') {
    return 'invalid-oid';
  }
  
  // Show first 8 and last 4 characters, mask the rest
  if (oid.length > 12) {
    return `${oid.substring(0, 8)}...${oid.substring(oid.length - 4)}`;
  }
  
  return '***';
}
