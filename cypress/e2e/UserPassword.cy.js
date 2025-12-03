import { login2 } from '../support/login.js';
import Users from '../support/Users.js';

describe('User Password Change Tests', () => {
    
    beforeEach(() => {
        cy.fixture('accounts.json').then((accounts) => {
            const { username, password } = accounts.existingUsers.resetPasswordUser
            login2(username, password);
        });
        
    });

    describe('Reset Password', () => {
        Users.resetPassword('chadtest09231', 'NewPassword123!', 'Testing12345!');
    });
});

