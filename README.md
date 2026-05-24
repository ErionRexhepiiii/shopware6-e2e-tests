# Shopware 6 Storefront — QA Automation Exercise

End-to-end Playwright tests for the guest checkout flow on the Shopware 6 public demo storefront, submitted as part of a QA/Automation Tester Internship application.

---

## Project Structure

```
shopware6-e2e-tests/
├── tests/
│   └── guestCheckout.spec.js     # Main E2E test + smoke tests
├── pages/
│   ├── StorefrontPage.js          # Homepage & search
│   ├── ProductPage.js             # Product detail page
│   ├── CartPage.js                # Shopping cart
│   └── CheckoutPage.js            # Full checkout flow
├── helpers/
│   └── testData.js                # Centralised test data
├── docs/
│   └── manual-test-plan.md        # Manual test plan (10+ test cases)
├── reports/
│   └── bug-report-BUG-001.md      # Bug report
├── playwright.config.js
├── package.json
└── README.md
```

The project uses the **Page Object Model (POM)** pattern. Each page of the application has its own class with locators and actions defined in one place. This keeps tests readable and reduces duplication — if a selector changes, you update it in the page object, not across every test.

---

## Environment

| Item | Detail |
|---|---|
| Application | Shopware 6 Storefront |
| Base URL | https://www.shopware6-demo.development-s25.com |
| Node.js | v18+ |
| Test Framework | Playwright v1.44 |
| Language | JavaScript |
| Browser | Chromium (headless by default) |

---

## Setup Instructions

**Prerequisites:** Node.js v18 or higher installed.

**1. Clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/shopware6-e2e-tests.git
cd shopware6-e2e-tests
```

**2. Install dependencies**

```bash
npm install
```

**3. Install Playwright browsers**

```bash
npx playwright install chromium
```

That's it — no `.env` file or additional config needed for the demo store.

---

## How to Run the Tests

**Run all tests (headless):**

```bash
npm test
```

**Run with a visible browser window:**

```bash
npm run test:headed
```

**Run in debug/step-through mode:**

```bash
npm run test:debug
```

**View the HTML report after a test run:**

```bash
npm run test:report
```

Reports are saved to `reports/playwright-report/`.

---

## Automated Test Coverage

| ID | Test | Type |
|---|---|---|
| TC-AUTO-001 | Full guest checkout via Cash on Delivery | E2E happy path |
| TC-AUTO-002 | Homepage loads and shows navigation | Smoke |
| TC-AUTO-003 | Nonsense search term shows no/few results | Negative smoke |
| TC-AUTO-004 | Cart page accessible, no 500 error | Smoke |

---

## Assumptions

1. **Demo store availability** — The shared demo store at the provided URL is online and accessible during test execution. Shared demos can be reset or go offline; this is outside our control.
2. **"Shirt" search term** — The demo store is assumed to have at least one product matching the keyword "Shirt". This was the most broadly applicable term found during exploratory testing. If the catalogue changes, update `SEARCH_KEYWORD` in `helpers/testData.js`.
3. **Cash on Delivery is enabled** — The payment method "Cash on Delivery" is assumed to be enabled in the demo store's admin settings.
4. **English language** — All selectors targeting visible label text (e.g. `getByLabel(/first name/i)`) assume the storefront is in English.
5. **No CAPTCHA / bot protection** — If the demo store introduces reCAPTCHA on the checkout form, the automation would require additional handling.
6. **Guest checkout is available** — The store is configured to allow guest orders (no forced account creation).

---

## Improvements With More Time

- **Visual regression testing** using `@percy/playwright` or Playwright's built-in screenshot diffing to catch unintended UI changes
- **Data-driven checkout tests** — run the checkout flow with multiple address datasets (international, edge-case characters) using Playwright's `test.each()`
- **Cross-browser coverage** — extend `playwright.config.js` to run on Firefox and WebKit (Safari engine)
- **Accessibility checks** — integrate `axe-playwright` to run automated a11y scans on each key page
- **CI/CD pipeline** — add a GitHub Actions workflow (`.github/workflows/playwright.yml`) to run tests on every pull request
- **Retry on flake** — add smarter retry logic for specific known-flaky interactions (e.g. off-canvas cart animations)
- **Test fixtures** — replace the hard-coded `GUEST_USER` data with Playwright fixtures for better test isolation and reuse
- **API-layer cart setup** — use Shopware's Store API to add items to cart directly, skipping the UI steps that precede the checkout. This would make the checkout test faster and less brittle

---

## Notes on Selector Strategy

Selectors are chosen in priority order:
1. `getByRole` + `getByLabel` — tied to accessible semantics, most resilient to visual redesigns
2. Stable `data-*` attributes or `id` attributes — direct and fast
3. CSS class selectors like `.btn-buy` or `.product-name` — used where Shopware's own markup provides stable, documented class names
4. Positional selectors (`nth`, `first()`) — used only as last resort and documented with a comment

Avoided: XPath, deeply nested CSS chains, and any selector referencing pixel coordinates or layout position.
