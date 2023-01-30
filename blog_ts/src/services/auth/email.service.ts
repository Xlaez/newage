

import { createTransport } from 'nodemailer';
import { email, smtp  } from '../../config'
import { verifyAccountTemplate } from '../../utils/convertMjmlToHtml.util';

const transport  = createTransport({
   service: smtp.host,
   auth:{
      type: 'Login',
      user: smtp.user,
      pass: smtp.pass
   }
});

const mailSender = (to: string, subject: string, payload: any)=>{
      const { app_name, name, digits} = payload;

      let html: any;

      if(subject === 'Verify Account'){
         html = verifyAccountTemplate({ app_name, name, digits });
      }

      const obj = { from: email.user, to, subject, html}
      return transport.sendMail(obj)
}

export {
   mailSender
}