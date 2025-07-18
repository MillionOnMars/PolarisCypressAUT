
const openAI = () => {
    cy.xpath("//button[@class='MuiIconButton-root MuiIconButton-variantPlain MuiIconButton-colorNeutral MuiIconButton-sizeLg css-1g9bxi6']")
        .click({ force: true });
    // Wait for the chat window or textarea to appear
    cy.xpath("//textarea[@placeholder='Type your question here']", { timeout: 20000 })
        .should('be.visible');
    // cy.xpath("//button[@aria-label='Maximize']//*[name()='svg']")
    //     .click({ force: true });
}

const sendPrompt = () => {
    cy.xpath("//textarea[@placeholder='Type your question here']")
        .should('be.visible', {timeout: 15000})
        .type('What is the next prime number after 29?{enter}', { force: true })
        .click();
    
    // Wait for the answer and scroll into view   
    cy.xpath("//span[contains(text(),'31.')]").last().should('be.visible');
        
}

class Chat {
    static createChat() {
        describe(`Should open Futurum AI window.`, () => {
            it(`Input prompt and validate reply.`, () => {
                openAI();
                sendPrompt();
             });
        });
    }
}

export default Chat;