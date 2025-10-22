import { login } from '../support/login.js';
import EmailTemplates from '../support/emailTemplates.js';

describe('Email Management Tests', () => {
    // Log in to the application before running the tests
    beforeEach(() => {
        // Load existing user credentials from accounts.json
        cy.fixture('accounts.json').then((accounts) => {
            const { username, password } = accounts.existingUsers.admin;
            login(username, password);
        });
    });
     // Test create, edit, and delete email templates
    describe('Email Template Operations', () => {
        EmailTemplates.manageEmailTemplate();
    });
    // Test create, edit, and delete dataset templates
    describe('Dataset Email Template Operations', () => {
        EmailTemplates.manageDatasetEmailTemplate();
    });
    
});
