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
        .filter(`:contains("Templates")`, { timeout: TIMEOUT })
        .not(`:contains("Email")`, { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .click({ force: true });
};

const navigateToEmailDatasetPage = () => {
    cy.get('button[class*="MuiButton-colorPrimary"]', { timeout: TIMEOUT })
        .filter(`:contains("Datasets")`, { timeout: TIMEOUT })
        .not(`:contains("Email")`, { timeout: TIMEOUT })
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

const fillDatasetForm = (title, description, imageUrl, url, leadAnalyst, leadAnalystUrl) => {
    // Fill title
    cy.get('input[name="title"]', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .clear()
        .type(title);
    
    // Fill description
    cy.get('textarea[placeholder*="markdown"]', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .clear()
        .type(description);

    // Fill URL
    cy.get('input[name="url"]', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .clear()
        .type(url);

    // Fill Lead Analyst Name
    cy.get('input[name="leadAnalyst.name"]', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .clear()
        .type(leadAnalyst);

    // Fill Lead Analyst URL
    cy.get('input[name="leadAnalyst.url"]', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .clear()
        .type(leadAnalystUrl);
};

const selectPracticeArea = (practiceArea = 'AI Platforms') => {
    // Click Practice Area dropdown
    cy.get('button[role="combobox"][class*="MuiSelect-button"]', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .click({ force: true });
    
    // Select practice area from dropdown
    cy.get('li[role="option"]', { timeout: TIMEOUT })
        .contains(practiceArea)
        .should('exist')
        .should('be.visible')
        .click({ force: true });
};

const setDatasetImage = (imageUrl) => {
    // Set Image
    cy.get('button[class*="MuiButton-variantOutlined"]', { timeout: TIMEOUT })
        .contains('Set Image')
        .should('exist')
        .should('be.visible')
        .click({ force: true });
    
    // Enter image URL
    cy.get('input[placeholder="Enter image URL"]', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .clear()
        .type(imageUrl);

    // Click Use URL button
    cy.contains('Use URL', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .click({ force: true });
};

const submitDatasetForm = (isEdit = false) => {
    const buttonText = isEdit ? 'Update Dataset' : 'Create Dataset';
    const successMessage = isEdit ? 'Dataset updated successfully' : 'Dataset created successfully';
    
    // Click Create/Update Dataset button to submit
    cy.contains(buttonText, { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .click({ force: true });
    
    // Verify dataset is created/updated
    cy.contains(successMessage, { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible');
};

const createDatasetTemplate = (practiceArea, title, description, imageUrl, url, leadAnalyst, leadAnalystUrl, additionalAnalysts, additionalAnalystsUrl) => {
    // Initialize dataset creation
    cy.contains('Create Dataset', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .click({ force: true });
    
    // Select practice area from data
    selectPracticeArea(practiceArea);
    
    // Fill all form fields
    fillDatasetForm(title, description, imageUrl, url, leadAnalyst, leadAnalystUrl);
    
    // Set dataset image
    setDatasetImage(imageUrl);
    
    // Submit form and verify (for create)
    submitDatasetForm(false);
};

const findAndSelectDataset = (practiceArea = 'AI Platforms') => {
    // Find and click the dataset to edit by looking for the practice area text
    cy.get('p.MuiTypography-root')
        .contains(practiceArea, { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .click({ force: true });
};

const fillDatasetEditForm = (title, description, url, leadAnalyst, leadAnalystUrl) => {
    // Fill title
    cy.get('input[name="title"]', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .clear()
        .type(title);
    
    // Fill description
    cy.get('textarea[placeholder*="markdown"]', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .clear()
        .type(description);

    // Fill URL
    cy.get('input[name="url"]', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .clear()
        .type(url);

    // Fill Lead Analyst Name
    cy.get('input[name="leadAnalyst.name"]', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .clear()
        .type(leadAnalyst);

    // Fill Lead Analyst URL
    cy.get('input[name="leadAnalyst.url"]', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .clear()
        .type(leadAnalystUrl);
};

const updateDatasetImage = (imageUrl) => {
    // Set Image
    cy.get('button[class*="MuiButton-variantOutlined"]', { timeout: TIMEOUT })
        .contains('Set Image')
        .should('exist')
        .should('be.visible')
        .click({ force: true });
    
    // Enter image URL
    cy.get('input[placeholder="Enter image URL"]', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .clear()
        .type(imageUrl);

    // Click Use URL button
    cy.contains('Use URL', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .click({ force: true });
};

const submitDatasetUpdate = () => {
    // Click Update Dataset button to submit
    cy.contains('Update Dataset', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .click({ force: true });
    
    // Verify dataset is updated
    cy.contains('Dataset updated successfully', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible');
};

const editDatasetTemplate = (practiceArea, title, updatedDescription, updatedUrl, imageUrl, leadAnalyst, leadAnalystUrl) => {
    // Select the dataset to edit using practice area from data
    findAndSelectDataset(practiceArea);

    // Fill the form with updated data
    fillDatasetEditForm(title, updatedDescription, updatedUrl, leadAnalyst, leadAnalystUrl);

    // Update dataset image
    updateDatasetImage(imageUrl);

    // Submit form and verify update
    submitDatasetUpdate();
};
const findDatasetByPracticeArea = (practiceArea) => {
    return cy.get('p.MuiTypography-root')
        .contains(practiceArea, { timeout: TIMEOUT })
        .should('exist')
        .parents('li.MuiListItem-root')
        .first();
};

const clickDeleteButton = () => {
    cy.get('button[aria-label="Delete dataset"][class*="MuiIconButton-colorDanger"]', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .click({ force: true });
};

const handleDeleteConfirmation = () => {
    cy.get('body').then(($body) => {
        if ($body.find('button:contains("Confirm"), button:contains("Delete")').length > 0) {
            cy.contains('button', /^(Confirm|Delete)$/, { timeout: TIMEOUT })
                .should('exist')
                .should('be.visible')
                .click({ force: true });
        }
    });
};

const verifyDatasetDeletion = (practiceArea) => {
    // Verify dataset is deleted with success message
    cy.contains('Dataset deleted', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible');
        
    // Verify the dataset no longer exists in the list
    cy.get('p.MuiTypography-root')
        .contains(practiceArea, { timeout: TIMEOUT })
        .should('not.exist');
};

const deleteDatasetTemplate = (practiceArea) => {
    // Find the dataset by practice area
    findDatasetByPracticeArea(practiceArea)
        .within(() => {
            // Click the delete button within the specific dataset row
            clickDeleteButton();
        });

    // Handle any confirmation dialog that appears
    handleDeleteConfirmation();

    // Verify the deletion was successful
    verifyDatasetDeletion(practiceArea);
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
    
    static manageDatasetEmailTemplate() {
        it('Should create dataset email template from data file', () => {
            cy.fixture('data.json').then((data) => {
                const { practiceArea, title, description, imageUrl, url, leadAnalyst, leadAnalystUrl, additionalAnalysts, additionalAnalystsUrl } = data.datasetEmailTemplate;
                navigateToUserProfile();
                navigateToAdminDashboard();
                navigateToEmailDatasetPage();
                createDatasetTemplate(practiceArea, title, description, imageUrl, url, leadAnalyst, leadAnalystUrl, additionalAnalysts, additionalAnalystsUrl);
            });
        });
        
        it('Should edit dataset email template from data file', () => {
            cy.fixture('data.json').then((data) => {
                const { practiceArea, title, description, imageUrl, url, leadAnalyst, leadAnalystUrl } = data.datasetEmailTemplate;
                const updatedDescription = description + "\n\nThis is an updated description.";
                const updatedUrl = url + "?ref=updated";
                navigateToUserProfile();
                navigateToAdminDashboard();
                navigateToEmailDatasetPage();
                editDatasetTemplate(practiceArea, title, updatedDescription, updatedUrl, imageUrl, leadAnalyst, leadAnalystUrl);
            });
        });
        
        it('Should delete dataset email template', () => {
            cy.fixture('data.json').then((data) => {
                const { practiceArea } = data.datasetEmailTemplate;
                navigateToUserProfile();
                navigateToAdminDashboard();
                navigateToEmailDatasetPage();
                deleteDatasetTemplate(practiceArea);
            });
        });
    }
}

export default EmailTemplates;