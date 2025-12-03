import { login } from '../support/login.js';
import Users from '../support/Users.js';

describe('User Password Change Tests', () => {
    
    beforeEach(() => {
        cy.fixture('accounts.json').then((accounts) => {
            const { username, password } = accounts.existingUsers.resetPasswordUser
            login(username, password);
        });
    });

    afterEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
    });

    describe('Reset Password', () => {
        Users.resetPassword('chadtest09231', 'NewPassword123!', 'Testing12345!');
    });
});

