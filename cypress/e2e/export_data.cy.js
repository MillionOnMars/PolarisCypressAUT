import { login } from "../support/login";
import exportdata, { getRandomPracticeArea } from "../support/export-data";

describe('Verify Export Data functionality', () => {
    const randomPracticeAreas = getRandomPracticeArea(3); // Get 3 random practice areas
    
    beforeEach(() => {
        // Load existing user credentials from accounts.json
        cy.fixture('accounts.json').then((accounts) => {
            const { username, password } = accounts.existingUsers.admin;
            login(username, password);
        });
    });

    // Choose 3 random Practice Areas and verify export data functionality
    randomPracticeAreas.forEach((area) => {
        exportData(area);
    });
});