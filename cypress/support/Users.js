import { add } from "lodash";

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
    
    // verify checkbox is checked (even if text has strikethrough)
    cy.get('.MuiCheckbox-root.Mui-checked', { timeout: TIMEOUT })
        .contains(subscriptionName)
        .should('exist');
    
    //Add new subscription
    cy.contains('Add Subscription', { timeout: TIMEOUT })
        .scrollIntoView()
        .should('exist')
        .should('be.visible')
        .click({ force: true });
    
    saveChanges();
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
}

export default Users;