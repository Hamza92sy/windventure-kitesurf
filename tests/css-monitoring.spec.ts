// tests/css-monitoring.spec.ts
import { test, expect } from '@playwright/test';

test.describe('CSS Monitoring - Windventure.fr', () => {
  
  // Test 1 : Vérification que Tailwind CSS est chargé
  test('Tailwind CSS est correctement chargé', async ({ page }) => {
    await page.goto('https://windventure.fr');
    
    // Vérifie qu'au moins un fichier CSS est chargé
    const cssLinks = await page.locator('link[rel="stylesheet"]');
    await expect(cssLinks).toHaveCount(1, { timeout: 10000 });
    
    // Vérifie que le CSS contient des classes Tailwind typiques
    const response = await page.request.get(await cssLinks.first().getAttribute('href') || '');
    const cssContent = await response.text();
    
    expect(cssContent).toContain('.bg-blue-500');
    expect(cssContent).toContain('.text-white');
    expect(cssContent).toContain('.flex');
  });

  // Test 2 : Vérification visuelle sur la page de test
  test('Page CSS-Test affiche correctement les styles', async ({ page }) => {
    await page.goto('https://windventure.fr/css-test');
    
    // Vérifie que les éléments ont bien les styles Tailwind appliqués
    const blueButton = page.locator('.bg-blue-500');
    await expect(blueButton).toBeVisible();
    
    // Vérifie la couleur computed (rendu final)
    const buttonColor = await blueButton.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    expect(buttonColor).toBe('rgb(59, 130, 246)'); // bg-blue-500
  });

  // Test 3 : Anti-régression CSS inline destructeur
  test('Aucun style inline destructeur détecté', async ({ page }) => {
    await page.goto('https://windventure.fr');
    
    // Vérifie qu'il n'y a pas de style inline qui casse tout
    const bodyStyle = await page.locator('body').getAttribute('style');
    
    if (bodyStyle) {
      // Si il y a du style inline, il ne doit pas être destructeur
      expect(bodyStyle).not.toContain('background: #fff');
      expect(bodyStyle).not.toContain('color: #000');
      expect(bodyStyle).not.toContain('all: initial');
    }
  });

  // Test 4 : Vérification responsive Tailwind
  test('Classes responsive Tailwind fonctionnent', async ({ page }) => {
    await page.goto('https://windventure.fr');
    
    // Test mobile
    await page.setViewportSize({ width: 375, height: 667 });
    const mobileNav = page.locator('.md\\:hidden'); // Élément caché sur mobile
    if (await mobileNav.count() > 0) {
      await expect(mobileNav.first()).toBeVisible();
    }
    
    // Test desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    const desktopNav = page.locator('.hidden.md\\:block'); // Élément visible sur desktop
    if (await desktopNav.count() > 0) {
      await expect(desktopNav.first()).toBeVisible();
    }
  });

  // Test 5 : Performance CSS - pas de FOUC
  test('Pas de FOUC (Flash of Unstyled Content)', async ({ page }) => {
    await page.goto('https://windventure.fr', { 
      waitUntil: 'domcontentloaded' 
    });
    
    // Vérifie que dès le DOMContentLoaded, les styles sont appliqués
    const heroSection = page.locator('h1').first();
    await expect(heroSection).toBeVisible({ timeout: 2000 });
    
    // Vérifie que le texte n'est pas dans le style par défaut du navigateur
    const fontSize = await heroSection.evaluate(el => 
      window.getComputedStyle(el).fontSize
    );
    expect(fontSize).not.toBe('32px'); // Taille par défaut h1 navigateur
  });

  // Test 6 : Monitoring des erreurs 404 CSS
  test('Aucun fichier CSS en 404', async ({ page }) => {
    const failed404s: string[] = [];
    
    page.on('response', response => {
      if (response.url().includes('.css') && response.status() === 404) {
        failed404s.push(response.url());
      }
    });
    
    await page.goto('https://windventure.fr');
    await page.waitForLoadState('networkidle');
    
    expect(failed404s).toHaveLength(0);
  });
});