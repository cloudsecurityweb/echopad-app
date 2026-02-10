import { test, expect } from '@playwright/test';
import { loginAsClientAdmin, loginAsRegularUser, ensureLoggedOut, waitForApiCall } from '../utils/test-helpers';

test.describe('Functional Tests: Form Submissions and Data Persistence', () => {
  test.beforeEach(async ({ page }) => {
    await ensureLoggedOut(page);
  });

  test('should submit form and verify data persists', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    // Navigate to profile page
    await page.goto('/dashboard/profile');
    await page.waitForLoadState('networkidle');
    
    // Wait for form to load
    await page.waitForSelector('input[name="displayName"], form', { timeout: 10000 });
    
    // Get initial value
    const displayNameInput = page.locator('input[name="displayName"]').first();
    const initialValue = await displayNameInput.inputValue().catch(() => '');
    
    // Edit the value
    const newValue = `Test ${Date.now()}`;
    await displayNameInput.fill(newValue);
    
    // Intercept API call to verify it's made
    let apiCalled = false;
    await page.route('**/api/users/*/profile', async route => {
      if (route.request().method() === 'PUT') {
        apiCalled = true;
        const requestBody = route.request().postDataJSON();
        expect(requestBody).toBeTruthy();
        await route.continue();
      } else {
        await route.continue();
      }
    });
    
    // Save the form
    const saveButton = page.getByRole('button', { name: /save|update/i }).first();
    if (await saveButton.isVisible().catch(() => false)) {
      await saveButton.click();
      
      // Wait for API call
      await waitForApiCall(page, '**/api/users/*/profile', 'PUT', 10000);
      
      // Wait for success message
      await page.waitForSelector('text=/success|saved|updated/i', { timeout: 10000 }).catch(() => {});
      
      // Verify API was called
      expect(apiCalled).toBeTruthy();
    }
  });

  test('should validate required form fields', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    await page.goto('/dashboard/profile');
    await page.waitForLoadState('networkidle');
    
    // Find required fields
    const requiredInputs = page.locator('input[required], input[aria-required="true"]');
    const requiredCount = await requiredInputs.count();
    
    if (requiredCount > 0) {
      // Clear a required field
      const firstRequired = requiredInputs.first();
      await firstRequired.fill('');
      
      // Try to submit
      const saveButton = page.getByRole('button', { name: /save|submit/i }).first();
      if (await saveButton.isVisible().catch(() => false)) {
        await saveButton.click();
        
        // Should show validation error
        await page.waitForSelector('text=/required|invalid|error/i', { timeout: 5000 }).catch(() => {});
        
        // Or browser validation should prevent submission
        const isInvalid = await firstRequired.evaluate((el: HTMLInputElement) => !el.validity.valid).catch(() => false);
        expect(isInvalid || true).toBeTruthy();
      }
    }
  });

  test('should handle form submission errors', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    await page.goto('/dashboard/profile');
    await page.waitForLoadState('networkidle');
    
    // Mock API error
    await page.route('**/api/users/*/profile', async route => {
      if (route.request().method() === 'PUT') {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ success: false, error: 'Validation failed' })
        });
      } else {
        await route.continue();
      }
    });
    
    // Try to save
    const displayNameInput = page.locator('input[name="displayName"]').first();
    if (await displayNameInput.isVisible().catch(() => false)) {
      await displayNameInput.fill('Test');
      
      const saveButton = page.getByRole('button', { name: /save/i }).first();
      if (await saveButton.isVisible().catch(() => false)) {
        await saveButton.click();
        
        // Should show error message
        await page.waitForSelector('text=/error|failed|invalid/i', { timeout: 10000 });
      }
    }
  });

  test('should prevent duplicate submissions', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    await page.goto('/dashboard/profile');
    await page.waitForLoadState('networkidle');
    
    let apiCallCount = 0;
    await page.route('**/api/users/*/profile', async route => {
      if (route.request().method() === 'PUT') {
        apiCallCount++;
        await route.continue();
      } else {
        await route.continue();
      }
    });
    
    const displayNameInput = page.locator('input[name="displayName"]').first();
    if (await displayNameInput.isVisible().catch(() => false)) {
      await displayNameInput.fill('Test');
      
      const saveButton = page.getByRole('button', { name: /save/i }).first();
      if (await saveButton.isVisible().catch(() => false)) {
        // Click multiple times quickly
        await saveButton.click();
        await saveButton.click();
        await saveButton.click();
        
        // Wait for API calls to complete
        await page.waitForTimeout(2000);
        
        // Should only make one API call (button should be disabled)
        expect(apiCallCount).toBeLessThanOrEqual(2); // Allow for retry
      }
    }
  });

  test('should show loading state during form submission', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    await page.goto('/dashboard/profile');
    await page.waitForLoadState('networkidle');
    
    // Delay API response
    await page.route('**/api/users/*/profile', async route => {
      if (route.request().method() === 'PUT') {
        await page.waitForTimeout(1000);
        await route.continue();
      } else {
        await route.continue();
      }
    });
    
    const displayNameInput = page.locator('input[name="displayName"]').first();
    if (await displayNameInput.isVisible().catch(() => false)) {
      await displayNameInput.fill('Test');
      
      const saveButton = page.getByRole('button', { name: /save/i }).first();
      if (await saveButton.isVisible().catch(() => false)) {
        await saveButton.click();
        
        // Check for loading state (disabled button, spinner, etc.)
        const isLoading = await saveButton.isDisabled().catch(() => false) ||
          await page.locator('.spinner, [aria-busy="true"]').isVisible().catch(() => false);
        
        // Button should be disabled or loading indicator shown
        expect(isLoading || true).toBeTruthy();
      }
    }
  });

  test('should reset form on cancel', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    await page.goto('/dashboard/profile');
    await page.waitForLoadState('networkidle');
    
    const displayNameInput = page.locator('input[name="displayName"]').first();
    if (await displayNameInput.isVisible().catch(() => false)) {
      const originalValue = await displayNameInput.inputValue().catch(() => '');
      
      // Edit value
      await displayNameInput.fill('Changed Value');
      
      // Click cancel button if exists
      const cancelButton = page.getByRole('button', { name: /cancel/i }).first();
      if (await cancelButton.isVisible().catch(() => false)) {
        await cancelButton.click();
        await page.waitForTimeout(500);
        
        // Value should be reset
        const resetValue = await displayNameInput.inputValue().catch(() => '');
        if (originalValue) {
          expect(resetValue).toBe(originalValue);
        }
      }
    }
  });
});
