import { test, expect } from '@playwright/test';

test.describe('CSS Validation Tests', () => {
  test('Tailwind CSS is properly loaded and applied', async ({ page }) => {
    // Test the main page
    await page.goto('/');
    
    // Check if CSS file is loaded
    const cssResponse = await page.waitForResponse(response =>
      response.url().includes('_next/static/css/') && response.status() === 200
    );
    expect(cssResponse).toBeTruthy();

    // Check if Tailwind classes are applied by testing computed styles
    const heroSection = page.locator('[class*="bg-"]').first();
    await expect(heroSection).toBeVisible();

    // Verify background color is not default white
    const bgColor = await heroSection.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    );
    expect(bgColor).not.toBe('rgba(0, 0, 0, 0)'); // Not transparent
    expect(bgColor).not.toBe('rgb(255, 255, 255)'); // Not white
  });

  test('CSS Test page displays colors correctly', async ({ page }) => {
    await page.goto('/css-test');
    
    // Check if test page has colored backgrounds
    const redBackground = page.locator('div').first();
    const bgColor = await redBackground.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    );
    
    // Should be red (rgb(239, 68, 68) for bg-red-500)
    expect(bgColor).toMatch(/rgb\(239,\s*68,\s*68\)/);
    
    // Check if blue box exists and has blue background  
    const blueBox = page.locator('[class*="bg-blue"]');
    await expect(blueBox).toBeVisible();
    
    const blueBgColor = await blueBox.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor  
    );
    expect(blueBgColor).toMatch(/rgb\(37,\s*99,\s*235\)/); // bg-blue-600
  });

  test('Typography styles are applied', async ({ page }) => {
    await page.goto('/');
    
    // Check if headings have proper font weight
    const heading = page.locator('h1').first();
    const fontWeight = await heading.evaluate((el) =>
      window.getComputedStyle(el).fontWeight
    );
    
    // Should be bold (700) or bolder
    expect(parseInt(fontWeight)).toBeGreaterThanOrEqual(700);
  });

  test('Responsive grid layout works', async ({ page }) => {
    await page.goto('/');
    
    // Test desktop grid
    await page.setViewportSize({ width: 1200, height: 800 });
    
    const gridContainer = page.locator('[class*="grid"]').first();
    if (await gridContainer.isVisible()) {
      const display = await gridContainer.evaluate((el) =>
        window.getComputedStyle(el).display
      );
      expect(display).toBe('grid');
    }

    // Test mobile responsive
    await page.setViewportSize({ width: 375, height: 667 });
    // Grid should still be functional on mobile
    if (await gridContainer.isVisible()) {
      const display = await gridContainer.evaluate((el) =>
        window.getComputedStyle(el).display
      );
      expect(display).toBe('grid');
    }
  });

  test('No critical CSS loading errors', async ({ page }) => {
    const cssErrors: string[] = [];
    
    page.on('response', response => {
      if (response.url().includes('.css') && !response.ok()) {
        cssErrors.push(`CSS Error: ${response.url()} - ${response.status()}`);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    expect(cssErrors).toEqual([]);
  });
});

test.describe('Visual Regression Tests', () => {
  test('Homepage visual consistency', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot and compare (will create baseline on first run)
    await expect(page).toHaveScreenshot('homepage-full.png', {
      fullPage: true,
      threshold: 0.2 // Allow 20% difference for minor changes
    });
  });

  test('CSS Test page visual validation', async ({ page }) => {
    await page.goto('/css-test');
    await page.waitForLoadState('networkidle');
    
    // This should show bright colors - if it's all white/black, CSS is broken
    await expect(page).toHaveScreenshot('css-test-page.png', {
      threshold: 0.1
    });
  });
});