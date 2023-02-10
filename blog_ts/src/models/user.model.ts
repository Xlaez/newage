import { compareSync, hashSync } from 'bcrypt';
import mongoose, { Schema, Document, Model } from 'mongoose';
import   paginate from 'mongoose-paginate-v2'

type UserDocument = Document & {
   fullName: string,
   username: string,
   email: string,
   password: string,
   isVerified: boolean,
}

const UserSchema = new Schema(
   {
      fullName: {
         type: Schema.Types.String,
         required: true
      },
      email: {
         type: Schema.Types.String,
         unique: true,
         required: true
      },
      username:{
         type: Schema.Types.String,
         unique: true,
         required: true
      },
      password: {
         type: Schema.Types.String,
         required: true
      },
      isVerified: {
         type: Schema.Types.Boolean,
         default: false,
      },
      refreshToken: {
         type: Schema.Types.String,
         required: false
      }
   }
);

UserSchema.plugin(paginate);

UserSchema.methods.doesPasswordMatch =  (password: string)=> {
   const user : any = this;
   return compareSync(password, user.password);
 };
 
 UserSchema.pre('save',  (next)=> {
   const user: any = this;
   if (user.isModified('password')) {
     user.password =  hashSync(user.password, 11);
   }
   next();
 });
 

const User: Model<UserDocument> = mongoose.model<UserDocument>('User', UserSchema)

export { User,  UserDocument };