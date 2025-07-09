import './commands';
import { setupGlobalErrorTracking } from './consoleErrorTracker';
require('cypress-xpath');

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