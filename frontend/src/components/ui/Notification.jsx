import { useEffect } from 'react';
import { showNotification } from '../../utils/notifications';

/**
 * Notification component wrapper
 * This component can be used to show notifications from React components
 * 
 * Usage:
 * import { showNotification } from '../../utils/notifications';
 * showNotification('Success message', 'success');
 */
export default function Notification() {
  // This component is mainly for exporting the utility
  // The actual notifications are shown via the utility function
  return null;
}

// Export the utility function for convenience
export { showNotification } from '../../utils/notifications';

