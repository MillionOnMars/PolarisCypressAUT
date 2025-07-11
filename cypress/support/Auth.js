const TIMEOUT = 10000;

// Navigate to the login page
const navigateToLoginPage = () => {
    cy.visit(Cypress.env('appUrl'))
};

// Authenticate a user with provided credentials
const authenticateUser = (username, password) => {
    cy.get('[id="username"]', { timeout: TIMEOUT }).type(username);
    cy.get('[id="password"]', { timeout: TIMEOUT }).type(password);
    cy.get('[type="submit"]', { timeout: TIMEOUT }).click();
};

// Verify successful login by checking username and URL
const verifySuccessfulLogin = (username) => {
    cy.contains(username, { timeout: TIMEOUT }).should('exist');
    cy.url().should('contain', '/home');
};

    // Verify logout by checking the welcome message and URL
const verifyLogout = () => {
    cy.contains('Welcome to Futurum Intelligence', { timeout: TIMEOUT }).should('exist');
    cy.url().should('contain', '/login');
};

// Log out the user by interacting with the menu
const logoutUser = () => {
    // Wait for user menu button and force click
    cy.get('.MuiBox-root.css-1fq16i4 > div:nth-child(2) > button')
        .should('exist')
        .click({ force: true });

    // Wait for logout icon and force click
    cy.get('[data-testid="LogoutIcon"]')
        .should('exist')
        .click({ force: true });
};

class Auth {
    static correctCredentials() {
        it('Should log in with correct credentials', () => {
            navigateToLoginPage();
            authenticateUser('chadtest0808', 'Testing12345!');
            verifySuccessfulLogin('Chad Test0808!');
        });
    }

    static incorrectCredentials() {
        it('Should not log in with incorrect credentials', () => {
            navigateToLoginPage();
            authenticateUser('Test', 'IncorrectPassword.');
            cy.contains('Incorrect username & password', { timeout: TIMEOUT }).should('exist');
            cy.url().should('contain', '/login');
        });
    }

    static directNotebookAccessWithoutLogin() {
        it('Should redirect to login when accessing notebook without authentication', () => {
            cy.visit(`${Cypress.env('appUrl')}/#/account_overview/home`);
            verifyLogout();
        });
    }

    static userLogout() {
        it('Should log out a user successfully', () => {
            navigateToLoginPage();
            authenticateUser('wescarda', 'Password12345!');
            verifySuccessfulLogin('wescarda!');
            logoutUser();
            verifyLogout();
        });
    }
}

export default Auth;