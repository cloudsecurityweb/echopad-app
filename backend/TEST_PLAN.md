# End-to-End Authentication Test Plan

## Overview
This document outlines test scenarios for the complete authentication and onboarding flow across all providers (Microsoft, Google, Email/Password) and roles (SuperAdmin, ClientAdmin, UserAdmin).

## Test Scenarios

### 1. Email/Password Sign-Up Flow

#### 1.1 First-Time Sign-Up
- **Steps:**
  1. Navigate to `/sign-up`
  2. Fill in organization name, organizer name, email, password
  3. Accept terms and conditions
  4. Submit form
- **Expected:**
  - User created with `role = CLIENT_ADMIN`
  - `status = PENDING`
  - `emailVerified = false`
  - Verification email sent
  - Redirect to `/verify-email-sent` page
  - User cannot access dashboard until verified

#### 1.2 Email Verification
- **Steps:**
  1. Check email inbox
  2. Click verification link
  3. Verify email via `/verify-email?email=...&token=...`
- **Expected:**
  - Email marked as verified (`emailVerified = true`)
  - Status updated to `ACTIVE`
  - Redirect to sign-in page with success message
  - User can now sign in

#### 1.3 Sign-In After Verification
- **Steps:**
  1. Navigate to `/sign-in`
  2. Enter verified email and password
  3. Submit
- **Expected:**
  - Successful sign-in
  - Redirect to `/dashboard`
  - Dashboard router redirects to `/dashboard/client-admin`

#### 1.4 Sign-In Before Verification
- **Steps:**
  1. Sign up but don't verify email
  2. Attempt to sign in
- **Expected:**
  - Sign-in rejected with error: "Email not verified"
  - Redirect to `/verify-email-sent` page
  - Option to resend verification email

### 2. Microsoft OAuth Sign-Up Flow

#### 2.1 First-Time Sign-Up
- **Steps:**
  1. Navigate to `/sign-up`
  2. Click "Sign up with Microsoft"
  3. Complete Microsoft authentication
  4. (Optional) Provide organization details
- **Expected:**
  - User created with `role = CLIENT_ADMIN` (unless SuperAdmin in Entra)
  - `status = ACTIVE` (OAuth email considered verified)
  - `emailVerified = true`
  - Redirect to `/dashboard`
  - Dashboard router redirects to `/dashboard/client-admin`

#### 2.2 Sign-In (Existing User)
- **Steps:**
  1. Navigate to `/sign-in`
  2. Click "Sign in with Microsoft"
  3. Complete Microsoft authentication
- **Expected:**
  - Successful sign-in
  - Role determined from Entra ID token or database
  - Redirect to appropriate dashboard based on role

### 3. Google OAuth Sign-Up Flow

#### 3.1 First-Time Sign-Up
- **Steps:**
  1. Navigate to `/sign-up`
  2. Click "Sign up with Google"
  3. Complete Google authentication
- **Expected:**
  - User created with `role = CLIENT_ADMIN`
  - `status = ACTIVE` (OAuth email considered verified)
  - `emailVerified = true`
  - Redirect to `/dashboard`
  - Dashboard router redirects to `/dashboard/client-admin`

#### 3.2 Sign-In (Existing User)
- **Steps:**
  1. Navigate to `/sign-in`
  2. Click "Sign in with Google"
  3. Complete Google authentication
- **Expected:**
  - Successful sign-in
  - Redirect to `/dashboard`
  - Dashboard router routes to appropriate dashboard

### 4. Invitation Flow

#### 4.1 ClientAdmin Creates Invitation
- **Prerequisites:** ClientAdmin signed in
- **Steps:**
  1. Navigate to user management
  2. Create invitation for new user email
  3. Submit
- **Expected:**
  - Invitation created with `role = user` (UserAdmin)
  - Invitation email sent
  - Invitation linked to ClientAdmin's organization

#### 4.2 Accept Invitation (Microsoft)
- **Steps:**
  1. Click invitation link
  2. Sign in with Microsoft (matching email)
  3. Accept invitation
- **Expected:**
  - User created with `role = USER` (UserAdmin)
  - `organizationId` set to inviting organization
  - `emailVerified = true` (OAuth)
  - `status = ACTIVE`
  - Redirect to `/dashboard`
  - Dashboard router redirects to `/dashboard/user-admin`

#### 4.3 Accept Invitation (Google)
- **Steps:**
  1. Click invitation link
  2. Sign in with Google (matching email)
  3. Accept invitation
- **Expected:**
  - User created with `role = USER` (UserAdmin)
  - `organizationId` set to inviting organization
  - `emailVerified = true` (OAuth)
  - `status = ACTIVE`
  - Redirect to `/dashboard/user-admin`

