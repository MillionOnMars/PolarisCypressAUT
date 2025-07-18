export function login(username, password) {
    // Visit the Bike4mind URL
    cy.visit(Cypress.env('appUrl'), { timeout: 60000})

    // Login flow with proper timeouts
    cy.get('[name="username"]', { timeout: 60000 })
        .should('be.visible')
        .type(username);
    cy.get('[name="password"]', { timeout: 10000 })
        .should('be.visible')
        .type(password);
    cy.get('button[type="submit"]', { timeout: 10000 })
        .should('be.visible')
        .click();

    // Verify successful login
    cy.url({ timeout: 50000 }).should('include', '/home');
}