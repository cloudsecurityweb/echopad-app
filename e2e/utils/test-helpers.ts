import { Page, expect } from '@playwright/test';

/**
 * Test helper utilities for Echopad E2E tests
 */

export const API_BASE_URL = process.env.API_URL || 'https://echopad-backend.azurewebsites.net';

/**
 * Wait for page to be fully loaded
 */
export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
}

/**
 * Check if element is visible with retry
 */
export async function isElementVisible(page: Page, selector: string, timeout = 5000): Promise<boolean> {
  try {
    await page.waitForSelector(selector, { state: 'visible', timeout });
    return true;
  } catch {
    return false;
  }
}

/**
 * Take a screenshot with timestamp
 */
export async function takeScreenshot(page: Page, name: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({ 
    path: `test-results/screenshots/${name}-${timestamp}.png`,
    fullPage: true 
  });
}

/**
 * Clear browser storage
 */
export async function clearStorage(page: Page) {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

/**
 * Mock API response
 */
export async function mockApiResponse(page: Page, url: string, response: object) {
  await page.route(url, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(response),
    });
  });
}

/**
 * Check for console errors
 */
export function setupConsoleErrorCapture(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  return errors;
}

/**
 * Validate no critical console errors
 */
export function validateNoConsoleErrors(errors: string[], allowedPatterns: RegExp[] = []) {
  const criticalErrors = errors.filter(error => {
    // Ignore known non-critical errors
    const knownIgnored = [
      /Failed to open popup/i,
      /GSI_LOGGER/i,
      /net::ERR_BLOCKED_BY_CLIENT/i,
    ];
    return ![...knownIgnored, ...allowedPatterns].some(pattern => pattern.test(error));
  });
  
  if (criticalErrors.length > 0) {
    console.log('Critical console errors found:', criticalErrors);
  }
  
  return criticalErrors;
}

/**
 * API Health Check
 */
export async function checkApiHealth(page: Page): Promise<boolean> {
  try {
    const response = await page.request.get(`${API_BASE_URL}/api/health`);
    return response.ok();
  } catch {
    return false;
  }
}

/**
 * Get test user credentials
 */
export function getTestUserCredentials() {
  return {
    clientAdmin: {
      email: process.env.TEST_CLIENT_ADMIN_EMAIL || 'pandey.abhi142002@gmail.com',
      password: process.env.TEST_CLIENT_ADMIN_PASSWORD || '11111111',
    },
    regularUser: {
      email: process.env.TEST_USER_EMAIL || 'pandeyabhi.142002@gmail.com',
      password: process.env.TEST_USER_PASSWORD || '11111111',
    },
  };
}

/**
 * Login with email and password
 */
export async function loginWithEmailPassword(page: Page, email: string, password: string) {
  await page.goto('/sign-in');
  await page.waitForLoadState('networkidle');
  
  // Fill in email
  const emailInput = page.getByLabel(/Email/i).first();
  await emailInput.fill(email);
  
  // Fill in password
  const passwordInput = page.getByLabel(/Password/i).first();
  await passwordInput.fill(password);
  
  // Click login button
  const loginButton = page.getByRole('button', { name: /Login|Sign in/i }).first();
  await loginButton.click();
  
  // Wait for redirect to dashboard or error
  await page.waitForURL(/\/dashboard|\/sign-in/, { timeout: 15000 });
  
  // Verify we're logged in (should be on dashboard)
  const isDashboard = page.url().includes('/dashboard');
  if (!isDashboard) {
    throw new Error('Login failed - not redirected to dashboard');
  }
  
  await page.waitForLoadState('networkidle');
}

/**
 * Login as Client Admin
 */
export async function loginAsClientAdmin(page: Page) {
  const credentials = getTestUserCredentials();
  await loginWithEmailPassword(page, credentials.clientAdmin.email, credentials.clientAdmin.password);
}

/**
 * Login as Regular User
 */
export async function loginAsRegularUser(page: Page) {
  const credentials = getTestUserCredentials();
  await loginWithEmailPassword(page, credentials.regularUser.email, credentials.regularUser.password);
}

/**
 * Ensure user is logged out
 */
export async function ensureLoggedOut(page: Page) {
  await clearStorage(page);
  await page.goto('/sign-in');
  await page.waitForLoadState('networkidle');
}

/**
 * Verify API response contains expected data
 */
export async function verifyApiResponse(page: Page, url: string, expectedFields: string[]): Promise<boolean> {
  try {
    const response = await page.request.get(url);
    if (!response.ok()) return false;
    
    const data = await response.json();
    return expectedFields.every(field => {
      const keys = field.split('.');
      let value = data;
      for (const key of keys) {
        value = value?.[key];
        if (value === undefined) return false;
      }
      return true;
    });
  } catch {
    return false;
  }
}

/**
 * Wait for API call to complete
 */
export async function waitForApiCall(page: Page, urlPattern: string | RegExp, method: string = 'GET', timeout: number = 10000): Promise<void> {
  const pattern = typeof urlPattern === 'string' ? urlPattern : urlPattern.source;
  await page.waitForResponse(
    response => {
      const url = response.url();
      const matches = typeof urlPattern === 'string' ? url.includes(urlPattern) : urlPattern.test(url);
      return matches && response.request().method() === method.toUpperCase();
    },
    { timeout }
  );
}
