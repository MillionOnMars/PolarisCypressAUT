import { login } from '../support/login.js';
import Analytics from '../support/analytics.js';

describe('Analytics Operations', () => {
    // Log in to the application before running the tests
    beforeEach(() => {
        // Load existing user credentials from accounts.json
        cy.fixture('accounts.json').then((accounts) => {
            const { username, password } = accounts.existingUsers.admin;
            login(username, password);
        });
    });
    // Test all chat models
    Analytics.verifyAnalyticsDashboard();
});
