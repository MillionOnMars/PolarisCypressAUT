import { timeout } from "async";

const textModels = ['GPT-4.1', 'claude-3-5-sonnet', 'GPT-5'];

let prompts;

before(() => {
    cy.fixture('data.json').then((promptsData) => {
        prompts = promptsData;
    });
});

const openAI = () => {
    cy.xpath("(//*[name()='path'])[1]")
        .click({ force: true });
    // Wait for the chat window or textarea to appear
    cy.xpath("//textarea[@placeholder='Type your question here']", { timeout: 20000 })
        .should('be.visible');
}

const mathQuestions = [
    { question: 'What is the capital of France?', answer: 'Paris' },
    { question: 'What gas do humans breathe in to survive?', answer: 'Oxygen' },
    { question: 'What planet is known as the Red Planet?', answer: 'Mars' },
    { question: 'What element has the chemical symbol "O"?', answer: 'Oxygen' },
    { question: 'What organ pumps blood through the body?', answer: 'Heart' },
    { question: 'What is the largest mammal on Earth?', answer: 'Blue Whale' },
    { question: 'What language is primarily spoken in Brazil?', answer: 'Portuguese' },
    { question: 'What is the hardest natural substance?', answer: 'Diamond' },
    { question: 'What ocean is the largest on Earth?', answer: 'Pacific' },
    { question: 'What is the currency of Philippines?', answer: 'Peso' }
];

const getRandomMathQuestion = () => {
    const randomIndex = Math.floor(Math.random() * mathQuestions.length);
    return mathQuestions[randomIndex];
};

const sendPrompt = (modelName) => {
    const { question, answer } = getRandomMathQuestion();
    cy.xpath("//textarea[@placeholder='Type your question here']")
        .should('be.visible', {timeout: 15000})
        .type(`${question}{enter}`, { force: true })
        .then(() => {
            cy.wrap(Date.now()).as('startTime');
            cy.log(`Question submitted: "${question}", expected answer: "${answer}", using model: "${modelName}"`);
        });
    
    cy.wait(2000);

    cy.contains(answer, { timeout: 30000, matchCase: false }) // Case insensitive match
        .scrollIntoView()
        .should('exist')
        .should('be.visible')
        .then(() => {
            cy.get('@startTime').then((startTime) => {
                const endTime = Date.now();
                const responseTime = endTime - startTime;
                const responseTimeSeconds = (responseTime/1000).toFixed(2);
                cy.log(`Response time: ${responseTime}ms (${responseTimeSeconds} seconds) using model: "${modelName}"`);
                
                // Update the response time array in the JSON file
                cy.task('updateResponseTime', {
                    filePath: 'cypress/reports/responseTime.json',
                    modelData: {
                        textModel: modelName,
                        ResponseTime: `${responseTimeSeconds} secs.`
                    }
                });
            });
        });
}

const selectTextModel = (modelName) => {
    cy.get('.MuiSelect-button', { timeout: 30000 })
        .first()
        .should('be.visible')
        .click();
    
    // Select the specific model from the textModels array
    cy.contains(modelName, { timeout: 10000 }, { matchCase: false })
        .should('be.visible')
        .click();

    //verify the selected model is displayed
    cy.contains('button[role="combobox"]', modelName, { timeout: 10000 })
        .first()
        .should('be.visible');

    cy.log(`Selected text model: ${modelName}`);
};

const deleteNotebook = () => {
    cy.get('[data-testid="MoreVertIcon"]', { timeout: 10000})
        .should('be.visible')
        .should('not.be.disabled', { timeout: 10000 })
        .click();

    cy.contains('li[role="menuitem"]', 'Delete', { timeout: 10000 })
        .should('be.visible')
        .click();
    
    // Wait for confirmation dialog or deletion to complete
    cy.wait(2000);
    
    //confirm deletion
    cy.xpath("//button[normalize-space()='DELETE']", { timeout: 10000 })
        .should('be.visible')
        .click()
        .then(() => {
            cy.log('Delete confirmed, notebook deletion completed');
        });
    cy.contains('Session deleted successfully', { timeout: 10000 })
        .should('be.visible')
};

