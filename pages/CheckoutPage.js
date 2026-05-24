const { expect } = require('@playwright/test');

class CheckoutPage {
  constructor(page) {
    this.page = page;
  }

  async continueAsGuest() {
    const guestLink = this.page.locator(
      'a:has-text("Gast"), a:has-text("guest"), button:has-text("Gast"), button:has-text("guest")'
    ).first();
    if (await guestLink.count() > 0) {
      await guestLink.click();
      await this.page.waitForLoadState('domcontentloaded');
    }
  }

  async fillGuestAddressForm(data) {
    // Email — try multiple selectors
    const emailInput = this.page.locator(
      'input[type="email"], input[name="email"], input[id*="email"], input[placeholder*="mail"]'
    ).first();
    await expect(emailInput).toBeVisible({ timeout: 10000 });
    await emailInput.fill(data.email);

    // Salutation
    const salutation = this.page.locator('select[name*="salutation"], select[id*="salutation"]').first();
    if (await salutation.count() > 0) {
      await salutation.selectOption({ index: 1 });
    }

    // First name
    const firstName = this.page.locator(
      'input[name*="firstName"], input[name*="firstname"], input[id*="firstName"]'
    ).first();
    if (await firstName.count() > 0) await firstName.fill(data.firstName);

    // Last name
    const lastName = this.page.locator(
      'input[name*="lastName"], input[name*="lastname"], input[id*="lastName"]'
    ).first();
    if (await lastName.count() > 0) await lastName.fill(data.lastName);

    // Street
    const street = this.page.locator(
      'input[name*="street"], input[id*="street"]'
    ).first();
    if (await street.count() > 0) await street.fill(data.street);

    // Zip code
    const zip = this.page.locator(
      'input[name*="zipcode"], input[name*="zip"], input[id*="zip"]'
    ).first();
    if (await zip.count() > 0) await zip.fill(data.zipCode);

    // City
    const city = this.page.locator(
      'input[name*="city"], input[id*="city"]'
    ).first();
    if (await city.count() > 0) await city.fill(data.city);

    // Country
    const country = this.page.locator(
      'select[name*="country"], select[id*="country"]'
    ).first();
    if (await country.count() > 0) {
      try {
        await country.selectOption({ label: 'Germany' });
      } catch {
        await country.selectOption({ index: 1 });
      }
    }
  }

  async submitAddressForm() {
    const submitBtn = this.page.locator(
      'button[type="submit"]:has-text("Weiter"), button[type="submit"]:has-text("Continue"), button[type="submit"]:has-text("Next"), button[type="submit"]:has-text("Fortfahren"), .register-submit'
    ).first();
    await submitBtn.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async selectCashOnDelivery() {
    const codLabel = this.page.locator('label').filter({ hasText: /cash on delivery|nachnahme/i }).first();
    if (await codLabel.count() > 0) {
      await codLabel.click();
      await this.page.waitForTimeout(500);
    }
  }

  async placeOrder() {
    const orderBtn = this.page.locator(
      '#confirmFormSubmit, button:has-text("Zahlungspflichtig bestellen"), button:has-text("Place order"), button:has-text("Confirm")'
    ).first();
    await expect(orderBtn).toBeVisible({ timeout: 10000 });
    await orderBtn.click();
    await this.page.waitForLoadState('networkidle', { timeout: 30000 });
  }

  async verifyOrderConfirmation() {
    const confirmation = this.page.locator(
      'h1:has-text("Vielen Dank"), h1:has-text("Thank you"), .finish-ordernumber, h1:has-text("Danke")'
    ).first();
    await expect(confirmation).toBeVisible({ timeout: 15000 });
  }

  async getOrderNumber() {
    try {
      const orderNum = this.page.locator('.finish-ordernumber, [data-order-number]').first();
      return await orderNum.innerText({ timeout: 5000 });
    } catch {
      return 'Order number not found';
    }
  }
}

module.exports = { CheckoutPage };