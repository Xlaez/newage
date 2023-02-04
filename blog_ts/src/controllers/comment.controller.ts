import { catchAsync, AppRes, httpStatus } from "owl-factory";
import {
    newComment,
    incrementComment,
    findComment,
    updateComment,
    deleteComment
} from "../services/comment.service";
import pick from "../utils/pick.util";
import {Request, Response} from "express";

const createComment = catchAsync( async (req: Request, res: Response)=>{
    const { user }: any = req;
    const { parentId, body, postId }: any = req.body;

    const _newComment = await newComment({
        author: user,
        postId,
        body,
    });

    if(parentId){
        const parentComment = await findComment(parentId);
        if(!parentComment) throw new AppRes(httpStatus.BAD_REQUEST, 'Not found')
    }
    _newComment.parentId = parentId;
    await incrementComment(postId, parentId);
    _newComment.save();
    res.status(httpStatus.CREATED).json('comment created')
})
const _deleteComment = catchAsync(async (req: Request, res: Response)=>{
    const { commentId } = req.params;
    const comment = await findComment(commentId);
    if(!comment) throw new AppRes(httpStatus.NOT_FOUND, 'Not found');

    const { parentId, postId }: any = comment;
    await deleteComment(commentId, parentId, postId);
    res.status(httpStatus.OK).json('Comment deleted')
});

/*const getReplies = catchAsync(async (req: Request, res: Response)=>{
    const filter = pick(req.query, ['parentId']);
})*/

export {
    _deleteComment,
    createComment,

}

