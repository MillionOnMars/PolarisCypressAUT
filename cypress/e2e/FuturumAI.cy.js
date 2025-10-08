import { login } from '../support/login.js';
import Research from '../support/research.js'; 

describe('Futurum AI operations', () => {
    // Log in to the application before running the tests
    beforeEach(() => {
        // Load existing user credentials from accounts.json
        cy.fixture('accounts.json').then((accounts) => {
            const { username, password } = accounts.existingUsers.admin;
            login(username, password);
        });
    });
    // Test all chat models (GPT-3.5, GPT-4, Gemini Pro)
    Research.createChat();
    // Test file operations with the 'recipe' file
    Research.Files('recipe');
    // Add tags to the notebook
    Research.manageTags();
});
