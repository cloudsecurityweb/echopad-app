import http from './http';

/**
 * Fetch Intercom identity data (app ID + HMAC user_hash) for the
 * currently authenticated user.
 *
 * @returns {Promise<{ appId: string, userHash: string, user: { id: string, name: string, email: string } }>}
 */
export async function fetchIntercomIdentity() {
  const { data } = await http.get('/api/intercom');
  return data;
}
