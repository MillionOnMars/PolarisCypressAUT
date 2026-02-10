import { login } from '../support/login.js';
import Users from '../support/Users.js';

describe('User Subscription Tests', () => {
    
    beforeEach(() => {
        cy.fixture('accounts.json').then((accounts) => {
            const { username, password } = accounts.existingUsers.resetPasswordUser
            login(username, password);
        });
    });
    afterEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
    });
    
    describe('Subscription Management', () => {
        Users.updateSubscription('AI Platforms');
    });
    
    describe('Organization Management', () => {
        Users.changeOrganization('AMD_QA','Microsoft','chadtest0808');
    });

});

describe('Analyst User Management', () => {
    
    beforeEach(() => {
        cy.fixture('accounts.json').then((accounts) => {
            const { username, password } = accounts.existingUsers.analyst
            login(username, password);
        });
    });
    afterEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
    });
    
    describe('Page Access Verification', () => {
        Users.verifyUserPages('analyst');
    });
});

describe('Analyst Plus User Management', () => {
    
    beforeEach(() => {
        cy.fixture('accounts.json').then((accounts) => {
            const { username, password } = accounts.existingUsers.analystp
            login(username, password);
        });
    });
    afterEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
    });
    
    describe('Page Access Verification', () => {
        Users.verifyUserPages('analystp');
    });
});
