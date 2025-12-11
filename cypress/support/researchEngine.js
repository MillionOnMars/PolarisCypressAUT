import { navigateToResearchEngine } from './navigate.js';


const TIMEOUT = 10000;
const TASK_COMPLETION_TIMEOUT = 120000; // 120 seconds for task to complete

// Selectors
const SELECTORS = {
    navigation: {
        analystTools: 'Analyst Tools',
        research: 'p[aria-label="Research"].MuiTypography-root.MuiTypography-body-md'
    },
    agent: {
        createButton: 'Create New Agent',
        nameInput: 'input[placeholder*="Give"]',
        descriptionTextarea: 'textarea[name="description"][placeholder*="Describe what this agent specializes in"].MuiTextarea-textarea',
        submitButton: 'button',
        deleteButton: 'button.MuiButton-root.MuiButton-variantSolid.MuiButton-colorDanger.MuiButton-sizeMd'
    },
    task: {
        createButton: 'Create Task',
        researchTypeLabel: 'Research Type',
        titleInput: 'input[placeholder*="inspiring"], input[placeholder*="title"]',
        descriptionTextarea: 'textarea[placeholder*="research"], textarea[placeholder*="Description"]',
        urlInput: 'input[name="urls.0"][type="url"][placeholder*="example"].MuiInput-input',
        promptInput: 'input[placeholder*="looking for"], textarea[placeholder*="Prompt"]',
        submitButton: 'button[type="submit"]',
        statusChip: 'span.MuiChip-label.MuiChip-labelSm'
    },
    modal: {
        deleteAgentTitle: 'Delete Agent',
        confirmationMessage: 'Are you sure you want to delete this agent?',
        deleteButton: 'Delete'
    }
};

// Messages
const MESSAGES = {
    agentCreated: 'Research agent created successfully',
    agentDeleted: 'Research agent deleted successfully',
    taskCreated: 'Research task created successfully! 🚀 Starting research...',
    taskCompleted: 'Completed'
};

// Create a new agent
const createAgent = (agentName, agentDescription) => {
    cy.contains(SELECTORS.agent.createButton, { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .click({ force: true });
    
    cy.get(SELECTORS.agent.nameInput, { timeout: TIMEOUT })
        .first()
        .should('be.visible')
        .clear()
        .type(agentName);
    
    cy.get(SELECTORS.agent.descriptionTextarea, { timeout: TIMEOUT })
        .should('be.visible')
        .clear()
        .type(agentDescription);
    
    cy.contains(SELECTORS.agent.submitButton, 'Create Agent', { timeout: TIMEOUT })
        .should('be.visible')
        .click({ force: true });
    
    cy.contains(MESSAGES.agentCreated, { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible');
    
    cy.contains(agentName, { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible');
};

// Delete an agent
const deleteAgent = (agentName) => {
    cy.contains(agentName, { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .click({ force: true });
    
    cy.contains(SELECTORS.agent.submitButton, 'Delete Agent', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .click({ force: true });
    
    cy.contains(SELECTORS.modal.deleteAgentTitle, { timeout: TIMEOUT })
        .should('exist');
    
    cy.contains(SELECTORS.modal.confirmationMessage, { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible');
    
    cy.get(SELECTORS.agent.deleteButton, { timeout: TIMEOUT })
        .contains(SELECTORS.modal.deleteButton)
        .should('exist')
        .should('be.visible')
        .click({ force: true });
    
    cy.contains(MESSAGES.agentDeleted, { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible');
    
    cy.contains(agentName, { timeout: TIMEOUT })
        .should('not.exist');
};

// Fill task form fields
const fillTaskForm = (taskData) => {
    // Select Research Type
    cy.contains(SELECTORS.task.researchTypeLabel, { timeout: TIMEOUT })
        .parent()
        .find('select, [role="combobox"]')
        .click({ force: true });
    
    cy.contains(taskData.researchType, { timeout: TIMEOUT })
        .click({ force: true });
    
    // Fill in Task Title
    cy.get(SELECTORS.task.titleInput, { timeout: TIMEOUT })
        .should('be.visible')
        .clear()
        .type(taskData.title);
    
    // Fill in Description
    cy.get(SELECTORS.task.descriptionTextarea, { timeout: TIMEOUT })
        .should('be.visible')
        .clear()
        .type(taskData.description);
    
    // Fill in Target URL
    cy.get(SELECTORS.task.urlInput, { timeout: TIMEOUT })
        .should('be.visible')
        .clear()
        .type(taskData.targetUrl);
    
    // Fill in optional prompt if provided
    if (taskData.prompt) {
        cy.get(SELECTORS.task.promptInput, { timeout: TIMEOUT })
            .should('be.visible')
            .clear()
            .type(taskData.prompt);
    }
};

// Verify task completion
const verifyTaskCompletion = (taskTitle) => {
    cy.contains(taskTitle, { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible');
    
    cy.contains(taskTitle, { timeout: TIMEOUT })
        .parents('div')
        .find(SELECTORS.task.statusChip, { timeout: TASK_COMPLETION_TIMEOUT })
        .should('contain', MESSAGES.taskCompleted)
        .should('be.visible');
};

// Create a new task
const createTask = (taskData) => {
    cy.contains(SELECTORS.task.createButton, { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .click({ force: true });
    
    fillTaskForm(taskData);
    
    cy.get(SELECTORS.task.submitButton, { timeout: TIMEOUT })
        .contains('Create Task')
        .should('be.visible')
        .click({ force: true });
    
    cy.contains(MESSAGES.taskCreated, { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible');
    
    verifyTaskCompletion(taskData.title);
};

class ResearchEngine {
    static testCreateAgent() {
        it('Should create a new agent', () => {
            cy.fixture('data.json').then((data) => {
                const { agentName, agentDescription } = data.researchEngine;
                
                navigateToResearchEngine();
                createAgent(agentName, agentDescription);
            });
        });
    }

    static testDeleteAgent() {
        it('Should delete an agent', () => {
            cy.fixture('data.json').then((data) => {
                const { agentName } = data.researchEngine;
                
                navigateToResearchEngine();
                deleteAgent(agentName);
            });
        });
    }

    static testCreateTask() {
        it('Should create a new task', () => {
            cy.fixture('data.json').then((data) => {
                const taskData = data.researchEngine.task;
                
                navigateToResearchEngine();
                createTask(taskData);
            });
        });
    }
}

export default ResearchEngine;