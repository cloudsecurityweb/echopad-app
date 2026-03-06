# 🌐 API Layer

This page documents the frontend's HTTP client, API modules, and how requests are authenticated.

---

## HTTP Client

**File:** `src/api/http.js`

A pre-configured **Axios** instance that all API modules use:

```javascript
import axios from 'axios';
import { authRef } from './auth';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use(async (config) => {
  const token = await authRef.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Key Features

- **Base URL** from `VITE_API_BASE_URL` (defaults to `http://localhost:3000`)
- **Automatic Bearer token** injection via request interceptor
- All API modules import and use this shared instance

---

## Auth Reference

**File:** `src/api/auth.js`

The `authRef` object provides a way for the HTTP client to access the current auth token without importing `AuthContext` (which would cause circular dependencies):

```javascript
export const authRef = {
  getAccessToken: () => null,  // Overridden by AuthProvider at runtime
};
```

The `AuthProvider` sets `authRef.getAccessToken` to a function that returns the current token (MSAL, Google, or stored JWT).

---

## API Modules

All API modules are in `src/api/` and export functions that call the backend.

| Module | File | Endpoints |
|--------|------|-----------|
| **Analytics** | `analytics.api.js` | Super admin analytics |
| **Auth** | `auth.js` | Auth reference (token provider) |
| **Client Feedback** | `clientFeedback.api.js` | Submit and list feedback |
| **Clients** | `clients.api.js` | Client management |
| **Dashboard** | `dashboard.api.js` | Dashboard metrics |
| **Downloads** | `downloads.api.js` | AI Scribe installer downloads |
| **Help Center** | `helpCenter.api.js` | Help docs CRUD |
| **Intercom** | `intercom.api.js` | Identity verification |
| **Licenses** | `licenses.api.js` | License management |
| **Metrics** | `metrics.api.js` | Transcription metrics |
| **Organizations** | `organizations.api.js` | Organization management |
| **Products** | `products.api.js` | Product catalog |
| **Transcription History** | `transcriptionHistory.api.js` | Transcription records |
| **User Products** | `userProduct.api.js` | User product access |
| **Users** | `users.api.js` | User management |

---

## Usage Pattern

API modules export simple functions that return Axios promises:

```javascript
// src/api/metrics.api.js
import http from './http';

export const getUserMetrics = (tenantId, userId) =>
  http.get(`/api/metrics/user?tenantId=${tenantId}&userId=${userId}`);

export const getClientMetrics = (tenantId) =>
  http.get(`/api/metrics/client?tenantId=${tenantId}`);

export const getPlatformMetrics = () =>
  http.get('/api/metrics/platform');
```

### Consumed by Hooks

```javascript
// src/hooks/useUserMetrics.js
import { getUserMetrics } from '../api/metrics.api';

export function useUserMetrics() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    getUserMetrics(tenantId, userId)
      .then(res => setMetrics(res.data))
      .catch(err => console.error(err));
  }, [tenantId, userId]);

  return { metrics };
}
```

---

## Error Handling

API errors are generally handled at the hook or component level:

```javascript
try {
  const response = await someApi.action();
  // Handle success
} catch (error) {
  if (error.response?.status === 401) {
    // Token expired — redirect to sign-in
  } else {
    toast.error('Something went wrong');
  }
}
```

---

## Adding a New API Module

1. Create `src/api/yourFeature.api.js`
2. Import the shared HTTP client:
   ```javascript
   import http from './http';
   ```
3. Export functions for each endpoint:
   ```javascript
   export const getItems = () => http.get('/api/your-feature');
   export const createItem = (data) => http.post('/api/your-feature', data);
   ```
4. Create a hook in `src/hooks/useYourFeature.js` that calls the API module
5. Update this documentation

---

## Related Pages

- [Authentication](./authentication.md) — How `authRef` works
- [State Management](./state-management.md) — Hooks that consume APIs
- [Backend API Reference](../backend/api-reference.md) — Server-side endpoints
