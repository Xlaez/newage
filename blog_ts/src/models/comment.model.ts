import mongoose, { Schema, model, Document, Model } from 'mongoose';
import paginate  from 'mongoose-paginate-v2';

type CommentDocument = Document & {
   body: string,
    author: string,
    parentId: string,
    postId: string,

}

const CommentSchema = new Schema(
   {
      body: {
         type: Schema.Types.ObjectId,
         required: true,
       },
       author: {
         type: Schema.Types.ObjectId,
         ref: 'users',
       },
       postId: {
         type: Schema.Types.ObjectId,
         ref: 'posts',
       },
       parentId: {
         type: Schema.Types.ObjectId,
         ref: 'users',
       },
       likes: {
         type: Number,
         default: 0,
       },
       replyCount: {
         type: Number,
         default: 0,
       },
     },
     { timestamps: true }
);
//CommentSchema.plugin(paginate)

const Comment: Model<CommentDocument> = mongoose.model<CommentDocument>('Comment', CommentSchema)
export {
   Comment,
   CommentDocument
};