# 🧩 Components Reference

This page provides an overview of all component groups in the Echopad frontend. Components are organized by feature domain under `src/components/`.

---

## Component Groups

### `layout/` — App Layout

Structural components that define the overall page layout.

| Component | Description |
|-----------|-------------|
| `Navigation` | Top navigation bar (public pages) |
| `Footer` | Site footer |
| `DashboardLayout` | Dashboard shell (sidebar + header + content area) |
| `DashboardSidebar` | Role-based sidebar navigation |
| `DashboardHeader` | Dashboard top bar with user menu |

---

### `auth/` — Authentication Guards

Components that control access to protected content.

| Component | Description |
|-----------|-------------|
| `ProtectedRoute` | Redirects unauthenticated users to sign-in |
| `RoleGate` | Conditionally renders based on user role |

---

### `sections/` — Homepage Sections

Marketing sections displayed on the landing page.

| Component | Description |
|-----------|-------------|
| `Hero` | Hero banner with headline and CTA |
| `TrustBar` | Logo bar of trusted organizations |
| `AgentsOverview` | Overview of AI agent products |
| `Platform` | Platform features section |
| `ROI` | Return on investment calculator/stats |
| `Contact` | Contact form section |

---

### `products/` — Product Display

Components for showcasing the AI product catalog.

| Component | Description |
|-----------|-------------|
| `ProductDetails` | Detailed product information view |
| `ProductCard` | Card display for a single product |
| `ProductGrid` | Grid layout for multiple product cards |

---

### `ui/` — Generic UI Components

Reusable UI building blocks used across the app.

| Component | Description |
|-----------|-------------|
| `ErrorBoundary` | Catches React errors, shows fallback |
| `CookieConsent` | GDPR cookie consent banner |
| `Loader` / `Spinner` | Loading indicators |
| `Modal` | Modal dialog |
| `Toast` | Notification toast (via React Toastify) |

---

### `analytics/` — Analytics Display

Components for rendering analytics data and charts.

| Component | Description |
|-----------|-------------|
| `MetricsCard` | Displays a single metric with label and value |

---

### `subscription/` — Subscription Management

Components for managing subscriptions and billing.

| Component | Description |
|-----------|-------------|
| `SubscriptionCard` | Displays subscription details |
| `PlanSelector` | Plan selection UI |
| `BillingInfo` | Billing information display |

---

### `transcription/` — Transcription Features

Components related to the AI Scribe transcription feature.

| Component | Description |
|-----------|-------------|
| `TranscriptionHistory` | List of past transcriptions |
| `TranscriptionPlayer` | Audio playback with transcript |

---

### `users/` — User Management

Components for managing users within an organization.

| Component | Description |
|-----------|-------------|
| `UserTable` | Tabular list of users |
| `UserForm` | Create/edit user form |
| `InviteUserModal` | Modal for sending user invitations |

---

### `clients/` — Client Management

Components for SuperAdmin client (organization) management.

| Component | Description |
|-----------|-------------|
| `ClientTable` | List of client organizations |
| `ClientCard` | Card view of a client |

---

### `help/` — Help Center

Components for the integrated help center.

| Component | Description |
|-----------|-------------|
| `HelpDocList` | List of help articles |
| `HelpDocViewer` | Help article content viewer |

---

### `settings/` — Settings

Components for user and app settings.

| Component | Description |
|-----------|-------------|
| `SettingsForm` | Settings form with save |
| `ProfileSettings` | Profile editing section |

---

### `store/` — Store Components

Components related to the product store.

| Component | Description |
|-----------|-------------|
| `StoreGrid` | Product store grid layout |
| `StoreBanner` | Store promotional banner |

---

## Component Conventions

### File Naming

- PascalCase for component files: `ProductCard.jsx`
- Group by feature: `components/products/ProductCard.jsx`
- One component per file (unless tightly coupled)

### Component Structure

```jsx
import { useState } from 'react';
import { useRole } from '../../contexts/RoleContext';

/**
 * ComponentName - Brief description
 * @param {Object} props
 * @param {string} props.title - The card title
 */
export default function ComponentName({ title, children }) {
  const { isSuperAdmin } = useRole();

  return (
    <div className="rounded-lg bg-white shadow p-6">
      <h3>{title}</h3>
      {children}
    </div>
  );
}
```

---

## Adding a New Component

1. Create a new folder under `src/components/` for the feature (or add to an existing one)
2. Create the component file with PascalCase naming
3. Use Tailwind classes for styling
4. Import and use in your page component
5. Update this documentation

---

## Related Pages

- [Architecture](./architecture.md) — Component hierarchy
- [Routing](./routing.md) — Pages that use these components
- [State Management](./state-management.md) — Hooks used by components
