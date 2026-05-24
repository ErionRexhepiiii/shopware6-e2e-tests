const { expect } = require('@playwright/test');

class ProductPage {
  constructor(page) {
    this.page = page;

    this.productTitle = page.locator('h1').first();

    this.addToCartButton = page.locator(
      'button.btn-buy, button[type="submit"].btn-buy, #productDetailPageBuyProductForm button[type="submit"], button:has-text("Add to cart"), button:has-text("In den Warenkorb")'
    ).first();
  }

  async verifyOnProductPage() {
    await expect(this.productTitle).toBeVisible({ timeout: 10000 });
  }

  async addToCart() {
    await expect(this.addToCartButton).toBeVisible({ timeout: 8000 });
    await this.addToCartButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async goToCart() {
    await this.page.goto('/checkout/cart');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getProductName() {
    return await this.productTitle.innerText();
  }
}

module.exports = { ProductPage };