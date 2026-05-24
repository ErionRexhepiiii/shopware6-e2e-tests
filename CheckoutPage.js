// pages/CheckoutPage.js
// Handles the multi-step checkout: guest selection, address form, payment, confirmation

const { expect } = require('@playwright/test');

class CheckoutPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // --- Guest checkout option ---
    // Shopware shows a "Continue as guest" or "Order as guest" link/button
    this.continueAsGuestButton = page.locator(
      '[data-form-submit-loader-button] >> text=/guest/i, ' +
      'a:has-text("guest"), ' +
      'button:has-text("guest"), ' +
      '.register-guest'
    ).first();

    // Alternative locator using getByRole (accessible and stable)
    this.guestEmailInput = page.getByLabel(/email/i).first();

    // --- Billing address fields ---
    // Using getByLabel: the most resilient selector because it ties to the visible label text
    this.salutationSelect = page.locator('select[name="salutation"], select#personalSalutation');
    this.firstNameInput = page.getByLabel(/first name/i).first();
    this.lastNameInput = page.getByLabel(/last name/i).first();
    this.streetInput = page.getByLabel(/street/i).first();
    this.zipCodeInput = page.getByLabel(/zip|postal/i).first();
    this.cityInput = page.getByLabel(/city/i).first();
    this.countrySelect = page.locator('select[name*="country"], select#billingAddressCountry');

    // --- Payment method ---
    // Target the "Cash on Delivery" option by its visible label text
    this.cashOnDeliveryOption = page.locator(
      'input[type="radio"] + label:has-text("Cash on delivery"), ' +
      'label:has-text("Cash on delivery") input[type="radio"]'
    ).first();

    // Simpler fallback using filter
    this.paymentMethodLabels = page.locator('.payment-method label, [data-payment-method] label');

    // --- Order confirmation ---
    // The main CTA on the confirm page
    this.placeOrderButton = page.locator(
      '#confirmFormSubmit, button[form="confirmOrderForm"], button.confirm-checkout-submit'
    ).first();

    // Success page elements
    this.confirmationHeading = page.locator(
      'h1:has-text("Thank you"), h1:has-text("Order"), .finish-ordernumber'
    ).first();

    this.orderNumberText = page.locator(
      '.finish-ordernumber, [data-order-number], strong:has-text("SW")'
    ).first();
  }

  /**
   * Select guest checkout option on the register/login page
   * Shopware sometimes shows this as a tab or a direct link
   */
  async continueAsGuest() {
    // Try the guest tab/link first
    const guestLink = this.page.getByRole('link', { name: /guest/i })
      .or(this.page.getByRole('button', { name: /guest/i }));

    if (await guestLink.count() > 0) {
      await guestLink.first().click();
      await this.page.waitForLoadState('domcontentloaded');
    }
    // If no explicit "guest" button is found, Shopware may allow filling the form directly
    // (some themes merge the guest and register flows)
  }

  /**
   * Fill in the billing address form for a guest
   * @param {Object} data
   * @param {string} data.email
   * @param {string} data.firstName
   * @param {string} data.lastName
   * @param {string} data.street
   * @param {string} data.zipCode
   * @param {string} data.city
   */
  async fillGuestAddressForm(data) {
    // Email field
    await this.guestEmailInput.fill(data.email);

    // Salutation — pick the first non-placeholder option if the field exists
    const salutationExists = await this.salutationSelect.count();
    if (salutationExists > 0) {
      await this.salutationSelect.selectOption({ index: 1 }); // Skip blank placeholder
    }

    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.streetInput.fill(data.street);
    await this.zipCodeInput.fill(data.zipCode);
    await this.cityInput.fill(data.city);

    // Country — set to Germany (DE) if available (demo store default)
    const countryExists = await this.countrySelect.count();
    if (countryExists > 0) {
      // Try selecting Germany; fall back silently if not found
      try {
        await this.countrySelect.selectOption({ label: 'Germany' });
      } catch {
        await this.countrySelect.selectOption({ index: 1 });
      }
    }
  }

  /**
   * Submit the guest address form to proceed to payment selection
   */
  async submitAddressForm() {
    const continueButton = this.page.locator(
      'button[type="submit"].register-submit, button:has-text("Continue"), ' +
      'button:has-text("Next"), .register-login-guest button[type="submit"]'
    ).first();

    await continueButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Select Cash on Delivery as the payment method on the confirm page
   * Shopware's confirm page lists payment methods — we need to select the right radio
   */
  async selectCashOnDelivery() {
    // Scroll to payment section first to make sure it's in view
    const paymentSection = this.page.locator(
      '#confirmPaymentForm, .confirm-payment, [data-confirm-payment]'
    ).first();

    if (await paymentSection.count() > 0) {
      await paymentSection.scrollIntoViewIfNeeded();
    }

    // Find the Cash on Delivery radio input
    const codLabel = this.page.locator('label').filter({ hasText: /cash on delivery/i }).first();
    const codExists = await codLabel.count();

    if (codExists > 0) {
      await codLabel.click();
      await this.page.waitForTimeout(500); // Brief wait for UI state update
    } else {
      // Fallback: look for the radio directly
      const codRadio = this.page.locator('input[type="radio"][value*="cash"], input[type="radio"][id*="cash"]').first();
      if (await codRadio.count() > 0) {
        await codRadio.click();
      }
    }
  }

  /**
   * Click the final "Place Order" / "Confirm Order" button
   */
  async placeOrder() {
    await expect(this.placeOrderButton).toBeVisible({ timeout: 10000 });
    await this.placeOrderButton.click();
    // Longer wait — order submission involves a POST and redirect
    await this.page.waitForLoadState('networkidle', { timeout: 30000 });
  }

  /**
   * Verify we've landed on the order confirmation page
   */
  async verifyOrderConfirmation() {
    await expect(this.confirmationHeading).toBeVisible({ timeout: 15000 });
  }

  /**
   * Get the order number from the confirmation page (if displayed)
   * @returns {Promise<string>}
   */
  async getOrderNumber() {
    try {
      return await this.orderNumberText.innerText({ timeout: 5000 });
    } catch {
      return 'Order number element not found';
    }
  }
}

module.exports = { CheckoutPage };
