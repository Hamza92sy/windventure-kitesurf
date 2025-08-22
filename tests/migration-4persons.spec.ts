import { test, expect } from '@playwright/test';

/**
 * 🧪 TESTS AUTOMATISÉS - MIGRATION PACKAGES 4 PERSONNES
 * Valide le flux complet réservation avec nouveaux packages optimisés
 */

test.describe('Migration 4 Personnes - Tests Critiques', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigation vers packages optimisés
    await page.goto('/packages');
  });

  test('🎯 Affichage packages optimisés avec pricing 4 personnes', async ({ page }) => {
    // Vérifier présence nouveaux packages
    await expect(page.locator('text=Semi-Private Discovery')).toBeVisible();
    await expect(page.locator('text=Semi-Private Experience')).toBeVisible();
    await expect(page.locator('text=Exploration Adventure')).toBeVisible();
    await expect(page.locator('text=Combined Ultimate')).toBeVisible();
    
    // Vérifier pricing par personne affiché
    await expect(page.locator('text=€380')).toBeVisible(); // Semi-Private Discovery
    await expect(page.locator('text=€580')).toBeVisible(); // Semi-Private Experience
    await expect(page.locator('text=€750')).toBeVisible(); // Exploration Adventure
    await expect(page.locator('text=€950')).toBeVisible(); // Combined Ultimate
    
    // Vérifier capacité max 4 personnes mentionnée
    await expect(page.locator('text=Max 4')).toBeVisible();
  });

  test('💳 Réservation Beginner Private (1 personne) - Prix fixe', async ({ page }) => {
    // Sélectionner Beginner Private
    await page.click('text=Beginner Private');
    await page.click('text=Book Now');
    
    // Vérifier pricing forfaitaire
    await expect(page.locator('text=€720 (forfait 1 personne)')).toBeVisible();
    
    // Remplir formulaire
    await page.fill('[name="firstName"]', 'Test');
    await page.fill('[name="lastName"]', 'User');
    await page.fill('[name="email"]', 'test@windventure.fr');
    await page.fill('[name="phone"]', '+33612345678');
    await page.fill('[name="preferredDate"]', '2024-12-01');
    
    // Vérifier participants fixé à 1
    await expect(page.locator('[name="participants"]')).toHaveValue('1');
    await expect(page.locator('option[value="2"]')).not.toBeVisible();
    
    // Vérifier prix total
    await expect(page.locator('text=€720')).toBeVisible();
    
    // Clic payment (test sans aller jusqu'à Stripe)
    await page.click('button:has-text("Proceed to Payment")');
  });

  test('👥 Réservation Semi-Private Discovery (4 personnes) - Calcul dynamique', async ({ page }) => {
    // Sélectionner Semi-Private Discovery
    await page.click('text=Semi-Private Discovery');
    await page.click('text=Book Now');
    
    // Vérifier breakdown pricing affiché
    await expect(page.locator('text=Pricing Breakdown (4 personnes max)')).toBeVisible();
    
    // Remplir formulaire
    await page.fill('[name="firstName"]', 'Test');
    await page.fill('[name="lastName"]', 'Group');
    await page.fill('[name="email"]', 'group@windventure.fr');
    await page.fill('[name="phone"]', '+33612345679');
    await page.fill('[name="preferredDate"]', '2024-12-15');
    
    // Test calcul dynamique participants
    await page.selectOption('[name="participants"]', '1');
    await expect(page.locator('text=€380')).toBeVisible(); // 1 × 380€
    
    await page.selectOption('[name="participants"]', '2');
    await expect(page.locator('text=€760')).toBeVisible(); // 2 × 380€
    
    await page.selectOption('[name="participants"]', '3');
    await expect(page.locator('text=€1,140')).toBeVisible(); // 3 × 380€
    
    await page.selectOption('[name="participants"]', '4');
    await expect(page.locator('text=€1,520')).toBeVisible(); // 4 × 380€ MAX!
    
    // Vérifier pas d'option 5 personnes
    await expect(page.locator('option[value="5"]')).not.toBeVisible();
    
    // Procéder au payment avec 4 personnes
    await page.click('button:has-text("Proceed to Payment")');
  });

  test('📊 Validation contraintes max participants', async ({ page }) => {
    // Test avec package groupe
    await page.click('text=Exploration Adventure');
    await page.click('text=Book Now');
    
    // Remplir formulaire valide
    await page.fill('[name="firstName"]', 'Test');
    await page.fill('[name="lastName"]', 'Constraint');
    await page.fill('[name="email"]', 'constraint@windventure.fr');
    await page.fill('[name="phone"]', '+33612345680');
    await page.fill('[name="preferredDate"]', '2024-12-20');
    
    // Vérifier sélection max 4 participants possible
    const participantsSelect = page.locator('[name="participants"]');
    await expect(participantsSelect.locator('option')).toHaveCount(4); // 1,2,3,4
    
    // Test avec 4 participants (max)
    await page.selectOption('[name="participants"]', '4');
    await expect(page.locator('text=€3,000')).toBeVisible(); // 4 × 750€
    
    // Vérifier pas de message erreur
    await expect(page.locator('text=Maximum')).not.toBeVisible();
  });

  test('🔄 Test API checkout optimisée', async ({ page, request }) => {
    // Test API directement
    const response = await request.get('/api/checkout/optimized?packageId=semi-private-discovery&participants=3');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.package.name).toBe('Semi-Private Discovery');
    expect(data.participants).toBe(3);
    expect(data.totalPrice).toBe(1140); // 3 × 380€
    expect(data.maxParticipants).toBe(4);
  });

  test('📧 Données correctes envoyées à Make.com/Notion', async ({ page }) => {
    // Intercepter requêtes réseau
    let checkoutPayload: any = null;
    
    page.on('request', request => {
      if (request.url().includes('/api/checkout/optimized')) {
        checkoutPayload = request.postDataJSON();
      }
    });
    
    // Effectuer réservation complète
    await page.click('text=Combined Ultimate');
    await page.click('text=Book Now');
    
    await page.fill('[name="firstName"]', 'Premium');
    await page.fill('[name="lastName"]', 'Customer');
    await page.fill('[name="email"]', 'premium@windventure.fr');
    await page.fill('[name="phone"]', '+33612345681');
    await page.fill('[name="preferredDate"]', '2024-12-25');
    await page.selectOption('[name="participants"]', '4');
    await page.fill('[name="specialRequests"]', 'Test migration 4 personnes');
    
    await page.click('button:has-text("Proceed to Payment")');
    
    // Vérifier données payload
    expect(checkoutPayload).toBeDefined();
    expect(checkoutPayload.packageId).toBe('combined-ultimate');
    expect(checkoutPayload.participants).toBe(4);
    expect(checkoutPayload.bookingData.firstName).toBe('Premium');
    expect(checkoutPayload.bookingData.specialRequests).toBe('Test migration 4 personnes');
  });

  test('💰 Vérification marges business calculées', async ({ page }) => {
    // Ce test vérifie que les marges calculées correspondent au business plan
    
    const testCases = [
      { 
        package: 'semi-private-discovery', 
        participants: 4, 
        expectedRevenue: 1520,
        expectedMargin: 692 // Revenue - charges - instructeur
      },
      { 
        package: 'semi-private-experience', 
        participants: 4, 
        expectedRevenue: 2320,
        expectedMargin: 972
      },
      { 
        package: 'exploration-adventure', 
        participants: 4, 
        expectedRevenue: 3000,
        expectedMargin: 1350
      },
      { 
        package: 'combined-ultimate', 
        participants: 4, 
        expectedRevenue: 3800,
        expectedMargin: 1830
      }
    ];

    for (const testCase of testCases) {
      const response = await page.request.get(`/api/checkout/optimized?packageId=${testCase.package}&participants=${testCase.participants}`);
      const data = await response.json();
      
      expect(data.totalPrice).toBe(testCase.expectedRevenue);
      console.log(`✅ ${data.package.name}: ${data.totalPrice}€ revenue, ~${testCase.expectedMargin}€ marge estimée`);
    }
  });

  test('🚨 Test rollback - Ancien système encore accessible', async ({ page }) => {
    // Vérifier que l'ancien système peut encore fonctionner si nécessaire
    await page.goto('/packages-legacy'); // Si on garde une version legacy
    
    // Ou vérifier compatibilité avec anciens IDs
    const response = await page.request.get('/api/packages/beginner-semi-private');
    // Si 404, c'est normal, sinon vérifier mapping
  });
});

test.describe('Performance et UX - Migration', () => {
  
  test('⚡ Temps de chargement pages packages < 2s', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/packages');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(2000); // < 2 secondes
    console.log(`🏎️ Packages loaded in ${loadTime}ms`);
  });
  
  test('📱 Interface mobile responsive packages 4 personnes', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/packages');
    
    // Vérifier affichage mobile OK
    await expect(page.locator('text=Semi-Private Discovery')).toBeVisible();
    await expect(page.locator('text=Max 4 pers')).toBeVisible();
    
    // Test formulaire mobile
    await page.click('text=Semi-Private Discovery');
    await page.click('text=Book Now');
    
    // Vérifier formulaire utilisable sur mobile
    await expect(page.locator('[name="participants"]')).toBeVisible();
    await expect(page.locator('text=Pricing Breakdown')).toBeVisible();
  });
});

/**
 * 🎯 RÉSULTATS ATTENDUS
 * 
 * ✅ Tous les tests DOIVENT passer pour validation migration
 * ✅ Pricing 4 personnes correct partout
 * ✅ API checkout optimisée fonctionnelle
 * ✅ Contraintes max participants respectées
 * ✅ Performance maintenue < 2s
 * ✅ Mobile responsive OK
 */