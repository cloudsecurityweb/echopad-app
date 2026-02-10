# Functional Testing Documentation

## Overview

This document describes the comprehensive functional testing suite for Echopad that verifies actual business logic, CRUD operations, and data persistence.

## What We're Testing

Unlike basic E2E tests that only check page loading and navigation, these functional tests verify:

1. **Data Editing**: Users can edit information and changes are saved
2. **Form Submissions**: Forms validate, submit, and persist data correctly
3. **CRUD Operations**: Create, Read, Update, Delete operations work as expected
4. **Data Persistence**: Changes are saved to the backend and reflected in the UI
5. **Error Handling**: Forms handle errors gracefully
6. **User Workflows**: Complete user journeys through the application

## Test Files

### 1. `functional-profile.spec.ts`
**Tests Profile Management Functionality**

- ✅ Edit and save profile information (Client Admin)
- ✅ Edit and save profile information (Regular User)
- ✅ Validate profile form fields (email format, required fields)
- ✅ Handle profile update errors gracefully
- ✅ Verify changes persist after save

**Key Features Tested:**
- Profile form editing
- Data persistence
- Form validation
- Error handling

### 2. `functional-licenses.spec.ts`
**Tests License Management Functionality**

- ✅ View licenses list as Client Admin
- ✅ Assign license to user
- ✅ Revoke license from user
- ✅ Request new license
- ✅ Filter and search licenses

**Key Features Tested:**
- License assignment workflow
- License revocation workflow
- License request workflow
- License filtering/search

### 3. `functional-users.spec.ts`
**Tests User Management Functionality**

- ✅ View users list as Client Admin
- ✅ Search and filter users
- ✅ View user details
- ✅ Edit user information
- ✅ Handle user status changes

**Key Features Tested:**
- User CRUD operations
- User search/filter
- User detail views
- User status management

### 4. `functional-products.spec.ts`
**Tests Products Management Functionality**

- ✅ View products owned as Regular User
- ✅ View products store as Client Admin
- ✅ View product details
- ✅ Filter products by category or type

**Key Features Tested:**
- Product listing
- Product detail views
- Product filtering

### 5. `functional-subscriptions.spec.ts`
**Tests Subscriptions Management Functionality**

- ✅ View subscriptions page as Client Admin
- ✅ Switch between subscription tabs
- ✅ View subscription details
- ✅ Handle subscription actions (renew, cancel, etc.)

**Key Features Tested:**
- Subscription listing
- Tab navigation
- Subscription details
- Subscription actions

### 6. `functional-forms.spec.ts`
**Tests Form Submission and Data Persistence**

- ✅ Submit form and verify data persists
- ✅ Validate required form fields
- ✅ Handle form submission errors
- ✅ Prevent duplicate submissions
- ✅ Show loading state during submission
- ✅ Reset form on cancel

**Key Features Tested:**
- Form submission workflow
- Form validation
- Error handling
- Loading states
- Form reset functionality

## Test Helpers

### Updated `test-helpers.ts`

Added new helper functions:

- `getTestUserCredentials()` - Get test user credentials from environment
- `loginWithEmailPassword()` - Login with email/password
- `loginAsClientAdmin()` - Login as Client Admin user
- `loginAsRegularUser()` - Login as Regular User
- `ensureLoggedOut()` - Ensure user is logged out
- `verifyApiResponse()` - Verify API response contains expected data
- `waitForApiCall()` - Wait for specific API call to complete

## Test Credentials

Tests use the following credentials (configurable via environment variables):

**Client Admin:**
- Email: `pandey.abhi142002@gmail.com`
- Password: `11111111`

**Regular User:**
- Email: `pandeyabhi.142002@gmail.com`
- Password: `11111111`

Set via environment variables:
- `TEST_CLIENT_ADMIN_EMAIL`
- `TEST_CLIENT_ADMIN_PASSWORD`
- `TEST_USER_EMAIL`
- `TEST_USER_PASSWORD`

## Running Functional Tests

```bash
# Run all functional tests
npx playwright test functional

# Run specific functional test file
npx playwright test functional-profile

# Run with UI mode (interactive)
npx playwright test functional --ui

# Run in debug mode
npx playwright test functional --debug
```

## What Gets Verified

### 1. **Data Persistence**
- Changes are saved to the backend
- Changes are reflected in the UI after save
- Data persists across page reloads

### 2. **Form Validation**
- Required fields are validated
- Invalid data is rejected
- Error messages are displayed

### 3. **API Integration**
- API calls are made correctly
- API responses are handled properly
- Errors are displayed to users

### 4. **User Workflows**
- Complete user journeys work end-to-end
- Navigation between pages works
- Data flows correctly through the application

### 5. **Error Handling**
- Errors are caught and displayed
- Forms handle errors gracefully
- Users can recover from errors

## Test Coverage

These functional tests complement the existing E2E tests:

**Existing Tests (Non-functional):**
- Page loading
- Navigation
- Authentication flows
- API health checks
- Accessibility
- Performance

**New Functional Tests:**
- ✅ Profile editing and saving
- ✅ License assignment/revocation
- ✅ User management operations
- ✅ Product viewing and filtering
- ✅ Subscription management
- ✅ Form submissions
- ✅ Data persistence verification

## Best Practices

1. **Isolation**: Each test logs out before starting
2. **Flexibility**: Tests handle optional UI elements gracefully
3. **Verification**: Tests verify both UI changes and API calls
4. **Error Handling**: Tests verify error scenarios
5. **Data Cleanup**: Tests use test data that can be cleaned up

## Future Enhancements

Potential additions:
- [ ] Test data cleanup after tests
- [ ] More comprehensive CRUD operations
- [ ] Integration with test database
- [ ] Visual regression testing
- [ ] Performance testing for CRUD operations
- [ ] Multi-step workflow testing
