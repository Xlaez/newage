import mongoose, { Schema, Document, Model } from 'mongoose';

type UserDocument = Document & {
   fullName: string,
   email: string,
   password: string,
   isVerified: boolean,
}

type UserInput = {
   fullName: UserDocument['fullName']
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
)

const User: Model<UserDocument> = mongoose.model<UserDocument>('User', UserSchema)

export { User, UserInput, UserDocument };