/**
 * @author Utibeabasi Ekong <https://github.com/Xlaez>
 */
const Comment = require('../models/comment.model');
const { updatePostWithId } = require('./post.service');

const newComment = async (data) => {
  return new Comment(data);
};

const findById = async (id) => {
  return Comment.findById(id).populate('author', 'username avatar _id').lean();
};

const findByIdAndUpdate = async (id, body) => {
  return Comment.findByIdAndUpdate(id, { body }).lean();
};

const getCommentReplies = async (filter, options) => {
  return Comment.paginate(filter, options);
};

const _deleteComment = async (commentId, parentId, postId) => {
  if (parentId) {
    await Comment.findByIdAndUpdate(parentId, {
      $inc: { replyCount: -1 },
    });
  } else {
    await updatePostWithId(postId, { $inc: { commentCount: -1 } });
  }
  await Comment.deleteMany({ parentId: commentId });
  return Comment.deleteOne({ _id: commentId });
};

const incrementComment = async (postId, parentId) => {
  if (parentId) {
    await Comment.findByIdAndUpdate(parentId, {
      $inc: { replyCount: 1 },
    });
  } else {
    await updatePostWithId(postId, { $inc: { commentCount: 1 } });
  }
};

const _getComments = async (filter, options) => {
  return Comment.paginate(filter, options);
};
module.exports = {
  findById,
  findByIdAndUpdate,
  _deleteComment,
  newComment,
  incrementComment,
  getCommentReplies,
  _getComments,
};
