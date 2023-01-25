/**
 * @author Utibeabasi Ekong <https://github.com/Xlaez>
 */

const Joi = require('joi');

const uploadPost = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    descr: Joi.string().required(),
    category: Joi.string().required(),
    body: Joi.string(),
  }),
};

const updatePost = {
  body: Joi.object().keys({
    body: Joi.string(),
    descr: Joi.string(),
  }),
  param: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

const deletePost = {
  param: Joi.object().keys({
    id: Joi.object().required(),
  }),
};

const createComment = {
  body: Joi.object().keys({
    body: Joi.string().required(),
    postId: Joi.string().required(),
    parentId: Joi.string(),
  }),
};

const getReplies = {
  query: Joi.object().keys({
    page: Joi.string().required(),
    limit: Joi.string().required(),
    sortBy: Joi.string().optional(),
    parentId: Joi.string().required(),
  }),
};

const getComments = {
  query: Joi.object().keys({
    page: Joi.string().required(),
    limit: Joi.string().required(),
    sortBy: Joi.string().optional(),
    postId: Joi.string().required(),
  }),
};

const deleteComment = {
  param: Joi.object().keys({
    commentId: Joi.object().required(),
  }),
};

module.exports = {
  uploadPost,
  updatePost,
  deletePost,
  createComment,
  deleteComment,
  getReplies,
  getComments,
};
