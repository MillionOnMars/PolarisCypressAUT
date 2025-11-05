import { login } from '../support/login.js';
import Migration from '../support/migration.js';

describe('Migration Operations', () => {
    // Log in to the application before running the tests
    beforeEach(() => {
        // Load existing user credentials from accounts.json
        cy.fixture('accounts.json').then((accounts) => {
            const { username, password } = accounts.existingUsers.admin;
            login(username, password);
        });
    });
    // Test all chat models
    Migration.verifyMigration();
});
