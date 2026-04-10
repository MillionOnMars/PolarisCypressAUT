import Research from '../support/research.js'; 
import Common from '../support/common.js';
import briefCaseChecker from '../fixtures/briefCaseChecker.json';
import briefCaseSelectors from '../fixtures/briefCaseSelectors.json';
import organizationMap from '../fixtures/organizationMap.json';
let selectedModel; // variable to store the selected value AI model

/**
 * Opens a new AU session by clicking the 'Create new analysis session' button,
 * waits for the session to be created (indicated by the 'Session created successfully' toast),
 * and then waits for the AI chat to open (indicated by the 'Open Briefcase' text).
 */
const openNewSession = () => {
    //click the new session button
    cy.get('button[aria-label="Create new analysis session"]').should('be.visible').click();

    //wait for the session to be created
    cy.get('[data-sonner-toast]', { timeout: 10000 })
        .should('be.visible')
        .within(() => {
            cy.contains('[data-title]', 'Session created successfully')
            .should('be.visible');
        });

    //wait for the AI chat to open and to load fully by checking for the presence of the 'Open Briefcase' text
    cy.contains('p', 'Open Briefcase').should('be.visible');
};

/**
 * Navigate to the Gen AI Briefcase menu
 * @param {string} mainMenu - the main menu item to click
 * @param {string} [subMenu] - the sub menu item to click, if applicable
 * @param {string} promptName - the name of the prompt to click
 * @param {boolean} [isSubMenuAnOrganization=false] - whether the sub menu is an organization
 */
const navigateToGenAIMBriefCaseMenu = (mainMenu, subMenu, promptName,isSubMenuAnOrganization = false) => {
    Cypress.env('genAI').briefCaseName = promptName;
   
    // Find the button, check aria-expanded, and click if not expanded
    const mainMenuSelector = briefCaseSelectors[mainMenu];
    cy.get(mainMenuSelector)
    .should('exist')
    .should('be.visible')
    .then(($btn) => {
        const isExpanded = $btn.attr('aria-expanded') === 'true';
        if (!isExpanded) {
            cy.wrap($btn).click({ force: true });
        }
    });

    //click the sub menu
    if (subMenu !== '' && subMenu !== undefined && subMenu !== null) {
        const subMenuSelector = isSubMenuAnOrganization
            ? briefCaseSelectors.Organization
            : briefCaseSelectors[subMenu];

        cy.get(subMenuSelector).should('exist').should('be.visible').click();
    }
    
    //click specific prompt
    const promptSelector = briefCaseSelectors[promptName];
    cy.get(promptSelector).should('exist').should('be.visible').click();
    
}

/**
 * Selects a random AI model from the dropdown.
 * 
 * Steps:
 * 1. Opens the dropdown.
 * 2. Gets all options and picks a random one.
 * 3. Gets the visible text (model name) of the selected option.
 * 4. Clicks the random option.
 * 5. Verifies the selected value is reflected in the combobox.
 */
const selectRandomAIModel = () => {
    // 1. Open the dropdown
    cy.get('button[role="combobox"]')
        .eq(0)                 
        .should('exist')       
        .should('be.visible')  
        .click({ force: true }); 

    // 2. Get all options and pick a random one
    cy.get('ul[role="listbox"]')
        .eq(2)
        .find('li')
        .should('have.length.greaterThan', 0)
        .then($options => {
            const randomIndex = Math.floor(Math.random() * $options.length);
            cy.log(`Total options: ${$options.length}`);
            cy.log(` Random index: ${randomIndex}`);
            const $selected = $options.eq(randomIndex);

            // 3. Get the visible text (model name)
            selectedModel = $selected.find('p').text().trim();

            cy.log(`Selected Model: ${selectedModel}`);

            // 4. Click the random option
            cy.wrap($selected).click();

            // 5. Verify selected value is reflected in combobox
            cy.get('button[role="combobox"]')
                .eq(0)
                .find('p')
                .should('be.visible')
                .and('have.text', selectedModel);
        });
};

