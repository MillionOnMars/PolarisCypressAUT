const TIMEOUT = 10000;

const navigateToReportsSection = () => {
    cy.contains('Reports', { timeout: TIMEOUT })
        .should('be.visible')
        .click({ force: true });
};

const waitForHomepageToLoad = () => {
    // Wait for the organization autocomplete input to be visible
    cy.get('input[role="combobox"][class*="MuiAutocomplete-input"]', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .should('have.value', 'Microsoft_QA');
};

const waitForLoadingToComplete = () => {
    // Wait for loading animation to disappear
    cy.get('.MuiCircularProgress-progress', { timeout: TIMEOUT })
        .should('not.exist');
};

const searchReport = (reportName) => {
    // Click on the search input
    cy.get('input[placeholder="Search"]', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .clear()
        .type(reportName);
};

const verifyReportIsDisplayed = (reportName) => {
    cy.contains(reportName, { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible');
};

const verifyPracticeAreaFilter = (practiceArea) => {
    // Wait for loading to complete
    waitForLoadingToComplete();
    
    // Verify the practice area filter is applied
    cy.get('.MuiTable-root', { timeout: TIMEOUT })
        .contains(practiceArea)
        .should('exist')
        .should('be.visible');
};

const selectPracticeArea = (practiceArea) => {
    // Click the practice area dropdown button
    cy.get('button[role="combobox"]', { timeout: TIMEOUT })
        .eq(0)
        .should('exist')
        .should('be.visible')
        .click({ force: true });
    
    // First, click "All" to deselect all selections
    cy.get('li[role="option"]', { timeout: TIMEOUT })
        .contains('All')
        .should('exist')
        .should('be.visible')
        .click({ force: true });
    
    // Then select the specific practice area
    cy.get('li[role="option"]', { timeout: TIMEOUT })
        .contains(practiceArea)
        .should('exist')
        .should('be.visible')
        .click({ force: true });

    // Close the dropdown by clicking outside
    cy.get('body').click(0,0);

    // Verify filter output
    verifyPracticeAreaFilter(practiceArea);
};

const selectReportType = (reportType) => {
    // Click the report type dropdown button
    cy.get('button[role="combobox"]', { timeout: TIMEOUT })
        .eq(1)
        .should('exist')
        .should('be.visible')
        .click({ force: true });

    // Click the first checked option to deselect all selections
    cy.get('ul[role="listbox"]:visible', { timeout: TIMEOUT })
        .first()
        .find('li[role="option"][aria-selected="true"]')
        .first()
        .should('exist')
        .click({ force: true });

    // Select the report type from dropdown
    cy.get('ul[role="listbox"]:visible', { timeout: TIMEOUT })
        .find('li[role="option"]')
        .contains(reportType)
        .should('exist')
        .click({ force: true });

    // Wait for loading to complete
    waitForLoadingToComplete();

    // Verify filter output
    cy.get('.MuiTable-root', { timeout: TIMEOUT })
        .contains(reportType)
        .should('exist')
        .should('be.visible');
};

const selectYear = (year) => {
    // Click the year dropdown button
    cy.get('button[role="combobox"]', { timeout: TIMEOUT })
        .eq(2)
        .should('exist')
        .should('be.visible')
        .click({ force: true });

    // Click the first checked option to deselect all selections
    cy.get('ul[role="listbox"]:visible', { timeout: TIMEOUT })
        .first()
        .find('li[role="option"][aria-selected="true"]')
        .first()
        .should('exist')
        .click({ force: true });

    // Select the year from dropdown
    cy.get('li[role="option"]', { timeout: TIMEOUT })
        .contains(year)
        .should('exist')
        .should('be.visible')
        .click({ force: true });

    // Wait for loading to complete
    waitForLoadingToComplete();

    // Verify filter output
    cy.get('.MuiTable-root', { timeout: TIMEOUT })
        .contains(year)
        .should('exist')
        .should('be.visible');
};

const verifyQuarterInTable = (quarter) => {
    // Map quarter to month ranges
    const quarterMonths = {
        'Q1': ['01', '02', '03'],
        'Q2': ['04', '05', '06'],
        'Q3': ['07', '08', '09'],
        'Q4': ['10', '11', '12']
    };

    // Get the months for the selected quarter
    const months = quarterMonths[quarter];

    // Wait for loading to complete
    waitForLoadingToComplete();

    // Verify the date in the published date column falls within the quarter
    cy.get('table.MuiTable-root tbody tr', { timeout: TIMEOUT })
        .should('exist')
        .first()
        .find('td')
        .eq(1)
        .invoke('text')
        .then((dateText) => {
            // Extract month from date format (MM.DD.YYYY or similar)
            const monthMatch = dateText.match(/(\d{2})\.\d{2}\.\d{4}/);
            if (monthMatch) {
                const month = monthMatch[1];
                expect(months).to.include(month);
            }
        });
};

const selectQuarter = (quarter) => {
    // Click the quarter dropdown button
    cy.get('button[role="combobox"]', { timeout: TIMEOUT })
        .eq(3)
        .should('exist')
        .should('be.visible')
        .click({ force: true });
    
    // Click the first checked option to deselect all selections
    cy.get('ul[role="listbox"]:visible', { timeout: TIMEOUT })
        .first()
        .find('li[role="option"][aria-selected="true"]')
        .first()
        .should('exist')
        .click({ force: true });
    
    // Select the quarter from dropdown
    cy.get('li[role="option"]', { timeout: TIMEOUT })
        .contains(quarter)
        .should('exist')
        .should('be.visible')
        .click({ force: true });
        
    // Verify filter output - check if date falls within quarter
    verifyQuarterInTable(quarter);
};

const applyReportFilters = (practiceArea, reportType, year, quarter) => {
    // Apply all report filters
    selectPracticeArea(practiceArea);
    selectReportType(reportType);
    selectYear(year);
    selectQuarter(quarter);
};

const clickPreviewButton = (reportName) => {
    // Find the table row containing the report name and click Preview button
    cy.get('table.MuiTable-root tbody tr', { timeout: TIMEOUT })
        .contains('td', reportName)
        .parent('tr')
        .within(() => {
            cy.get('button[class*="MuiButton-variantOutlined"]', { timeout: TIMEOUT })
                .contains('Preview')
                .should('exist')
                .should('be.visible')
                .click({ force: true });
        });
};

const verifyPreviewModal = (previewTitle) => {  
    // Verify preview modal is displayed with the correct title
    cy.get('body', { timeout: TIMEOUT })
        .should('contain', previewTitle);
};

const openFullReport = () => {
    // Click Open Full Report button
    cy.contains('button', 'Open Full Report', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .click({ force: true });
};

const verifyFullReportPage = () => {
    // Verify full report PDF viewer is displayed
    cy.get('#webviewer-1', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible');
};

const waitForDocumentToLoad = () => {
    // Wait for the document content container to be fully loaded
    cy.get('#webviewer-1', { timeout: TIMEOUT })
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap)
        .find('.content .document-content-container', { timeout: 20000 })
        .should('exist')
        .should('be.visible');
    
    // Wait for the first page canvas to be loaded
    cy.get('#webviewer-1', { timeout: TIMEOUT })
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap)
        .find('canvas.canvas1', { timeout: 20000 })
        .should('exist')
        .should('be.visible');
    
    // Additional wait to ensure document is fully rendered
    cy.wait(2000);
};

const previewReport = (reportName, previewTitle) => {
    // Search for the report
    searchReport(reportName);
    
    // Wait for loading to complete
    waitForLoadingToComplete();
    
    // Click preview button
    clickPreviewButton(reportName);
    
    // Verify preview modal opened
    verifyPreviewModal(previewTitle);
    
    // Open full report
    openFullReport();
    
    // Verify full report page
    verifyFullReportPage();
};

const clickExportButton = () => {
    // Wait for document to load before clicking export
    waitForDocumentToLoad();
    
    // Get the iframe and work with its content
    cy.get('#webviewer-1', { timeout: TIMEOUT })
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap)
        .find('button.Button.ActionButton[aria-label="Download"]', { timeout: TIMEOUT })
        .should('exist')
        .should('be.visible')
        .click({ force: true });
    
    // Wait for download to initiate
    cy.wait(2000);
};

const verifyDownloadCompleted = (fileName = 'Quantum Computers Software and Hardware Architecture.pdf') => {
    // Verify PDF download completed
    const downloadsFolder = Cypress.config('downloadsFolder');
    
    // Wait for download to complete
    cy.wait(3000);
    
    // Verify file exists and is not empty
    cy.readFile(`${downloadsFolder}/${fileName}`, 'binary', { timeout: 15000 })
        .should((buffer) => {
            expect(buffer.length).to.be.greaterThan(0);
        });
};

const exportReport = (reportName, previewTitle) => {
    // Search for the report
    searchReport(reportName);
    
    // Wait for loading to complete
    waitForLoadingToComplete();
    
    // Click preview button
    clickPreviewButton(reportName);
    
    // Verify preview modal opened
    verifyPreviewModal(previewTitle);
    
    // Open full report
    openFullReport();

    // Verify full report page
    verifyFullReportPage();

    // Click Export/Download button
    clickExportButton();
    
    // Verify download completed
    verifyDownloadCompleted();
};

class Reports {
    static filterReports() {
        it('Should search reports', () => {
            cy.fixture('data.json').then((data) => {
                const { name } = data.report;
                waitForHomepageToLoad();
                navigateToReportsSection();
                searchReport(name);
                verifyReportIsDisplayed(name);
            });
        });

        it('Should filter Practice Area, Report Type, Year and Quarter', () => {
            cy.fixture('data.json').then((data) => {
                const { practiceArea, reportType, year, quarter } = data.report;
                waitForHomepageToLoad();
                navigateToReportsSection();
                applyReportFilters(practiceArea, reportType, year, quarter);
            });
        });
    }

    static viewReportPreview() {
        it('Should view report preview and open full report', () => {
            cy.fixture('data.json').then((data) => {
                const { name, title } = data.report;
                waitForHomepageToLoad();
                navigateToReportsSection();
                previewReport(name, title);
            });
        });
    }

    static exportReports() {
        it('Should export report as PDF', () => {
            cy.fixture('data.json').then((data) => {
                const { name, title } = data.report;
                waitForHomepageToLoad();
                navigateToReportsSection();
                exportReport(name, title);
            });
        });
    }
}

export default Reports;