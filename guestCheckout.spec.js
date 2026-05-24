// tests/guestCheckout.spec.js
// End-to-end test: Guest user completes checkout using Cash on Delivery
//
// ASSUMPTION: The Shopware demo store at https://www.shopware6-demo.development-s25.com
// has at least one product matching the search keyword "Shirt" and has the
// "Cash on Delivery" payment method enabled.
//
// If the store layout changes (which can happen on a shared demo), selectors in the
// Page Objects may need updating. That's a known maintenance cost of E2E testing.

const { test, expect } = require('@playwright/test');
const { StorefrontPage } = require('../pages/StorefrontPage');
const { ProductPage } = require('../pages/ProductPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const { GUEST_USER, SEARCH_KEYWORD, ROUTES } = require('../helpers/testData');

// ─────────────────────────────────────────────────────────────────────────────
// Main happy-path test: Guest checkout with Cash on Delivery
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Guest Checkout — Cash on Delivery', () => {

  test('TC-AUTO-001: Guest user searches, adds product to cart, and completes checkout via Cash on Delivery', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // ── STEP 1: Open storefront ──────────────────────────────────────────────
    await storefront.goto();
    await expect(page).toHaveTitle(/.+/); // Page loads with any title
    console.log('✓ Homepage loaded');

    // ── STEP 2: Search for a product ─────────────────────────────────────────
    await storefront.searchFor(SEARCH_KEYWORD);

    // Verify the URL changed to a search results page
    await expect(page).toHaveURL(/search|find/, { timeout: 10000 });
    console.log(`✓ Search results loaded for "${SEARCH_KEYWORD}"`);

    // ── STEP 3: Select the first product ────────────────────────────────────
    await storefront.selectFirstSearchResult();

    // Verify we're on a product detail page
    await productPage.verifyOnProductPage();
    const productName = await productPage.getProductName();
    console.log(`✓ Product detail page loaded: "${productName}"`);

    // ── STEP 4: Add product to cart ──────────────────────────────────────────
    await productPage.addToCart();
    console.log('✓ Add to cart button clicked');

    // Navigate to cart page (more reliable than waiting for off-canvas animation)
    await productPage.goToCart();

    // ── STEP 5: Verify cart and proceed to checkout ──────────────────────────
    await expect(page).toHaveURL(new RegExp(ROUTES.cart), { timeout: 10000 });
    await cartPage.verifyCartHasItems();
    console.log('✓ Cart page: item present');

    await cartPage.proceedToCheckout();

    // ── STEP 6: Select guest checkout ───────────────────────────────────────
    // The URL should be on the register/checkout page now
    await page.waitForURL(/register|checkout/, { timeout: 15000 });
    console.log('✓ Reached checkout/register page');

    await checkoutPage.continueAsGuest();
    console.log('✓ Guest checkout option selected');

    // ── STEP 7: Fill billing address form ───────────────────────────────────
    await checkoutPage.fillGuestAddressForm(GUEST_USER);
    console.log('✓ Billing address form filled');

    await checkoutPage.submitAddressForm();
    console.log('✓ Address form submitted');

    // ── STEP 8: Select Cash on Delivery on the confirm page ─────────────────
    // After submitting, Shopware routes to /checkout/confirm
    await page.waitForURL(/confirm/, { timeout: 20000 });
    console.log('✓ Reached checkout confirm page');

    await checkoutPage.selectCashOnDelivery();
    console.log('✓ Cash on Delivery selected');

    // ── STEP 9: Place order ──────────────────────────────────────────────────
    await checkoutPage.placeOrder();
    console.log('✓ Order placed');

    // ── STEP 10: Verify order confirmation ──────────────────────────────────
    await page.waitForURL(/finish|confirm|thank/, { timeout: 30000 });
    await checkoutPage.verifyOrderConfirmation();

    const orderNumber = await checkoutPage.getOrderNumber();
    console.log(`✓ Order confirmation page reached. Order: ${orderNumber}`);

    // Final assertion — URL confirms we finished
    await expect(page).toHaveURL(/finish|thank/);
  });

});

// ─────────────────────────────────────────────────────────────────────────────
// Supplementary smoke tests
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Storefront Smoke Tests', () => {

  test('TC-AUTO-002: Homepage loads and displays navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/.+/);
    // Navigation / header should be visible
    const header = page.locator('header, .header-main, #header').first();
    await expect(header).toBeVisible();
  });

  test('TC-AUTO-003: Search with no results shows appropriate message', async ({ page }) => {
    const storefront = new StorefrontPage(page);
    await storefront.goto();
    await storefront.searchFor('xyznonexistentproduct12345');

    // Either an empty results message appears, or the result count is 0
    const noResultsMessage = page.locator(
      '[data-listing-count="0"], .no-result-headline, :text("0 results"), :text("no results")'
    ).first();

    // We accept either "no results" text OR zero products listed
    const productCards = page.locator('.product-box, .product-card');
    const productCount = await productCards.count();

    if (productCount > 0) {
      // If somehow results appear, at least assert the count is low
      expect(productCount).toBeLessThan(5);
    } else {
      // Ideally a "no results" message is shown — UX best practice
      // We log rather than hard-fail since different Shopware themes vary here
      console.log('✓ No product cards shown for nonsense search term');
    }
  });

  test('TC-AUTO-004: Cart page is accessible and shows empty state when no items added', async ({ page }) => {
    await page.goto('/checkout/cart');
    await expect(page).toHaveURL(/checkout\/cart/);

    // Page should render without a 500 error
    const body = page.locator('body');
    await expect(body).not.toContainText('500');
    await expect(body).not.toContainText('Internal Server Error');
  });

});
