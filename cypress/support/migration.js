const DEFAULT_TIMEOUT = 15000;

// Create reusable constants
const CONFIG = {
    ORGANIZATION: 'ChadOrg_QAs',
    NAME: 'Auto-QA',
    EMAIL: 'QA-AUT@milliononmars.com',
    MIN_COUNT_VALUE: 1,
    CHECKBOXES: [
        'Send Email to Users',
        'Customer Portal',
        'CyberSecurity',
        'Software Engineering',
        'CIO Insights',
        'AI Devices',
        'Data Intelligence',
        'AI Platforms',
        'Semiconductors',
        'Enterprise Software',
        'CEO Insights',
        'Channel Ecosystems',
        'Analyst Tools',
        'Intelligence Feed',
        'Futurum Equities'
    ],
    SELECTALL : [
        'Production Subscriptions',
        'Experimental'
    ], 
    EXPECTED_SENT_COUNT: 1
};

const navigateToMigration = () => {
    cy.get('[aria-label="Settings"]', { timeout: DEFAULT_TIMEOUT })
        .should('be.visible')
        .click();
    cy.contains('Admin', { timeout: DEFAULT_TIMEOUT })
        .should('be.visible')
        .click();
    cy.wait(5000); // wait for 5 seconds to ensure the page loads
    cy.get('.MuiButton-root.MuiButton-variantPlain.MuiButton-colorPrimary')
        .contains('Migration')
        .should('be.visible')
        .click();
};

const sendEmailtoUsers = (email) => {
    cy.get('input[type="checkbox"][aria-checked]', { timeout: DEFAULT_TIMEOUT })
        .contains('Send Email to Users')
        .should('be.visible')
        .check();
};

const handleCheckboxByIndex = (index, action = 'check') => {
    cy.get('input[type="checkbox"]')
        .eq(index)
        .should('exist')
        .then(($checkbox) => {
            const isChecked = $checkbox.prop('checked');
            
            switch (action) {
                case 'check':
                    if (!isChecked) {
                        cy.wrap($checkbox).check();
                        cy.log(`Checked checkbox: ${CONFIG.CHECKBOXES[index]}`);
                    }
                    break;
                case 'uncheck':
                    if (isChecked) {
                        cy.wrap($checkbox).uncheck();
                        cy.log(`Unchecked checkbox: ${CONFIG.CHECKBOXES[index]}`);
                    }
                    break;
                case 'toggle':
                    cy.wrap($checkbox).click();
                    cy.log(`Toggled checkbox: ${CONFIG.CHECKBOXES[index]}`);
                    break;
            }
        });
};

const validateUserMigration = (sendEmail) => {
    cy.get('textarea[placeholder="Enter user list (name, email) separated by commas and new lines"]', { timeout: DEFAULT_TIMEOUT })
        .should('be.visible')
        .type(`${CONFIG.NAME},${CONFIG.EMAIL}`);

    //Click Parse User List button
    cy.contains('button', 'Parse User List', { timeout: DEFAULT_TIMEOUT })
        .should('be.visible')
        .click();

    //Type organization name
    cy.get('[aria-label="Select an organization"]', { timeout: DEFAULT_TIMEOUT })
        .should('be.visible')
        .type(CONFIG.ORGANIZATION);

    // Select from dropdown options
    cy.contains('[role="option"], li', 'ChadOrg_QAs', { timeout: DEFAULT_TIMEOUT })
        .should('be.visible')
        .click();

    //Click Migrate Users button
    cy.contains('button', 'Migrate Users', { timeout: DEFAULT_TIMEOUT })
        .should('be.visible')
        .click();

    //Verify migration success message
    if (sendEmail) {
        const expectedMessage = `Migration complete! Emails: ${CONFIG.EXPECTED_SENT_COUNT} sent, 0 failed`;
        cy.contains(expectedMessage, { matchCase: false, timeout: DEFAULT_TIMEOUT })
            .should('be.visible');
        cy.log(`Migration completed: ${CONFIG.EXPECTED_SENT_COUNT} emails sent, 0 failed`);
    } else {
        cy.contains('Migration complete!', { matchCase: false, timeout: DEFAULT_TIMEOUT })
            .should('be.visible');
        // Validate the generated password is not empty
        validateGeneratedPassword();
        cy.log('Migration completed without email notification. Password generated for users.');
    }

}

const validateGeneratedPassword = () => {
    cy.get('p.MuiTypography-root.MuiTypography-body-md')
        .last()
        .should('be.visible')
        .should('not.be.empty')
        .invoke('text')
        .then((passwordText) => {
            // Validate password is not empty and has content
            expect(passwordText.trim()).to.not.be.empty;
            expect(passwordText.trim()).to.have.length.greaterThan(0);
            
            cy.log(`Generated password: ${passwordText}`);
        });
};

const clickSelectAll = (index) => {
    cy.contains('button', 'Select All')
        .eq(index)
        .should('be.visible')
        .click();
    cy.log(`Clicked Select All button for  ${CONFIG.SELECTALL[index]}`);
};

class Migration {
    static verifyMigration() {
        describe('Migration Verification', () => {
            it('Should send password email to users', () => {
                navigateToMigration();
                handleCheckboxByIndex(0, 'check'); // Send Email to Users
                clickSelectAll(0); // Production Subscriptions
                validateUserMigration(true);

            });
            it('Password generated to users', () => {
                navigateToMigration();
                handleCheckboxByIndex(0, 'uncheck'); // Send Email to Users
                clickSelectAll(0); // Production Subscriptions
                validateUserMigration(false);
            });
        });
    }
}

export default Migration;