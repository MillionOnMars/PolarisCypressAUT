const openAI = () => {
    cy.xpath("(//*[name()='path'])[1]")
        .click({ force: true });
    // Wait for the chat window or textarea to appear
    cy.xpath("//textarea[@placeholder='Type your question here']", { timeout: 20000 })
        .should('be.visible');
}

const mathQuestions = [
    { question: 'What is the next prime number after 31?', answer: '37' },
    { question: 'What is 12 + 8?', answer: '20' },
    { question: 'What is the square root of 64?', answer: '8' },
    { question: 'What is 15 × 3?', answer: '45' },
    { question: 'What is the next prime number after 7?', answer: '11' },
    { question: 'What is 100 ÷ 4?', answer: '25' },
    { question: 'What is 2 to the power of 5?', answer: '32' },
    { question: 'What is the factorial of 4?', answer: '24' },
    { question: 'What is the next prime number after 13?', answer: '17' },
    { question: 'What is 9 squared?', answer: '81' }
];

const getRandomMathQuestion = () => {
    const randomIndex = Math.floor(Math.random() * mathQuestions.length);
    return mathQuestions[randomIndex];
};

const sendPrompt = () => {
    const { question, answer } = getRandomMathQuestion();
    cy.xpath("//textarea[@placeholder='Type your question here']")
        .should('be.visible', {timeout: 15000})
        .type(`${question}{enter}`, { force: true })
        .then(() => {
            cy.wrap(Date.now()).as('startTime');
            cy.log(`Question submitted: "${question}", expected answer: "${answer}"`);
        });
    
    cy.wait(2000);
    
    cy.contains(answer, { timeout: 30000 })
        .scrollIntoView()
        .should('be.visible')
        .then(() => {
            cy.get('@startTime').then((startTime) => {
                const endTime = Date.now();
                const responseTime = endTime - startTime;
                cy.log(`Response time: ${responseTime}ms (${(responseTime/1000).toFixed(2)} seconds)`);
                
                // Store response time to file
                cy.task('writeFile', {
                    filePath: 'cypress/reports/responseTime.json',
                    content: {
                        question: question,
                        answer: answer,
                        responseTime: responseTime,
                        responseTimeSeconds: (responseTime/1000).toFixed(2),
                        timestamp: new Date().toISOString()
                    }
                });
            });
        });
}

const deleteNotebook = () => {
    cy.get('.MuiTypography-root.MuiTypography-body-xs.css-12xawau', { timeout: 10000})
        .should('be.visible')
        .should('not.be.disabled', { timeout: 10000 })
        .click();

    cy.get('.css-1jt3kwv', { timeout: 10000 })
        // .should('be.visible')
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

class Chat {
    static createChat() {
        describe(`Should open Futurum AI window.`, () => {
            it(`Input prompt and validate reply.`, () => {
                openAI();
                sendPrompt();
             });
            it(`Should delete notebook.`, () => {
                openAI();
                deleteNotebook();
            });
        });
    }
}

export default Chat;