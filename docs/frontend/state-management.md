# 🧠 State Management

The Echopad frontend manages state through **React Contexts** and **custom hooks**. There is no external state library (no Redux, Zustand, etc.) — state flows through the component tree via context providers.

---

## Contexts

### `AuthContext`

**File:** `src/contexts/AuthContext.jsx`

Manages all authentication state. See [Authentication](./authentication.md) for details.

| Value | Type | Description |
|-------|------|-------------|
| `isAuthenticated` | `boolean` | Whether the user is logged in |
| `isLoading` | `boolean` | Whether auth state is being determined |
| `userProfile` | `object` | User data returned from backend |
| `accessToken` | `string` | Current access token |
| `authProvider` | `string` | Auth provider (`'microsoft'`, `'google'`, `'email-password'`, `'magic'`) |
| `tokenRoles` | `string[]` | Entra ID app roles |
| `userOID` | `string` | Azure AD Object ID |
| `signIn` | `function` | Initiate sign-in |
| `signUp` | `function` | Initiate registration |
| `signOut` | `function` | Log out |

**Hook:** `useAuth()`

---

### `RoleContext`

**File:** `src/contexts/RoleContext.jsx`

Derives the user's role from auth state and exposes role-checking helpers.

| Value | Type | Description |
|-------|------|-------------|
| `currentRole` | `string` | Current role (`'super_admin'`, `'client_admin'`, `'user_admin'`) |
| `isLoadingRole` | `boolean` | Whether role is still being determined |
| `isSuperAdmin` | `boolean` | True if user is SuperAdmin |
| `isClientAdmin` | `boolean` | True if user is ClientAdmin |
| `isUserAdmin` | `boolean` | True if user is UserAdmin |

**Hook:** `useRole()`

#### Role Constants

```javascript
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  CLIENT_ADMIN: 'client_admin',
  USER_ADMIN: 'user_admin',
};
```

#### Role Priority

1. **Token roles** (Entra ID) — highest priority
2. **Backend profile role** — database source of truth
3. **Email domain** (`@cloudsecurityweb.com` → SuperAdmin)
4. **Default** → `client_admin`

> **⚠️ Note:** `isLoadingRole` stays `true` until a reliable role source is found. This prevents flash-of-wrong-content (e.g., showing ClientAdmin menu to a SuperAdmin during initial load).

---

## Custom Hooks Reference

All hooks are in `src/hooks/`. They encapsulate data fetching, state, and side effects.

### Data Fetching Hooks

| Hook | File | Description |
|------|------|-------------|
| `useUserProfile` | `useUserProfile.js` | Fetches and manages current user profile |
| `useUsers` | `useUsers.js` | Fetches user list for an organization |
| `useOrganization` | `useOrganization.js` | Fetches organization details |
| `useProducts` | `useProducts.js` | Fetches product catalog |
| `useOrgProducts` | `useOrgProducts.js` | Fetches products assigned to an org |
| `useLicenses` | `useLicenses.js` | Fetches license list |
| `useOrgLicenses` | `useOrgLicenses.js` | Fetches licenses for an org |
| `useUserLicenses` | `useUserLicenses.js` | Fetches licenses assigned to a user |
| `useTranscriptionHistory` | `useTranscriptionHistory.js` | Fetches transcription history |
| `useHelpCenterDocs` | `useHelpCenterDocs.js` | Fetches help center document list |
| `useHelpCenterDoc` | `useHelpCenterDoc.js` | Fetches a single help document |
| `useProductUsage` | `useProductUsage.js` | Fetches product usage data |

### Metrics Hooks

| Hook | File | Description |
|------|------|-------------|
| `useUserMetrics` | `useUserMetrics.js` | User-level transcription metrics |
| `useClientMetrics` | `useClientMetrics.js` | Client-level metrics |
| `usePlatformMetrics` | `usePlatformMetrics.js` | Platform-wide metrics (SuperAdmin) |
| `useSuperAdminAnalytics` | `useSuperAdminAnalytics.js` | Super admin analytics data |
| `useAnalyticsClientAdmin` | `useAnalyticsClientAdmin.js` | Client admin analytics |
| `useDashboard` | `useDashboard.js` | Dashboard summary data |

### Utility Hooks

| Hook | File | Description |
|------|------|-------------|
| `useOID` | `useOID.js` | Resolves user OID from various auth providers |
| `useAnimation` | `useAnimation.js` | Scroll-triggered animations |
| `useAudioRecorder` | `useAudioRecorder.js` | Browser audio recording |
| `usePageTitle` | `usePageTitle.jsx` | Dynamic page title management |
| `useScript` | `useScript.js` | Dynamic script loading |

---

## Data Flow Pattern

```
Component
    │
    └── useSomeHook()                      ← Custom hook
          │
          ├── useState / useEffect           ← Local state
          │
          └── someApi.fetchData()            ← API call
                │
                └── http.get('/api/...')      ← Axios
                      │
                      └── interceptor adds Bearer token
                            │
                            └── Backend API
```

### Example

```javascript
// In a component:
import { useUserMetrics } from '../hooks/useUserMetrics';

function MetricsCard() {
  const { metrics, loading, error } = useUserMetrics();

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage />;
  return <MetricsDisplay data={metrics} />;
}
```

---

## Related Pages

- [Authentication](./authentication.md) — AuthContext details
- [API Layer](./api-layer.md) — How API calls work
- [Components](./components.md) — Components that consume these hooks
