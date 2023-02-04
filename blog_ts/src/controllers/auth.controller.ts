import { catchAsync, httpStatus, AppRes } from "owl-factory";
import { compareSync, hashSync } from "bcrypt";
import {
   createUser,
   getUserById,
    loginUser,
    sendVerificationDigits,
    updateUser,
    verifyAccount
} from '../services/auth/user.service'
import { Request, Response } from "express";

const register = catchAsync( async(req: Request, res: Response)=>{
   await createUser(req.body);
   await sendVerificationDigits(req, { username: req.body.username, email: req.body.email});
   res.status(httpStatus.CREATED).json({
      message: "Created"
   })
});

const validate = catchAsync(async (req: Request, res: Response)=>{
   const user = verifyAccount(req.body.digits);
   res.status(httpStatus.OK).json({
       message:"Sent",
       token: user
   })
});

const login = catchAsync(async (req: Request, res: Response)=>{
    const { emailOrUsername, password } = req.body;
    const result: object = await loginUser(emailOrUsername, password);
    res.status(httpStatus.OK).json(result);
});

const updatePassword = catchAsync(async (req: Request, res: Response)=>{
    const { user } : any = req;
    const { newPassword, oldPassword }= req.body;
    const userData = await getUserById(user, newPassword);
    if(!userData) throw new AppRes(404, 'User not found');
    if(!(await compareSync(oldPassword, userData.password))) throw new AppRes(400, "Password does not matches")
    const password = await hashSync(newPassword, 11);
    await updateUser(userData._id, {password})
    res.status(httpStatus.OK).send('updated')
});

export default {
    register,
    validate,
    updatePassword, login
}
