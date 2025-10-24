import { login } from '../support/login.js';
import Reports from '../support/reports.js';

// Test suite for reports section
describe('Reports Section Tests', () => {
    // Login as admin before each test
    beforeEach(() => {
        cy.fixture('accounts.json').then((accounts) => {
            const { username, password } = accounts.existingUsers.admin;
            login(username, password);
        });
    });

    // Test filtering reports with multiple criteria
    describe('Report Filter Operations', () => {
        Reports.filterReports();
    });

    // Test report preview functionality
    describe('Report Preview Operations', () => {
        Reports.viewReportPreview();
    });

    // Test report export functionality
    describe('Report Export Operations', () => {
        Reports.exportReports();
    });
});
