import { login } from '../support/login.js';
import Data, { getRandomQA }  from '../support/data.js';

describe('Verify QA datas', () => { 
    const randomQAs = getRandomQA(35); 

    beforeEach(() => {
        // Load existing user credentials from accounts.json
        cy.fixture('accounts.json').then((accounts) => {
            const { username, password } = accounts.existingUsers.admin;
            login(username, password);
        });
    });

    //Choose 5 random QAs
    randomQAs.forEach((qa) => {
        Data.verifyQAData(qa);
    });
});
