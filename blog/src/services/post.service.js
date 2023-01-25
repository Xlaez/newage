/**
 * @author Utibeabasi Ekong <https://github.com/Xlaez>
 */

/* eslint-disable no-unused-vars */
const { AppRes } = require('owl-factory');
const Posts = require('../models/post.models');

/**
 *
 * @param {Object{title:string, descr:string, body:string, author:string, image:string}} data
 */
const uploadPost = async (data) => {
  return Posts.create(data);
};

const updatePostWithId = async (id, data) => {
  return Posts.updateOne({ _id: id }, data);
};

const deletPost = async (id) => {
  return Posts.deleteOne({ _id: id });
};

const getSinglePost = async (id) => {
  return Posts.findById(id).populate('author', 'username _id image social about').lean();
};

module.exports = {
  uploadPost,
  updatePostWithId,
  deletPost,
  getSinglePost,
};
