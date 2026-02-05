# Azure Portal User Consent Setup Guide

## Overview

This guide explains how to enable user consent for the Echopad application in Microsoft Entra ID (Azure AD), allowing users to consent to the app without requiring admin approval.

## Problem

When users try to sign in with Microsoft Entra ID, they may see the following error:

```
Need admin approval
echopad-app needs permission to access resources in your organization that only an admin can grant. 
Please ask an admin to grant permission to this app before you can use it.
```

This happens when the app registration requires admin consent for API permissions.

**Important Note**: Having a role assigned (like SuperAdmin) is **different** from having API permissions granted. Even if a user has the SuperAdmin role, they still need admin consent for the API permissions the app requests.

## Solution Options

You have two options to resolve this:

### Option 1: Grant Admin Consent for the Organization (Recommended for Internal Apps)

This allows all users in your organization to use the app without individual consent.

### Option 2: Enable User Consent (Recommended for External/Multi-tenant Apps)

This allows users to consent to the app themselves when they first sign in.

---

## Option 1: Grant Admin Consent for Organization

### Steps

1. **Navigate to Azure Portal**
   - Go to [https://portal.azure.com](https://portal.azure.com)
   - Sign in with an admin account

2. **Go to App Registrations**
   - Search for "Azure Active Directory" or "Microsoft Entra ID"
   - Click on "App registrations" in the left menu
   - Find and select your app: **echopad-app** (Client ID: `d4ea5537-8b2a-4b88-9dbd-80bf02596c1a`)

3. **Review API Permissions**
   - Click on "API permissions" in the left menu
   - Review the list of permissions that require admin consent
   - Look for permissions marked with "Admin consent required"

4. **Grant Admin Consent**
   - Click the "Grant admin consent for [Your Organization]" button at the top
   - Confirm the action in the popup dialog
   - Wait for the status to change to "Granted for [Your Organization]" (green checkmark)

5. **Verify**
   - All permissions should now show "Granted for [Your Organization]"
   - Users should now be able to sign in without the admin approval prompt

---

## Custom API Scope Configuration

The Echopad app uses a custom API scope: `api://d4ea5537-8b2a-4b88-9dbd-80bf02596c1a/access_as_user`

This requires additional configuration steps:

### Step 1: Verify Backend API Scope is Exposed

1. **Go to Backend API App Registration**
   - Azure Portal → Entra ID → App registrations
   - Find the **backend API app registration** (Client ID: `d4ea5537-8b2a-4b88-9dbd-80bf02596c1a`)
   - Click on "Expose an API" in the left menu

2. **Check if Scope Exists**
   - Look for scope: `access_as_user`
   - If it exists, verify it's configured correctly
   - If it doesn't exist, create it (see below)

3. **Create the Scope (if needed)**
   - Click "+ Add a scope"
   - **Scope name**: `access_as_user`
   - **Who can consent**: 
     - "Admins and users" (if you want to enable user consent)
     - "Admins only" (if you want admin consent only)
   - **Admin consent display name**: "Access Echopad API"
   - **Admin consent description**: "Allow the application to access Echopad API on behalf of the signed-in user"
   - **User consent display name**: "Access Echopad API"
   - **User consent description**: "Allow the application to access Echopad API on your behalf"
   - Click "Add scope"

### Step 2: Grant Admin Consent for Custom API Permission

1. **Go to Frontend App Registration**
   - Azure Portal → Entra ID → App registrations
   - Find the **frontend app registration** (same Client ID if it's a SPA: `d4ea5537-8b2a-4b88-9dbd-80bf02596c1a`)
   - Click on "API permissions" in the left menu

2. **Check if Permission Exists**
   - Look for permission: `api://d4ea5537-8b2a-4b88-9dbd-80bf02596c1a/access_as_user`
   - If it's not there, add it (see below)

3. **Add the Permission (if needed)**
   - Click "+ Add a permission"
   - Select "My APIs" tab
   - Find your backend API app (echopad-app)
   - Select "Delegated permissions"
   - Check the box for `access_as_user`
   - Click "Add permissions"

4. **Grant Admin Consent**
   - Find the permission `api://d4ea5537-8b2a-4b88-9dbd-80bf02596c1a/access_as_user`
   - Click "Grant admin consent for [Your Organization]"
   - Confirm the action
   - Wait for status to show "Granted for [Your Organization]" (green checkmark)

### Step 3: Verify User Role Assignment

1. **Go to Enterprise Applications**
   - Azure Portal → Entra ID → Enterprise applications
   - Find "echopad-app"
   - Click on "Users and groups" in the left menu

2. **Verify User Assignment**
   - Check if the user (e.g., `vaibhav@cloudsecurityweb.com`) is listed
   - Verify they have the correct role assigned (SuperAdmin, ClientAdmin, or UserAdmin)

3. **Assign User (if needed)**
   - Click "+ Add user/group"
   - Select the user
   - Select role: "SuperAdmin" (or appropriate role)
   - Click "Assign"

---

## Option 2: Enable User Consent

### Steps

1. **Navigate to Azure Portal**
   - Go to [https://portal.azure.com](https://portal.azure.com)
   - Sign in with an admin account

2. **Go to Enterprise Applications**
   - Search for "Azure Active Directory" or "Microsoft Entra ID"
   - Click on "Enterprise applications" in the left menu
   - Find and select your app: **echopad-app**

3. **Configure User Settings**
   - Click on "User settings" in the left menu
   - Find the section "Users can consent to apps accessing company data on their behalf"
   - Set this to **"Yes"**
   - Alternatively, you can enable "Users can consent to apps accessing company data for the groups they own" if you want group-based consent

4. **Configure Admin Consent Requests (Optional)**
   - In the same "User settings" page
   - Find "Admin consent requests"
   - You can configure whether users can request admin consent if they encounter an app that requires it

5. **Save Changes**
   - Click "Save" at the top of the page

6. **Verify API Permissions**
   - Go back to "App registrations" → Your app → "API permissions"
   - Check which permissions require admin consent
   - For permissions that don't require admin consent, users can now consent themselves
   - For permissions that do require admin consent, you still need to grant admin consent (Option 1)

---

## Understanding Permission Types

### Delegated Permissions
- Allow the app to act on behalf of the signed-in user
- Users can consent to these permissions themselves (if user consent is enabled)
- Example: "Sign in and read user profile"

### Application Permissions
- Allow the app to act on its own behalf (without a user)
- Always require admin consent
- Example: "Read all users" (app-only)

### Admin Consent Required
- Some permissions are marked as requiring admin consent
- Even with user consent enabled, these require admin approval
- You must grant admin consent for these permissions (Option 1)

### Custom API Scopes
- Custom scopes are defined in your backend API app registration
- They must be exposed in the "Expose an API" section
- Frontend apps must request these permissions and have admin consent granted
- Example: `api://d4ea5537-8b2a-4b88-9dbd-80bf02596c1a/access_as_user`

## Understanding Role vs Permission Consent

**Important**: Role assignment and API permission consent are **two separate things**:

1. **Role Assignment** (App Roles)
   - Assigned in Enterprise Applications → Users and groups
   - Determines what the user can do in your application (SuperAdmin, ClientAdmin, UserAdmin)
   - Example: User has "SuperAdmin" role

2. **API Permission Consent**
   - Granted in App Registrations → API permissions
   - Determines what API permissions the app can use
   - Example: App has permission to use `access_as_user` scope

**Even if a user has the SuperAdmin role, they still need admin consent for API permissions.**

---

## Troubleshooting

### Users Still See Admin Approval Prompt (Even After Role Assignment)

**Common Issue**: User has SuperAdmin role but still sees admin approval prompt.

**Root Cause**: Role assignment and API permission consent are separate. The user needs:
1. ✅ Role assigned (SuperAdmin, ClientAdmin, or UserAdmin) - **You've done this**
2. ❌ API permission consent granted - **This is likely missing**

**Solution**:

1. **Check API Permission Status**
   - Go to App registrations → Your app → API permissions
   - Look for: `api://d4ea5537-8b2a-4b88-9dbd-80bf02596c1a/access_as_user`
   - Verify it shows "Granted for [Your Organization]" (green checkmark)
   - If not, grant admin consent (see Step 2 above)

2. **Check if Custom Scope is Exposed**
   - Go to App registrations → Backend API → Expose an API
   - Verify `access_as_user` scope exists
   - If it doesn't exist, create it (see Step 1 above)

3. **Check User Assignment**
   - Go to Enterprise applications → echopad-app → Users and groups
   - Verify user is assigned with correct role
   - If not assigned, assign the user with the appropriate role

4. **Wait for Propagation**
   - Azure AD changes can take 5-10 minutes to propagate
   - Try again after waiting

5. **Clear Browser Cache**
   - Users should clear their browser cache and cookies
   - Try signing in again in an incognito/private window

### Custom API Scope Not Working

If the custom API scope continues to cause issues, you can temporarily switch to standard Microsoft Graph permissions:

**Update Frontend Configuration** (`frontend/src/config/authConfig.js`):

Change from:
```javascript
scopes: ["api://d4ea5537-8b2a-4b88-9dbd-80bf02596c1a/access_as_user"]
```

To:
```javascript
scopes: ["User.Read", "openid", "profile", "email"]
```

Then grant admin consent for these Microsoft Graph permissions in the app registration.

### General Troubleshooting

1. **Check Permission Status**
   - Go to App registrations → Your app → API permissions
   - Verify that permissions show "Granted for [Your Organization]" (green checkmark)
   - If not, grant admin consent (Option 1)

2. **Check User Consent Settings**
   - Go to Enterprise applications → Your app → User settings
   - Verify "Users can consent to apps accessing company data on their behalf" is set to "Yes"
   - Save changes

3. **Check App Registration Type**
   - Go to App registrations → Your app → Authentication
   - Verify "Supported account types" is set appropriately:
     - "Accounts in this organizational directory only" for single-tenant
     - "Accounts in any organizational directory" for multi-tenant

4. **Clear Browser Cache**
   - Users should clear their browser cache and cookies
   - Try signing in again in an incognito/private window

### Permission Not Appearing After Granting Consent

1. **Wait a Few Minutes**
   - Azure AD changes can take a few minutes to propagate

2. **Check Tenant ID**
   - Verify you're granting consent in the correct tenant
   - Check that the app registration is in the correct tenant

3. **Verify App Registration**
   - Ensure the Client ID matches: `d4ea5537-8b2a-4b88-9dbd-80bf02596c1a`
   - Verify the app is not disabled

---

## Security Considerations

### When to Use Admin Consent (Option 1)
- Internal applications used only by your organization
- Applications that need broad permissions
- Applications where you want centralized control

### When to Use User Consent (Option 2)
- External/multi-tenant applications
- Applications where users should control their own data access
- Applications with minimal permissions

### Best Practices
- Regularly review API permissions and remove unused ones
- Use the principle of least privilege (only request necessary permissions)
- Monitor consent grants in Azure AD audit logs
- Consider using conditional access policies for additional security

---

## Additional Resources

- [Microsoft Docs: Configure how users consent to applications](https://learn.microsoft.com/en-us/azure/active-directory/manage-apps/configure-user-consent)
- [Microsoft Docs: Admin consent workflow](https://learn.microsoft.com/en-us/azure/active-directory/manage-apps/configure-admin-consent-workflow)
- [Microsoft Docs: Understanding Azure AD application consent experiences](https://learn.microsoft.com/en-us/azure/active-directory/develop/application-consent-experience)

---

## Quick Reference

**App Registration Details:**
- App Name: echopad-app
- Client ID: `d4ea5537-8b2a-4b88-9dbd-80bf02596c1a`
- Tenant ID: Check your Azure AD tenant settings

**Common API Permissions:**
- `User.Read` - Sign in and read user profile (Microsoft Graph)
- `openid` - Sign users in (Microsoft Graph)
- `profile` - View users' basic profile (Microsoft Graph)
- `email` - View users' email address (Microsoft Graph)
- `api://d4ea5537-8b2a-4b88-9dbd-80bf02596c1a/access_as_user` - Custom API scope (Echopad API)

**Quick Fix for Custom API Scope Issues:**
1. Backend API → Expose an API → Verify/Add `access_as_user` scope
2. Frontend App → API permissions → Add `api://d4ea5537-8b2a-4b88-9dbd-80bf02596c1a/access_as_user`
3. Frontend App → API permissions → Grant admin consent
4. Enterprise applications → echopad-app → Users and groups → Verify user role assignment
5. Clear browser cache and retry

**Quick Fix for Standard Permissions:**
1. Azure Portal → Entra ID → App registrations → echopad-app
2. API permissions → Grant admin consent
3. Enterprise applications → echopad-app → User settings → Enable user consent
