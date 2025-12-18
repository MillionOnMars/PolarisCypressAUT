import { login } from '../support/login.js';
import EmailJobs from '../support/emailJobs.js';

// Test suite for email jobs management
describe('Email Jobs Management Tests', () => {
    // Login as admin before each test
    beforeEach(() => {
        cy.fixture('accounts.json').then((accounts) => {
            const { username, password } = accounts.existingUsers.admin;
            login(username, password);
        });
    });

    // Test running batch jobs for all users in an organization
    describe('Batch Job Operations', () => {
        EmailJobs.runBatchJobs();
    });
    
    // Test sending emails to selected users in an organization
    describe('Send to Selected Users Operations', () => {
        EmailJobs.sendToSelectedUsers();
    });
    describe('Target Organizations section', () => {
        EmailJobs.verifySelectedOrganizations();
        EmailJobs.verifyOrganizationChecklist();
    });
    describe('Preview Section', () => {
        EmailJobs.previewEmailTemplate();
    });
});
