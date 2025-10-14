import { timeout } from "async";

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

const navigateToEmailTemplatesPage = () => {
    cy.get('button[class*="MuiButton-colorPrimary"]', { timeout: TIMEOUT })
        .filter(':contains("Templates")', { timeout: TIMEOUT })
        .not(':contains("Email")')
        .should('exist')
        .should('be.visible')
        .click({ force: true });
};

const saveTemplate = () => {
    cy.contains('Save', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .click({ force: true });
};

const verifyTemplateSuccess = (action) => {
    const messages = {
        created: 'Template created successfully',
        updated: 'Template updated successfully', 
        deleted: 'Template deleted'
    };
    
    cy.contains(messages[action] || messages.created, { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible');
};

const fillTemplateForm = (templateName, subject, body, isEdit = false) => {
    if (!isEdit) {
        // Enter template name (only for create, not edit)
        cy.get('input[placeholder="Enter template name"]', { timeout: TIMEOUT })
            .should('exist')
            .should('be.visible')
            .clear()
            .type(templateName);
    }

    // Enter subject
    cy.get('input[placeholder="Enter email subject"]', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .clear()
        .type(subject);

    // Enter body
    cy.get('textarea[placeholder="Enter template description"]', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .clear()
        .type(body);
};

const createEmailTemplate = (templateName, subject, body) => {
    // Click Create Template button
    cy.contains('Create Template', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .click({ force: true });

    // Fill the form
    fillTemplateForm(templateName, subject, body, false);

    // Save template
    saveTemplate();
        
    // Verify template is created
    verifyTemplateSuccess('created');
};

const editEmailTemplate = (templateName, updatedSubject, updatedBody) => {
    // Find and click the template to edit
    cy.contains(templateName, { timeout: TIMEOUT })
        .should('exist')
        .click({ force: true });
    
    // Click edit button
    cy.contains('Edit', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .click({ force: true });

    // Fill the form with updated data
    fillTemplateForm(templateName, updatedSubject, updatedBody, true);

    // Save changes
    saveTemplate();
        
    // Verify template is updated
    verifyTemplateSuccess('updated');
};

const deleteEmailTemplate = (templateName) => {
    // Find the specific template and its delete button
    cy.contains(templateName, { timeout: TIMEOUT })
        .should('exist')
        .parent() // Go to parent container
        .parent() // Go up one more level to the row
        .find('button[aria-label="Delete template"]')
        .should('have.length', 1) // Ensure we found exactly one delete button
        .click({ force: true });
    
    // Verify template is deleted
    verifyTemplateSuccess('deleted');
        
    // Verify the template no longer exists in the list
    cy.contains(templateName, { timeout: TIMEOUT })
        .should('not.exist');
};

class EmailTemplates {
    static manageEmailTemplate() {
        it('Should create email template from data file', () => {
            cy.fixture('data.json').then((data) => {
                const { name, subject, body } = data.emailTemplate;
                navigateToUserProfile();
                navigateToAdminDashboard();
                navigateToEmailTemplatesPage();
                createEmailTemplate(name, subject, body);
            });
        });
        
        it('Should edit email template', () => {
            cy.fixture('data.json').then((data) => {
                const { name, subject, body } = data.emailTemplate;
                const updatedSubject = subject + " - Updated";
                const updatedBody = body + "<p>This is an update.</p>";
                navigateToUserProfile();
                navigateToAdminDashboard();
                navigateToEmailTemplatesPage();
                editEmailTemplate(name, updatedSubject, updatedBody);
            });
        });

        it('Should delete email template', () => {
            cy.fixture('data.json').then((data) => {
                const { name } = data.emailTemplate;
                navigateToUserProfile();
                navigateToAdminDashboard();
                navigateToEmailTemplatesPage();
                deleteEmailTemplate(name);
            });
        });
    }
}

export default EmailTemplates;