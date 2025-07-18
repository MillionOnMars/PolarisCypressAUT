
const openAI = () => {
    cy.xpath("//button[@class='MuiIconButton-root MuiIconButton-variantPlain MuiIconButton-colorNeutral MuiIconButton-sizeLg css-1g9bxi6']")
        .click({ force: true });
}

const sendPrompt = () => {
    cy.xpath("//textarea[@placeholder='Type your question here']")
        .should('be.visible', {timeout: 15000})
        .type('What is the next prime number after 29?{enter}', { force: true });
    // Wait for the answer and scroll into view
    cy.contains('31', { timeout: 20000 })
        .scrollIntoView()
        .should('be.visible');
        
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