const uploadFile = (dataType) => {
    const testCase = prompts[dataType];
    openAI()
    cy.contains("Research Files", { timeout: 10000 }).should("be.visible").click()
    //click on Add Knowledge button
    cy.contains('Add Knowledge', { timeout: 10000 })
        .should('be.visible')
        .click();

    // Click the upload button
    cy.contains('Upload File', { timeout: 10000 })
        .should('be.visible')
        .click();

    // Wait for file input to be ready and upload file
    cy.get('input[type="file"]')
        .should('exist')
        .and('not.be.disabled')
        .wait(2000) // Add wait for upload dialog to fully load
        .then(($input) => {
            // Verify input is ready
            cy.wrap($input)
                .should('have.prop', 'disabled', false)
                .selectFile(testCase.filepath, { force: true });
        });

    // Wait for upload completion indicators
    cy.intercept('POST', '**/createFabFile').as('uploadRequest');
    cy.wait('@uploadRequest', { timeout: 10000 });

    //Verify file uploaded
    cy.contains(`Uploaded: ${testCase.filepath.split('/').pop()}`);

    cy.log('File uploaded successfully.');
    //click close button
    cy.get('[data-testid="CloseIcon"]').last().should("be.visible").click();
    cy.wait(5000)
};

const fileOperation = (operation, dataType, newName) => {

  const testCase = prompts[dataType];
  const filename = testCase.filepath.split("/").pop();
  openAI()
  cy.contains("Research Files", { timeout: 10000 }).should("be.visible").click()

    switch (operation) {
      case "createFile":
        // Click on create file button
        cy.contains("Create File").should("be.visible").click();
        //Enter filename
        cy.get('input[placeholder="Enter file name"]')
          .should("be.visible")
          .type('Newfile.txt')
        cy.get('textarea[placeholder="Edit content here. You can use markdown formatting."]')
          .should("be.visible")
          .type("Sample content for the new file");
        cy.contains('Save Changes')
          .should("be.visible")
          .click();
        cy.contains('File saved successfully', {timeout:10000}).should('be.visible');
        cy.log(`File ${filename} created successfully`);
        break;

      case "renameFile":
        //select the file
        cy.contains(`${filename}`, { timeout: 10000 })
            .should("be.visible")
            .click();

        //Click rename button. Temporarily search outside the modal
        cy.document().its('body').find('li[role="menuitem"]').contains('Rename')
          .should("be.visible")
          .click();

        cy.get('input[value="' + filename + '"]')
          .should("be.visible")
          .clear()
          .type(newName)
          .type("{enter}");

        cy.log(`File ${newName} renamed successfully`);
        //Click Close button
        // cy.get('[data-testid="CloseIcon"]').eq(2).should("be.visible").click();

        break;

      case "deleteFile":
        //select the file
        cy.contains(`${filename}`, { timeout: 10000 })
            .should("be.visible")
            .click();

        //Click delete button
        cy.contains("Delete 1 files").should("be.visible").click();
        cy.document().its('body').find('button').contains('Ok').click();
        break;

      case "addFile":
        //select the file
        cy.contains(`${filename}`, { timeout: 10000 })
            .should("be.visible")
            .click();

        // click add file
        cy.contains("Add 1 files").should("be.visible").click();

        //wait for file to be added
        cy.wait(2000);

        cy.log("File added to Notebook Successfully.");
        break;

      default:
        throw new Error(`Invalid file operation: ${operation}`);
    }
}

