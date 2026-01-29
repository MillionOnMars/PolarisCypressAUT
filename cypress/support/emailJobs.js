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

const selectOrganizationFromSendingSummary = (organization) => {
    cy.get('p.MuiTypography-root.MuiTypography-body-md', { timeout: TIMEOUT })
        .contains(organization)
        .scrollIntoView()
        .should('be.visible')
        .parents('.MuiSheet-root')
        .first()
        .should('exist')
        .should('be.visible')
        .scrollIntoView()
        .within(() => {
            cy.get('input[type="checkbox"].MuiCheckbox-input', { timeout: TIMEOUT })
                .should('exist')
                .should('not.be.disabled')
                .click({ force: true });
        });
};
    
const verifyOrganizationShowUp = (organization) => {
    cy.contains('Send to All Users in 2 Organizations', { timeout: TIMEOUT })
        .scrollIntoView()
        .should('exist')
        .should('be.visible')
        .click({ force: true });
    
    // Wait for modal to appear
    cy.get('.MuiSheet-root.MuiSheet-variantOutlined.MuiSheet-colorNeutral', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible');
    
    // Verify modal title
    cy.contains('Confirm Email Send', { timeout: TIMEOUT })
        .should('be.visible');
    
    // Find and verify the organization in the list
    cy.get('ul.MuiList-root', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .within(() => {
            cy.get('p.MuiTypography-body-sm.css-rw38d', { timeout: TIMEOUT })
                .contains(organization)
                .scrollIntoView()
                .should('be.visible');
        });
};


const verifyOrganizationUserCount = (organization, expectedUserCount) => {
    cy.get('ul.MuiList-root', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .within(() => {
            cy.get('p.MuiTypography-body-sm.css-rw38d', { timeout: TIMEOUT })
                .contains(organization)
                .scrollIntoView()
                .should('be.visible')
                .invoke('text')
                .then((text) => {
                    // Extract the user count from text like "Acme_QA (12 of 12 users selected)"
                    const match = text.match(/\((\d+)\s+of\s+(\d+)\s+users\s+selected\)/);
                    expect(match, `User count pattern not found in: ${text}`).to.not.be.null;
                    
                    const selectedCount = parseInt(match[1]);
                    const totalCount = parseInt(match[2]);
                    
                    cy.log(`${organization}: ${selectedCount} of ${totalCount} users selected`);
                    expect(totalCount).to.equal(expectedUserCount);
                    expect(selectedCount).to.equal(totalCount);
                });
        });
};


const verifyViewUsersModal = (expectedUsers) => {
    
    // Verify all expected users are in the list
    expectedUsers.forEach((user) => {
        cy.get('ul.MuiList-root, table, .MuiListItem-root', { timeout: TIMEOUT })
            .contains(user)
            .scrollIntoView()
            .should('be.visible');
    });
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
    static verifySendingSummary() {
        it('Selected orgs should show up', () => {
             cy.fixture('data.json').then((data) => {
                const { org2, org3, emailJobName2 } = data.emailJob;
                setupEmailJobNavigation();
                selectEmailJob(emailJobName2);
                selectOrganizationFromSendingSummary(org2);
                selectOrganizationFromSendingSummary(org3);
                verifyOrganizationShowUp(org2);
                verifyOrganizationShowUp(org3);
             });
        });

        it('Number of users per selected org should show up', () => {
            cy.fixture('data.json').then((data) => {
                const { org2, org3, emailJobName2 } = data.emailJob;
                setupEmailJobNavigation();
                selectEmailJob(emailJobName2);
                selectOrganizationFromSendingSummary(org2);
                selectOrganizationFromSendingSummary(org3);
                
                // Click to open modal
                cy.contains('Send to All Users in 2 Organizations', { timeout: TIMEOUT })
                    .scrollIntoView()
                    .should('exist')
                    .should('be.visible')
                    .click({ force: true });
                
                // Wait for modal to appear
                cy.get('.MuiSheet-root.MuiSheet-variantOutlined.MuiSheet-colorNeutral', { timeout: TIMEOUT })
                    .should('exist')
                    .should('be.visible');
                
                // Verify user counts
                verifyOrganizationUserCount(org2, 8);
                verifyOrganizationUserCount(org3, 4);
            });
        });

        it('View users should show a modal with the user list', () => {
            cy.fixture('data.json').then((data) => {
                const { org2, org3, org2Users, org3Users, emailJobName2 } = data.emailJob;
                
                setupEmailJobNavigation();
                selectEmailJob(emailJobName2);
                selectOrganizationFromSendingSummary(org2);
                selectOrganizationFromSendingSummary(org3);
                verifyOrganizationShowUp(org2);
                verifyOrganizationShowUp(org3);
                verifyViewUsersModal(org2Users);
                verifyViewUsersModal(org3Users);
            });
        });
    }
}

export default EmailJobs;