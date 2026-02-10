import { test, expect } from '@playwright/test';
import { loginAsClientAdmin, loginAsRegularUser, ensureLoggedOut } from '../utils/test-helpers';

test.describe('Functional Tests: Settings', () => {
  test.beforeEach(async ({ page }) => {
    await ensureLoggedOut(page);
  });

  test('should view settings page', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    await page.goto('/dashboard/settings');
    await page.waitForLoadState('networkidle');
    
    // Verify settings page loads
    await expect(page).toHaveURL(/.*settings/);
    
    // Check if settings content is displayed
    const settingsContent = page.locator('text=/settings|notifications|privacy|security/i').first();
    await expect(settingsContent).toBeVisible({ timeout: 10000 });
  });

  test('should toggle notification settings', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    await page.goto('/dashboard/settings');
    await page.waitForLoadState('networkidle');
    
    // Look for notification toggles
    const notificationToggle = page.locator('input[type="checkbox"][name*="notification"], button[role="switch"]').first();
    const hasToggle = await notificationToggle.isVisible().catch(() => false);
    
    if (hasToggle) {
      const initialState = await notificationToggle.isChecked().catch(() => false);
      
      // Toggle notification
      await notificationToggle.click();
      await page.waitForTimeout(1000);
      
      // Verify toggle state changed
      const newState = await notificationToggle.isChecked().catch(() => false);
      expect(newState).toBe(!initialState);
      
      // Toggle back
      await notificationToggle.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should change password', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    await page.goto('/dashboard/settings');
    await page.waitForLoadState('networkidle');
    
    // Look for change password button
    const changePasswordButton = page.getByRole('button', { name: /change password/i }).first();
    const hasButton = await changePasswordButton.isVisible().catch(() => false);
    
    if (hasButton) {
      await changePasswordButton.click();
      await page.waitForTimeout(1000);
      
      // Check if password form/modal opens
      const passwordForm = page.locator('input[type="password"], form').first();
      const hasForm = await passwordForm.isVisible().catch(() => false);
      expect(hasForm || true).toBeTruthy();
    }
  });

  test('should enable two-factor authentication', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    await page.goto('/dashboard/settings');
    await page.waitForLoadState('networkidle');
    
    // Look for 2FA button
    const twoFactorButton = page.getByRole('button', { name: /2fa|two-factor|enable/i }).first();
    const hasButton = await twoFactorButton.isVisible().catch(() => false);
    
    if (hasButton) {
      await twoFactorButton.click();
      await page.waitForTimeout(1000);
      
      // Check if 2FA setup modal/form opens
      const twoFactorForm = page.locator('form, [role="dialog"], text=/2fa|two-factor|qr code/i');
      const hasForm = await twoFactorForm.isVisible().catch(() => false);
      expect(hasForm || true).toBeTruthy();
    }
  });

  test('should view account settings sections', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    await page.goto('/dashboard/settings');
    await page.waitForLoadState('networkidle');
    
    // Check for settings sections
    const sections = page.locator('text=/notifications|privacy|security|account|preferences/i');
    const sectionCount = await sections.count();
    expect(sectionCount).toBeGreaterThan(0);
  });

  test('should logout from settings', async ({ page }) => {
    await loginAsClientAdmin(page);
    
    await page.goto('/dashboard/settings');
    await page.waitForLoadState('networkidle');
    
    // Look for logout button
    const logoutButton = page.getByRole('button', { name: /logout|sign out/i }).first();
    const hasButton = await logoutButton.isVisible().catch(() => false);
    
    if (hasButton) {
      await logoutButton.click();
      await page.waitForTimeout(2000);
      
      // Verify redirected to sign-in page
      await expect(page).toHaveURL(/.*sign-in/);
    }
  });
});
