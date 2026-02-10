import { login2 } from '../support/login.js';
import { logoutUser } from './Auth.js';
import { navigateToUserProfile, navigateToSubscriptionPage, navigateToAdminDashboard } from './navigate.js';

const TIMEOUT = 10000;

const saveChanges = () => {
    cy.contains('Save Changes', { timeout: TIMEOUT })
        .scrollIntoView()
        .should('exist')
        .should('be.visible')
        .click({ force: true });
    cy.contains('Profile updated successfully', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible');
};

const removeSubscriptionPlan = (subscriptionName) => {
    navigateToSubscriptionPage();
    
    cy.contains('button[class*="MuiMenuButton-colorSuccess"]', subscriptionName, { timeout: TIMEOUT })
        .scrollIntoView()
        .should('exist')
        .should('be.visible')
        .parents('.MuiGrid-container')
        .within(() => {
            cy.get('[data-testid="DeleteIcon"]', { timeout: TIMEOUT })
                .should('exist')
                .should('be.visible')
                .click({ force: true });
        });
    
    cy.contains('button[class*="MuiMenuButton-colorSuccess"]', subscriptionName, { timeout: TIMEOUT })
        .should('not.exist');
    
    saveChanges();
};

const addSubscriptionPlan = (subscriptionName) => {
    navigateToSubscriptionPage();
    
    cy.contains('Add Subscription', { timeout: TIMEOUT })
        .scrollIntoView()
        .should('exist')
        .should('be.visible')
        .click({ force: true });

    cy.contains(subscriptionName, { timeout: TIMEOUT })
        .scrollIntoView()
        .should('exist')
        .should('be.visible');

    saveChanges();
};

const changeOrganization = (newOrgName, username) => {
    navigateToAdminDashboard();

    cy.get('input[placeholder="Search users..."]', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .clear()
        .type(username);

    cy.get('button[aria-label="Profile"][class*="MuiButton-colorWarning"]', { timeout: TIMEOUT })
        .eq(0)
        .should('exist')
        .should('be.visible')
        .click({ force: true });
    
    cy.get('input[role="combobox"][class*="MuiAutocomplete-input"]', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .clear()
        .type(newOrgName);
    
    cy.get('[role="option"]', { timeout: TIMEOUT })
        .contains(newOrgName)
        .click({ force: true });
    
    saveChanges();
};

const resetPassword = (newPassword, originalPassword) => {
    navigateToUserProfile();
    cy.contains('Change Password', { timeout: TIMEOUT })
        .scrollIntoView()
        .should('exist')
        .should('be.visible')
        .click({ force: true });

    cy.get('[data-testid="change-password-current-input"]', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .clear()
        .type(originalPassword);

    cy.get('input[name="newPassword"][type="password"]', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .clear()
        .type(newPassword);
    
    cy.get('input[name="confirmPassword"][type="password"]', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .clear()
        .type(newPassword);
    
    cy.get('[data-testid="change-password-submit-button"]', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .click({ force: true });
    
    cy.contains('Password changed successfully', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible');
    
    cy.contains('Password changed successfully', { timeout: TIMEOUT })
        .should('not.exist');
    
    cy.get('[data-testid="CloseIcon"]')
        .eq(2)
        .click({ force: true });

    cy.wait(2000);
};

const logoutAndClearSession = () => {
    cy.log('🚪 Logging out and clearing session...');

    cy.request({
        method: 'POST',
        url: '/api/logout',
        failOnStatusCode: false,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        cy.log(`Logout API response: ${response.status}`);
        if (response.status === 200 || response.status === 401) {
            cy.log('✅ Logout API call completed');
        }
    });

    // Use the logoutUser function from auth.js
    logoutUser();
    cy.wait(15000);
    
    // Clear all browser state
    cy.clearCookies();
    cy.clearLocalStorage();
    
    cy.log('✅ Session cleared');
};

const changePassword = (username, newPassword, originalPassword) => {
    // Change to new password
    resetPassword(newPassword, originalPassword);
    
    // Logout and clear session after password change
    logoutAndClearSession();
    
    // Re-login with new password to verify it works
    cy.log(`🔐 Logging back in with new password for user: ${username}`);
    login2(username, newPassword);
    cy.wait(3000);
};

// Page access constants
const BASE_ANALYST_PAGES = [
    '[aria-label="Your daily dashboard - morning briefing and tasks"]',
    '[aria-label="Manage blocked news sources"]',
    '[aria-label="Research Files"]',
    '[aria-label="Review and triage company events, generate content"]',
    '[aria-label="View and manage generated content"]',
    '[aria-label="Manage companies and coverage"]',
    '[aria-label="Create Signal"]',
    '[aria-label="G2 Data Overview"]'
];

const ANALYST_PLUS_EXTRA_PAGES = [
    '[aria-label="Customer-initiated leads - Salesforce, briefings, inquiries, and calls"]',
    '[aria-label="Outbound leads - News events, earnings, G2, and intelligence"]',
    '[aria-label="Analyst Comments"]'
];

const ROLE_PERMISSIONS = {
    analyst: {
        allowedPages: [...BASE_ANALYST_PAGES],
        restrictedPages: [...ANALYST_PLUS_EXTRA_PAGES]
    },
    analystp: {
        allowedPages: [...BASE_ANALYST_PAGES, ...ANALYST_PLUS_EXTRA_PAGES],
        restrictedPages: []
    },
    admin: {
        allowedPages: [...BASE_ANALYST_PAGES, ...ANALYST_PLUS_EXTRA_PAGES],
        restrictedPages: []
    }
};

const verifyPages = (role) => {
    const { allowedPages, restrictedPages } = ROLE_PERMISSIONS[role];

    // Verify allowed pages exist
    allowedPages.forEach((selector) => {
        cy.get(selector).should('exist');
    });

    // Verify restricted pages do not exist
    restrictedPages.forEach((selector) => {
        cy.get(selector).should('not.exist');
    });
};

class Users {
    static  updateSubscription(subscriptionName) {
        it('Remove user subscription', () => {
            navigateToUserProfile();
            removeSubscriptionPlan(subscriptionName);
        });
        it('Add user subscription', () => {
            navigateToUserProfile();
            addSubscriptionPlan(subscriptionName);
        });
    }
    
    static changeOrganization(newOrgName, oldOrgName, username) {
        it('Update user organization', () => {
            navigateToUserProfile();
            changeOrganization(newOrgName, username);
        });
        it('Revert user organization', () => {
            navigateToUserProfile();
            changeOrganization(oldOrgName, username);
        });
    }

    static resetPassword(username, newPassword, originalPassword) {
        it('Change user password', () => {
            changePassword(username, newPassword, originalPassword);
        });
        it('Revert password back to original', () => {
            // Need to re-authenticate after previous test changed password
            changePassword(username, originalPassword, newPassword);
        });
    }
    static verifyUserPages(role) {
        it(`should have correct page access for ${role} role`, () => {
            verifyPages(role);
        });
    }
}

export default Users;