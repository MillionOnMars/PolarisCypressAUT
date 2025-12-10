const TIMEOUT = 10000;

/**
 * Navigate to Admin panel
 * Used by: accounts-org.js, emailJobs.js, emailTemplates.js, Users.js
 */
export const navigateToAdmin = () => {
    cy.log('🔧 Navigating to Admin panel...');
    
    cy.get('[data-testid="SettingsSuggestIcon"]', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .click({ force: true });

    cy.get('[data-testid="AdminPanelSettingsIcon"]', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .click({ force: true });

    // Verify admin dashboard loaded
    cy.url({ timeout: 30000 }).should('include', '/admin');
    
    cy.wait(3000); // wait for 3 seconds to ensure the page loads

    cy.log('✅ Successfully navigated to Admin panel');

};

export const navigateToAccountsOrg = () => {
    // cy.contains('User Tags', {timeout: TIMEOUT})
    cy.get('[data-testid="AccountBalanceIcon"]', {timeout: TIMEOUT})
        .should('exist')
        .click()
    
    cy.contains('Accounts Overview', {timeout: TIMEOUT})
        .should('exist')

    cy.wait(3000); // wait for 3 seconds to ensure the page loads
};