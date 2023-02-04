import {Comment} from "../models/comment.model";
import { updatePost } from './post.service';

const newComment = async (data: any)=>{
    return new Comment(data)
};

const findComment = async (id: string)=>{
    return Comment.findById(id).populate('author', 'username avatar, _id').lean()
};

const updateComment = async (id: string, data: any)=>{
    return Comment.updateOne({ _id: id}).lean();
};

const deleteComment = async (id: string, parentId: string, postId: string)=>{
    if(parentId){
        await Comment.findByIdAndUpdate(parentId, {
            $inc: { replyCount: -1}
        })
    }else {
        await updatePost(postId, { $inc: { commentCount: -1}});
    }
    await Comment.deleteMany({ parentId: id });
    return Comment.deleteOne({ _id: id })
};

const incrementComment = async (postId: string, parentId: string)=>{
    if(parentId){
        await Comment.findByIdAndUpdate(parentId, {
            $inc: { replyCount: 1 }
        });
    }else{
        await updatePost(postId, { $inc:{ commentCount: 1}});
    }
};

/*
const getCommentReplies = async (filter: any, options: any) => {
    return Comment.paginate(filter, options);
};
*/


export {
    deleteComment,
    updateComment,
    findComment,
    newComment,
    incrementComment,
    updatePost
}