/**
 * This function will get the latency metrics for a given Gen AI brief case.
 * The function will log the start time, the time when the initial response is visible,
 * the time when the final response starts, and the time when the stream is fully loaded.
 * It will then calculate the latency metrics and update the response time array in the JSON file.
 * 
 * @param {string} briefCaseName - The name of the brief case to get the latency metrics for.
 * 
 * @returns {Promise<void>}
 */
const getGenAILatency = (organization, briefCaseName) => {
    const env = Cypress.env('environment');
    briefCaseName = briefCaseName ? briefCaseName : Cypress.env('genAI').briefCaseName;
    const checker = briefCaseChecker[env][briefCaseName];
    console.log("organization:", JSON.stringify(organization))
    console.log("orgMap:", JSON.stringify(organizationMap))
    console.log("org:", JSON.stringify(organizationMap[organization]))
    const orgConfig = organizationMap[organization][env];
    const hasInitialResponse = orgConfig.hasInitialResponse;

    let startTime;
    let lap1; // Initial response
    let lap2; // Final response start
    let lap3; // Stream end
    let adjustedLap1; // This will be used to calculate actual response latency by adjusting for cases where there is no initial response

    cy.then(() => {
        startTime = performance.now();
    });

    //LAP 1 — Initial response
    if(hasInitialResponse == true){
        const initialResponse = new RegExp(checker.initialResponse, 'i');
        cy.contains(initialResponse, { timeout: 600000 }) //set timeout to 10 mins to allow for slow responses. 
            .should('be.visible')
            .then(() => {
            lap1 = performance.now();
        }); 

        console.log("isInitialResponse:", hasInitialResponse);
    }

    // LAP 2 — Final Response Start
    const responseChecker = checker.responseChecker;
    cy.contains('h1', responseChecker, { timeout: 600000 }) //set timeout to 10 mins to allow for slow responses. 
        .should('be.visible')
        .then(() => {
        lap2 = performance.now();

        //adjusted lap is if there is no initial response, then lap1 will be the same as start time, 
        //if there is an initial response, then lap1 will be used to calculate the actual response latency
        adjustedLap1 = hasInitialResponse == true ? lap1 : startTime;

    });

    // Scroll + click until stream fully loaded
    const scrollUntilFullyLoaded = () => {
        const responseEndChecker = checker.responseEndChecker;
        return cy.get('body').then(($body) => {
            const endCheckerVisible = $body.find('h2').filter((i, el) =>
                el.innerText.toLowerCase().includes(responseEndChecker.toLowerCase())
                ).length > 0;

            const arrow = $body.find('[data-testid="KeyboardDoubleArrowDownTwoToneIcon"]');
            const arrowVisible = arrow.length && Cypress.$(arrow).is(':visible');

            if (!endCheckerVisible || (endCheckerVisible && arrowVisible)) {
                if (arrowVisible) {
                cy.wrap(arrow).click({ force: true });
                }

                // Scroll inside the container
                cy.get('div.MuiBox-root[class*="css-ge"]')
                    .last()
                    .scrollTo('bottom', { duration: 300, ensureScrollable: false });

                cy.wait(800);
                return scrollUntilFullyLoaded(); // Recurse until done
            }

            // End condition: End checker visible AND arrow gone
            if (endCheckerVisible && !arrowVisible) {
                cy.log('Stream fully completed...');

                // LAP 3 — Response data streaming end
                lap3 = performance.now();
                
                // Check for the AI model used in the prompt response area.
                cy.get('body').then(($body) => {
                    const generatedLabel = $body.find('[aria-label*="Generated using"]');
                    if (generatedLabel.length) {
                        cy.log('Generated label found:', generatedLabel.attr('aria-label'));
                    } else {
                        cy.log('Generated label not found');
                    }
                });

                // Convert milliseconds to seconds
                const toSeconds = (ms) => +(ms / 1000).toFixed(2);

                // Calculate durations in seconds
                const metrics = {
                    initialResponseLatency: toSeconds(adjustedLap1 - startTime),
                    actualResponseLatency: toSeconds(lap2 - adjustedLap1),
                    responseStreamingDuration: toSeconds(lap3 - lap2),
                    totalEndToEnd: toSeconds(lap3 - startTime)
                };
                const modelData = {
                    aiModel: selectedModel,
                    promptName: briefCaseName,
                    hasInitialResponse: hasInitialResponse,
                    initialResponseLatency: `${metrics.initialResponseLatency} secs`,
                    actualResponseLatency: `${metrics.actualResponseLatency} secs.`,
                    responseStreamingDuration: `${metrics.responseStreamingDuration} secs.`,
                    totalEndToEnd: `${metrics.totalEndToEnd} secs.`
                };

                // Apply threshold check
                const updatedModelData = checkIfLatencyBelowThreshold(modelData);
                console.log('Final Metrics:', updatedModelData);

                // Save with exceedsThreshold
                cy.task('updateResponseTime', {
                    filePath: 'cypress/reports/latencyMetrics.json',
                    modelData: updatedModelData
                });
            }
        });
    };

    return scrollUntilFullyLoaded();
};

