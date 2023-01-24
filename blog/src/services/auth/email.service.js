/**
 * @author Utibeabasi Ekong <https://github.com/Xlaez>
 */

/* eslint-disable camelcase */
const { createTransport } = require('nodemailer');
const { email, smtp } = require('../../configs');
const { verifyAccountTemplate } = require('../../utils/convertMjmlToHtml.utils');

const transport = createTransport({
  service: smtp.host,
  auth: {
    type: 'Login',
    user: smtp.user,
    pass: smtp.pass,
  },
});

/**
 *
 * @param {string} to
 * @param {string} subject
 * @param {Object{app_name:string, name: string, digits:string}} payload
 */

const mailSender = (to, subject, payload) => {
  // would be passed to the mailsender payload object param
  const { app_name, name, digits } = payload;

  let html;

  // code checks for template by the subject passed from the controller and send the appropriate template as an email passing the parameters needed

  switch (subject) {
    case 'Verify Account':
      html = verifyAccountTemplate({ app_name, name, digits });
      break;
    default:
      break;
  }

  const obj = { from: email.user, to, subject, html };
  return transport.sendMail(obj);
};

module.exports = mailSender;
