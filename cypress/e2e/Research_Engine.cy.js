import { login } from '../support/login.js';
import ResearchEngine from '../support/researchEngine.js';

describe('Research Engine Tests', () => {
    beforeEach(() => {
        cy.fixture('accounts.json').then((accounts) => {
            const { username, password } = accounts.existingUsers.admin;
            login(username, password);
        });
    });

    describe('Create Agent', () => {
        ResearchEngine.testCreateAgent();
    });

    describe('Create Task', () => {
        ResearchEngine.testCreateTask();
    });

    describe('Delete Agent', () => {
        ResearchEngine.testDeleteAgent();
    });
});
