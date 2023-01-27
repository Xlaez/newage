/**
 * @author Chris Egbaaibon <https://github.com/chrisegbaaaibon
 */

import { httpStatus, AppRes } from 'owl-factory';
import { signToken, verifyToken } from './token.service';
import { mailSender } from './email.service';
import { User, UserDocument } from '../../models/user.model';
import { uniqueFiveDigits } from '../../utils/randomGenerator.utils';
import { app, email } from '../../config';
import paginateLabel from '../../utils/paginationLabel.util';

const ifUser = (email: string, username: string)=>{
   return User.findOne({ $or: [{ email}, { username }]})
};

const getUserById =  (id: any, removeField: any) =>{
      return User.findById(id).select([`-${removeField}`])
}

const queryUsers = async (
   { search, filter }: { search: string; filter: object },
   { limit, page, orderBy, sortedBy }: { limit: number; page: number; orderBy: string; sortedBy: 'asc' | 'desc' }
   ): Promise<object> => {
   const options = {
   lean: true,
   customLabels: paginateLabel,
   };
   
   let searchParam: any = { isAccountVerified: true };
   if (search) {
      searchParam = { $or: [{ username: {
         $regex: search, 
         $option: 'i'
      }},
         {
            email:{
               $regex: search,
               $options: 'i'
            }
         }
   ]};
   }
   
   const users = await User.paginate(
   {
   searchParam,
   ...filter,
   },
   {
   ...(limit ? { limit } : { limit: 10 }),
   page,
   sort: { [orderBy]: sortedBy === 'asc' ? 1 : -1 },
   ...options,
   select: ['-password', '-updatedAt', '-isAccountVerified', '-__v'],
   }
   );
   return users;
   };   