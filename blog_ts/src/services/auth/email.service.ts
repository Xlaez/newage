

import { createTransport } from 'nodemailer';
import { email, smtp  } from '../../config'

const transport  = createTransport({
   service: smtp.host,
   auth:{
      type: 'LOGIN',
      user: smtp.user,
      pass: smtp.pass
   }
});

const mailSender = (to: string, subject: string, payload: any)=>{
      const { app_name, name, digits} = payload;

      let html: any;

      if(subject === 'Verify Account'){
         //html = verifyAccountTemplate({ app_name, name, digits });
      }

      const obj = { from: email.user, to, subject, html}
      return transport.sendMail(obj)
}

export {
   mailSender
}