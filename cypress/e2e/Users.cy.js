import { login } from '../support/login.js';
import Users from '../support/Users.js';

describe('User Management Tests', () => {
    
    beforeEach(() => {
        cy.fixture('accounts.json').then((accounts) => {
            const { username, password } = accounts.existingUsers.resetPasswordUser
            login(username, password);
        });
    });
    
    describe('Subscription Management', () => {
        Users.updateSubscription('AI Platforms');
    });
    
    describe('Organization Management', () => {
        Users.changeOrganization('AMD_QA','Microsoft','chadtest0808');
    });

    describe('Reset Password', () => {
        Users.resetPassword('chadtest09231', 'NewPassword123!', 'Testing12345!');
    });
});
