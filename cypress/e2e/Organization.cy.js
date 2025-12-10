import AccountsOrg from "../support/accounts-org";
import { login } from "../support/login";

let OrgName = "TestAUT_Org";
let NewOrgName = "Updated_TestAUT_Org";

describe('Organization Creation', () => {
    beforeEach(() => {
        // Load existing user credentials from accounts.json
        cy.fixture('accounts.json').then((accounts) => {
            const { username, password } = accounts.existingUsers.admin;
            login(username, password);
        });
    });

    describe('Create New Organization', () => {
        AccountsOrg.createNewOrg(OrgName);
    });

    describe('Update Existing Organization', () => {
        AccountsOrg.updateOrg(OrgName, NewOrgName);
    });

    describe('Add Subscription to Organization', () => {
        AccountsOrg.addSubscription(NewOrgName);
    });

    describe('Remove Subscription from Organization', () => {
        AccountsOrg.removeSubscription(NewOrgName);
    });

    describe('Delete Organization', () => {
        AccountsOrg.deleteOrg(NewOrgName);
    });
});