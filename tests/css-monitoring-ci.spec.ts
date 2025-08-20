// tests/css-monitoring-ci.spec.ts - Version CI/CD optimisée
import { test, expect } from '@playwright/test';

test.describe('CI/CD CSS Health Check', () => {
  
  test('Quick CSS Health Check', async ({ page }) => {
    await page.goto(process.env.VERCEL_URL || 'https://windventure.fr');
    
    // 1. CSS est chargé
    const cssLink = page.locator('link[rel="stylesheet"]').first();
    await expect(cssLink).toBeVisible();
    
    // 2. Au moins un élément Tailwind est stylé
    const styledElement = page.locator('[class*="bg-"], [class*="text-"], [class*="flex"]').first();
    await expect(styledElement).toBeVisible();
    
    // 3. Pas de FOUC visible
    await page.waitForTimeout(500); // Simule un utilisateur réel
    const computedStyle = await styledElement.evaluate(el => 
      window.getComputedStyle(el).color
    );
    expect(computedStyle).not.toBe('rgb(0, 0, 0)'); // Pas la couleur par défaut
  });
});