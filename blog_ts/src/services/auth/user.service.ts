/**
 * @author Chris Egbaaibon <https://github.com/chrisegbaaaibon
 */

import { httpStatus, AppRes } from 'owl-factory';
import { Request } from 'express'
import { signToken } from './token.service';
import { mailSender } from './email.service';
import { User } from '../../models/user.model';
import { uniqueFiveDigits } from '../../utils/randomGenerator.utils';
import { app, email } from '../../config';
//import paginateLabel from '../../utils/paginationLabel.util';
import { compare } from 'bcrypt';
import { addToRedis, getValueFromRedis } from '../../libs/redis.libs';

const ifUser = (email: string, username: string)=>{
   return User.findOne({ $or: [{ email}, { username }]})
};

const getUserById =  (id: any, removeField: any) =>{
      return User.findById(id).select([`-${removeField}`])
}

const createUser = async (data: any)=>{
   if (await ifUser(data.email, data.username)) throw new AppRes(httpStatus.BAD_REQUEST, 'Email or Username already in use')
   return User.create()
}


const updateUser = async (uniqueData: string, data: any)=>{
   const filter: string  = uniqueData;
   const update = await User.findOneAndUpdate(
      { $or: [{ username: filter}, { email: filter }, { _id: filter }]},
      { ...data },
      { new: true}
   ).select(['-password']);
   return update;
};


const loginUser = async( uniqueData: string, password: string)=>{
   const user = await ifUser(uniqueData, uniqueData)
   if ( !user || !(await compare(password, user.password))){
         throw new AppRes(httpStatus.BAD_REQUEST, 'Invalid credentials')
   }
   const token = signToken(user._id, 60 * 60 * 30, process.env.JWT_SECRET)

   return {
      user:{
         username: user.username,
         id: user._id,
         email: user.email,
      },
      token
   };
};

const verifyAccount = async (digits: number) => {
   const value = await getValueFromRedis(digits.toString());
   if (!value) throw new AppRes(httpStatus.BAD_REQUEST, 'digits is wrong or has expired');
   const user: any | null = await User.findOneAndUpdate({ email: value }, { isVerified: true }, { new: true });
   const token = signToken(user._id,  60 * 60 * 3, process.env.JWT_SECRET);
   return token;
 };

 const sendVerificationDigits = async (req: Request, user: any)=>{
      const digits = uniqueFiveDigits();
      const link = `${req.protocol}://${req.get('host')}${req.url}`;
      await addToRedis(digits.toString(), user.email.toString());
      return mailSender( user.email, 'Verify Account', {
         digits,
         link,
         name: user.username,
         app_name: app.name
      });
   }


   export {
      createUser, loginUser,
      sendVerificationDigits,
      verifyAccount,
      updateUser,
      getUserById,
   }