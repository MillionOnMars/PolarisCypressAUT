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
        EmailJobs.runBatchJobs('July 2025 Kevin', 'AMD_QA');
    });
    
    // Test sending emails to selected users in an organization
    describe('Send to Selected Users Operations', () => {
        EmailJobs.sendToSelectedUsers(
            'Test', 
            'Acme_QA',
            [
                'chad+test03180@milliononmars.com', 
                'kevin+110b@milliononmars.com'
            ]
        );
    });
    describe.only('Target Organizations section', () => {
        EmailJobs.verifySelectedOrganizations('AMD_QA','Acme_QA');
        EmailJobs.verifyOrganizationChecklist('AMD_QA');
    });
});
