import { login } from '../support/login.js';
import Chat from '../support/chat.js'; 

describe('Futurum AI operations', () => {
    // Log in to the application before running the tests
    beforeEach(() => {
        // Load existing user credentials from accounts.json
        cy.fixture('accounts.json').then((accounts) => {
            const { username, password } = accounts.existingUsers.admin;
            login(username, password);
        });
    });
    Chat.createChat();
});
