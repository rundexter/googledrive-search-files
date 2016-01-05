var google = require('googleapis'),
    util = require('./util.js');

var service = google.drive('v3');

var pickInputs = {
        'corpus': 'corpus',
        'orderBy': 'orderBy',
        'pageSize': 'pageSize',
        'pageToken': 'pageToken',
        'q': 'q',
        'spaces': 'spaces'
    },
    pickOutputs = {
        'files': 'files'
    };

module.exports = {

    /**
     * Get auth data.
     *
     * @param step
     * @param dexter
     * @returns {*}
     */
    authOptions: function (step, dexter) {
        var OAuth2 = google.auth.OAuth2,
            oauth2Client = new OAuth2();

        if(!dexter.environment('google_access_token')) {

            this.fail('A [google_access_token] environment variable is required for this module');
            return false;
        } else {

            oauth2Client.setCredentials({
                access_token: dexter.environment('google_access_token')
            });

            return oauth2Client;
        }
    },

    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var auth = this.authOptions(step, dexter),
            inputs = util.pickInputs(step, pickInputs),
            validateErrors = util.checkValidateErrors(inputs, pickInputs);

        if (!auth)
            return;

        if (validateErrors)
            return this.fail(validateErrors);

        inputs.fields = 'files';
        // set credential
        google.options({ auth: auth });
        service.files.list(inputs, function (error, data) {
console.log(error);
            if (error)
                this.fail(error);
             else
                this.complete(util.pickOutputs(data, pickOutputs));
        }.bind(this));
    }
};
