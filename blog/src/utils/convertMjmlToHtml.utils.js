const mjml = require('mjml');
const { resolve } = require('path');
const { readFileSync } = require('fs');
const { compile } = require('handlebars');

/**
 * Require all templates and compile them
 */

const verifyAccount = readFileSync(
	resolve(__dirname, '../templates/verify-account.mjml')
).toString();
const verifyAccountTemplate = compile(mjml(verifyAccount).html);

module.exports = {
	verifyAccountTemplate,
};
