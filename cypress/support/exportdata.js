const PracticeArea = ['AI Platforms','Cybersecurity','Semiconductors','Software Engineering','Enterprise Software','CIO Insights','CEO Insights','AI Devices','Channel Ecosystems']; // Add Practice Areas here - no data yet (Customer Experience, Quantum Computing, Communications Network, Data Intelligence,) - Customer Portal has its own Export Data.

const getRandomPracticeArea = (count) => {
    return PracticeArea.sort(() => 0.5 - Math.random()).slice(0, count);
};

const verifyFileContent = (filePath, expectedContent) => {
    cy.readFile(filePath, { timeout: 60000 })
        .should('exist')
        .then((fileContent) => {
            expect(fileContent).to.include(expectedContent);
        });
};

// Configuration object for each practice area
const practiceAreaConfig = {
    'AI Platforms': {
        exports: [
            { xpath: "(//span[contains(text(),'Export')])[1]", wait: 5000 },
            { xpath: "(//span[contains(text(),'Export')])[2]", wait: 5000 },
            { xpath: "(//span[contains(text(),'Export')])[3]", wait: 10000 },
            { xpath: "(//span[contains(text(),'Export')])[4]", wait: 10000 }
        ],
        files: [
            { path: 'cypress/downloads/Scenario Forecast.csv', content: 'Scenario' },
            { path: 'cypress/downloads/Market Forecast.csv', content: 'Deployment' },
            { path: 'cypress/downloads/AI Practices.csv', content: 'North America' },
            { path: 'cypress/downloads/AI Models.csv', content: 'North America' }
        ]
    },
    'Cybersecurity': {
        exports: [
            { xpath: "(//span[contains(text(),'Export')])[1]", wait: 10000 },
            { xpath: "(//span[contains(text(),'Export')])[2]", wait: 10000 }
        ],
        files: [
            { path: 'cypress/downloads/Actual Revenue.csv', content: 'Cloud Revenue' },
            { path: 'cypress/downloads/Forecast Revenue.csv', content: 'Cloud Revenue' }
        ]
    },
    'Semiconductors': {
        exports: [
            { xpath: "(//span[contains(text(),'Export')])[1]", wait: 5000 },
            { xpath: "(//span[contains(text(),'Export')])[2]", wait: 5000 },
            { xpath: "(//span[contains(text(),'Export')])[5]", wait: 10000 },
            { xpath: "(//span[contains(text(),'Export')])[6]", wait: 10000 }
        ],
        files: [
            { path: 'cypress/downloads/Scenario Forecast.csv', content: 'Scenario' },
            { path: 'cypress/downloads/Submarket Forecast.csv', content: 'GPU' },
            { path: 'cypress/downloads/Market Share.csv', content: 'North America' },
            { path: 'cypress/downloads/Strategic Investments.csv', content: 'Europe - Western Europe/EU' }
        ]
    },
    'Software Engineering': {
        exports: [
            { xpath: "(//span[contains(text(),'Export')])[1]", wait: 5000 },
            { xpath: "(//span[contains(text(),'Export')])[2]", wait: 10000 },
            { xpath: "(//span[contains(text(),'Export')])[3]", wait: 10000 }
        ],
        files: [
            { path: 'cypress/downloads/DevOps Market.csv', content: 'Cloud' },
            { path: 'cypress/downloads/ADM Practices.csv', content: 'North America' },
            { path: 'cypress/downloads/AIOps.csv', content: 'North America' }
        ]
    },
    'Enterprise Software': {
        exports: [
            { xpath: "(//span[contains(text(),'Export')])[1]", wait: 5000 },
            { xpath: "(//span[contains(text(),'Export')])[2]", wait: 5000 },
            { xpath: "(//span[contains(text(),'Export')])[14]", wait: 10000 },
            { xpath: "(//span[contains(text(),'Export')])[15]", wait: 10000 }
        ],
        files: [
            { path: 'cypress/downloads/Application Practices.csv', content: 'North America' },
            { path: 'cypress/downloads/Business Intelligence.csv', content: 'North America' },
            { path: 'cypress/downloads/Actual Revenue.csv', content: 'Business Services' },
            { path: 'cypress/downloads/Forecast Revenue.csv', content: 'Business Services' }
        ]
    },
    'CIO Insights': {
        exports: [
            { xpath: "(//span[contains(text(),'Export')])[1]", wait: 10000 },
            { xpath: "(//span[contains(text(),'Export')])[2]", wait: 10000 }
        ],
        files: [
            { path: 'cypress/downloads/Priorities.csv', content: 'North America' },
            { path: 'cypress/downloads/IT Spend.csv', content: 'North America' }
        ]
    },
    'CEO Insights': {
        exports: [
            { xpath: "(//span[contains(text(),'Export')])[1]", wait: 10000 },
            { xpath: "(//span[contains(text(),'Export')])[2]", wait: 10000 }
        ],
        files: [
            { path: 'cypress/downloads/Planning.csv', content: 'North America' },
            { path: 'cypress/downloads/Execution.csv', content: 'North America' }
        ]
    },
    'AI Devices': {
        exports: [
            { xpath: "(//span[contains(text(),'Export')])[1]", wait: 5000 }
        ],
        files: [
            { path: 'cypress/downloads/Actual Revenue.csv', content: 'Laptop' }
        ]
    },
    'Channel Ecosystems': {
        exports: [
            { xpath: "(//span[contains(text(),'Export')])[1]", wait: 10000 },
            { xpath: "(//span[contains(text(),'Export')])[2]", wait: 10000 }
        ],
        files: [
            { path: 'cypress/downloads/Market Expectations.csv', content: 'North America' },
            { path: 'cypress/downloads/Vendors.csv', content: 'North America' }
        ]
    }
};

