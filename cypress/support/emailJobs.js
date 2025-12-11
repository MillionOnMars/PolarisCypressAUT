const TIMEOUT = 10000;

const navigateToUserProfile = () => {
    cy.get('[data-testid="PersonIcon"]', { timeout: TIMEOUT })
        .eq(1) // Select the second occurrence
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

const selectCreateJob = () => {
    // Click on Create Job button
    cy.contains('Create Job', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .click({ force: true });
};

const selectOrganizationFromChecklist = (organization) => {
    // Find the organization item and click it to toggle checkbox
    cy.get('div.MuiBox-root.css-15ml4b9', { timeout: TIMEOUT })
        .contains(organization)
        .should('exist')
        .click({ force: true }); // Click the entire box to toggle checkbox
    
    // Verify checkbox is checked
    cy.get('span.MuiTypography-root.MuiTypography-body-xs', { timeout: TIMEOUT })
        .contains(organization)
        .parent()
        .find('input[type="checkbox"]', { timeout: TIMEOUT })
        .should('be.checked');
};

const verifyTargetOrganizationsSection = (org1, org2) => {
    // Verify the Target Organizations section exists with both orgs
    cy.get('div.MuiBox-root.css-1vrkypf', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .within(() => {
            // Verify org1 exists
            cy.get('span.MuiChip-label', { timeout: TIMEOUT })
                .contains(org1)
                .should('exist')
                .should('be.visible');
            
            // Verify org2 exists
            cy.get('span.MuiChip-label', { timeout: TIMEOUT })
                .contains(org2)
                .should('exist')
                .should('be.visible');
            
            // Verify total count
            cy.get('span.MuiChip-label', { timeout: TIMEOUT })
                .should('have.length.at.least', 2)
                .then(($chips) => {
                    const chipTexts = Array.from($chips).map(el => el.textContent);
                    cy.log(`Target Organizations: ${chipTexts.join(', ')}`);
                });
        });
};

const verifyOrganizationChecklist = () => {
    // Verify the checklist container exists
    cy.get('div.MuiSheet-root.MuiSheet-variantOutlined', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible');
    
    // Verify all checkboxes and organization labels exist
    cy.get('div.MuiBox-root.css-15ml4b9', { timeout: TIMEOUT })
        .should('have.length.greaterThan', 0)
        .each(($organizationItem) => {
            // Verify checkbox exists (don't check visibility - it has opacity: 0)
            cy.wrap($organizationItem)
                .find('input[type="checkbox"]', { timeout: TIMEOUT })
                .should('exist');
            
            // Verify organization label exists and is visible
            cy.wrap($organizationItem)
                .find('span.MuiTypography-root.MuiTypography-body-xs', { timeout: TIMEOUT })
                .should('exist')
                .should('exist');
        });
    
    // Log total number of organizations
    cy.get('div.MuiBox-root.css-15ml4b9', { timeout: TIMEOUT })
        .then(($items) => {
            const organizationCount = $items.length;
            cy.log(`Total organizations in checklist: ${organizationCount}`);
            expect(organizationCount).to.be.greaterThan(0);
        });
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
    static verifySelectedOrganizations(org1, org2) {
        it('Should verify Target Organizations section', () => {
            navigateToUserProfile();
            navigateToAdminDashboard();
            navigateToEmailJobsPage();
            selectCreateJob();
            selectOrganizationFromChecklist(org1);
            selectOrganizationFromChecklist(org2);
            verifyTargetOrganizationsSection(org1, org2);
        });
    }
    static verifyOrganizationChecklist(org1) {
        it('Should verify organization checklist functionality', () => {
            navigateToUserProfile();
            navigateToAdminDashboard();
            navigateToEmailJobsPage();
            selectCreateJob();
            selectOrganizationFromChecklist(org1);
            verifyOrganizationChecklist();
        });
    }
}

export default EmailJobs;