import { Request, Response } from "express";
import { catchAsync, AppRes  } from "owl-factory";
import { updateUser, getUserById, queryUsers } from "../services/auth/user.service";


const updateProfile = catchAsync(async (req: Request, res: Response)=>{
   const { user } : any = req
   const profile = await updateUser(user, req.body);
   if(!profile) throw new AppRes(500, 'Cannot update profile')
   res.status(200).send('Success')
});

const getUser = catchAsync( async(req: Request, res: Response)=>{
   const { user } : any = req;
   const profile: any = await getUserById(user, 'password');
   res.status(200).json(profile);
})

const getUsers = catchAsync(async (req: Request, res: Response)=>{
   const { limit, page, sortedBy, orderBy, search, filter }: any = req.query;
   const users = await queryUsers({ search, filter}, { limit: +limit, page: +page, orderBy, sortedBy})
   if(!users) throw new AppRes(404, 'Not found')
   res.status(200).json(users)
})

export {
   updateProfile,
   getUser,
   getUsers
}