const tagOperations = (operation, tagName) => {
    // Open research files
    cy.contains("Research Files", { timeout: 10000 }).should("be.visible").click()

    switch (operation) {
        case "createTag":
            cy.contains('Create Tag')
                .should('be.visible')
                .click();
            
            // Type the tag name
            cy.get('input[placeholder="Enter a descriptive name..."]')
                .should('be.visible')
                .type(tagName);

            //enter description
            cy.get('textarea[placeholder="Describe what files this organizes..."]')
                .should('be.visible')
                .type(`This is a tag for ${tagName}`);
            
            // Click create tag button
            cy.get('.MuiButton-sizeLg')
                .should('be.visible')
                .click();

            //Verify tag creation success message
            cy.contains('Tag created successfully', { timeout: 10000 })
                .should('be.visible');  

            cy.log(`Tag "${tagName}" created successfully`);
            break;

        case "editTag":
            // Click on existing tag to edit
            cy.get('.lucide-more-vertical')
                .eq(0) // Adjust index if necessary
                .should('exist')
                .trigger('mouseover')
                .click();

            cy.contains('Edit')
                .should('be.visible')
                .click();

            // Type the tag name
            cy.get('input[placeholder="Enter a descriptive name..."]')
                .should('be.visible')
                .type('Renamed-'+tagName);

            // Click update tag button
            cy.get('.MuiButton-sizeLg')
                .should('be.visible')
                .click();

            //Verify tag edit success message
            cy.contains('Tag updated successfully', { timeout: 10000 })
                .should('be.visible');

            cy.log(`Tag "Renamed-${tagName}" edited successfully`);
            break;

        case "deleteTag":
            // Click on existing tag to edit
            cy.get('.lucide-more-vertical')
                .eq(0) // Adjust index if necessary
                .should('exist')
                .trigger('mouseover')
                .click();
            
            // Click delete
            cy.contains("Delete").should("be.visible").click();
            cy.document().its('body').find('button').contains('Ok').click();

            //Verify tag not exist
            cy.contains(`Renamed-${tagName}`, { timeout: 10000 })
                .should('not.exist');

            cy.log(`Tag "Renamed-${tagName}" deleted successfully`);
            break;

        default:
            throw new Error(`Invalid tag operation: ${operation}`);
    }

    // Close metadata panel
    cy.get('[data-testid="CloseIcon"]')
        .last()
        .should('be.visible')
        .click();
};

const openToolsMenu = (tools) => {
    cy.contains('div[role="button"]', 'Tools', { timeout: 10000 })
        .should('be.visible')
        .click();
    cy.log('Tools menu opened successfully');
    cy.contains('li[role="menuitem"]', tools, { timeout: 10000, matchCase: false })
        .should('be.visible')
        .click();
};

// Update your Research class to test all 3 models
class Research {
    static createChat() {
        describe(`Should test all text models.`, () => {
            // Initialize the response time file
            before(() => {
                cy.task('writeFile', {
                    filePath: 'cypress/reports/responseTime.json',
                    content: []
                });
            });

            textModels.forEach((model, index) => {
                it(`Should test ${model} model and record response time.`, () => {
                    openAI();
                    selectTextModel(model);
                    sendPrompt(model);
                    
                    // Add delay between models and clean up
                    if (index < textModels.length - 1) {
                        deleteNotebook();
                        cy.wait(3000); // Wait between model tests
                    }
                });
            });

            // Final cleanup
            after(() => {
                deleteNotebook();
            });
        });
    }
    static Files(filepath) {
        describe("Files Operations", () => {
          it("Create file", () => {
            fileOperation("createFile", filepath);
          });

          it("Upload file", () => {
            uploadFile(filepath);
            fileOperation("addFile", filepath);
          });

            // Renaming file is currently not available on polaris
            //   it("Renames file", () => {
            //     uploadFile(filepath);
            //     fileOperation("renameFile", filepath, "RenamedFile");
            //   });

          it("Deletes file", () => {
            fileOperation("deleteFile", filepath);
          });
        });
    }

    static manageTags() {
        describe('Tag Operations', () => {
            const testTag = 'AutomationTag';

            beforeEach(() => {
                openAI();
            });

            it('Should create a new tag', () => {
                tagOperations('createTag', testTag);
            });

            it('Should edit an existing tag', () => {
                tagOperations('editTag', testTag);
            });

            it('Should delete a tag', () => {
                tagOperations('deleteTag', testTag);
            });
        });
    }
    static testAllTools() {
        describe('Complete Tools Testing Suite', () => {
            const allTools = [
                'System Prompts',
                'Suggested Prompts', 
                'Experimental Features',
                'Web Search',
                'Deep Research',
                'Recharts'
            ];

            beforeEach(() => {
                openAI();
            });

            allTools.forEach((tool, index) => {
                it(`Should test ${tool} tool`, () => {
                    openToolsMenu(tool);
                    
                    // Add delay between tools
                    if (index < allTools.length - 1) {
                        cy.wait(2000);
                    }
                });
            });

            afterEach(() => {
                deleteNotebook();
            });
        });
    }
}

export default Research;