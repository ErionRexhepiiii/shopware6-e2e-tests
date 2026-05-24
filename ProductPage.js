// pages/ProductPage.js
// Handles the product detail page (PDP)

const { expect } = require('@playwright/test');

class ProductPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Product detail page elements
    this.productTitle = page.locator('h1.product-detail-name, h1[itemprop="name"]');
    this.productPrice = page.locator('.product-detail-price, [itemprop="price"]');

    // Quantity input — some themes show it, some hide it; handle both gracefully
    this.quantityInput = page.locator(
      'input[name="quantity"], .product-detail-quantity-input input'
    );

    // The "Add to cart" button — Shopware's default class is .btn-buy
    this.addToCartButton = page.locator(
      'button.btn-buy, button[type="submit"].btn-buy, #productDetailPageBuyProductForm button[type="submit"]'
    );

    // Cart success notification / off-canvas cart
    this.cartSuccessNotification = page.locator(
      '.flashbag-container .alert-success, .offcanvas-cart, [data-off-canvas-cart]'
    );

    // Cart icon / link in header
    this.cartLink = page.locator(
      '.header-cart-btn, a.cart-item-count, [data-offcanvas-cart-toggle]'
    ).first();
  }

  /**
   * Verify we're on a product detail page by checking the title is visible
   */
  async verifyOnProductPage() {
    await expect(this.productTitle).toBeVisible({ timeout: 10000 });
  }

  /**
   * Add the current product to the cart
   */
  async addToCart() {
    await expect(this.addToCartButton).toBeVisible({ timeout: 8000 });
    await this.addToCartButton.click();

    // Wait for either an off-canvas cart to open OR a success flash message
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate directly to the cart page via URL
   * More reliable than clicking a dynamic off-canvas element
   */
  async goToCart() {
    await this.page.goto('/checkout/cart');
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Get the product name text from the PDP
   * @returns {Promise<string>}
   */
  async getProductName() {
    return await this.productTitle.innerText();
  }
}

module.exports = { ProductPage };
