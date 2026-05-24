// pages/CartPage.js
// Handles the cart / basket page

const { expect } = require('@playwright/test');

class CartPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Cart line items
    this.cartItems = page.locator('.cart-item, .line-item');

    // Total price in cart summary
    this.cartTotal = page.locator('.cart-total, [data-cart-total]');

    // "Proceed to checkout" button
    // Shopware uses a form submit that navigates to /checkout/confirm or /checkout/register
    this.checkoutButton = page.locator(
      'a[href*="/checkout"], button.begin-checkout-btn, .begin-checkout-btn, a.btn.btn-primary[href*="checkout"]'
    ).first();

    // Empty cart message
    this.emptyCartMessage = page.locator('.cart-empty, [data-empty-cart-message]');
  }

  /**
   * Verify at least one item is in the cart
   */
  async verifyCartHasItems() {
    await expect(this.cartItems.first()).toBeVisible({ timeout: 8000 });
  }

  /**
   * Proceed to checkout
   * This takes the user to the register/login page with a guest option
   */
  async proceedToCheckout() {
    await expect(this.checkoutButton).toBeVisible({ timeout: 8000 });
    await this.checkoutButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}

module.exports = { CartPage };
