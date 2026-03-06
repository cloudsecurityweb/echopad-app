# 🔐 Frontend Authentication

This page explains how authentication works in the Echopad frontend, covering the `AuthContext`, MSAL configuration, Google OAuth, and the token management pattern.

---

## Overview

The frontend supports **four authentication methods**:

| Method | Library | Config File |
|--------|---------|-------------|
| **Microsoft Entra ID** | `@azure/msal-browser` + `@azure/msal-react` | `src/config/authConfig.js` |
| **Google OAuth** | `@react-oauth/google` | `src/config/googleAuthConfig.js` |
| **Email/Password** | Direct API calls | — |
| **Magic Link** | Direct API calls | — |

---

## AuthContext

**File:** `src/contexts/AuthContext.jsx` (~1194 lines)

The `AuthProvider` is the central authentication hub. It manages:

- Current authentication state (`isAuthenticated`, `isLoading`)
- User profile from the backend (`userProfile`)
- Access token management (`accessToken`)
- Auth provider detection (`authProvider`: `'microsoft'` | `'google'` | `'email-password'` | `'magic'`)
- Token roles from Entra ID (`tokenRoles`)
- User's Object ID (`userOID`)

### Exposed via `useAuth()` Hook

```javascript
const {
  isAuthenticated,     // boolean — is user logged in?
  isLoading,           // boolean — is auth state being determined?
  userProfile,         // object — user data from backend API
  accessToken,         // string — current access token
  authProvider,        // string — which auth provider was used
  tokenRoles,          // array — Entra ID app roles
  userOID,             // string — Azure AD Object ID
  signIn,              // function — initiate sign-in
  signUp,              // function — initiate registration
  signOut,             // function — log out
} = useAuth();
```

---

## MSAL Configuration

**File:** `src/config/authConfig.js`

Configures the Microsoft Authentication Library (MSAL) for browser-based auth:

```javascript
const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_MSAL_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_MSAL_TENANT_ID}`,
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
};
```

### MSAL Initialization

In `src/main.jsx`, the MSAL instance is created and passed to `<MsalProvider>`:

```javascript
import { PublicClientApplication } from '@azure/msal-browser';
const msalInstance = new PublicClientApplication(msalConfig);
```

---

## Google OAuth Configuration

**File:** `src/config/googleAuthConfig.js`

```javascript
export const googleAuthConfig = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
};

export const googleScopes = ['email', 'profile', 'openid'];
```

The `<GoogleOAuthProvider>` wraps the entire app in `App.jsx`.

---

## Auth Token Flow

### Sign-In Flow

```
User clicks "Sign In"
    │
    ├─ Microsoft: MSAL popup/redirect → Token → POST /api/auth/sign-in
    ├─ Google: Google popup → Token → POST /api/auth/sign-in
    ├─ Email/Password: Form submit → POST /api/auth/sign-in-email
    └─ Magic Link: Email sent → User clicks → Token verified
         │
         ▼
Backend returns user profile + sets auth state
    │
    ▼
AuthContext updates → RoleContext derives role → Dashboard renders
```

### Token Injection

The `authRef` pattern (in `src/api/auth.js`) provides a way for the Axios HTTP client to get the current access token without a circular dependency:

```javascript
// src/api/auth.js
export const authRef = {
  getAccessToken: () => null,   // Overridden by AuthProvider
};

// In AuthProvider:
authRef.getAccessToken = async () => {
  // Returns MSAL token, Google token, or stored JWT
};
```

The HTTP interceptor in `src/api/http.js` calls `authRef.getAccessToken()` on every request:

```javascript
http.interceptors.request.use(async (config) => {
  const token = await authRef.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## Role Detection

After authentication, the `RoleProvider` determines the user's role. Priority order:

1. **Token roles** — Entra ID app roles (`SuperAdmin`, `ClientAdmin`, `UserAdmin`)
2. **Backend profile** — `userProfile.user.role` from the API
3. **Email domain** — `@cloudsecurityweb.com` → SuperAdmin
4. **Default** — `client_admin`

See [State Management](./state-management.md) for more on `RoleContext`.

---

## Sign-Out

```javascript
const { signOut } = useAuth();

// Clears all auth state, revokes tokens, redirects to home
signOut();
```

---

## Related Pages

- [Architecture](./architecture.md) — Provider tree structure
- [State Management](./state-management.md) — RoleContext and hooks
- [API Layer](./api-layer.md) — Token interceptor details
- [Backend Auth](../backend/authentication.md) — Server-side token verification
