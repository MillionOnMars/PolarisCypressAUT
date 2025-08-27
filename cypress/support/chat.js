const textModels = ['claude-3-opus', 'GPT-5', 'GPT-4.1'];

const openAI = () => {
    cy.xpath("(//*[name()='path'])[1]")
        .click({ force: true });
    // Wait for the chat window or textarea to appear
    cy.xpath("//textarea[@placeholder='Type your question here']", { timeout: 20000 })
        .should('be.visible');
}

const mathQuestions = [
    { question: 'What is the capital of France?', answer: 'Paris' },
    { question: 'What gas do humans breathe in to survive?', answer: 'Oxygen' },
    { question: 'What planet is known as the Red Planet?', answer: 'Mars' },
    { question: 'What element has the chemical symbol "O"?', answer: 'Oxygen' },
    { question: 'What organ pumps blood through the body?', answer: 'Heart' },
    { question: 'What is the largest mammal on Earth?', answer: 'Bluewhale' },
    { question: 'What language is primarily spoken in Brazil?', answer: 'Portuguese' },
    { question: 'What is the hardest natural substance?', answer: 'Diamond' },
    { question: 'What ocean is the largest on Earth?', answer: 'Pacific' },
    { question: 'What is the currency of Philippines?', answer: 'Peso' }
];

const getRandomMathQuestion = () => {
    const randomIndex = Math.floor(Math.random() * mathQuestions.length);
    return mathQuestions[randomIndex];
};

const sendPrompt = (modelName) => {
    const { question, answer } = getRandomMathQuestion();
    cy.xpath("//textarea[@placeholder='Type your question here']")
        .should('be.visible', {timeout: 15000})
        .type(`${question}{enter}`, { force: true })
        .then(() => {
            cy.wrap(Date.now()).as('startTime');
            cy.log(`Question submitted: "${question}", expected answer: "${answer}", using model: "${modelName}"`);
        });
    
    cy.wait(2000);
    
    cy.contains(answer, { timeout: 30000 })
        .scrollIntoView()
        .should('be.visible')
        .then(() => {
            cy.get('@startTime').then((startTime) => {
                const endTime = Date.now();
                const responseTime = endTime - startTime;
                const responseTimeSeconds = (responseTime/1000).toFixed(2);
                cy.log(`Response time: ${responseTime}ms (${responseTimeSeconds} seconds) using model: "${modelName}"`);
                
                // Update the response time array in the JSON file
                cy.task('updateResponseTime', {
                    filePath: 'cypress/reports/responseTime.json',
                    modelData: {
                        textModel: modelName,
                        ResponseTime: `${responseTimeSeconds} secs.`
                    }
                });
            });
        });
}

const selectTextModel = (modelName) => {
    //click new notebook
    // cy.xpath("//button[normalize-space()='+']").should('be.visible', {timeout: 15000})
    // .click();
    // Click the dropdown/button to open model selection
    cy.get('.MuiBox-root.css-1jdsw35 > div > div > button', { timeout: 30000 })
        .should('be.visible')
        .click();
    
    // Wait for dropdown to appear
    cy.wait(1000);
    
    // Select the specific model from the textModels array
    cy.contains(modelName, { timeout: 10000 })
        .should('be.visible')
        .click({ force: true });
    
    cy.log(`Selected text model: ${modelName}`);
};

const deleteNotebook = () => {
    cy.get('.MuiTypography-root.MuiTypography-body-xs.css-o9tzp0', { timeout: 10000})
        .should('be.visible')
        .should('not.be.disabled', { timeout: 10000 })
        .click();

    cy.get('.MuiGrid-grid-xs-1.css-12ufn3n > div > button', { timeout: 10000 })
        .click({ force: true });
    // Then click the "Delete" button
    cy.get('li[role="menuitem"]', { timeout: 10000 }).eq(6)
        .should('be.visible')
        .click();
    
    // Wait for confirmation dialog or deletion to complete
    cy.wait(2000);
    
    //confirm deletion
    cy.xpath("//button[normalize-space()='DELETE']", { timeout: 10000 })
        .should('be.visible')
        .click()
        .then(() => {
            cy.log('Delete confirmed, notebook deletion completed');
        });
    cy.contains('Session deleted successfully', { timeout: 10000 })
        .should('be.visible')
};

// Update your Chat class to test all 3 models
class Chat {
    static createChat() {
        describe(`Should test all text models.`, () => {
            // Initialize the response time file
            before(() => {
                cy.task('writeFile', {
                    filePath: 'cypress/reports/responseTime.json',
                    content: []
                });
            });

            textModels.forEach((model, index) => {
                it(`Should test ${model} model and record response time.`, () => {
                    openAI();
                    selectTextModel(model);
                    sendPrompt(model);
                    
                    // Add delay between models and clean up
                    if (index < textModels.length - 1) {
                        deleteNotebook();
                        cy.wait(3000); // Wait between model tests
                    }
                });
            });

            // Final cleanup
            after(() => {
                deleteNotebook();
            });
        });
    }
}

export default Chat;