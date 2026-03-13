# 🏗 Frontend Architecture

This page describes the high-level architecture of the Echopad frontend, including folder organization, the provider/component hierarchy, and styling approach.

---

## Folder Structure

```
frontend/src/
├── main.jsx               # App entry point (MSAL init, React root)
├── App.jsx                # Root component, provider tree, router
├── index.css              # Global styles & Tailwind imports
│
├── api/                   # HTTP client & API modules
│   ├── http.js            # Axios instance with auth interceptor
│   ├── auth.js            # Auth reference (token provider)
│   └── *.api.js           # Feature-specific API modules
│
├── components/            # Reusable UI components
│   ├── analytics/         # Analytics display components
│   ├── auth/              # Auth guards (ProtectedRoute)
│   ├── clients/           # Client management components
│   ├── help/              # Help center components
│   ├── layout/            # Navigation, Footer, DashboardLayout
│   ├── products/          # Product display components
│   ├── sections/          # Homepage sections (Hero, ROI, etc.)
│   ├── settings/          # Settings components
│   ├── store/             # Store-related components
│   ├── subscription/      # Subscription management
│   ├── transcription/     # Transcription UI components
│   ├── ui/                # Generic UI (ErrorBoundary, CookieConsent)
│   └── users/             # User management components
│
├── config/                # App configuration
│   ├── authConfig.js      # MSAL configuration
│   ├── googleAuthConfig.js# Google OAuth configuration
│   └── featureFlags.js    # Feature toggles
│
├── contexts/              # React Contexts
│   ├── AuthContext.jsx     # Authentication state & methods
│   └── RoleContext.jsx     # Role-based access control
│
├── data/                  # Static data
│   ├── products.js        # Product catalog definitions
│   └── transcripts.js     # Sample transcript data
│
├── hooks/                 # Custom React hooks (23 hooks)
│   └── use*.js            # Feature-specific hooks
│
├── pages/                 # Page-level components
│   ├── auth/              # Sign In, Sign Up, Verify, etc.
│   ├── dashboard/         # Dashboard pages (nested routes)
│   ├── ai-scribe/         # AI Scribe product page
│   ├── ai-docman/         # AI DocMan product page
│   ├── aperio/            # Aperio product page
│   └── ...                # Other product/static pages
│
├── utils/                 # Utility functions (16 files)
│   ├── analytics.js       # Google Analytics
│   ├── intercom.js        # Intercom integration
│   ├── tokenDecoder.js    # JWT token parsing
│   └── ...                # Other utilities
│
└── assets/                # Static assets (images, etc.)
```

---

## Provider Tree

The entire app is wrapped in nested providers in `App.jsx`:

```
<ErrorBoundary>
  <GoogleOAuthProvider>
    <MsalProvider>
      <AuthProvider>           ← Authentication state
        <RoleProvider>         ← Role-based access
          <BrowserRouter>      ← Routing
            <Routes />
            <IntercomBootstrap />
            <CookieConsent />
            <ToastContainer />
          </BrowserRouter>
        </RoleProvider>
      </AuthProvider>
    </MsalProvider>
  </GoogleOAuthProvider>
</ErrorBoundary>
```

### Provider Responsibilities

| Provider | Purpose |
|----------|---------|
| `ErrorBoundary` | Catches React render errors, shows fallback UI |
| `GoogleOAuthProvider` | Provides Google OAuth context |
| `MsalProvider` | Provides Microsoft MSAL authentication context |
| `AuthProvider` | Manages auth state, token refresh, user profile |
| `RoleProvider` | Derives user role, provides `isSuperAdmin`, `isClientAdmin`, `isUserAdmin` |
| `BrowserRouter` | Client-side routing |

---

## Styling

The project uses **Tailwind CSS 4** with the Vite plugin:

```javascript
// vite.config.js
import tailwindcss from '@tailwindcss/vite';

export default {
  plugins: [react(), tailwindcss()],
};
```

- Global styles are in `src/index.css`
- Component styles use Tailwind utility classes inline
- No CSS modules or styled-components

---

## Key Patterns

### Component Organization

- **Pages** (`src/pages/`) are top-level route components — they compose smaller components
- **Components** (`src/components/`) are reusable building blocks — organized by feature domain
- **Layout components** (`components/layout/`) provide shared structure (Navigation, Footer, DashboardLayout)

### Data Fetching

Data is fetched using **custom hooks** that wrap API calls:

```
Page Component
    └── useHookName()           ← Custom hook
          └── apiModule.method()  ← API module
                └── http.get()     ← Axios instance
                      └── Bearer token injected via interceptor
```

### Role-Based Rendering

Components conditionally render based on user role:

```jsx
import { useRole } from '../contexts/RoleContext';

function Dashboard() {
  const { isSuperAdmin, isClientAdmin, isUserAdmin } = useRole();

  if (isSuperAdmin) return <SuperAdminDashboard />;
  if (isClientAdmin) return <ClientAdminDashboard />;
  return <UserAdminDashboard />;
}
```

---

## Build & Bundle

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Serve the `dist/` build locally |

The production build creates static files in `dist/` which are deployed to Azure Static Web Apps.

---

## Related Pages

- [Routing](./routing.md) — All routes and guards
- [Authentication](./authentication.md) — Auth flow details
- [State Management](./state-management.md) — Contexts and hooks
- [Components](./components.md) — Component reference
