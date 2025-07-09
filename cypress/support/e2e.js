// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
// import 'cypress-real-events/support';
import './commands';
// import Notebook from './Notebook.js';
// import Signup from './Signup.js';
// import Projects from './Projects.js';
import Data from './data.js'; 
// import Auth from './auth.js';

export {
    // Notebook,
    // Signup,
    Data,
    Auth
};

// name: Run Data.cy.js Twice Daily

// on:
//   schedule:
//     - cron: '0 7 * * *'   # 7:00 AM UTC
//     - cron: '0 15 * * *'  # 3:00 PM UTC

// jobs:
//   cypress-run:
//     runs-on: ubuntu-latest

//     steps:
//       - name: Checkout code
//         uses: actions/checkout@v4

//       - name: Set up Node.js
//         uses: actions/setup-node@v4
//         with:
//           node-version: 18

//       - name: Install dependencies
//         run: npm ci

//       - name: Run Cypress Data.cy.js
//         env:
//           CYPRESS_APP_URL: ${{ secrets.CYPRESS_APP_URL }}
//         run: npx cypress run --spec "cypress/e2e/Data.cy.js"

