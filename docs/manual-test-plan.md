\# Manual Test Plan — Shopware 6 Storefront Guest Checkout



\*\*Project:\*\* Shopware 6 Storefront QA Exercise

\*\*Author:\*\* Erion Rexhepi

\*\*Version:\*\* 1.0

\*\*Date:\*\* May 2026

\*\*Environment:\*\* https://www.shopware6-demo.development-s25.com



\---



\## 1. Introduction



This test plan covers manual testing of the guest user checkout flow on the Shopware 6 public demo storefront. The scope is limited to the core user journey:



> A guest visitor finds a product, adds it to the cart, and completes checkout using Cash on Delivery.



Manual tests are organised by feature area. Each test case is written at the level of detail a QA engineer would use during sprint testing or regression cycles.



\---



\## 2. Scope



\*\*In Scope:\*\*

\- Product search and search results page

\- Product Detail Page (PDP) — key UI elements and add to cart

\- Shopping cart — item display, quantities, totals

\- Guest checkout flow — email, billing address form

\- Form validation — required fields, format checks

\- Payment method selection — Cash on Delivery

\- Order confirmation page



\*\*Out of Scope:\*\*

\- Registered user account features

\- Admin / merchant panel

\- Payment gateway integrations (real transactions)

\- Performance or load testing

\- Back-end API testing



\---



\## 3. Test Environment



| Item | Detail |

|---|---|

| Application | Shopware 6 Storefront |

| URL | https://www.shopware6-demo.development-s25.com |

| Browser | Google Chrome (latest), Firefox (latest) |

| OS | Windows 11 / macOS |

| Test Type | Manual functional testing |

| Test Data | Guest email: testguest@qatest.dev |



\---



\## 4. Positive Test Cases



\### TC-POS-001 — Successful Product Search Returns Relevant Results



| Field | Detail |

|---|---|

| \*\*Title\*\* | Product search returns relevant results |

| \*\*Priority\*\* | High |

| \*\*Preconditions\*\* | User is on the storefront homepage |

| \*\*Test Steps\*\* | 1. Click the search bar in the header. 2. Type "Shirt" and press Enter or click the search icon. 3. Observe the search results page. |

| \*\*Expected Result\*\* | A list of products matching or related to "Shirt" is displayed. Results include product names, images, and prices. The URL updates to reflect the search query. |



\---



\### TC-POS-002 — Product Detail Page Displays Correct Information



| Field | Detail |

|---|---|

| \*\*Title\*\* | Product detail page renders all key elements |

| \*\*Priority\*\* | High |

| \*\*Preconditions\*\* | User has completed a search and sees results. |

| \*\*Test Steps\*\* | 1. Click on any product from the search results. 2. Observe the product detail page (PDP). |

| \*\*Expected Result\*\* | The PDP loads and displays: product name, at least one product image, a price, a product description, and an "Add to cart" button. |



\---



\### TC-POS-003 — Add Product to Cart Successfully



| Field | Detail |

|---|---|

| \*\*Title\*\* | Product is added to cart from PDP |

| \*\*Priority\*\* | High |

| \*\*Preconditions\*\* | User is on a product detail page. |

| \*\*Test Steps\*\* | 1. On the PDP, click the "Add to cart" button. 2. Observe the cart icon or notification area. |

| \*\*Expected Result\*\* | A success notification appears (e.g. toast message or off-canvas cart opens). The cart icon in the header updates to show at least 1 item. No error messages are displayed. |



\---



\### TC-POS-004 — Cart Displays Added Product Correctly



| Field | Detail |

|---|---|

| \*\*Title\*\* | Cart page reflects the product added |

| \*\*Priority\*\* | High |

| \*\*Preconditions\*\* | At least one product has been added to the cart. |

| \*\*Test Steps\*\* | 1. Navigate to the cart (click cart icon or go to /checkout/cart). 2. Observe the cart contents. |

| \*\*Expected Result\*\* | The cart page shows the product name, quantity (default 1), unit price, and total price. A "Proceed to checkout" button is visible. |



\---



\### TC-POS-005 — Guest Checkout Form Accepts Valid Data



| Field | Detail |

|---|---|

| \*\*Title\*\* | Guest can fill checkout form with valid data |

| \*\*Priority\*\* | High |

| \*\*Preconditions\*\* | Cart has at least one item. User has clicked "Proceed to checkout". |

| \*\*Test Steps\*\* | 1. Select or confirm the guest checkout option. 2. Fill in: email (testguest@qatest.dev), salutation, first name, last name, street, zip code, city, country. 3. Click Continue/Next. |

| \*\*Expected Result\*\* | The form is accepted without validation errors. The user is advanced to the next checkout step (payment/confirmation). |



\---



\### TC-POS-006 — Cash on Delivery is Selectable as Payment Method



| Field | Detail |

|---|---|

| \*\*Title\*\* | User can select Cash on Delivery on the confirm page |

| \*\*Priority\*\* | High |

| \*\*Preconditions\*\* | Guest address form has been successfully submitted. User is on the checkout confirm page. |

| \*\*Test Steps\*\* | 1. Locate the payment method section on the confirm page. 2. Select "Cash on Delivery" if it is not already selected. 3. Observe the selection state. |

| \*\*Expected Result\*\* | The Cash on Delivery radio button becomes selected. No error messages appear. The "Place Order" button remains enabled. |



\---



\### TC-POS-007 — Order is Placed Successfully and Confirmation Page Displays



| Field | Detail |

|---|---|

