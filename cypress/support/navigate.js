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

// Navigate to Research Engine page
export const navigateToResearchEngine = () => {
    cy.contains('Analyst Tools', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .click({ force: true });

    cy.wait(2000);
    
    cy.get('p[aria-label="Research Tool"]', { timeout: TIMEOUT })
        .first()
        .should('exist')
        .click({ force: true });
    
    cy.url({ timeout: TIMEOUT }).should('include', '/#/analystTools/research');
};

export const navigateToReportsSection = () => {

    cy.get('[aria-label="View and search reports"]', { matchCase: false, timeout: TIMEOUT })
        .should('be.visible')
        .click({ force: true });
};

export const navigateToAnalyticsDashboard = () => {
    cy.get('[aria-label="Settings"]', { timeout: TIMEOUT })
        .should('be.visible')
        .click();
    cy.get('[role="menuitem"]').contains('Admin', { matchCase: false, timeout: TIMEOUT })
        .should('be.visible')
        .click();
    cy.wait(5000); // wait for 5 seconds to ensure the page loads
};

export const navigateToUserActivity = () => {
    cy.get('.MuiButton-root.MuiButton-variantPlain.MuiButton-colorPrimary')
        .contains('User Activity')
        .should('be.visible')
        .click();
};

export const navigateToEmails = () => {
    cy.get('.MuiButton-root.MuiButton-variantPlain.MuiButton-colorPrimary')
        .contains('Emails')
        .should('be.visible')
        .click();
};

export const navigateToReports = () => {
    cy.get('.MuiButton-root.MuiButton-variantPlain.MuiButton-colorPrimary')
        .contains('Reports')
        .should('be.visible')
        .click();
};

export const navigateToUserProfile = () => {
    cy.get('[data-testid="PersonIcon"]', { timeout: TIMEOUT })
        .its('length')
        .then((count) => {
            const index = count === 1 ? 0 : 1;
            cy.log(`Clicking PersonIcon at index ${index} (total: ${count})`);
            
            cy.get('[data-testid="PersonIcon"]')
                .eq(index)
                .should('exist')
                .click({ force: true });
        });
    cy.contains('Profile', { timeout: TIMEOUT })
        .should('be.visible')
        .click({ force: true });

    // wait for profile to load
    cy.wait(2000);
};

export const navigateToSubscriptionPage = () => {
    cy.wait(2000);
    cy.get('[data-testid="SubscriptionsIcon"]', { timeout: TIMEOUT })
        .last()
        .should('be.visible')
        .click({ force: true });
    cy.contains('Manage My Subscriptions', { timeout: TIMEOUT })
        .should('be.visible')
        .click({ force: true });
};

export  const navigateToAdminDashboard = () => {
    cy.get('[data-testid="ManageAccountsIcon"]', { timeout: TIMEOUT })
        .last()
        .should('be.visible')
        .click({ force: true });
    
    cy.contains('Admin Dashboard', { timeout: TIMEOUT })
        .should('be.visible')
        .click({ force: true });

    // Verify admin dashboard loaded
    cy.url({ timeout: 30000 }).should('include', '/admin');
};