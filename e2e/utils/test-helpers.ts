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

// -------------------------
// Auth helpers (email/password)
// -------------------------

export type TestUserRole = 'clientAdmin' | 'user';

export interface TestUserCredentials {
  email: string;
  password: string;
}

export function getTestUserCredentials(role: TestUserRole): TestUserCredentials {
  if (role === 'clientAdmin') {
    if (!process.env.TEST_CLIENT_ADMIN_EMAIL || !process.env.TEST_CLIENT_ADMIN_PASSWORD) {
      throw new Error('TEST_CLIENT_ADMIN_EMAIL and TEST_CLIENT_ADMIN_PASSWORD must be set for client admin tests');
    }
    return {
      email: process.env.TEST_CLIENT_ADMIN_EMAIL,
      password: process.env.TEST_CLIENT_ADMIN_PASSWORD,
    };
  }

  if (!process.env.TEST_USER_EMAIL || !process.env.TEST_USER_PASSWORD) {
    throw new Error('TEST_USER_EMAIL and TEST_USER_PASSWORD must be set for user tests');
  }
  return {
    email: process.env.TEST_USER_EMAIL,
    password: process.env.TEST_USER_PASSWORD,
  };
}

export async function loginWithEmailPassword(page: Page, creds: TestUserCredentials) {
  await page.goto('/sign-in');
  await waitForPageLoad(page);

  await page.getByLabel(/Email/i).fill(creds.email);
  await page.getByLabel(/Password/i).fill(creds.password);

  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.getByRole('button', { name: /login/i }).click(),
  ]).
  catch(() => undefined);
}

export async function loginAsClientAdmin(page: Page) {
  const creds = getTestUserCredentials('clientAdmin');
  await loginWithEmailPassword(page, creds);
}

export async function loginAsRegularUser(page: Page) {
  const creds = getTestUserCredentials('user');
  await loginWithEmailPassword(page, creds);
}

export async function ensureLoggedOut(page: Page) {
  await page.goto('/');
  await waitForPageLoad(page);

  // Try to find a logout/sign out button or menu item
  const logoutCandidates = [
    page.getByRole('button', { name: /sign out|log out/i }),
    page.getByRole('link', { name: /sign out|log out/i }),
  ];

  for (const candidate of logoutCandidates) {
    if (await candidate.isVisible().catch(() => false)) {
      await candidate.click();
      await page.waitForTimeout(1000);
      break;
    }
  }

  // Clear storage as a fallback
  await clearStorage(page);
}
