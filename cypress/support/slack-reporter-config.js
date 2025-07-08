module.exports = {
    reporterEnabled: 'cypress-slack-reporter',
    reporterOptions: {
        webhookUrl: process.env.SLACK_WEBHOOK_URL,
        channel: 'polaris-aut-results',
        title: 'Polaris AUT Test Results',
        reportHtml: true,
        screenshotOnFail: true
    }
};