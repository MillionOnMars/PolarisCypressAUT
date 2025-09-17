const PracticeArea = ['AI Platforms', 'Cybersecurity', 'Semiconductors', 'Sofware Engineering', 'Enterprise Software', 'CIO Insights', 'CEO Insights', 'AI Devices', 'Channel Ecosystems']; // Add Practice Areas here - no data yet (Customer Experience, Quantum Computing, Communications Network, Data Intelligence,) - Customer Portal has its own Export Data.

const getRandomPracticeArea = (count) => {
    return PracticeArea.sort(() => 0.5 - Math.random()).slice(0, count);
};

const exportData = (pracArea) => {
    // Practice Area Selection
    cy.get("button[role='combobox']", { timeout: 15000 })
        .should('be.visible')
        .should('not.be.disabled', { timeout: 15000 })
        .click();
    cy.contains(pracArea, { timeout: 10000 }).click()
    cy.wait(3000); // wait for 3 second
    
    switch(pracArea) {
        case 'AI Platforms':
            //Market Data
            cy.xpath("(//span[contains(text(),'Export')])[1]").click(); // Export Data button - Actual Revenue
            cy.xpath("(//span[contains(text(),'Export')])[2]").click(); // Export Data button - Forecast Revenue
            //Decision Maker
            cy.xpath("(//span[contains(text(),'Export')])[3]").click(); // Export Data button - AI Practices
            cy.xpath("(//span[contains(text(),'Export')])[4]").click(); // Export Data button - Consultants & Integrators
            //Check Downloaded Files
            cy.readFile('cypress/downloads/Actual Revenue.csv', { timeout: 15000 })
                .should('exist')
                .then((fileContent) => {
                    expect(fileContent).to.include('Actual');
                });
            cy.readFile('cypress/downloads/Forecast Revenue.csv', { timeout: 15000 })
                .should('exist')
                .then((fileContent) => {
                    expect(fileContent).to.include('Forecast');
                });
            cy.readFile('cypress/downloads/AI Practices.csv', { timeout: 15000 })
                .should('exist')
                .then((fileContent) => {
                    expect(fileContent).to.include('AI Practices');
                });
            cy.readFile('cypress/downloads/Consultants & Integrators.csv', { timeout: 15000 })
                .should('exist')
                .then((fileContent) => {
                    expect(fileContent).to.include('Consultants & Integrators');        
                });
            //Delete Downloaded Files
            cy.task('deleteFile', 'cypress/downloads/Actual Revenue.csv');
            cy.task('deleteFile', 'cypress/downloads/Forecast Revenue.csv');
            break;
        case 'Cybersecurity':
            //Decision Maker
            cy.xpath("(//span[contains(text(),'Export')])[1]").click(); // Export Data button - Cyber Security Usage
            cy.xpath("(//span[contains(text(),'Export')])[2]").click(); // Export Data button - Data Protection
            //Check Downloaded Files
            cy.readFile('cypress/downloads/Cyber Security Usage.csv', { timeout: 15000 })
                .should('exist')
                .then((fileContent) => {
                    expect(fileContent).to.include('Cyber Security Usage');
                });
            cy.readFile('cypress/downloads/Data Protection.csv', { timeout: 15000 })
                .should('exist')
                .then((fileContent) => {
                    expect(fileContent).to.include('Data Protection');        
                });
            //Delete Downloaded Files
            cy.task('deleteFile', 'cypress/downloads/Cyber Security Usage.csv');
            cy.task('deleteFile', 'cypress/downloads/Data Protection.csv');
            break;
        case 'Semiconductors':
            //Decision Maker
            cy.xpath("(//span[contains(text(),'Export')])[1]").click(); // Export Data button - AI Chipsets Practices
            cy.xpath("(//span[contains(text(),'Export')])[2]").click(); // Export Data button - AI Chipsets On Premise
            //Market Data
            cy.xpath("(//span[contains(text(),'Export')])[5]").click(); // Export Data button - Actual Revenue
            cy.xpath("(//span[contains(text(),'Export')])[6]").click(); // Export Data button - Forecast Revenue
            //Check Downloaded Files
            cy.readFile('cypress/downloads/AI Chipsets Practices.csv', { timeout: 15000 })
                .should('exist')
                .then((fileContent) => {
                    expect(fileContent).to.include('AI Chipsets Practices');
                });
            cy.readFile('cypress/downloads/AI Chipsets On Premise.csv', { timeout: 15000 })
                .should('exist')
                .then((fileContent) => {
                    expect(fileContent).to.include('AI Chipsets On Premise');        
                });
            cy.readFile('cypress/downloads/Actual Revenue.csv', { timeout: 15000 })
                .should('exist')
                .then((fileContent) => {
                    expect(fileContent).to.include('Actual');
                });
            cy.readFile('cypress/downloads/Forecast Revenue.csv', { timeout: 15000 })
                .should('exist')
                .then((fileContent) => {
                    expect(fileContent).to.include('Forecast');
                });
            //Delete Downloaded Files
            cy.task('deleteFile', 'cypress/downloads/AI Chipsets Practices.csv');
            cy.task('deleteFile', 'cypress/downloads/AI Chipsets On Premise.csv');
            cy.task('deleteFile', 'cypress/downloads/Actual Revenue.csv');
            cy.task('deleteFile', 'cypress/downloads/Forecast Revenue.csv');
            break;

            default:
                cy.log(`Practice area "${pracArea}" is not recognized.`);
                break;
            }
    }


export default exportData;
export { getRandomPracticeArea };