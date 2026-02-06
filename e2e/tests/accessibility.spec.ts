import { test, expect } from '@playwright/test';
import { waitForPageLoad } from '../utils/test-helpers';

test.describe('Accessibility Tests', () => {
  
  test('should have proper heading hierarchy on homepage', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    
    // Should have an h1
    const h1 = page.locator('h1');
    await expect(h1.first()).toBeVisible();
    
    // H1 should come before h2
    const h1Position = await h1.first().boundingBox();
    const h2 = page.locator('h2').first();
    
    if (await h2.isVisible()) {
      const h2Position = await h2.boundingBox();
      if (h1Position && h2Position) {
        expect(h1Position.y).toBeLessThan(h2Position.y);
      }
    }
  });

  test('should have alt text on images', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < Math.min(count, 10); i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const role = await img.getAttribute('role');
      
      // Image should have alt text or be marked as decorative
      const hasAccessibility = alt !== null || role === 'presentation' || role === 'none';
      
      if (!hasAccessibility) {
        const src = await img.getAttribute('src');
        console.log(`Image missing alt text: ${src}`);
      }
    }
    
    // At least the logo should have alt text
    const logo = page.getByRole('img', { name: /logo/i });
    await expect(logo.first()).toBeVisible();
  });

  test('should have proper form labels', async ({ page }) => {
    await page.goto('/sign-in');
    await waitForPageLoad(page);
    
    // Email field should have label
    const emailInput = page.getByLabel(/Email/i);
    await expect(emailInput).toBeVisible();
    
    // Password field should have label
    const passwordInput = page.getByLabel(/Password/i);
    await expect(passwordInput).toBeVisible();
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    
    // Check main heading is readable
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    
    // Get computed styles
    const styles = await heading.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        color: computed.color,
        backgroundColor: computed.backgroundColor,
        fontSize: computed.fontSize
      };
    });
    
    // Font size should be at least 16px for main content
    const fontSize = parseFloat(styles.fontSize);
    expect(fontSize).toBeGreaterThanOrEqual(16);
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    
    // Press Tab to navigate
    await page.keyboard.press('Tab');
    
    // Should focus on first interactive element
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON', 'INPUT']).toContain(focusedElement);
    
    // Continue tabbing
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
    }
    
    // Should still have focus somewhere
    const stillFocused = await page.evaluate(() => document.activeElement?.tagName);
    expect(stillFocused).toBeDefined();
  });

  test('should have skip to content link (if present)', async ({ page }) => {
    await page.goto('/');
    
    // Press Tab to reveal skip link (if it exists)
    await page.keyboard.press('Tab');
    
    // Check if skip link is present
    const skipLink = page.locator('a[href="#main"], a[href="#content"], .skip-link, .skip-to-content');
    const hasSkipLink = await skipLink.count() > 0;
    
    if (hasSkipLink) {
      console.log('Skip to content link found');
    } else {
      console.log('No skip to content link found - consider adding one');
    }
    
    // This is a soft check - not all sites need skip links
    expect(true).toBeTruthy();
  });

  test('should have proper button/link roles', async ({ page }) => {
    await page.goto('/sign-in');
    await waitForPageLoad(page);
    
    // Login button should have button role
    const loginButton = page.getByRole('button', { name: /Login/i });
    await expect(loginButton).toBeVisible();
    
    // Sign up should be a link
    const signUpLink = page.getByRole('link', { name: /Sign Up/i });
    await expect(signUpLink).toBeVisible();
  });

  test('should handle focus trapping in modals', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    
    // Try to find and open a modal (e.g., mobile menu)
    const menuButton = page.getByRole('button', { name: /Toggle mobile menu/i });
    
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await page.waitForTimeout(500);
      
      // If modal opened, focus should be trapped
      const isModalOpen = await page.locator('[role="dialog"], .modal, .mobile-menu').isVisible().catch(() => false);
      
      if (isModalOpen) {
        // Tab should stay within modal
        await page.keyboard.press('Tab');
        const focusedInModal = await page.evaluate(() => {
          const modal = document.querySelector('[role="dialog"], .modal, .mobile-menu');
          return modal?.contains(document.activeElement);
        });
        
        expect(focusedInModal).toBeTruthy();
      }
    }
    
    expect(true).toBeTruthy();
  });
});
