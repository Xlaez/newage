import { Request, Response } from "express";
import { catchAsync, AppRes  } from "owl-factory";
import { updateUser, getUserById } from "../services/auth/user.service";


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

export {
   updateProfile,
   getUser
}