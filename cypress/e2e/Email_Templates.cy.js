import { login } from '../support/login.js';
import EmailTemplates from '../support/emailTemplates.js';

describe('Email Template Management Tests', () => {
    // Log in to the application before running the tests
    beforeEach(() => {
        // Load existing user credentials from accounts.json
        cy.fixture('accounts.json').then((accounts) => {
            const { username, password } = accounts.existingUsers.admin;
            login(username, password);
        });
    });
    
    describe('Email Template Operations', () => {
        EmailTemplates.manageEmailTemplate();
    });
    
});
