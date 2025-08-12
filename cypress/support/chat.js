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
    
    // Wait a moment for the message to be sent, then scroll
    cy.wait(2000);
    cy.scrollTo('bottom'); // Scroll the entire page

    // cy.xpath("//span[contains(text(),'31.')]", { timeout: 30000 })
    cy.contains('31', { timeout: 10000 }).should('exist');
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