import { resolve } from 'path';
import { readFileSync } from 'fs';
import { compile } from 'handlebars';
import mjml from 'mjml'

const verifyAccount = readFileSync(
   resolve(__dirname, '../templates/verify-account.mjml')
).toString();

const verifyAccountTemplate = compile(mjml(verifyAccount).html)

export {
   verifyAccountTemplate
}