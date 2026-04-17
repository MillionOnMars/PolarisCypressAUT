import Users from '../support/Users.js';

describe('User Password Change Tests', () => {

    describe('Reset Password', () => {
        Users.resetPassword('chadtest09231', 'NewPassword123!', 'Testing12345!');
    });
});

