import { startCase } from 'lodash';
import { navigateToAnalyticsDashboard,navigateToUserActivity,navigateToEmails,navigateToReports } from './navigate.js';

const DEFAULT_TIMEOUT = 15000;

// Create reusable constants
const ANALYTICS_CONFIG = {
    ORGANIZATION: 'ChadOrg_QAs',
    EMAIL: 'chad@milliononmars.com',
    START_DATE: '2025-11-03',
    END_DATE: '2025-11-03',
    MIN_COUNT_VALUE: 1,
};

const validateUserActivityFilters = () => {
    navigateToUserActivity();
    // Select Organization: ChadOrg_QAs
    cy.get('input[placeholder="Select Organizations"]', { timeout: DEFAULT_TIMEOUT })
        .should('be.visible')
        .click();
    
    // Type and select ChadOrg_QAs
    cy.get('input[placeholder="Select Organizations"]')
        .type(ANALYTICS_CONFIG.ORGANIZATION);
    
    // Select from dropdown options
    cy.contains('[role="option"], li', 'ChadOrg_QAs', { timeout: DEFAULT_TIMEOUT })
        .should('be.visible')
        .click();

    //select start date
    cy.get('input[type="date"]').first()
        .should('exist')
        .clear()
        .type(ANALYTICS_CONFIG.START_DATE);

    //select end date
    cy.get('input[type="date"]').last()
        .should('exist')
        .clear()
        .type(ANALYTICS_CONFIG.END_DATE);

    // Verify the result shows the expected email
    cy.contains(ANALYTICS_CONFIG.EMAIL, { timeout: DEFAULT_TIMEOUT })
        .should('be.visible');
    
    cy.log('User Activity filter validation completed successfully.');
    
};

const validateEmails = () => {
    navigateToEmails();
    // Input Email
    cy.get('input[placeholder="Search by email..."]', { timeout: DEFAULT_TIMEOUT })
        .should('be.visible')
        .type(ANALYTICS_CONFIG.EMAIL);

    //select start date
    cy.get('input[type="date"]').first()
        .should('exist')
        .clear()
        .type(ANALYTICS_CONFIG.START_DATE);

    //Click on search button
    cy.get('[data-testid="SearchIcon"]')
        // .parent('button')
        .should('be.visible')
        .click();

    cy.wait(2000);
 
    // Verify results
    validateEmailAllCountValues(ANALYTICS_CONFIG.MIN_COUNT_VALUE);

    cy.log('Email validation count completed successfully.');

};

const validateReports = () => {
    navigateToReports();
    validateReportAllCountValues(ANALYTICS_CONFIG.MIN_COUNT_VALUE);

    cy.log('Reports validation count completed successfully.');

};

const validateEmailAllCountValues = (minValue) => {
    cy.get('a.MuiLink-root.MuiLink-colorPrimary.MuiLink-inherit.MuiLink-underlineNone')
        .should('have.length.at.least', 1)
        .each(($link) => {
            cy.wrap($link)
                .invoke('text')
                .then((text) => {
                    const value = parseInt(text.trim());
                    if (!isNaN(value)) {
                        expect(value).to.be.at.least(minValue);
                        cy.log(`✅ Link value ${value} is >= ${minValue}`);
                    }
                });
        });
};

const validateReportAllCountValues = (minValue) => {
    cy.get('h2.MuiTypography-root.MuiTypography-h2')
        .should('have.length.at.least', 1)
        .each(($header) => {
            cy.wrap($header)
                .invoke('text')
                .then((text) => {
                    const value = parseInt(text.trim());
                    if (!isNaN(value)) {
                        expect(value).to.be.at.least(minValue);
                        cy.log(`✅ Header value ${value} is >= ${minValue}`);
                    }
                });
        });
};

class Analytics {
    static verifyAnalyticsDashboard() {
        describe('Analytics Dashboard Verification', () => {
            it('Should navigate to User Activity', () => {
                navigateToAnalyticsDashboard();
                validateUserActivityFilters();
            });
            it('Should navigate to Reports and validate count', () => {
                navigateToAnalyticsDashboard();
                validateReports();
            });
            it('Should navigate to Emails and validate count', () => {
                navigateToAnalyticsDashboard();
                validateEmails();
            });
        });
    }
}

export default Analytics;