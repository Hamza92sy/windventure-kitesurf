import { test, expect } from '@playwright/test';

test.describe('Payment Flow End-to-End', () => {
  
  test('should complete booking flow from packages to payment', async ({ page }) => {
    // Navigate to packages page
    await page.goto('/packages');
    
    // Click on a package (Combined Package)
    await page.click('[data-package-id="combined"]');
    
    // Should navigate to booking page
    await expect(page).toHaveURL(/\/book\?package=combined/);
    
    // Package should be detected and displayed
    await expect(page.locator('h3')).toContainText('Combined Package');
    await expect(page.locator('text=€1,350')).toBeVisible();
    
    // Fill out the booking form
    await page.fill('[name="firstName"]', 'Jean');
    await page.fill('[name="lastName"]', 'Dupont');
    await page.fill('[name="email"]', 'jean.dupont@example.com');
    await page.fill('[name="phone"]', '+33 6 12 34 56 78');
    
    // Set preferred date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    await page.fill('[name="preferredDate"]', dateString);
    
    // Select participants
    await page.selectOption('[name="participants"]', '2');
    
    // Add special requests
    await page.fill('[name="specialRequests"]', 'First time kitesurfing, looking forward to the experience!');
    
    // Verify booking summary shows correct total
    await expect(page.locator('text=€2,700')).toBeVisible(); // 1,350 × 2 participants
    
    // Click book now button (this would redirect to Stripe in real scenario)
    const bookButton = page.locator('button[type="submit"]');
    await expect(bookButton).toContainText('Book Now - €1,350');
    await expect(bookButton).toBeEnabled();
    
    // Note: In a real test, you would mock Stripe or use test mode
    // For now, we just verify the form is properly set up
  });
  
  test('should handle package not found gracefully', async ({ page }) => {
    // Navigate to booking page with invalid package
    await page.goto('/book?package=invalid-package');
    
    // Should show error message
    await expect(page.locator('text=Package Not Found')).toBeVisible();
    await expect(page.locator('text=invalid-package')).toBeVisible();
    
    // Should have link back to packages
    const backLink = page.locator('a[href="/packages"]');
    await expect(backLink).toBeVisible();
    await expect(backLink).toContainText('Back to Packages');
  });
  
  test('should validate required form fields', async ({ page }) => {
    // Navigate to booking page with valid package
    await page.goto('/book?package=beginner-private');
    
    // Try to submit without filling required fields
    await page.click('button[type="submit"]');
    
    // Browser should show validation messages for required fields
    const firstNameInput = page.locator('[name="firstName"]');
    await expect(firstNameInput).toBeFocused();
  });
  
  test('should calculate pricing correctly for different participants', async ({ page }) => {
    // Test with different packages and participant counts
    const testCases = [
      { package: 'beginner-private', price: 720, participants: 1, total: 720 },
      { package: 'beginner-semi-private', price: 1100, participants: 2, total: 2200 },
      { package: 'exploration', price: 1250, participants: 3, total: 3750 },
      { package: 'combined', price: 1350, participants: 4, total: 5400 }
    ];
    
    for (const testCase of testCases) {
      await page.goto(`/book?package=${testCase.package}`);
      
      // Verify package price is displayed
      await expect(page.locator(`text=€${testCase.price.toLocaleString()}`)).toBeVisible();
      
      // Select participants
      await page.selectOption('[name="participants"]', testCase.participants.toString());
      
      // Verify total calculation
      await expect(page.locator(`text=€${testCase.total.toLocaleString()}`)).toBeVisible();
    }
  });
  
  test('should handle success page correctly', async ({ page }) => {
    // Navigate to success page with session ID
    await page.goto('/success?session_id=cs_test_123456789');
    
    // Should show success message
    await expect(page.locator('text=Booking Confirmed!')).toBeVisible();
    await expect(page.locator('text=Thank you for choosing Windventure')).toBeVisible();
    
    // Should have return home button
    const homeButton = page.locator('a[href="/"]');
    await expect(homeButton).toBeVisible();
    await expect(homeButton).toContainText('Return to Homepage');
  });
  
  test('should handle cancel page correctly', async ({ page }) => {
    // Navigate to cancel page with package ID
    await page.goto('/cancel?package=combined');
    
    // Should show cancel message
    await expect(page.locator('text=Booking Cancelled')).toBeVisible();
    await expect(page.locator('text=no charges were made')).toBeVisible();
    
    // Should have complete booking button with original package
    const completeButton = page.locator('a[href="/book?package=combined"]');
    await expect(completeButton).toBeVisible();
    await expect(completeButton).toContainText('Complete Your Booking');
  });
  
});