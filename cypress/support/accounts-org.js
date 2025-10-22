import { timeInterval } from "rxjs";
import { verify } from "tweetnacl";
const TIMEOUT = 10000;
const navigateToAdmin = () => {
    cy.get('[aria-haspopup="menu"]', {timeout: TIMEOUT})
    .eq(1)
    .should('exist')
    .click()

    cy.contains('Admin', {timeout: TIMEOUT})
    .should('exist')
    .click()
}

const navigateToAccountsOrg = () => {
    cy.contains('User Tags', {timeout: TIMEOUT})
    cy.xpath("(//button[normalize-space()='Accounts'])[1]", {timeout: TIMEOUT})
    .should('exist')
    .click()
}

const createOrg = (OrgName) => {
    
    cy.get('textarea[placeholder="Organization Name"]', {timeout: TIMEOUT})
    .should('exist') // Ensure the element exists
    .type(OrgName); // Type into the textarea
    
    cy.get("[aria-label='Create a new organization']", {timeout: TIMEOUT})
    .should('exist')
    .click()
    
}

const verifyOrgCreated = (OrgName) => {
    cy.get('.css-1lv7pyi', {timeout: TIMEOUT}).type(OrgName).type('{enter}');
    cy.contains(OrgName).click();
    cy.contains('Profile', {timeout: TIMEOUT})
    .should('exist')
    .click()
}

const updateOrg = (NewOrgName) => {
    cy.get('.css-1u0jcuo', {timeout: TIMEOUT})
    .eq(0)
    .clear()
    .type(NewOrgName);
    cy.contains('Update', {timeout: TIMEOUT})
    .should('exist')
    .click()
    cy.contains('Organization updated successfully!', {timeout: TIMEOUT})
    .should('exist');
}

const linkSalesforce = () => {

    cy.get('.css-1g5jyb9', {timeout: TIMEOUT})
    .should('exist').click().type('Acme{enter}');
    cy.contains('Acme (Sample)', {timeout: TIMEOUT})
    .should('exist')
    .click()
    cy.contains('Update', {timeout: TIMEOUT})
    .should('exist')
    .click()
    cy.contains('Salesforce account linked successfully', {timeout: TIMEOUT})
    .should('exist');
}

const addSubscription = (OrgName) => {
    cy.contains('Subscriptions', {timeout: TIMEOUT}).click()
    cy.contains('Add All', {timeout: TIMEOUT})
    .should('exist')
    .click()
    cy.contains('Save Changes', {timeout: TIMEOUT}).should('exist')
    .click()
    cy.contains('Subscriptions updated successfully', {timeout: TIMEOUT})
    .should('exist');
}

const removeSubscription = () => {
    cy.contains('Subscriptions', {timeout: TIMEOUT}).click()
    cy.contains('Remove All', {timeout: TIMEOUT})
    .should('exist')
    .click()
    cy.contains('Save Changes', {timeout: TIMEOUT}).should('exist')
    .click()
    cy.contains('Subscriptions updated successfully', {timeout: TIMEOUT})
    .should('exist');
}

const deleteOrg = (OrgName) => {
    cy.get('.css-1lv7pyi').type(OrgName).type('{enter}');
    cy.contains(OrgName).click();
    cy.contains('Delete', {timeout: TIMEOUT})
    .should('exist')
    .click()
    cy.get('.css-1q3ylrc')
    .eq(1)
    .should('exist')
    .click()
    cy.contains('Organization deleted successfully', {timeout: TIMEOUT})
    .should('exist');
}

class AccountsOrg {

    static createNewOrg(OrgName) {
        it('Should create and verify the new organization', () => {
            navigateToAdmin();
            navigateToAccountsOrg();
            createOrg(OrgName);
            verifyOrgCreated(OrgName);
        });
    }
    
    static updateOrg(OldOrgName, NewOrgName) {
        it('Should update the organization name and link salesforce', () => {
            navigateToAdmin();
            navigateToAccountsOrg();
            verifyOrgCreated(OldOrgName);
            updateOrg(NewOrgName);
            linkSalesforce();
        });
}
    static addSubscription(OrgName) {
        it('Should add subscriptions to the organization', () => {
            navigateToAdmin();
            navigateToAccountsOrg();
            verifyOrgCreated(OrgName);
            addSubscription();
        });
    }
    static removeSubscription(OrgName) {
        it('Should remove subscriptions from the organization', () => {
            navigateToAdmin();
            navigateToAccountsOrg();
            verifyOrgCreated(OrgName);
            removeSubscription();
        });
    }
    static deleteOrg(OrgName) {
        it('Should delete the organization', () => {
            navigateToAdmin();
            navigateToAccountsOrg();
            deleteOrg(OrgName);
        });
    }
}

export default AccountsOrg;