# 🗺 Frontend Routing

This page documents all routes in the Echopad frontend, organized by access level.

---

## Route Map

### Public Pages

These routes are accessible to everyone (no authentication required).

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `HomePage` | Marketing landing page |
| `/ai-scribe` | `AIScribe` | AI Scribe product page |
| `/ai-docman` | `AIDocMan` | AI DocMan product page |
| `/ai-medical-assistant` | `AIMedicalAssistant` | AI Medical Assistant product page |
| `/ai-receptionist` | `AIReceptionist` | AI Receptionist product page |
| `/ai-admin-assistant` | `AIAdminAssistant` | AI Admin Assistant product page |
| `/ai-reminders` | `AIReminders` | AI Reminders product page |
| `/echopad-insights` | `EchoPadInsights` | EchoPad Insights product page |
| `/aperio` | `Aperio` | Aperio product page |
| `/privacy-policy` | `PrivacyPolicy` | Privacy policy |
| `/terms-of-service` | `TermsOfService` | Terms of service |

### Authentication Pages

| Path | Component | Description |
|------|-----------|-------------|
| `/sign-in` | `SignIn` | Sign-in page (Microsoft, Google, Email, Magic) |
| `/sign-up` | `SignUp` | Registration page |
| `/login-complete` | `LoginComplete` | Post-login callback handler |
| `/verify-email` | `VerifyEmail` | Email verification handler |
| `/verify-email-sent` | `VerifyEmailSent` | "Check your email" confirmation |
| `/resend-verification` | `ResendVerification` | Resend verification email |
| `/forgot-password` | `ForgotPassword` | Password reset request |
| `/reset-password` | `ResetPassword` | Password reset form |
| `/accept-invitation` | `AcceptInvitation` | Accept org invitation |

### Protected Dashboard (Nested)

All `/dashboard/*` routes are wrapped in `<ProtectedRoute>` and use the `<DashboardLayout>` shell.

| Path | Component | Description | Roles |
|------|-----------|-------------|-------|
| `/dashboard` | `Dashboard` | Main dashboard (role-specific view) | All |
| `/dashboard/profile` | `Profile` | User profile | All |
| `/dashboard/client-admin` | `Profile` | Client admin profile view | ClientAdmin |
| `/dashboard/productsowned` | `ProductsOwned` | User's owned products | All |
| `/dashboard/product/download/ai-scribe` | `EchopadAIScribeDownload` | AI Scribe desktop download | All |
| `/dashboard/products` | `Products` | Product catalog | All |
| `/dashboard/clients` | `SuperAdminClients` | Client management | SuperAdmin |
| `/dashboard/clients/:id` | `ClientDetail` | Client detail view | SuperAdmin |
| `/dashboard/clients/client/:tenantId/:id` | `ClientManagementPage` | Client management page | SuperAdmin |
| `/dashboard/subscriptions` | `Subscriptions` | Subscription management | ClientAdmin |
| `/dashboard/licenses` | `Licenses` | License management | ClientAdmin+ |
| `/dashboard/license-requests` | `LicenseRequests` | License requests | SuperAdmin |
| `/dashboard/billing` | `Billing` | Billing overview | ClientAdmin |
| `/dashboard/help` | `HelpCenter` | Help center | All |
| `/dashboard/help/:docId` | `HelpDocDetail` | Help article detail | All |
| `/dashboard/users` | `Users` | User management | ClientAdmin+ |
| `/dashboard/activity` | `Activity` | Activity log | ClientAdmin+ |
| `/dashboard/analytics` | `Analytics` | Analytics & metrics | All |
| `/dashboard/settings` | `Settings` | Account settings | All |
| `/dashboard/client-feedback` | `ClientFeedback` | Feedback management | ClientAdmin+ |

### Catch-All

| Path | Component | Description |
|------|-----------|-------------|
| `*` | `NotFound` | 404 page |

---

## Route Guards

### `ProtectedRoute`

**File:** `src/components/auth/ProtectedRoute.jsx`

Wraps the dashboard routes. If the user is not authenticated, they are redirected to the sign-in page.

```jsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  }
>
  {/* Nested routes */}
</Route>
```

### Role-Based Dashboard

The `Dashboard` component (at `/dashboard`) renders a different dashboard based on the user's role:

| Role | Component | Description |
|------|-----------|-------------|
| SuperAdmin | `SuperAdminDashboard` | Platform-wide overview |
| ClientAdmin | `ClientAdminDashboard` | Organization overview |
| UserAdmin | `UserAdminDashboard` | Personal usage dashboard |

---

## Navigation

### Homepage Navigation

The homepage uses hash-based navigation to scroll to sections:

| Hash | Section |
|------|---------|
| `#agents` | AgentsOverview section |
| `#platform` | Platform section |
| `#roi` | ROI section |
| `#contact` | Contact section |

### Dashboard Sidebar

The `DashboardLayout` component provides a sidebar navigation that changes based on the user's role. Menu items are conditionally rendered:

- **SuperAdmin** sees: Dashboard, Clients, Products, Licenses, Analytics, Help, Settings
- **ClientAdmin** sees: Dashboard, Profile, Products, Users, Subscriptions, Licenses, Analytics, Help, Settings
- **UserAdmin** sees: Dashboard, Profile, Products Owned, Analytics, Help, Settings

---

## Scroll Behavior

- `ScrollToTop` component resets scroll position on route changes
- Homepage supports hash-based smooth scrolling to sections
- `headerOffset` of 80px accounts for the fixed navigation bar

---

## Adding a New Route

1. Create a page component in `src/pages/your-feature/YourFeature.jsx`
2. Import it in `src/App.jsx`
3. Add the `<Route>` element in the appropriate section:
   - Public: alongside other public routes
   - Protected: inside the `/dashboard` route group
4. If it needs sidebar navigation, update `DashboardLayout`
5. Update this documentation

---

## Related Pages

- [Architecture](./architecture.md) — Provider tree and component hierarchy
- [Authentication](./authentication.md) — How ProtectedRoute works
- [Components](./components.md) — Layout components reference
