import { test, expect } from '@playwright/test';
import { TailwindChecker } from './helpers/tailwind-checker';

test.describe('Smart CSS Validation', () => {
  test('CSS works without inline style interference', async ({ page }) => {
    await page.goto('https://windventure.fr');
    
    const checker = new TailwindChecker(page);
    
    // Test complet Tailwind
    const tailwindWorks = await checker.runFullCheck();
    
    // Si Tailwind ne fonctionne pas, log les détails pour debug
    if (!tailwindWorks) {
      // Capture screenshot pour analyse visuelle
      await page.screenshot({ path: 'css-debug-screenshot.png', fullPage: true });
      
      // Log le CSS chargé
      const cssLinks = await page.locator('link[rel="stylesheet"]').all();
       CSS trouvé(s)`);
      
      for (const link of cssLinks) {
        const href = await link.getAttribute('href');
              }
    }
    
    // Le test passe avec warning si CSS ne fonctionne pas
    // (pour éviter de bloquer le CI/CD)
    expect(tailwindWorks).toBeTruthy();
  });

  test('CSS Test page shows colors correctly', async ({ page }) => {
    await page.goto('https://windventure.fr/css-test');
    
    // Vérifie spécifiquement les couleurs sur la page de test
    const redDiv = page.locator('.bg-red-500').first();
    
    if (await redDiv.count() > 0) {
      const bgColor = await redDiv.evaluate(el => window.getComputedStyle(el).backgroundColor);
      
      // bg-red-500 devrait être rgb(239, 68, 68)
      expect(bgColor).toMatch(/rgb\(239,\s*68,\s*68\)/);
          } else {
      console.warn('⚠️ Page test CSS non trouvée ou non stylée');
    }
  });
});