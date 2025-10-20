import AccountsOrg from "../support/accounts-org";
import { login } from "../support/login";


describe('Organization Creation', () => {
    beforeEach(() => {
        // Load existing user credentials from accounts.json
        cy.fixture('accounts.json').then((accounts) => {
            const { username, password } = accounts.existingUsers.admin;
            login(username, password);
        });
    });

   describe('Create New Organization', () => {
        AccountsOrg.createNewOrg('TestAUT_Org');
    });

   describe('Verify Organization Creation', () => {
        AccountsOrg.verifyOrgCreated('TestAUT_Org');
    });

   describe('Update Existing Organization', () => {
       AccountsOrg.updateOrg('TestAUT_Org', 'Updated_TestAUT_Org');
    });
    describe('Add Subscription to Organization', () => {
        AccountsOrg.addSubscription('Updated_TestAUT_Org');
    });
    describe('Remove Subscription from Organization', () => {
        AccountsOrg.removeSubscription('Updated_TestAUT_Org');
    });
    describe('Delete Organization', () => {
        AccountsOrg.deleteOrg('Updated_TestAUT_Org');
    });
});