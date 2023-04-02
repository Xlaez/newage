/**
 * @author Utibeabasi Ekong <https://github.com/Xlaez>
 */
const { catchAsync, AppRes, httpStatus } = require('@dolphjs/core');
const {
  newComment,
  _deleteComment,
  findById,
  incrementComment,
  getCommentReplies,
  _getComments,
  findByIdAndUpdate,
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
  options.populate = 'likedBy';
  // TODO: remeber to delete the password field from the pagination return value
  const replies = await getCommentReplies(filter, options);
  if (!replies) throw new AppRes(httpStatus.NOT_FOUND, 'resource not found');
  res.status(httpStatus.OK).json(replies);
});

const getComments = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['postId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  options.populate = 'likedBy';
  // TODO: remeber to delete the password field from the pagination return value
  const comments = await _getComments(filter, options);
  if (!comments) throw new AppRes(httpStatus.NOT_FOUND, 'resource not found');
  res.status(httpStatus.OK).json(comments);
});

const updateComment = catchAsync(async (req, res) => {
  const { id, body } = req.body;
  const comment = await findByIdAndUpdate(id, { body });
  if (!comment) throw new AppRes(httpStatus.INTERNAL_SERVER_ERROR, 'cannot update comment');
  res.status(httpStatus.OK).send('comment updated');
});

const addLikes = catchAsync(async (req, res) => {
  const { user } = req;
  const comment = await findByIdAndUpdate(req.params.id, {
    $inc: { likes: 1 },
    $addToSet: { likedBy: user },
  });
  if (!comment) throw new AppRes(httpStatus.INTERNAL_SERVER_ERROR, 'cannot update comment');
  res.status(httpStatus.OK).send('comment liked');
});

const removeLike = catchAsync(async (req, res) => {
  const { user } = req;
  const comment = await findByIdAndUpdate(req.params.id, {
    $inc: { likes: -1 },
    $pull: { likedBy: user },
  });
  if (!comment) throw new AppRes(httpStatus.INTERNAL_SERVER_ERROR, 'cannot update comment');
  res.status(httpStatus.OK).send('comment unliked');
});

module.exports = {
  createComment,
  deleteComment,
  getReplies,
  getComments,
  updateComment,
  addLikes,
  removeLike,
};
