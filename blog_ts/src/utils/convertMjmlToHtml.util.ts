import { resolve } from 'path';
import { readFileSync } from 'fs';
import { compile } from 'handlebars';
const mjml = require( 'mjml') // this one no gree use import 

const verifyAccount = readFileSync(
   resolve(__dirname, '..')
).toString();

const verifyAccountTemplate = compile(mjml(verifyAccount).html)

export {
   verifyAccountTemplate
}