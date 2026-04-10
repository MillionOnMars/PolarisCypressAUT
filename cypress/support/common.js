const selectOrganization = (orgName) => {
    // get the combobox input excluding unwanted placeholders
    cy.get('input[role="combobox"]', { timeout: 10000 })
        .not('[placeholder="Select analyst..."], [placeholder="View as analyst"]')
        .should('be.visible')
        .should('not.be.disabled')
        .then($input => {
        const currentValue = $input.val();

        if (currentValue !== orgName) {
            // type the organization name
            cy.wrap($input)
                .should('be.visible')
                .and('not.be.disabled')
                .click()
                .type('{selectall}{backspace}')
                .type(orgName);

            // select the organization from the dropdown
            cy.contains('[role="option"]', orgName, { timeout: 10000 })
                .should('be.visible')
                .and('not.be.disabled')
                .click();
        } else {
            cy.log(`Organization is already set to "${orgName}", skipping input and selection`);
        }
    });
};

class Common {
    static selectOrganization(orgName) {
        selectOrganization(orgName);
     }
}
export default Common;