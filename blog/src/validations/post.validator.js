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

module.exports = {
  uploadPost,
  updatePost,
  deletePost,
};
