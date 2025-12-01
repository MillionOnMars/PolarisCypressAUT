import { login } from './login.js';
import { logoutUser } from './Auth.js';

const TIMEOUT = 10000;

const navigateToUserProfile = () => {
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
        .should('exist')
        .click({ force: true });
};

const navigateToSubscriptionPage = () => {
    cy.wait(2000);
    cy.get('[data-testid="SubscriptionsIcon"]', { timeout: TIMEOUT })
        .should('be.visible')
        .click({ force: true });
    cy.contains('Manage My Subscriptions', { timeout: TIMEOUT })
        .should('be.visible')
        .click({ force: true });
};

const navigateToAdminDashboard = () => {
    cy.contains('Admin Settings', { timeout: TIMEOUT })
        .should('exist')
        .click({ force: true });
    
    cy.contains('Admin Dashboard', { timeout: TIMEOUT })
        .should('exist')
        .click({ force: true });
};

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

    // Use the logoutUser function from auth.js
    logoutUser();
    cy.wait(8000);
    
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
    login(username, newPassword);
    cy.wait(3000);
};

class Users {
    static updateSubscription(subscriptionName) {
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
}

export default Users;