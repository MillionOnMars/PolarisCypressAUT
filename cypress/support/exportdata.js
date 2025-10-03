const PracticeArea = ['AI Platforms', 'Cybersecurity', 'Semiconductors', 'Sofware Engineering', 'Enterprise Software', 'CIO Insights', 'CEO Insights', 'AI Devices', 'Channel Ecosystems']; // Add Practice Areas here - no data yet (Customer Experience, Quantum Computing, Communications Network, Data Intelligence,) - Customer Portal has its own Export Data.

const getRandomPracticeArea = (count) => {
    return PracticeArea.sort(() => 0.5 - Math.random()).slice(0, count);
};

const verifyFileContent = (filePath, expectedContent) => {
    cy.readFile(filePath, { timeout: 15000 })
        .should('exist')
        .then((fileContent) => {
            expect(fileContent).to.include(expectedContent);
        });
};

const exportData = (pracArea) => {
    cy.wait(2000); // wait for 2 seconds
    cy.get('[aria-label="Export Data"]', {timeout: 10000})
        .eq(1)
        .should('exist')
        .click({force:true}); // Click Export Data button on left navigation
        // Practice Area Selection
    cy.get("button[role='combobox']", { timeout: 10000 })
        .contains('AI Platforms') // Ensure the dropdown has loaded
        .should('be.visible')
        .should('not.be.disabled', { timeout: 10000 })
        .click();
        cy.wait(2000); // wait for dropdown to load
    cy.get('.css-pfk9p').contains(pracArea, { timeout: 10000 })
    .click()
    cy.wait(2000); // wait for section to load
    
    switch(pracArea) {
        case 'AI Platforms':
            //Market Data
            cy.xpath("(//span[contains(text(),'Export')])[1]").click(); // Export Data button - Actual Revenue
            cy.xpath("(//span[contains(text(),'Export')])[2]").click(); // Export Data button - Forecast Revenue
            cy.wait(5000); // wait for 5 seconds for the files to download
            //Decision Maker
            cy.xpath("(//span[contains(text(),'Export')])[3]").click(); // Export Data button - AI Practices
            cy.xpath("(//span[contains(text(),'Export')])[4]").click(); // Export Data button - Consultants & Integrators
            cy.wait(10000); // wait for 10 seconds for the files to download
            
            // Verify Files
            verifyFileContent('cypress/downloads/Actual Revenue.csv', 'Development Tools');
            verifyFileContent('cypress/downloads/Forecast Revenue.csv', 'Development Tools');
            verifyFileContent('cypress/downloads/AI Practices.csv', 'Qualified');
            verifyFileContent('cypress/downloads/Consultants & Integrators.csv', 'North America');
            //Delete Downloaded Files
            cy.task('deleteFiles', [
            'cypress/downloads/Actual Revenue.csv',
            'cypress/downloads/Forecast Revenue.csv',
            'cypress/downloads/AI Practices.csv',
            'cypress/downloads/Consultants & Integrators.csv',
            ]); 
            break;
        case 'Cybersecurity':
            //Decision Maker
            cy.xpath("(//span[contains(text(),'Export')])[1]").click(); // Export Data button - Cyber Security Usage
            cy.xpath("(//span[contains(text(),'Export')])[2]").click(); // Export Data button - Data Protection
            cy.wait(10000); // wait for 10 seconds for the files to download
            
            // Verify Files
            verifyFileContent('cypress/downloads/Cyber Security Usage.csv', 'North America');
            verifyFileContent('cypress/downloads/Data Protection.csv', 'North America');
            //Delete Downloaded Files
            cy.task('deleteFiles', [
            'cypress/downloads/Cyber Security Usage.csv',
            'cypress/downloads/Data Protection.csv',
            ]);
            break;
        case 'Semiconductors':
            //Decision Maker
            cy.xpath("(//span[contains(text(),'Export')])[1]").click(); // Export Data button - AI Chipsets Practices
            cy.xpath("(//span[contains(text(),'Export')])[2]").click(); // Export Data button - AI Chipsets On Premise
            cy.wait(5000); // wait for 5 seconds for the files to download
            //Market Data
            cy.xpath("(//span[contains(text(),'Export')])[5]").click(); // Export Data button - Actual Revenue
            cy.xpath("(//span[contains(text(),'Export')])[6]").click(); // Export Data button - Forecast Revenue
            cy.wait(10000); // wait for 10 seconds for the files to download
            
            // Verify Files
            verifyFileContent('cypress/downloads/AI Chipsets Practices.csv', 'North America');
            verifyFileContent('cypress/downloads/AI Chipsets On Premise.csv', 'North America');
            verifyFileContent('cypress/downloads/Actual Revenue.csv', 'Development Tools');
            verifyFileContent('cypress/downloads/Forecast Revenue.csv', 'Development Tools');
            
            //Delete Downloaded Files
            cy.task('deleteFiles', [
            'cypress/downloads/AI Chipsets Practices.csv',
            'cypress/downloads/AI Chipsets On Premise.csv',
            'cypress/downloads/Actual Revenue.csv',
            'cypress/downloads/Forecast Revenue.csv',
            ]);
            break;
        case 'Software Engineering':
            //Market Data
            cy.xpath("(//span[contains(text(),'Export')])[1]").click(); // Export Data button - DevOps Market
            cy.wait(5000); // wait for 5 seconds for the files to download
            //Decision Maker
            cy.xpath("(//span[contains(text(),'Export')])[2]").click(); // Export Data button - ADM Practices
            cy.xpath("(//span[contains(text(),'Export')])[3]").click(); // Export Data button - AIOps
            cy.wait(10000); // wait for 10 seconds for the files to download
            
            // Verify Files
            verifyFileContent('cypress/downloads/DevOps Market.csv', 'Cloud');
            verifyFileContent('cypress/downloads/ADM Practices.csv', 'North America');
            verifyFileContent('cypress/downloads/AIOps.csv', 'North America');
            //Delete Downloaded Files
            cy.task('deleteFiles', [
            'cypress/downloads/DevOps Market.csv',
            'cypress/downloads/ADM Practices.csv',
            'cypress/downloads/AIOps.csv',
            ]);
            break;
        case 'Enterprise Software':
            //Decision Maker
            cy.xpath("(//span[contains(text(),'Export')])[1]").click(); // Export Data button - Application Practices
            cy.xpath("(//span[contains(text(),'Export')])[2]").click(); // Export Data button - Business Intelligence
            cy.wait(5000); // wait for 5 seconds for the files to download
            //Market Data
            cy.xpath("(//span[contains(text(),'Export')])[14]").click(); // Export Data button - Actual Revenue
            cy.xpath("(//span[contains(text(),'Export')])[15]").click(); // Export Data button - Forecast Revenue
            cy.wait(10000); // wait for 10 seconds for the files to download
            
            // Verify Files
            verifyFileContent('cypress/downloads/Actual Revenue.csv', 'Business Services');
            verifyFileContent('cypress/downloads/Forecast Revenue.csv', 'Business Services');
            verifyFileContent('cypress/downloads/Application Practices.csv', 'North America');
            verifyFileContent('cypress/downloads/Business Intelligence.csv', 'North America');
            //Delete Downloaded Files
            cy.task('deleteFiles', [
            'cypress/downloads/Actual Revenue.csv',
            'cypress/downloads/Forecast Revenue.csv',
            'cypress/downloads/Application Practices.csv',
            'cypress/downloads/Business Intelligence.csv',
            ]);
            break;
        case 'CIO Insights':
            //CIO Insights
            cy.xpath("(//span[contains(text(),'Export')])[1]").click(); // Export Data button - Priorities
            cy.xpath("(//span[contains(text(),'Export')])[2]").click(); // Export Data button - IT Spend
            cy.wait(10000); // wait for 10 seconds for the files to download  
            // Verify Files
            verifyFileContent('cypress/downloads/Priorities.csv', 'North America');
            verifyFileContent('cypress/downloads/IT Spend.csv', 'North America');
            //Delete Downloaded Files
            cy.task('deleteFiles', [
            'cypress/downloads/Priorities.csv',
            'cypress/downloads/IT Spend.csv',
            ]);
            break;
        case 'CEO Insights':
            //Decision Maker
            cy.xpath("(//span[contains(text(),'Export')])[1]").click(); // Export Data button - Planning
            cy.xpath("(//span[contains(text(),'Export')])[2]").click(); // Export Data button - Execution
            cy.wait(10000); // wait for 10 seconds for the files to download  
            // Verify Files
            verifyFileContent('cypress/downloads/Planning.csv', 'North America');
            verifyFileContent('cypress/downloads/Execution.csv', 'North America');
            //Delete Downloaded Files
            cy.task('deleteFiles', [
            'cypress/downloads/Planning.csv',
            'cypress/downloads/Execution.csv',
            ]);
            break;
        case 'AI Devices':
            //Market Data
            cy.xpath("(//span[contains(text(),'Export')])[1]").click(); // Export Data button - Actual Revenue
            cy.wait(5000); // wait for 5 seconds for the files to download  
            // Verify Files
            verifyFileContent('cypress/downloads/Actual Revenue.csv', 'Laptop');
            //Delete Downloaded Files
            cy.task('deleteFiles', [
            'cypress/downloads/Actual Revenue.csv',
            ]);
            break;
        case 'Channel Ecosystems':
            //Decision Maker
            cy.xpath("(//span[contains(text(),'Export')])[1]").click(); // Export Data button - Market Expectations
            cy.xpath("(//span[contains(text(),'Export')])[2]").click(); // Export Data button - Vendors
            cy.wait(10000); // wait for 10 seconds for the files to download
            // Verify Files
            verifyFileContent('cypress/downloads/Market Expectations.csv', 'North America');
            verifyFileContent('cypress/downloads/Vendors.csv', 'North America');
            //Delete Downloaded Files
            cy.task('deleteFiles', [
            'cypress/downloads/Market Expectations.csv',
            'cypress/downloads/Vendors.csv',
            ]);
            break;
        default:
                cy.log(`Practice area "${pracArea}" is not recognized.`);
                break;
            }
    }
class ExportData {
    static verifyExportData(pracArea) {
        it(`Should select ${pracArea} and verify export data.`, () => {
            exportData(pracArea)
        });
    }
}   

export { ExportData, getRandomPracticeArea };