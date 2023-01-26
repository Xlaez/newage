import { sign, verify } from 'jsonwebtoken';

const signToken = ( userId: any, exp: any, secret: string)=>{
   
      const payload = {
         sub: userId,
      }
      return sign(payload, secret, { expiresIn: exp })
}

const verifyToken = (token: string, secret: string)=>{
   const payload = verify(token, secret)
   return payload;
}

export {
   signToken,
   verifyToken
}