/**
 * Checks if the given latency metrics exceeds the thresholds defined in Cypress.env('genAI').latencyThresholds.
 * @param {Object} metrics - object containing latency metrics
 * @return {Object} - metrics object with an additional property 'exceedsThreshold' indicating if the latency exceeded the threshold
 */
const checkIfLatencyBelowThreshold = (metrics) => {
    const thresholds = Cypress.env('genAI').latencyThresholds;

    // helper to extract numeric value from "12.34 secs"
    const parseSeconds = (value) => {
        if (!value) return 0;
        return parseFloat(value.toString().replace(/[^0-9.]/g, ''));
    };

    const initialLatency = parseSeconds(metrics.initialResponseLatency);
    const actualLatency = parseSeconds(metrics.actualResponseLatency);

    const initialThreshold = parseFloat(thresholds.initialResponseLatency);
    const actualThreshold = parseFloat(thresholds.actualResponseLatency);

    // check if exceeded
    const exceedsThreshold =
        initialLatency > initialThreshold ||
        actualLatency > actualThreshold;

    // attach result to metrics
    return {
        ...metrics,
        exceedsThreshold
    };
};

class genAI {
    static testGenAILBriefCaseLatency (organization, mainMenu, subMenu, promptName, isSubMenuAnOrganization){
        describe(`Gen AI Latency Testing for briefcase "${promptName}"`, () => {
            let orgName;
            before(() => {
                cy.task('writeFile', {
                    filePath: 'cypress/reports/latencyMetrics.json',
                    content: []
                });

                // Map organization based on environment since some organizations have different names in staging vs prod
                const env = Cypress.env('environment');
                const orgKey = organization;
                const orgConfig = organizationMap[organization][env];
                orgName = orgConfig.name;
                subMenu = isSubMenuAnOrganization ? orgName : subMenu;
                cy.log(`Organization: ${organization}`);
                cy.log(`SubMenu: ${subMenu}`);

            });
            
            it(`Check Gen AI Latency for Prompt: "${promptName}"`, () => {
                Common.selectOrganization(orgName);
                Research.openAI();
                openNewSession('');  
                //selectRandomAIModel(); // There is an issue when seleclting Claude 4.6 Opus, we are investigating, for now we will hardcode to select Claude 4.5 Sonnet.
                Research.selectTextModel('Claude 4.6 Sonnet');
                navigateToGenAIMBriefCaseMenu(mainMenu, subMenu, promptName, isSubMenuAnOrganization)
                getGenAILatency(organization, promptName);
                Research.deleteNotebook();
            });
        });
    }
}
export default genAI;