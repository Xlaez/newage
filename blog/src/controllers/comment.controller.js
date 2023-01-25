/**
 * @author Utibeabasi Ekong <https://github.com/Xlaez>
 */
const { catchAsync, AppRes, httpStatus } = require('owl-factory');
const {
  newComment,
  _deleteComment,
  findById,
  incrementComment,
  getCommentReplies,
  _getComments,
} = require('../services/comment.service');
const pick = require('../utils/pick.utils');
// const { getSinglePost } = require('../services/post.service');

const createComment = catchAsync(async (req, res) => {
  const { user } = req;
  const { parentId, body, postId } = req.body;

  // eslint-disable-next-line prefer-const
  let _newComment = await newComment({
    author: user,
    postId,
    body,
  });

  if (parentId) {
    const parentComment = await findById(parentId);
    if (!parentComment) throw new AppRes(httpStatus.BAD_REQUEST, 'comment not found');
  }

  _newComment.parentId = parentId;
  await incrementComment(postId, parentId);
  _newComment.save();
  res.status(httpStatus.CREATED).send('comment created');
});

const deleteComment = catchAsync(async (req, res) => {
  const { commentId } = req.params;

  const comment = await findById(commentId);
  if (!comment) throw new AppRes(httpStatus.BAD_REQUEST, 'comment not found');

  const { parentId, postId } = comment;
  await _deleteComment(commentId, parentId, postId);
  res.status(httpStatus.OK).send('comment deleted');
});

const getReplies = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['parentId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const replies = await getCommentReplies(filter, options);
  if (!replies) throw new AppRes(httpStatus.NOT_FOUND, 'resource not found');
  res.status(httpStatus.OK).json(replies);
});

const getComments = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['postId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const comments = await _getComments(filter, options);
  if (!comments) throw new AppRes(httpStatus.NOT_FOUND, 'resource not found');
  res.status(httpStatus.OK).json(comments);
});

module.exports = {
  createComment,
  deleteComment,
  getReplies,
  getComments,
};
