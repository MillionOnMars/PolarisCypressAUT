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
    // Test all chat models 
    Research.createChat();
    // Check ingest engine with analytics questions
    Research.createChatWithAnalyticsQuestions();
    // Test tool operations
    Research.testAllTools();
    // Test file operations with the 'recipe' file
    Research.Files('recipe');
    // Add tags to the notebook
    Research.manageTags();
});
