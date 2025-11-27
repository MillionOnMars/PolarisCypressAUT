export function login(username, password, forceLogout = false) {
    // Visit the Bike4mind URL
    cy.visit(Cypress.env('appUrl'))

    cy.wait(5000);

    // Wait for the page to load and check if we're on the login page
    cy.url().then((url) => {
        cy.log('Current URL:', url);
        
        // Check if we're on login page by looking for login elements
        cy.get('body').then(($body) => {
            const hasLoginForm = $body.find('[name="username"]').length > 0;
            const isChadLoggedIn = $body.text().includes('Chad Test0808!');
            cy.log('Has login form:', hasLoginForm);
            cy.log('Is Chad Test0808! logged in:', isChadLoggedIn);
            
            // If forceLogout is true and user "Chad Test0808!" is logged in, logout first
            if (forceLogout && isChadLoggedIn) {
                cy.log('Chad Test0808! is logged in, logging out...');
                
                cy.get('[data-testid="SettingsSuggestIcon"]', { timeout: 10000 })
                    .should('exist')
                    .should('be.visible')
                    .click({ force: true });
                
                cy.contains('Logout', { timeout: 10000 })
                    .should('exist')
                    .should('be.visible')
                    .click({ force: true });
                
                // Wait for logout to complete
                cy.url({ timeout: 10000 }).should('include', '/login');
                
                // Now proceed with login
                cy.get('[name="username"]', { timeout: 10000 })
                    .should('be.visible')
                    .type(username);
                cy.get('button[type="submit"]', { timeout: 10000 })
                    .should('be.visible')
                    .click();
                cy.get('[name="password"]', { timeout: 10000 })
                    .should('be.visible')
                    .type(password);
                cy.get('button[type="submit"]', { timeout: 10000 })
                    .should('be.visible')
                    .click();
                
                // Verify successful login
                cy.url({ timeout: 30000 }).should('include', '/md_executive_summary');
            }
            // If forceLogout is false and Chad Test0808! is NOT logged in, logout and login again
            else if (!forceLogout && !isChadLoggedIn && !hasLoginForm) {
                cy.log('Different user is logged in, logging out...');
                
                cy.get('[data-testid="SettingsSuggestIcon"]', { timeout: 10000 })
                    .should('exist')
                    .should('be.visible')
                    .click({ force: true });
                
                cy.contains('Logout', { timeout: 10000 })
                    .should('exist')
                    .should('be.visible')
                    .click({ force: true });
                
                // Wait for logout to complete
                cy.url({ timeout: 10000 }).should('include', '/login');
                
                // Now proceed with login
                cy.get('[name="username"]', { timeout: 10000 })
                    .should('be.visible')
                    .type(username);
                cy.get('button[type="submit"]', { timeout: 10000 })
                    .should('be.visible')
                    .click();
                cy.get('[name="password"]', { timeout: 10000 })
                    .should('be.visible')
                    .type(password);
                cy.get('button[type="submit"]', { timeout: 10000 })
                    .should('be.visible')
                    .click();
                
                // Verify successful login
                cy.url({ timeout: 30000 }).should('include', '/feed');
            }
            else if (url.includes('/login') || hasLoginForm) {
                // Login flow with proper timeouts
                cy.get('[name="username"]', { timeout: 10000 })
                    .should('be.visible')
                    .type(username);
                cy.get('button[type="submit"]', { timeout: 10000 })
                    .should('be.visible')
                    .click();
                cy.get('[name="password"]', { timeout: 10000 })
                    .should('be.visible')
                    .type(password);
                cy.get('button[type="submit"]', { timeout: 10000 })
                    .should('be.visible')
                    .click();
                
                // Verify successful login after logging in
                cy.url({ timeout: 30000 }).should('satisfy', (url) => {
                    return url.includes('/feed') || url.includes('/home');
                });
            } else {
                cy.log('Already logged in with correct user, skipping login flow');
            }
        });
    });
}
