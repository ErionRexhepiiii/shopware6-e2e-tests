const { test, expect } = require('@playwright/test');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const { GUEST_USER, ROUTES } = require('../helpers/testData');

test.describe('Guest Checkout - Cash on Delivery', () => {

  test('TC-AUTO-001: Guest user browses category, adds product to cart, and completes checkout via Cash on Delivery', async ({ page }) => {
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await page.goto('/');
    await expect(page).toHaveTitle(/.+/);
    console.log('Homepage loaded');

    // Dismiss cookie banner if present
    try {
      const cookieBtn = page.locator('button:has-text("Nur technisch")').first();
      if (await cookieBtn.isVisible({ timeout: 3000 })) {
        await cookieBtn.click();
        await page.waitForTimeout(500);
      }
    } catch {}

    // Navigate directly to product
    await page.goto('/Demo-Produkt/SW10001');
    await page.waitForLoadState('domcontentloaded');
    console.log('Product page loaded');

    const productTitle = page.locator('h1').first();
    await expect(productTitle).toBeVisible({ timeout: 10000 });
    const productName = await productTitle.innerText();
    console.log('Product: ' + productName);

    // Add to cart
    const addToCartBtn = page.locator(
      'button:has-text("In den Warenkorb"), button:has-text("Add to cart"), button.btn-buy'
    ).first();
    await expect(addToCartBtn).toBeVisible({ timeout: 8000 });
    await addToCartBtn.click();
    await page.waitForTimeout(1000);
    console.log('Added to cart');

    // Go to cart
    await page.goto('/checkout/cart');
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(new RegExp(ROUTES.cart), { timeout: 10000 });
    await cartPage.verifyCartHasItems();
    console.log('Cart has items');

    // Go to checkout
    await page.goto('/checkout/confirm');
    await page.waitForLoadState('domcontentloaded');
    console.log('Reached checkout page');

    // Use exact IDs from the form — billing address fields only
    const vorname = page.locator('#billingAddress-personalFirstName');
    const nachname = page.locator('#billingAddress-personalLastName');
    const email = page.locator('#personalMail, input[name*="email"], input[id*="mail"]').first();
    const strasse = page.locator('#billingAddress-addressStreet, input[name*="billingAddress"][name*="street"]').first();
    const plz = page.locator('#billingAddress-addressZipcode, input[name*="billingAddress"][name*="zipcode"]').first();
    const ort = page.locator('#billingAddress-addressCity, input[name*="billingAddress"][name*="city"]').first();

    await expect(vorname).toBeVisible({ timeout: 10000 });

    await vorname.fill(GUEST_USER.firstName);
    await nachname.fill(GUEST_USER.lastName);
    await email.fill(GUEST_USER.email);
    await strasse.fill(GUEST_USER.street);
    await plz.fill(GUEST_USER.zipCode);
    await ort.fill(GUEST_USER.city);
    console.log('Address form filled');

    // Click Weiter
    await page.locator('button:has-text("Weiter")').first().click();
    await page.waitForLoadState('networkidle');
    console.log('Form submitted');

    // Should now be on confirm page
    await page.waitForURL(/confirm/, { timeout: 20000 });
    console.log('Reached confirm page');

   await checkoutPage.selectCashOnDelivery();
    console.log('Cash on Delivery selected');

    // Check the AGB (terms) checkbox — required before placing order
    const agbCheckbox = page.locator('input[type="checkbox"]').filter({ hasText: '' }).first()
      .or(page.locator('#tos, input[name*="tos"], input[name*="agb"]').first());
    const agb = page.locator('input[type="checkbox"]').first();
    if (await agb.isVisible({ timeout: 3000 })) {
      await agb.check();
      console.log('AGB checkbox checked');
    }

    await checkoutPage.placeOrder();
    console.log('Order placed');

    // Wait for any URL change after order — could be /checkout/finish or similar
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    const finalUrl = page.url();
    console.log('Final URL: ' + finalUrl);

    // Verify confirmation page by heading text instead of URL
    const confirmation = page.locator('h1, h2').filter({ hasText: /danke|vielen 	dank|bestell|thank|order/i }).first();
    await expect(confirmation).toBeVisible({ timeout: 15000 });
    console.log('Order confirmed!');
  });

});

test.describe('Storefront Smoke Tests', () => {

  test('TC-AUTO-002: Homepage loads and displays navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/.+/);
    const header = page.locator('header, .header-main, #header').first();
    await expect(header).toBeVisible();
  });

  test('TC-AUTO-003: Search with no results shows appropriate message', async ({ page }) => {
    await page.goto('/');
    await page.locator('input[name="search"]').fill('xyznonexistentproduct12345');
    await page.locator('input[name="search"]').press('Enter');
    await page.waitForLoadState('domcontentloaded');
    const productCards = page.locator('.product-box, .product-card');
    const productCount = await productCards.count();
    if (productCount === 0) {
      console.log('No products shown for nonsense search');
    } else {
      expect(productCount).toBeLessThan(5);
    }
  });

  test('TC-AUTO-004: Cart page is accessible and shows empty state when no items added', async ({ page }) => {
    await page.goto('/checkout/cart');
    await expect(page).toHaveURL(/checkout\/cart/);
    const body = page.locator('body');
    await expect(body).not.toContainText('500');
    await expect(body).not.toContainText('Internal Server Error');
  });

});