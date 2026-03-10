# 🐛 Bugs & Resolutions Log

A comprehensive record of bugs, errors, and issues encountered during the development of Echopad — and how they were resolved. This document serves as a reference for the team to avoid repeating past mistakes and to quickly diagnose similar issues in the future.

> **Convention:** Newest entries go at the top. When you fix a significant bug, add it here.

---

## Table of Contents

- [Application Bugs](#application-bugs)
  - [Security & Data Access](#security--data-access)
  - [Authentication & Sign-In](#authentication--sign-in)
  - [API & Backend](#api--backend)
  - [Frontend & UI](#frontend--ui)
  - [Desktop App (AI Scribe)](#desktop-app-ai-scribe)
- [Infrastructure & CI/CD Bugs](#infrastructure--cicd-bugs)
  - [GitHub Actions Runner](#github-actions-runner)
  - [Azure Deployment](#azure-deployment)
- [Configuration Gotchas](#configuration-gotchas)

---

## Application Bugs

### Security & Data Access

---

#### 🔴 `getAllUsers` Endpoint Leaked Cross-Tenant Data

**Date:** ~Jan 2026  
**Severity:** Critical (Security)  
**Area:** Backend — `userController.js`

**Symptom:**  
The `GET /api/users` endpoint returned **all users across all tenants** — any authenticated user could see every other user in the system.

**Root Cause:**  
The controller used `container.items.readAll().fetchAll()` without any tenant filtering, bypassing the partition-based isolation.

```javascript
// ❌ Before (insecure)
const { resources } = await container.items.readAll().fetchAll();
```

**Resolution:**  
- Added `verifyEntraToken` authentication middleware to the route
- Changed the query to use `getUsersByTenant(tid)` which filters by `tenantId` from `req.auth.tid`
- All user queries are now scoped to the authenticated user's tenant

```javascript
// ✅ After (secure)
const users = await getUsersByTenant(req.auth.tid);
```

**Lesson:** Never use `readAll()` without a partition key / tenant filter. Every query must include `tenantId`.

---

#### 🟠 Email-Only Queries Bypass Tenant Isolation

**Date:** ~Jan 2026  
**Severity:** High (Known Limitation)  
**Area:** Backend — `emailVerificationController.js`, `passwordAuthController.js`, `invitationController.js`

**Symptom:**  
Several controllers query by email without including `tenantId`, triggering expensive cross-partition queries and potentially returning data from other tenants.

**Files Affected:**
- `emailVerificationController.js` — `SELECT * FROM c WHERE c.email = @email`
- `passwordAuthController.js` — Same pattern (commented: "searches across all tenants")
- `invitationController.js` — `SELECT * FROM c WHERE c.token = @token AND c.email = @email`

**Root Cause:**  
During email verification and password reset flows, the user hasn't authenticated yet, so there's no `tenantId` available from a token.

**Status:** Documented as a known limitation.  
**Mitigation:** Email addresses are expected to be unique across the platform. For sign-in and verification, cross-partition lookup by email is acceptable since no sensitive data is returned beyond the user's own record.

---

#### 🟠 Tenant ID Mismatch Between OAuth and Email/Password Sign-ups

**Date:** ~Jan 2026  
**Severity:** High (Architectural)  
**Area:** Backend — `passwordAuthController.js`, `authController.js`

**Symptom:**  
Users from the same organization could end up with **different `tenantId` values** depending on how they signed up:
- OAuth (Microsoft) sign-ups → `tenantId` = Entra ID `tid` from the JWT
- Email/Password sign-ups → `tenantId` = `tenant_${randomUUID()}`

**Root Cause:**  
Email/password users don't have an Entra ID token, so a synthetic `tenantId` is generated. If some users in the same org signed up via Microsoft and others via email/password, they'd be in different partitions and unable to see each other's data.

**Resolution:**  
The invitation flow mitigates this — invited users (UserAdmins) inherit the `tenantId` from the inviting ClientAdmin's organization. New ClientAdmin registrations via email/password create their own tenant, which is the expected behavior (new org = new tenant).

**Lesson:** Document the tenant ID strategy clearly. All users within the same organization must share the same `tenantId`.

---

### Authentication & Sign-In

---

#### 🔴 "Signature verification failed" on Microsoft Sign-In

**Date:** Recurring  
**Severity:** Critical (Blocks sign-in)  
**Area:** Backend — `entraAuth.js`

**Symptom:**  
Users see a generic "Authentication failed" error. Backend logs show:
```
❌ Token verification failed: signature verification failed
```

**Root Cause:**  
Mismatch between frontend and backend Azure AD configuration. The backend's `AZURE_CLIENT_ID` or `AZURE_TENANT_ID` didn't match the frontend's `VITE_MSAL_CLIENT_ID` / `VITE_MSAL_TENANT_ID`. The backend was fetching JWKS keys for a different tenant/audience than the token was issued for.

**Resolution:**
1. Ensure `AZURE_CLIENT_ID` in backend `.env` matches `VITE_MSAL_CLIENT_ID` in frontend `.env`
2. Ensure `AZURE_TENANT_ID` in backend matches `VITE_MSAL_TENANT_ID` in frontend
3. Both must reference the **same Azure App Registration**
4. Run backend with `NODE_ENV=development` and check logs for: token issuer, extracted tenant, and JWKS URL

**Lesson:** Always verify that frontend and backend use the exact same app registration credentials. This is the #1 auth debugging step.

---

#### 🟠 Google Sign-In Token Verification Fallback Failures

**Date:** ~Jan 2026  
**Severity:** High  
**Area:** Backend — `middleware/auth.js`, `routes/auth.js`

**Symptom:**  
Google sign-in would intermittently fail, especially when the JWT issuer format didn't match expected patterns.

**Root Cause:**  
The `detectAuthProvider` middleware parses the JWT payload to determine the auth provider. If the issuer format was unexpected (e.g., Google using a different issuer URL), the middleware would fall through to Microsoft verification first, which would fail, and then attempt Google as a fallback — adding latency and sometimes failing entirely if the error wasn't properly propagated.

**Resolution:**  
Improved the fallback chain in `detectAuthProvider`:
1. Check for `echopad-magic` issuer first (Magic Link)
2. Check for `echopad-email-password` issuer (Email/Password)
3. Explicit check for `accounts.google.com` in issuer
4. Check for `login.microsoftonline.com` / `sts.windows.net` (Microsoft)
5. Unknown issuer: try Microsoft → Google → fail with clear error

**Lesson:** Auth provider detection should be explicit, not rely on fallback chains. The issuer claim is the primary discriminator.

---

#### 🟡 Role Flash on Dashboard Load (Wrong Dashboard Shown Briefly)

**Date:** ~Feb 2026  
**Severity:** Medium (UX)  
**Area:** Frontend — `RoleContext.jsx`

**Symptom:**  
When a SuperAdmin user logged in, they'd briefly see the ClientAdmin dashboard layout before the correct SuperAdmin dashboard rendered.

**Root Cause:**  
`RoleContext` defaulted `currentRole` to `CLIENT_ADMIN` and set `isLoadingRole` to `false` too early — before token roles or backend profile data had been fetched. This caused `Dashboard.jsx` to render the ClientAdmin view, then re-render with SuperAdmin once the role was determined.

**Resolution:**  
- Changed `isLoadingRole` to stay `true` until a **reliable** role source is found (token roles, backend profile, or email domain check)
- Added priority-based role determination: Token > Profile > Email domain > Default
- Components now show a loading state while `isLoadingRole === true`

```javascript
// Only mark role as loaded when we have a reliable source
if (roleIsReliable || (!isAuthLoading && !isAuthenticated) || (!isAuthLoading && userProfile !== null)) {
  setIsLoadingRole(false);
}
```

**Lesson:** Always gate UI rendering on auth/role loading states. Default values cause flash-of-wrong-content.

---

#### 🟡 MSAL Cache Causes Stale Auth State

**Date:** ~Feb 2026  
**Severity:** Medium  
**Area:** Frontend — `authConfig.js`, `AuthContext.jsx`

**Symptom:**  
After signing out and signing back in with a different account, the previous user's data would sometimes appear briefly.

**Root Cause:**  
MSAL uses `localStorage` for token caching (`cacheLocation: 'localStorage'`). On sign-out, the cache wasn't being fully cleared, and on sign-in, `isAuthenticated` would briefly flicker as MSAL initialized from cached state.

**Resolution:**  
- Improved sign-out flow to clear all cached tokens
- Added guards in `RoleContext` to avoid premature role determination during MSAL cache initialization
- `isLoadingRole` stays `true` while `isAuthLoading` is `true` to prevent stale role rendering

---

### API & Backend

---

#### 🔴 Super Admin Analytics Dashboard Showing All Zeros

**Date:** ~Feb 2026  
**Severity:** Critical (Data issue)  
**Area:** Backend — `analytics.service.js`, `transcriptionMetrics.service.js`

**Symptom:**  
The Super Admin Analytics dashboard displayed `0` for all metrics (total users, total sessions, total minutes, etc.).

**Root Cause:**  
The `getPlatformMetrics` service was querying the `transcriptionMetrics` container but the query was structured incorrectly — it was filtering by a specific `tenantId` instead of aggregating across all tenants (which a Super Admin should see).

**Resolution:**  
Updated `getPlatformMetrics` to perform cross-tenant aggregation when called by a SuperAdmin user, removing the tenant filter for platform-wide queries.

**Lesson:** SuperAdmin queries are inherently cross-tenant. Always test analytics endpoints with actual data, not just empty containers.

---

#### 🔴 Download Endpoint Failing in Production (AI Scribe Desktop)

**Date:** ~Feb 2026  
**Severity:** Critical (Feature broken)  
**Area:** Backend — `download.routes.js`, Azure App Service

**Symptom:**  
Users couldn't download the AI Scribe desktop app (.exe/.dmg). The download endpoint returned a 500 error in production.

**Root Cause:**  
The original implementation used Azure CLI (`az`) commands to fetch packages from Azure Artifacts Universal Packages. However:
1. Azure App Service doesn't have Azure CLI installed by default
2. Universal Packages don't support direct REST API downloads
3. Even with the startup script installing Azure CLI, some App Service plans don't support `sudo`

**Resolution:**  
Switched the download mechanism to **Azure Blob Storage**:
- Installers (.exe, .dmg) are now uploaded to Azure Blob Storage
- Download endpoint serves files directly from Blob Storage via REST API
- Version information is still fetched from Azure Artifacts for metadata
- `AZURE_DEVOPS_PAT` is still used for version lookup, but downloads come from Blob Storage

**Lesson:** Don't depend on CLI tools in App Service environments. Use REST APIs and Blob Storage for file serving.

---

#### 🟡 VM Endpoint Caching Stale URL

**Date:** ~Feb 2026  
**Severity:** Medium  
**Area:** Desktop App — `main.js`, `transcription.service.js`

**Symptom:**  
After updating the VM endpoint from `20.119.49.191:5000` (Whisper) to `localhost:8000` (Parakeet), the desktop app continued connecting to the old endpoint.

**Root Cause:**  
The endpoint URL was cached in the application's local settings (Electron Store). Even after updating `.env` and config files, the cached value took precedence.

**Resolution:**  
- Updated all references in `main.js`, `transcription.service.js`, `renderer.js`, `.env`, and `env.example`
- Added logic to invalidate cached settings when they match the old VM IP
- Added an `isParakeet` flag to dynamically switch between port 8000 (Parakeet) and port 5000 (Whisper)

**Lesson:** When changing config values, always account for cached/persisted settings that may override the new defaults.

---

#### 🟡 Avg Speed Metric Showing for Non-Admin Users

**Date:** ~Feb 2026  
**Severity:** Medium (UX)  
**Area:** Frontend — `UserMetricsCard`, `ClientMetricsCard` components

**Symptom:**  
The "Avg Speed" metric card was visible to regular users and Client Admins, but it was only relevant for Super Admins.

**Resolution:**  
Removed the "Avg Speed" card from `UserMetricsCard` and `ClientMetricsCard` components, keeping it only in the Super Admin view. Adjusted the grid layout to accommodate the reduced number of cards.

---

### Desktop App (AI Scribe)

---

#### 🟡 Parakeet/Whisper Port Switching

**Date:** ~Feb 2026  
**Severity:** Medium  
**Area:** Desktop App — Configuration

**Symptom:**  
The application needed to switch between Parakeet model (port 8000) and Whisper model (port 5000) depending on deployment configuration, but there was no clean mechanism to do this.

**Resolution:**  
Added an `isParakeet` configuration flag that controls which port the application connects to. The flag is read from the environment/settings and used to construct the API endpoint URL dynamically.

---

## Infrastructure & CI/CD Bugs

### GitHub Actions Runner

---

#### 🔴 Runner Disk Space Exhaustion

**Date:** Recurring  
**Severity:** Critical (CI/CD blocked)  
**Area:** Self-hosted GitHub Actions runner (Azure VM)

**Symptom:**  
```
System.IO.IOException: No space left on device
```
Deployments fail because the runner VM's disk is full.

**Root Cause:**  
- Old runner diagnostic logs (`_diag/*.log`) accumulating
- Old work directories (`_work/*`) from previous builds not cleaned up
- npm cache growing unbounded
- System journal logs filling up

**Resolution:**
1. Clean old logs: `find /opt/actions-runner/_diag -name "*.log" -mtime +7 -delete`
2. Clean old build artifacts: `rm -rf /opt/actions-runner/_work/*`
3. Clean npm cache: `npm cache clean --force`
4. Vacuum journal logs: `sudo journalctl --vacuum-time=7d`
5. Set up a **cron job** for automatic cleanup (daily at 2 AM)

**Prevention:**
```bash
# crontab -e
0 2 * * * find /opt/actions-runner/_diag -name "*.log" -mtime +7 -delete
0 2 * * * find /opt/actions-runner/_work -type d -mtime +3 -exec rm -rf {} + 2>/dev/null
```

---

#### 🔴 Runner Session Conflict ("A session for this runner already exists")

**Date:** Recurring  
**Severity:** Critical (CI/CD blocked)  
**Area:** Self-hosted runner

**Symptom:**  
```
Error: A session for this runner already exists
Runner connect error: Error: Conflict
```

**Root Cause:**  
Duplicate runner registrations or stale sessions. Can happen after a VM restart if the runner service doesn't cleanly disconnect from GitHub.

**Resolution:**
1. Stop the service: `sudo systemctl stop actions.runner.*`
2. Uninstall: `cd /opt/actions-runner && sudo ./svc.sh uninstall`
3. Remove stale config: `./config.sh remove`
4. Get a new token from GitHub Settings → Actions → Runners
5. Reconfigure with `--replace` flag:
   ```bash
   ./config.sh --url https://github.com/org/repo --token <NEW_TOKEN> --name github-runner --replace
   ```
6. Reinstall and start service

---

#### 🔴 Runner Network Socket Errors

**Date:** ~Early 2026  
**Severity:** Critical (CI/CD blocked)  
**Area:** Self-hosted runner (Azure ARM64 VM)

**Symptom:**  
```
System.Net.Sockets.SocketException (125): Operation canceled
```
Jobs fail in 2-3 seconds with no logs appearing in GitHub Actions UI. `BrokerServer` connection errors in runner diagnostics.

**Root Cause:**  
Network connectivity issues between the ARM64 Azure VM and GitHub's Actions infrastructure. Potential causes: Azure NSG rules blocking outbound connections, DNS resolution failures, or SSL/TLS certificate issues.

**Resolution:**
1. Verified DNS resolution for `github.com` and `vstoken.actions.githubusercontent.com`
2. Ensured Azure NSG allows outbound HTTPS (port 443) to GitHub domains
3. Updated the runner to the latest version: `./run.sh --update`
4. Verified system time synchronization (TLS requires accurate time)
5. Reconfigured runner with a fresh registration token

---

#### 🟠 `/home` Partition Full (1GB limit)

**Date:** ~Early 2026  
**Severity:** High  
**Area:** Self-hosted runner VM

**Symptom:**  
`/home` at 100% capacity (1014M used, 20K free). Runner can't write any logs.

**Root Cause:**  
Runner was installed in `/home/sandeepd/actions-runner/` which had a small 1GB `/home` partition. Build artifacts, diagnostic logs, and npm cache all accumulated in this small partition.

**Resolution:**  
Moved the runner from `/home/sandeepd/actions-runner/` to `/opt/actions-runner/` which has significantly more disk space:
```bash
sudo systemctl stop actions.runner.*
sudo ./svc.sh uninstall
sudo mv /home/sandeepd/actions-runner /opt/actions-runner
sudo chown -R sandeepd:sandeepd /opt/actions-runner
cd /opt/actions-runner
sudo ./svc.sh install && sudo ./svc.sh start
```

**Lesson:** Always install runners on a partition with adequate space. `/opt` or a dedicated data disk is preferred over `/home`.

---

#### 🟠 Azure CLI Not Found in Runner PATH

**Date:** ~Early 2026  
**Severity:** High  
**Area:** Self-hosted runner, deployment workflow

**Symptom:**  
Deployment workflow fails with:
```
Error: Azure CLI ('az') is not installed or not in PATH
```

**Root Cause:**  
The runner runs as the `github-runner` system user, which has a different `PATH` than the interactive user. Azure CLI was installed but not accessible to the runner's service user.

**Resolution:**
1. Created a system-wide profile: `/etc/profile.d/github-runner-path.sh`
2. Added Azure CLI and Node.js paths
3. Configured the systemd service with explicit `Environment="PATH=..."` directive
4. Add a `.env` file in the runner directory with the correct PATH

---

### Azure Deployment

---

#### 🟠 Static Web App Cache Control Headers

**Date:** ~Feb 2026  
**Severity:** Medium  
**Area:** Frontend deployment

**Symptom:**  
Users were seeing stale versions of the frontend after deployments. Browser-cached old JavaScript bundles would not update.

**Resolution:**  
Added proper cache control headers in `staticwebapp.config.json`:
- HTML files: `no-cache` (always revalidate)
- JS/CSS with hashed filenames: `public, max-age=31536000, immutable` (cache forever, Vite handles cache busting via filename hashes)

---

#### 🟡 CORS Errors After Production Deployment

**Date:** Recurring  
**Severity:** Medium  
**Area:** Backend — `server.js`

**Symptom:**  
Frontend API calls fail with CORS errors after deploying to a new domain or when Azure Static Web Apps generates a new preview URL.

**Root Cause:**  
The backend's `allowedOrigins` list in `server.js` didn't include the new domain/URL.

**Resolution:**  
Added the new origin to the `allowedOrigins` array in `server.js`. For long-term, use the `FRONTEND_URL` environment variable to dynamically configure the primary origin.

**Lesson:** When deploying to a new domain, always update both: (1) backend `allowedOrigins`, and (2) `FRONTEND_URL` env var.

---

## Configuration Gotchas

These aren't bugs per se, but common pitfalls that have tripped up the team:

| Gotcha | Description | Fix |
|--------|-------------|-----|
| **Env var mismatch** | Frontend `VITE_MSAL_CLIENT_ID` ≠ backend `AZURE_CLIENT_ID` | Always keep them identical |
| **Vite build-time vars** | `VITE_*` vars are injected at build time, not runtime | Changing secrets requires a rebuild |
| **Cosmos DB cold starts** | Serverless plan has cold start delays (2-5 sec) | Warmup service pings every 5 min |
| **Cosmos `readAll()` danger** | `readAll()` returns all docs across all partitions | Always filter by `tenantId` |
| **Token issuer mismatch** | Different Entra tenants use different JWKS endpoints | Backend auto-extracts `tid` from token |
| **Runner on `/home`** | Small partition fills up fast | Install runner on `/opt` or data disk |
| **Cached settings override** | Desktop app caches endpoint URLs locally | Add cache invalidation on config change |
| **ARM64 runner** | Some tools lack ARM64 builds | Verify architecture compatibility before installing |

---

## How to Add a New Entry

When you fix a notable bug, add it to this document:

```markdown
#### 🔴/🟠/🟡/🟢 Bug Title

**Date:** Month Year  
**Severity:** Critical / High / Medium / Low  
**Area:** Component or service name

**Symptom:**  
What the user or developer observed.

**Root Cause:**  
Why the bug happened.

**Resolution:**  
What was done to fix it.

**Lesson:** (optional)  
What we learned for the future.
```

**Severity guide:**
- 🔴 **Critical** — App broken, security vulnerability, data loss
- 🟠 **High** — Major feature broken, significant impact  
- 🟡 **Medium** — Feature degraded, workaround exists
- 🟢 **Low** — Cosmetic, minor inconvenience
