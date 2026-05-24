# Bug Report

---

## BUG-001 — Checkout Address Form Does Not Display Inline Validation Errors on First Submit Attempt

| Field | Detail |
|---|---|
| **Title** | Checkout guest address form silently clears and resets on invalid submit instead of showing inline field errors |
| **Bug ID** | BUG-001 |
| **Date Reported** | May 2026 |
| **Reported By** | Erion Rexhepi |
| **Component** | Guest Checkout — Billing Address Form |
| **Environment** | Shopware 6 Demo Store |
| **URL** | https://www.shopware6-demo.development-s25.com/account/register |
| **Browser** | Google Chrome 124 (latest) |
| **OS** | Windows 11 |
| **Device** | Desktop |
| **Severity** | Medium |
| **Priority** | High |

---

### Preconditions

1. User has at least one item in the cart.
2. User has clicked "Proceed to checkout" from the cart page.
3. User is on the checkout/register page and has selected the guest checkout option.

---

### Steps to Reproduce

1. Navigate to https://www.shopware6-demo.development-s25.com
2. Add any product to the cart.
3. Click "Proceed to checkout".
4. Select the "Continue as guest" / "Order as guest" option.
5. Leave the **email** and **last name** fields completely blank.
6. Fill in all other required fields (salutation, first name, street, zip, city, country) with valid data.
7. Click the **Continue** / **Submit** button.

---

### Expected Result

The form submission is blocked. Inline validation messages appear directly beneath the empty required fields (e.g. "This field is required" under the email input and the last name input). The user remains on the same form page with their previously entered data preserved, so they only need to correct the highlighted fields.

This is consistent with standard HTML5 form validation UX and Shopware's own documentation for required field handling.

---

### Actual Result

The form briefly appears to submit, then the page reloads. **The previously filled fields are cleared**, returning the form to a blank state. No inline error messages are shown adjacent to the empty fields. The user has no clear indication of which fields were invalid — they must guess and re-enter all data from scratch.

On some test runs, a generic flash notification appeared at the top of the page (e.g. "Please fill in all required fields"), but it auto-dismissed within 2 seconds and did not highlight the specific problematic fields.

---

### Impact / Justification

This is a UX and functional issue that directly damages conversion rate on the checkout flow — the most business-critical path on any e-commerce storefront. Forcing a user to re-enter all form data after a validation failure introduces friction and increases cart abandonment risk. Additionally, the lack of per-field error messaging makes the storefront non-compliant with basic WCAG 2.1 accessibility guidelines (Success Criterion 3.3.1 — Error Identification), which is a concern for enterprise clients using Shopware.

The issue was reproduced consistently across 3 test runs. It may be caused by a JavaScript validation handler that resets form state on failed server-side validation, rather than validating client-side before submission.

---

### Attachments

- [ ] Screenshot: form blank state after failed submit
- [ ] Screenshot: missing inline error messages
- [ ] Screen recording (recommended): showing the submit → reload → blank form behaviour

---

### Suggested Fix

Implement client-side validation using the HTML5 `required` attribute combined with JavaScript validation feedback that:
1. Prevents form submission if required fields are empty
2. Adds a visible, accessible error message (e.g. `<span role="alert">`) directly beneath the invalid field
3. Preserves all other field values after a failed submission attempt
4. Focuses the first invalid field for keyboard accessibility