#### 4.4 Accept Invitation (Magic Link)
- **Steps:**
  1. Click invitation link
  2. Accept invitation (no authentication required)
- **Expected:**
  - User created with `role = USER` (UserAdmin)
  - `organizationId` set to inviting organization
  - `emailVerified = true` (magic link trusted)
  - `status = ACTIVE`
  - Magic session token generated
  - Redirect to `/dashboard/user-admin`

### 5. Role-Based Dashboard Routing

#### 5.1 SuperAdmin Routing
- **Prerequisites:** User has SuperAdmin role in Entra ID
- **Steps:**
  1. Sign in
  2. Navigate to `/dashboard`
- **Expected:**
  - Dashboard router detects SuperAdmin role
  - Redirects to `/dashboard/super-admin`
  - SuperAdmin dashboard loads

#### 5.2 ClientAdmin Routing
- **Prerequisites:** User has ClientAdmin role or new sign-up
- **Steps:**
  1. Sign in
  2. Navigate to `/dashboard`
- **Expected:**
  - Dashboard router detects ClientAdmin role
  - Redirects to `/dashboard/client-admin`
  - ClientAdmin dashboard loads

#### 5.3 UserAdmin Routing
- **Prerequisites:** User accepted invitation
- **Steps:**
  1. Sign in
  2. Navigate to `/dashboard`
- **Expected:**
  - Dashboard router detects UserAdmin role
  - Redirects to `/dashboard/user-admin`
  - UserAdmin dashboard loads

### 6. Email Verification Edge Cases

#### 6.1 Expired Verification Token
- **Steps:**
  1. Sign up
  2. Wait 24+ hours
  3. Click verification link
- **Expected:**
  - Error: "Token expired"
  - Option to resend verification email

#### 6.2 Invalid Verification Token
- **Steps:**
  1. Sign up
  2. Modify verification token in URL
  3. Attempt verification
- **Expected:**
  - Error: "Invalid token"
  - Option to resend verification email

#### 6.3 Resend Verification Email
- **Steps:**
  1. Navigate to `/resend-verification`
  2. Enter email
  3. Submit
- **Expected:**
  - New verification email sent
  - New token generated
  - Previous token invalidated (if implemented)

### 7. Role Enforcement

#### 7.1 SuperAdmin-Only Routes
- **Routes:** `/api/analytics/super-admin`, `/api/clients/*`, `/api/products` (POST/PATCH)
- **Test:** ClientAdmin attempts access
- **Expected:** 403 Forbidden

#### 7.2 ClientAdmin-Only Routes
- **Routes:** `/api/invites/user`
- **Test:** UserAdmin attempts access
- **Expected:** 403 Forbidden

#### 7.3 UserAdmin Access
- **Routes:** Product usage endpoints
- **Test:** UserAdmin attempts access
- **Expected:** 200 OK (if authorized)

### 8. Multi-Provider Scenarios

#### 8.1 Sign Up with Microsoft, Sign In with Google
- **Steps:**
  1. Sign up with Microsoft
  2. Sign out
  3. Attempt sign in with Google (same email)
- **Expected:**
  - User found by email
  - Sign-in succeeds
  - Role preserved from original sign-up

#### 8.2 Sign Up with Email/Password, Sign In with Microsoft
- **Steps:**
  1. Sign up with email/password
  2. Verify email
  3. Sign out
  4. Sign in with Microsoft (same email)
- **Expected:**
  - User found by email
  - Sign-in succeeds
  - Role preserved
  - OID linked to existing user record

## Test Data Requirements

### Test Users
- SuperAdmin: Pre-configured in Entra ID
- ClientAdmin: Created via sign-up
- UserAdmin: Created via invitation

### Test Organizations
- Organization 1: Created by ClientAdmin 1
- Organization 2: Created by ClientAdmin 2

## Automated Test Checklist

- [ ] Email/Password sign-up creates unverified user
- [ ] Email verification activates account
- [ ] Unverified users cannot sign in
- [ ] Microsoft OAuth sign-up creates verified user
- [ ] Google OAuth sign-up creates verified user
- [ ] Invitation creates UserAdmin with correct organization
- [ ] Dashboard router checks email verification
- [ ] Dashboard router routes by role
- [ ] Role guards protect routes correctly
- [ ] Verification token expiration works
- [ ] Resend verification email works

## Manual Test Checklist

- [ ] Email verification email received
- [ ] Verification link works
- [ ] Invitation email received
- [ ] Invitation link works
- [ ] Dashboard redirects correctly
- [ ] Error messages are clear
- [ ] UX flows are smooth

## Notes

- All email/password users must verify email before access
- OAuth users (Microsoft/Google) are auto-verified
- Magic link invitations are auto-verified
- Entra ID roles are source of truth when present
- Database roles are fallback when token has no roles
- Email verification status is checked on all sign-in paths
