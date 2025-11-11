const TIMEOUT = 10000;

const navigateToUserProfile = () => {
    cy.get('[data-testid="PersonIcon"]', { timeout: TIMEOUT })
        .should('exist')
        .click({ force: true });
    cy.contains('Profile', { timeout: TIMEOUT })
        .should('exist')
        .click({ force: true });
};

const navigateToSubscriptionPage = () => {
    cy.contains('Subscription', { timeout: TIMEOUT })
        .should('exist')
        .click({ force: true });
    cy.contains('Manage My Subscriptions', { timeout: TIMEOUT })
        .should('exist')
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
    
    //verify current subscription and cancel it
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
    
    //Verify subscription is deleted
    cy.contains('button[class*="MuiMenuButton-colorSuccess"]', subscriptionName, { timeout: TIMEOUT })
        .should('not.exist');
    
    saveChanges();
};

const addSubscriptionPlan = (subscriptionName) => {
    navigateToSubscriptionPage();
    
    //Add new subscription
    cy.contains('Add Subscription', { timeout: TIMEOUT })
        .scrollIntoView()
        .should('exist')
        .should('be.visible')
        .click({ force: true });

    //Verify subscription is added
    cy.contains(subscriptionName, { timeout: TIMEOUT })
        .scrollIntoView()
        .should('exist')
        .should('be.visible');

    saveChanges();
};
const changeOrganization = (newOrgName, username) => {
    navigateToAdminDashboard();
    
    // Search for the specific user
    cy.get('input[placeholder="Search users..."]', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .clear()
        .type(username);

    // Click the Profile button for the user
    cy.get('button[aria-label="Profile"][class*="MuiButton-colorWarning"]', { timeout: TIMEOUT })
        .eq(0) // Assuming the first matched button is the correct one
        .should('exist')
        .should('be.visible')
        .click({ force: true });
    
    // Clear current organization and type new organization name
    cy.get('input[role="combobox"][class*="MuiAutocomplete-input"]', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .clear()
        .type(newOrgName);
    
    // Select the organization from dropdown
    cy.get('[role="option"]', { timeout: TIMEOUT })
        .contains(newOrgName)
        .click({ force: true });
    
    // Use existing saveChanges helper and add double-save logic there if needed
    saveChanges();
};

const resetPassword = (newPassword, originalPassword) => {
    cy.contains('Change Password', { timeout: TIMEOUT })
        .scrollIntoView()
        .should('exist')
        .should('be.visible')
        .click({ force: true });

    //Enter current password
    cy.get('[data-testid="change-password-current-input"]', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .clear()
        .type(originalPassword);

    // Enter new password
    cy.get('input[name="newPassword"][type="password"]', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .clear()
        .type(newPassword);
    
    // Confirm new password
    cy.get('input[name="confirmPassword"][type="password"]', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .clear()
        .type(newPassword);
    
    // Update password
    cy.get('[data-testid="change-password-submit-button"]', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .click({ force: true });
    
    // Verify success message appears
    cy.contains('Password changed successfully', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible');
    
    // Wait for success message to disappear
    cy.contains('Password changed successfully', { timeout: TIMEOUT })
        .should('not.exist');
};

const changePassword = (newPassword, originalPassword) => {
    // Change to new password
    resetPassword(newPassword, originalPassword);
    
    // Revert back to original password
    resetPassword(originalPassword, newPassword);
};


// Update the class method
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
    
    static resetPassword(newPassword, originalPassword) {
        it('Change user password and revert', () => {
            navigateToUserProfile();
            changePassword(newPassword, originalPassword);
        }); 
    }
}

export default Users;