| \*\*Title\*\* | Order confirmation page is shown after placing order |

| \*\*Priority\*\* | High |

| \*\*Preconditions\*\* | User is on the checkout confirm page with Cash on Delivery selected. |

| \*\*Test Steps\*\* | 1. Review the order summary on the confirm page. 2. Click "Place Order" / "Confirm Order". 3. Observe the resulting page. |

| \*\*Expected Result\*\* | User is redirected to an order confirmation/thank-you page. A confirmation message is displayed (e.g. "Thank you for your order"). An order number is visible. |



\---



\## 5. Negative Test Cases



\### TC-NEG-001 — Checkout Form Rejects Missing Required Fields



| Field | Detail |

|---|---|

| \*\*Title\*\* | Required fields show validation errors when left blank |

| \*\*Priority\*\* | High |

| \*\*Preconditions\*\* | User is on the guest checkout address form. |

| \*\*Test Steps\*\* | 1. Leave all fields empty. 2. Click the Continue/Submit button. |

| \*\*Expected Result\*\* | The form does not submit. Inline validation error messages appear next to each required field (e.g. "This field is required"). The user stays on the same page. |



\---



\### TC-NEG-002 — Checkout Form Rejects Invalid Email Format



| Field | Detail |

|---|---|

| \*\*Title\*\* | Invalid email format is rejected on the checkout form |

| \*\*Priority\*\* | High |

| \*\*Preconditions\*\* | User is on the guest checkout address form. |

| \*\*Test Steps\*\* | 1. Enter an invalid email such as "notanemail" or "test@" in the email field. 2. Fill all other required fields with valid data. 3. Click Continue/Submit. |

| \*\*Expected Result\*\* | The form does not proceed. An error message specific to the email field is shown (e.g. "Please enter a valid email address"). |



\---



\### TC-NEG-003 — Search for Non-existent Product Shows Empty / No Results State



| Field | Detail |

|---|---|

| \*\*Title\*\* | Searching for a nonsense term shows an appropriate empty state |

| \*\*Priority\*\* | Medium |

| \*\*Preconditions\*\* | User is on the storefront homepage. |

| \*\*Test Steps\*\* | 1. Enter a term with no possible matches (e.g. "xyznonexistentproduct99999") in the search bar. 2. Press Enter. |

| \*\*Expected Result\*\* | The search results page loads without an error. A clear message is shown to the user indicating no products were found (e.g. "No results found for your search"). |



\---



\## 6. Edge Cases



\### TC-EDGE-001 — Add the Same Product to Cart Multiple Times



| Field | Detail |

|---|---|

| \*\*Title\*\* | Adding the same product twice updates quantity rather than duplicating the line item |

| \*\*Priority\*\* | Medium |

| \*\*Preconditions\*\* | User is on a product detail page. |

| \*\*Test Steps\*\* | 1. Click "Add to cart". 2. Return to the same PDP. 3. Click "Add to cart" again. 4. Navigate to the cart page. |

| \*\*Expected Result\*\* | The cart shows the product once with a quantity of 2, not as two separate line items. The total price reflects quantity x unit price. |



\---



\### TC-EDGE-002 — Checkout Form Accepts Special Characters in Name and Address Fields



| Field | Detail |

|---|---|

| \*\*Title\*\* | Form handles special and international characters without breaking |

| \*\*Priority\*\* | Low |

| \*\*Preconditions\*\* | User is on the guest checkout address form. |

| \*\*Test Steps\*\* | 1. Fill the form with data containing special characters: First Name: "Arion", Last Name: "O'Brien-Muller", Street: "Hauptstrasse 12a". 2. Fill remaining required fields normally. 3. Submit the form. |

| \*\*Expected Result\*\* | The form accepts the input without sanitisation errors. The data is carried through to the confirm page and displayed correctly. No encoding issues appear. |



\---



\### TC-EDGE-003 — Navigating Back from Confirm Page to Cart Does Not Duplicate Order



| Field | Detail |

|---|---|

| \*\*Title\*\* | Browser back navigation from confirm page does not cause a duplicate order |

| \*\*Priority\*\* | Medium |

| \*\*Preconditions\*\* | User has successfully placed an order and is on the confirmation page. |

| \*\*Test Steps\*\* | 1. After reaching the confirmation page, click the browser Back button. 2. Observe the page that loads. 3. Attempt to click "Place Order" again if accessible. |

| \*\*Expected Result\*\* | The browser either redirects back to the confirmation page or the cart is shown as empty. A duplicate order is NOT placed. |



\---



\## 7. Test Execution Summary (Template)



| Test Case ID | Title | Status | Notes |

|---|---|---|---|

| TC-POS-001 | Product search returns relevant results | — | |

| TC-POS-002 | Product detail page renders all key elements | — | |

| TC-POS-003 | Product is added to cart from PDP | — | |

| TC-POS-004 | Cart page reflects the product added | — | |

| TC-POS-005 | Guest can fill checkout form with valid data | — | |

| TC-POS-006 | Cash on Delivery is selectable | — | |

| TC-POS-007 | Order confirmation page is shown | — | |

| TC-NEG-001 | Required fields show validation errors | — | |

| TC-NEG-002 | Invalid email format is rejected | — | |

| TC-NEG-003 | No-results search shows empty state | — | |

| TC-EDGE-001 | Same product added twice updates quantity | — | |

| TC-EDGE-002 | Special characters accepted in form | — | |

| TC-EDGE-003 | Back navigation does not duplicate order | — | |

