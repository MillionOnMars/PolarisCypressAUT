const QA = ['Acme_QA','AMD_QA', 'AWS_QA', 'Broadcom_QA', 'ChadOrg_QA, Inc_QA', 'Cloudera_QA', 'Commvault_QA', 'DELL_QA', 'ElasticSearch_QA', 'Google_QA', 'GoTo_QA', 'Groq', 'HP_QA', 'HPE_QA', 'IBM_QA', 'Intel_QA', 'JulOrg_Test', 'Lattice_QA', 'Lenovo_QA', 'Logitech_QA', 'Marvell_QA', 'Microsoft_QA', 'NetApp_QA', 'Oracle_QA', 'PureStorage_QA', 'Qualcomm_QA', 'Salesforce_QA', 'ServiceNow_QA', 'Shure_QA', 'SmartSheet_QA', 'Synopsis_QA', 'Veeam_QA', 'Zoho_QA', 'Zoom_QA']; // Add your qas here

const getRandomQA = (count) => {
    return QA.sort(() => 0.5 - Math.random()).slice(0, count);
};

const verifyQA = (qa) => {
    // Click the "New Chat" button
    cy.get("button[title='Open'] svg").click()
    cy.contains(qa, { timeout: 10000 }).click()
    cy.wait(3000); // wait for 5 second

    cy.get("button[role='combobox']")
        .should('be.visible')
        .should('not.contain', 'No data available')
};


class Data {
    static verifyQAData(qa) {
        it(`Should select QA:${qa} and verify data.`, () => {
            verifyQA(qa)
        });
    }
}

export default Data;
export { getRandomQA };