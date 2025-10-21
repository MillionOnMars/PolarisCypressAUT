const TIMEOUT = 10000;

const navigateToUserProfile = () => {
    cy.get('[data-testid="PersonIcon"]', { timeout: TIMEOUT })
        .should('exist')
        .click({ force: true });
    cy.contains('Profile', { timeout: TIMEOUT })
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

const navigateToEmailJobsPage = () => {
    cy.contains('Email Jobs', { timeout: TIMEOUT })
        .should('exist')
        .click({ force: true });
};

const selectEmailJob = (emailJobName) => {
    // Click on the email job by name
    cy.get('p.MuiTypography-root.MuiTypography-title-sm', { timeout: TIMEOUT })
        .contains(emailJobName)
        .should('exist')
        .should('be.visible')
        .click({ force: true });
};

const findOrganizationCard = (organization) => {
    // Find the organization card
    return cy.get('p.MuiTypography-root.MuiTypography-body-md', { timeout: TIMEOUT })
        .contains(organization)
        .scrollIntoView()
        .should('exist')
        .should('be.visible')
        .parents('.MuiSheet-root')
        .first();
};

const clickOrganizationSendButton = (organization) => {
    // Find organization and click its Send button
    findOrganizationCard(organization)
        .within(() => {
            cy.get('button[class*="MuiButton-colorPrimary"]', { timeout: TIMEOUT })
                .contains('Send')
                .should('exist')
                .should('be.visible')
                .click({ force: true });
        });
};

const clickViewUsersButton = (organization) => {
    // Find organization and click its View Users button
    findOrganizationCard(organization, { timeout: TIMEOUT })
        .within(() => {
            cy.get('button[class*="MuiButton-colorNeutral"]', { timeout: TIMEOUT })
                .contains('View Users')
                .scrollIntoView()
                .should('exist')
                .should('be.visible')
                .click({ force: true });
        });
};

const selectUsers = (userEmails) => {
    // Select users by their email addresses
    userEmails.forEach((email) => {
        cy.get('input[type="checkbox"]', { timeout: TIMEOUT })
            .parents('tr, li, .MuiListItem-root')
            .contains(email)
            .parents('tr, li, .MuiListItem-root')
            .first()
            .within(() => {
                cy.get('input[type="checkbox"]', { timeout: TIMEOUT })
                    .should('exist')
                    .check({ force: true });
            });
    });
};

const verifyUpdateSuccess = () => {
    // Verify email job was updated successfully
    cy.contains('Email job updated successfully', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible');
};

const verifyRecipientCount = () => {
    // Verify total recipients are more than 1
    cy.get('p.MuiTypography-root.MuiTypography-body-sm', { timeout: TIMEOUT })
        .contains('Total recipients:')
        .should('exist')
        .should('be.visible')
        .invoke('text')
        .then((text) => {
            const recipientCount = parseInt(text.match(/\d+/)[0]);
            expect(recipientCount).to.be.greaterThan(1);
            cy.log(`Total recipients: ${recipientCount}`);
        });
};

const confirmAndSendEmail = () => {
    // Click Confirm & Send button
    cy.get('button[class*="MuiButton-colorPrimary"]', { timeout: TIMEOUT })
        .contains('Confirm & Send')
        .should('exist')
        .should('be.visible')
        .click({ force: true });
    
    // Verify email job was sent successfully
    verifyUpdateSuccess();
};

const sendBatchJob = (emailJobName, organization) => {
    // Select the email job
    selectEmailJob(emailJobName);
    
    // Click Send button for the specific organization
    clickOrganizationSendButton(organization);
    
    // Verify initial update success
    verifyUpdateSuccess();
    
    // Verify recipient count is valid
    verifyRecipientCount();
    
    // Confirm and send the email
    confirmAndSendEmail();
};

const clickSendToSelectedUsersButton = () => {
    // Click Send to Selected Users button (exact match, not "in 1 Organization")
    cy.get('button[class*="MuiButton-sizeMd"]', { timeout: TIMEOUT })
        .filter(':contains("Send to Selected Users")')
        .not(':contains("Organization")')
        .should('have.length', 1)
        .should('exist')
        .should('be.visible')
        .click({ force: true });
};

const verifyEmailJobUpdateSuccess = () => {
    // Verify email job was updated successfully
    cy.contains('Email job updated successfully', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible');
};

const sendToUsers = (emailJobName, organization, userEmails) => {
    // Select the email job
    selectEmailJob(emailJobName);

    // Click View Users button for the specific organization
    clickViewUsersButton(organization);

    // Select users by email
    selectUsers(userEmails);

    // Click Send to Selected Users button
    clickSendToSelectedUsersButton();

    // Verify email job was sent successfully
    verifyEmailJobUpdateSuccess();
};

class EmailJobs {
    static runBatchJobs(emailJobName, organization) {
        it('Should run batch jobs', () => {
            navigateToUserProfile();
            navigateToAdminDashboard();
            navigateToEmailJobsPage();
            sendBatchJob(emailJobName, organization);
        });
    }
    
    static sendToSelectedUsers(emailJobName, organization, userEmails) {
        it('Should send email job to selected users', () => {
            navigateToUserProfile();
            navigateToAdminDashboard();
            navigateToEmailJobsPage();
            sendToUsers(emailJobName, organization, userEmails);
        });
    }
}

export default EmailJobs;