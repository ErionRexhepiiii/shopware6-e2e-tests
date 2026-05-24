// helpers/testData.js
// Centralised test data — keeping this in one place makes maintenance easy.
// For a real project, this could be loaded from a .env file or a fixture JSON.

const GUEST_USER = {
  email: 'testguest@qatest.dev',
  firstName: 'Jane',
  lastName: 'Tester',
  street: 'Teststraße 42',
  zipCode: '10115',
  city: 'Berlin',
};

// The product we'll use in the main flow test
// Using a known term that should return results on the Shopware demo store
const SEARCH_KEYWORD = 'Shirt';

// Expected URL fragments to assert we're on the right page
const ROUTES = {
  cart: '/checkout/cart',
  register: '/account/register',
  confirm: '/checkout/confirm',
  finish: '/checkout/finish',
};

module.exports = { GUEST_USER, SEARCH_KEYWORD, ROUTES };
