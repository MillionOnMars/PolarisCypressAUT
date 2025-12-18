const TIMEOUT = 10000;
const WAIT_TIMEOUT = 2000;

const navigateToUserProfile = () => {
    cy.get('[data-testid="PersonIcon"]', { timeout: TIMEOUT })
        .eq(1)
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
    cy.get('p.MuiTypography-root.MuiTypography-title-sm', { timeout: TIMEOUT })
        .contains(emailJobName)
        .should('exist')
        .should('be.visible')
        .click({ force: true });
};

const findOrganizationCard = (organization) => {
    return cy.get('p.MuiTypography-root.MuiTypography-body-md', { timeout: TIMEOUT })
        .contains(organization)
        .scrollIntoView()
        .should('exist')
        .should('be.visible')
        .parents('.MuiSheet-root')
        .first();
};

const clickOrganizationSendButton = (organization) => {
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
    findOrganizationCard(organization)
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
    cy.contains('Email job updated successfully', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible');
};

const verifyRecipientCount = () => {
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
    cy.get('button[class*="MuiButton-colorPrimary"]', { timeout: TIMEOUT })
        .contains('Confirm & Send')
        .should('exist')
        .should('be.visible')
        .click({ force: true });

    verifyUpdateSuccess();
};

const sendBatchJob = (emailJobName, organization) => {
    selectEmailJob(emailJobName);
    clickOrganizationSendButton(organization);
    verifyUpdateSuccess();
    verifyRecipientCount();
    confirmAndSendEmail();
};

const clickSendToSelectedUsersButton = () => {
    cy.get('button[class*="MuiButton-sizeMd"]', { timeout: TIMEOUT })
        .filter(':contains("Send to Selected Users")')
        .not(':contains("Organization")')
        .should('have.length', 1)
        .should('exist')
        .should('be.visible')
        .click({ force: true });
};

const sendToUsers = (emailJobName, organization, userEmails) => {
    selectEmailJob(emailJobName);
    clickViewUsersButton(organization);
    selectUsers(userEmails);
    clickSendToSelectedUsersButton();
    verifyUpdateSuccess();
};

const selectCreateJob = () => {
    cy.contains('Create Job', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .click({ force: true });
};

const selectOrganizationFromChecklist = (organization) => {
    cy.get('div.MuiBox-root.css-15ml4b9', { timeout: TIMEOUT })
        .contains(organization)
        .should('exist')
        .click({ force: true });

    cy.get('span.MuiTypography-root.MuiTypography-body-xs', { timeout: TIMEOUT })
        .contains(organization)
        .parent()
        .find('input[type="checkbox"]', { timeout: TIMEOUT })
        .should('be.checked');
};

const clickDropdownAndWait = (dropdownText, waitTime = 800) => {
    cy.contains(dropdownText, { timeout: TIMEOUT })
        .scrollIntoView()
        .should('exist')
        .should('be.visible')
        .click({ force: true });

    cy.wait(waitTime);

    cy.get('ul[role="listbox"]', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible');

    cy.get('li[role="option"]', { timeout: TIMEOUT })
        .should('have.length.at.least', 1)
        .should('be.visible');
};

const verifyOrganizationChecklist = () => {
    cy.get('div.MuiSheet-root.MuiSheet-variantOutlined', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible');

    cy.get('div.MuiBox-root.css-15ml4b9', { timeout: TIMEOUT })
        .should('have.length.greaterThan', 0)
        .each(($organizationItem) => {
            cy.wrap($organizationItem)
                .find('input[type="checkbox"]', { timeout: TIMEOUT })
                .should('exist');

            cy.wrap($organizationItem)
                .find('span.MuiTypography-root.MuiTypography-body-xs', { timeout: TIMEOUT })
                .should('exist');
        });

    cy.get('div.MuiBox-root.css-15ml4b9', { timeout: TIMEOUT })
        .then(($items) => {
            const organizationCount = $items.length;
            cy.log(`Total organizations in checklist: ${organizationCount}`);
            expect(organizationCount).to.be.greaterThan(0);
        });
};

const verifyOrganizationDropdownLoads = (organization) => {
    clickDropdownAndWait('Select Organization');

    cy.get('li[role="option"]', { timeout: TIMEOUT })
        .contains(organization)
        .should('exist')
        .should('be.visible')
        .click({ force: true });
};

const verifyUserDropdownLoads = (userLabel, userEmails) => {
    clickDropdownAndWait(userLabel);

    userEmails.forEach((email) => {
        cy.get('li[role="option"]', { timeout: TIMEOUT })
            .contains(email)
            .should('exist')
            .should('be.visible');
    });
};

const verifyPreviewEmailTemplate = () => {
    cy.get('iframe.MuiBox-root.css-1u53332', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible');

    cy.wait(WAIT_TIMEOUT);

    cy.get('iframe.MuiBox-root.css-1u53332', { timeout: TIMEOUT })
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap)
        .find('h1')
        .contains('The latest Futurum updates for Acme_QA')
        .should('exist')
        .should('be.visible');
};

const setupEmailJobNavigation = () => {
    navigateToUserProfile();
    navigateToAdminDashboard();
    navigateToEmailJobsPage();
};

class EmailJobs {
    static runBatchJobs() {
        it('Should run batch jobs', () => {
            cy.fixture('data.json').then((data) => {
                const { emailJobName, org1 } = data.emailJob;
                setupEmailJobNavigation();
                sendBatchJob(emailJobName, org1);
            });
        });
    }

    static sendToSelectedUsers() {
        it('Should send email job to selected users', () => {
            cy.fixture('data.json').then((data) => {
                const { emailJobName2, org2, userEmails } = data.emailJob;
                setupEmailJobNavigation();
                sendToUsers(emailJobName2, org2, userEmails);
            });
        });
    }

    static verifySelectedOrganizations() {
        it('Should verify Target Organizations section', () => {
            cy.fixture('data.json').then((data) => {
                const { org1, org2 } = data.emailJob;
                setupEmailJobNavigation();
                selectCreateJob();
                selectOrganizationFromChecklist(org1);
                selectOrganizationFromChecklist(org2);
            });
        });
    }

    static verifyOrganizationChecklist() {
        it('Should verify organization checklist functionality', () => {
            cy.fixture('data.json').then((data) => {
                const { org1 } = data.emailJob;
                setupEmailJobNavigation();
                selectCreateJob();
                selectOrganizationFromChecklist(org1);
                verifyOrganizationChecklist();
            });
        });
    }

    static previewEmailTemplate() {
        it('All orgs should load', () => {
            cy.fixture('data.json').then((data) => {
                const { allorgnames } = data.emailJob;
                setupEmailJobNavigation();
                selectCreateJob();
                
                allorgnames.forEach((org) => {
                    selectOrganizationFromChecklist(org);
                });
                
                verifyOrganizationDropdownLoads(allorgnames[0]);
            });
        });

        it('All users should load', () => {
            cy.fixture('data.json').then((data) => {
                const { org2, user1, alluseremails } = data.emailJob;
                setupEmailJobNavigation();
                selectCreateJob();
                selectOrganizationFromChecklist(org2);
                verifyOrganizationDropdownLoads(org2);
                verifyUserDropdownLoads(user1, alluseremails);
            });
        });

        it('Should preview email template', () => {
            cy.fixture('data.json').then((data) => {
                const { emailJobName2, org2, user1, alluseremails } = data.emailJob;
                setupEmailJobNavigation();
                selectEmailJob(emailJobName2);
                selectOrganizationFromChecklist(org2);
                verifyOrganizationDropdownLoads(org2);
                verifyUserDropdownLoads(user1, alluseremails);
                verifyPreviewEmailTemplate();
            });
        });
    }
}

export default EmailJobs;