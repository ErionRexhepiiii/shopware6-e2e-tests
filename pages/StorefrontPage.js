// pages/StorefrontPage.js
// Handles the homepage and product search interactions

const { expect } = require('@playwright/test');

class StorefrontPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // --- Selectors ---
    // Prefer accessible roles and labels first; fall back to stable CSS selectors.
    // Avoid nth-child, positional selectors, or anything tied to layout order.

    this.searchInput = page.getByRole('searchbox').or(
      page.locator('input[name="search"]')
    );

    this.searchSubmitButton = page.locator('button[type="submit"].header-search-btn').or(
      page.getByRole('button', { name: /search/i })
    );
  }

  /**
   * Navigate to the storefront homepage
   */
  async goto() {
    await this.page.goto('/');
    // Wait for the page to be interactive before proceeding
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Search for a product by keyword
   * @param {string} keyword
   */
  async searchFor(keyword) {
    await this.searchInput.click();
    await this.searchInput.fill(keyword);
    await this.searchInput.press('Enter');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click the first product in the search results listing
   */
  async selectFirstSearchResult() {
    // Target the product name link inside a product card/listing box
    const firstProduct = this.page
  	.locator('a[href*="/detail/"], .product-box a, .product-name a, h2 a, h3 a')
  	.first();

    await expect(firstProduct).toBeVisible({ timeout: 10000 });
    await firstProduct.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}

module.exports = { StorefrontPage };