const exportData = (pracArea) => {
    cy.wait(2000);
    cy.get('[aria-label="Export Data"]', {timeout: 10000})
        .first()
        .should('exist')
        .click({force:true});
    
    // Practice Area Selection
    cy.get("button[role='combobox']", { timeout: 10000 })
        .contains('AI Platforms')
        .should('be.visible')
        .should('not.be.disabled', { timeout: 10000 })
        .click();
    
    cy.wait(2000);
    
    cy.get('[role="listbox"]').contains(pracArea, { timeout: 10000 })
        .should('be.visible')
        .click();
    
    cy.wait(2000);
    
    // Get configuration for the selected practice area
    const config = practiceAreaConfig[pracArea];
    
    if (!config) {
        cy.log(`Practice area "${pracArea}" is not recognized.`);
        return;
    }
    
    // Click all export buttons with their respective waits
    config.exports.forEach((exportItem, index) => {
        cy.log(`Clicking export button ${index + 1} for ${pracArea}`);
        cy.xpath(exportItem.xpath).click();
        
        // Wait after clicking (use the wait from the export item)
        if (exportItem.wait) {
            cy.wait(exportItem.wait);
        }
    });
    
    // Verify all downloaded files
    cy.log(`Verifying ${config.files.length} files for ${pracArea}`);
    config.files.forEach((file) => {
        verifyFileContent(file.path, file.content);
    });
    
    // Delete all downloaded files
    const filePaths = config.files.map(file => file.path);
    cy.log(`Deleting ${filePaths.length} files`);
    cy.task('deleteFiles', filePaths);
};

class ExportData {
    static verifyExportData(pracArea) {
        it(`Should select ${pracArea} and verify export data.`, () => {
            exportData(pracArea);
        });
    }
    
    // Bonus: Method to test all practice areas
    static verifyAllPracticeAreas() {
        Object.keys(practiceAreaConfig).forEach((pracArea) => {
            this.verifyExportData(pracArea);
        });
    }
    
    // Bonus: Method to test random practice areas
    static verifyRandomPracticeAreas(count) {
        const randomAreas = getRandomPracticeArea(count);
        randomAreas.forEach((pracArea) => {
            this.verifyExportData(pracArea);
        });
    }
}   

export { ExportData, getRandomPracticeArea, practiceAreaConfig };