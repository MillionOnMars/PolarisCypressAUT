import { verify } from "tweetnacl";

const navigateToAdmin = () => {
    cy.wait(2000);
    cy.get('[aria-haspopup="menu"]', {timeout: 10000})
    .eq(1)
    .should('exist')
    .click()

    cy.contains('Admin', {timeout: 10000})
    .should('exist')
    .click()
}

const navigateToAccountsOrg = () => {
    cy.wait(5000);
    cy.xpath("(//button[normalize-space()='Accounts'])[1]", {timeout: 10000})
    .should('exist')
    .click()
}

const createOrg = (OrgName) => {
    cy.wait(3000);
    cy.get('textarea[placeholder="Organization Name"]')
    .should('exist') // Ensure the element exists
    .type(OrgName); // Type into the textarea
    
    cy.get("[aria-label='Create a new organization']", {timeout: 10000})
    .should('exist')
    .click()
}

const verifyOrgCreated = (OrgName) => {
    cy.get('.css-1lv7pyi').type(OrgName).type('{enter}');
    cy.contains(OrgName).click();
    cy.contains('Profile', {timeout: 10000})
    .should('exist')
    .click()
    cy.wait(2000);
}

const updateOrg = (NewOrgName) => {
    cy.get('.css-1u0jcuo')
    .eq(0)
    .clear()
    .type(NewOrgName);
    cy.contains('Update', {timeout: 5000})
    .should('exist')
    .click()
}

const linkSalesforce = () => {
    cy.wait(2000);
    cy.get('.css-1g5jyb9').should('exist').click().type('Acme{enter}');
    cy.wait(2000);
    cy.contains('Acme (Sample)', {timeout: 10000})
    .should('exist')
    .click()
    cy.contains('Update', {timeout: 5000})
    .should('exist')
    .click()
}

const addSubscription = (OrgName) => {
    cy.contains('Subscriptions', {timeout: 10000}).click()
    cy.contains('Add All', {timeout: 10000})
    .should('exist')
    .click()
    cy.contains('Save Changes', {timeout: 10000}).should('exist')
    .click()
}

const removeSubscription = () => {
    cy.contains('Subscriptions', {timeout: 10000}).click()
    cy.contains('Remove All', {timeout: 10000})
    .should('exist')
    .click()
    cy.contains('Save Changes', {timeout: 10000}).should('exist')
    .click()
}

const deleteOrg = (OrgName) => {
    cy.get('.css-1lv7pyi').type(OrgName).type('{enter}');
    cy.contains(OrgName).click();
    cy.contains('Delete', {timeout: 10000})
    .should('exist')
    .click()
    cy.get('.css-1q3ylrc')
    .eq(1)
    .should('exist')
    .click()
}

class AccountsOrg {

    static createNewOrg(OrgName) {
        it('Should create a new organization', () => {
            navigateToAdmin();
            navigateToAccountsOrg();
            createOrg(OrgName);
        });
    }
    
    static verifyOrgCreated(OrgName) {
        it('Should verify the organization is created', () => {
            navigateToAdmin();
            navigateToAccountsOrg();
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