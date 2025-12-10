const { defineConfig } = require("cypress");
const fs = require('fs');
const path = require('path');

// Define global environment URLs
const environments = {
   staging: 'https://app.staging.futurumgroup.com/'
};

module.exports = defineConfig({
  retries: 2,
  e2e: {    
    specPattern: [
      'cypress/e2e/Data.cy.js',
      'cypress/e2e/FuturumAI.cy.js',
      'cypress/e2e/Users.cy.js',
      'cypress/e2e/UserPassword.cy.js',
      // 'cypress/e2e/export_data.cy.js',
       'cypress/e2e/Email_Templates.cy.js',
      // 'cypress/e2e/Email_Jobs.cy.js',  
       'cypress/e2e/Practice_Area.cy.js',
      'cypress/e2e/Organization.cy.js',
      // 'cypress/e2e/Reports.cy.js',
      // 'cypress/e2e/Analytics.cy.js',
      'cypress/e2e/Migration.cy.js'
      // 'cypress/e2e/Research_Engine.cy.js'
    ],
    supportFile: 'cypress/support/index.js',
    downloadsFolder: 'cypress/downloads',
    env: {
      appUrl: process.env.CYPRESS_APP_URL || environments.staging
    },
    viewportWidth: 1920,
    viewportHeight: 1080,
    setupNodeEvents(on, config) {
      // Add this hook to generate results.json with per-spec breakdown
      on('after:run', (results) => {
        // Overall summary
        const testResults = {
          totalTests: results.totalTests,
          totalPassed: results.totalPassed,
          totalFailed: results.totalFailed,
          totalPending: results.totalPending,
          totalSkipped: results.totalSkipped,
          runs: results.runs,
          startedTestsAt: results.startedTestsAt,
          endedTestsAt: results.endedTestsAt,
          duration: results.totalDuration
        };

        // Per-spec breakdown
        const specSummary = results.runs.map(run => {
          const specName = path.basename(run.spec.relative);
          return {
            spec: specName,
            total: run.stats.tests,
            passing: run.stats.passes,
            failing: run.stats.failures,
            pending: run.stats.pending,
            skipped: run.stats.skipped,
            duration: run.stats.duration
          };
        });

        // Combine overall and per-spec data
        const fullResults = {
          ...testResults,
          specSummary: specSummary
        };

        const dir = path.dirname('cypress/reports/results.json');
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync('cypress/reports/results.json', JSON.stringify(fullResults, null, 2));
        console.log(`Test results saved: ${results.totalPassed} passed, ${results.totalFailed} failed`);
        
        // Log per-spec summary to console
        console.log('\n📊 Test Run Summary:');
        specSummary.forEach(spec => {
          const status = spec.failing > 0 ? '❌' : '✅';
          console.log(`${status} ${spec.spec}`);
          console.log(`   ↳ Total: ${spec.total}`);
          console.log(`   ↳ Passing: ${spec.passing}`);
          console.log(`   ↳ Failing: ${spec.failing}`);
        });
      });

      on('task', {
        writeFile({ filePath, content }) {
          const dir = path.dirname(filePath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
          return null;
        },
        
        updateResponseTime({ filePath, modelData }) {
          const dir = path.dirname(filePath);
          if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, { recursive: true });
          }

          let responseTimeArray = [];
          if (fs.existsSync(filePath)) {
              try {
                  const fileContent = fs.readFileSync(filePath, 'utf8');
                  responseTimeArray = JSON.parse(fileContent);
              } catch (error) {
                  console.log('Error reading existing file, creating new array');
                  responseTimeArray = [];
              }
          }

          const existingIndex = responseTimeArray.findIndex(item => item.textModel === modelData.textModel);
          if (existingIndex !== -1) {
              responseTimeArray[existingIndex] = modelData;
          } else {
              responseTimeArray.push(modelData);
          }

          fs.writeFileSync(filePath, JSON.stringify(responseTimeArray, null, 2));
          console.log(`Updated response time for ${modelData.textModel}: ${modelData.ResponseTime}`);
          
          return null;
        },

        updateErrorLog({ filePath, newErrors }) {
          const dir = path.dirname(filePath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }

          let existingData = { errors: [], totalErrors: 0 };
          if (fs.existsSync(filePath)) {
            try {
              const fileContent = fs.readFileSync(filePath, 'utf8');
              existingData = JSON.parse(fileContent);
            } catch (error) {
              console.log('Error reading existing consoleErrors file, creating new structure');
              existingData = { errors: [], totalErrors: 0 };
            }
          }

          if (!existingData.errors) {
            existingData.errors = [];
          }

          const existingSet = new Set(
            existingData.errors.map(err => JSON.stringify({
              message: err.message,
              suite: err.suite,
              test: err.test
            }))
          );

          const allErrors = [...existingData.errors];
          for (const error of newErrors) {
            const errorKey = JSON.stringify({
              message: error.message,
              suite: error.suite,
              test: error.test
            });
            
            if (!existingSet.has(errorKey)) {
              allErrors.push(error);
              existingSet.add(errorKey);
            }
          }

          const updatedData = {
            lastUpdate: new Date().toISOString(),
            totalErrors: allErrors.length,
            errors: allErrors
          };

          fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
          //  console.log(`Updated console errors log with ${newErrors.length} new errors. Total: ${updatedData.totalErrors}`);
          
          return null;
        },

        deleteFiles(filePaths) {
          filePaths.forEach((filePath) => {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
              console.log(`Deleted file: ${filePath}`);
            } else {
              console.log(`File not found: ${filePath}`);
            }
          });
          return null;
        },
      });
    }
  },
});
