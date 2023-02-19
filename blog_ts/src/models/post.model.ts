import mongoose, { Schema, model, Document, Model } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { categories } from './category.post.models';

type PostDocument = Document & {
   title: string,
   description: string,
   body: string,
}

const postSchema = new Schema({
   title:{
      type: Schema.Types.String,
      required: true,
      minlength: 3
   },
   description:{
      type: Schema.Types.String,
      required: true,
      minlength: 10
   },
   body:{
      type: Schema.Types.String,
      required:  true,
      minlength: 30
   },
   image:{
      type: Schema.Types.Mixed
   },
   views:{
      type: Schema.Types.Number,
      default: 0
   },
   liked:[
      {
         type: Schema.Types.ObjectId,
         ref: 'User'
      }
   ],
   likes:{
      type: Schema.Types.Number,
      default: 0
   },
   author: {
      type:Schema.Types.ObjectId,
      ref: 'User', 
   },
   category:{
      type: Schema.Types.String,
      enum: categories
   },
   commentCount:{
      type: Schema.Types.Number,
      default:0
   }
})

postSchema.plugin(paginate);

const Post: Model<PostDocument> = mongoose.model<PostDocument>('Post', postSchema)

export {
   Post,
   PostDocument
}