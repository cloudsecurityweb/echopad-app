/**
 * Utility functions for transcription history
 */

/**
 * Format duration in seconds to MM:SS format
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration (e.g., "05:23" or "1:23:45" for hours)
 */
export function formatDuration(seconds) {
  if (!seconds || seconds < 0) return '0:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format ISO date string to readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date (e.g., "Dec 15, 2024 at 3:45 PM")
 */
export function formatDate(dateString) {
  if (!dateString) return 'Unknown date';
  
  try {
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    return date.toLocaleString('en-US', options);
  } catch (error) {
    return 'Invalid date';
  }
}

/**
 * Format date to relative time (e.g., "2 hours ago", "3 days ago")
 * @param {string} dateString - ISO date string
 * @returns {string} Relative time string
 */
export function formatRelativeTime(dateString) {
  if (!dateString) return 'Unknown';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
    if (diffInSeconds < 2592000) {
      const weeks = Math.floor(diffInSeconds / 604800);
      return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
    }
    
    // For older dates, return formatted date
    return formatDate(dateString);
  } catch (error) {
    return 'Unknown';
  }
}

/**
 * Download transcription text as a .txt file
 * @param {string} text - Transcription text content
 * @param {string} filename - Optional filename (without extension)
 */
export function downloadTranscription(text, filename = null) {
  if (!text) {
    console.error('No text provided for download');
    return;
  }
  
  // Generate filename if not provided
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 19).replace(/:/g, '-');
  const finalFilename = filename || `transcription-${dateStr}`;
  
  // Create blob and download
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${finalFilename}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Truncate text to specified length with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength = 150) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export async function copyToClipboard(text) {
  if (!text) return false;
  
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Filter transcriptions by search query
 * @param {Array} transcriptions - Array of transcription objects
 * @param {string} query - Search query
 * @returns {Array} Filtered transcriptions
 */
export function filterBySearch(transcriptions, query) {
  if (!query || query.trim() === '') return transcriptions;
  
  const lowerQuery = query.toLowerCase();
  return transcriptions.filter(transcription => 
    transcription.text?.toLowerCase().includes(lowerQuery) ||
    transcription.id?.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Filter transcriptions by date range
 * @param {Array} transcriptions - Array of transcription objects
 * @param {string} range - Date range ('today', 'week', 'month', 'all')
 * @returns {Array} Filtered transcriptions
 */
export function filterByDateRange(transcriptions, range) {
  if (!range || range === 'all') return transcriptions;
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  let startDate;
  switch (range) {
    case 'today':
      startDate = today;
      break;
    case 'week':
      startDate = new Date(today);
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'month':
      startDate = new Date(today);
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    default:
      return transcriptions;
  }
  
  return transcriptions.filter(transcription => {
    const transcriptionDate = new Date(transcription.createdAt);
    return transcriptionDate >= startDate;
  });
}

/**
 * Filter transcriptions by status
 * @param {Array} transcriptions - Array of transcription objects
 * @param {string} status - Status filter ('all', 'completed', 'processing', 'failed')
 * @returns {Array} Filtered transcriptions
 */
export function filterByStatus(transcriptions, status) {
  if (!status || status === 'all') return transcriptions;
  return transcriptions.filter(transcription => transcription.status === status);
}

