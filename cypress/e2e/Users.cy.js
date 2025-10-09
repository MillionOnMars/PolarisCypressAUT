import { login } from '../support/login.js';
import Users from '../support/Users.js';

describe('User Management Tests', () => {
    
    // Log in to the application before running the tests
    beforeEach(() => {
        // Load existing user credentials from accounts.json
        cy.fixture('accounts.json').then((accounts) => {
            const { username, password } = accounts.existingUsers.admin;   
            login(username, password);
        });
    });
    
    describe('Subscription Management', () => {
        Users.updateSubscription('AI Devices');
    });
    
    describe('Organization Management', () => {
        Users.changeOrganization('AMD_QA','Microsoft_QA','chadtest0808');
    });
    
    describe('Reset Password', () => {
        Users.resetPassword('NewPassword123', 'Testing12345!');
    });
});
