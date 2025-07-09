import './commands';
import { setupGlobalErrorTracking } from './consoleErrorTracker';
require('cypress-xpath');

// // filepath: /Users/Automation/Documents/my-cypress-project/cypress/support/index.js
// Cypress.on('uncaught:exception', (err) => {
//     if (
//         err.message.includes('ResizeObserver loop completed with undelivered notifications') ||
//         err.message.includes('Failed to register a ServiceWorker') ||
//         err.message.includes('Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>')
//     ) {
//         // Prevent Cypress from failing the test for these known errors
//         return false;
//     }
// });

// Set up global error tracking for all tests
setupGlobalErrorTracking();

// Add custom error handling for uncaught exceptions
Cypress.on('uncaught:exception', (err) => {
    console.error('Uncaught Exception:', {
        message: err.message,
        timestamp: new Date().toISOString(),
        stack: err.stack
    });
    
    return false;
});

// Cypress.Cookies.defaults({
//     preserve: 'sessionid',
// })