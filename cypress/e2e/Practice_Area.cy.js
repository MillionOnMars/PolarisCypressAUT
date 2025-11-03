import { login } from '../support/login.js';
import PracticeAreas from '../support/practiceAreas.js';

// Test suite for practice area navigation and subscription verification
describe('Practice Area Access Tests', () => {
    // Login before each test
    beforeEach(() => {
        cy.fixture('accounts.json').then((accounts) => {
            const { username, password } = accounts.existingUsers.subscribedUser; // User with 6 subscriptions
            login(username, password);
            
            // Wait for the nav-order API call to complete once per test
            cy.intercept('GET', '/api/settings/nav-order/fetch').as('navOrderFetch');
            cy.wait('@navOrderFetch', { timeout: 10000 });
        });
    });

    // Test access to areas without subscription - should show Contact Sales
    describe('Unsubscribed Practice Area Access', () => {
        PracticeAreas.testUnsubscribedAccess();
    });

    // Test access to subscribed practice areas - should show full content
    describe('Subscribed Practice Area Access', () => {
        PracticeAreas.testSubscribedAccess();
    });

    // Test navigation and tab switching for subscribed areas
    describe('Practice Area Navigation and Tab Switching', () => {
        PracticeAreas.testNavigationAndTabSwitching();
    });

    // Test tiles visibility for subscribed areas
    describe('Practice Area Tiles Verification', () => {
        PracticeAreas.testTilesVisibility();
    });
});
