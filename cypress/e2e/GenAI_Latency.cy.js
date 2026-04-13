import { login } from '../support/login.js';
import GenAI from '../support/genAI.js';

describe('Gen AI Latency Testing', () => {
    beforeEach(() => {
        cy.fixture('accounts.json').then((accounts) => {
            const { username, password } = accounts.existingUsers.latencyUser;
            login(username, password);
        });
    });

    GenAI.testGenAILBriefCaseLatency('IBM', 'Customer', 'IBM', 'SWOT SNAPSHOT PROD', 'Claude 4.6 Opus', true);
 
});
