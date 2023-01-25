/**
 * @author Utibeabasi Ekong <https://github.com/Xlaez>
 */

const paginateLabel = require('../utils/paginationLabel.utils');
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

const queryPosts = async ({ filter, search }, { page, limit, sortBy, orderBy }) => {
  const options = {
    lean: true,
    customLabels: paginateLabel,
  };
  const _page = +page;
  let searchObj = {};
  if (search) {
    searchObj = {
      $or: [
        { descr: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { body: { $regex: search, $options: 'i' } },
      ],
    };
  }

  const posts = await Posts.paginate(
    {
      searchObj,
      ...filter,
      populate: ('author', 'avatar username _id'),
    },
    {
      ...(limit ? { limit: +limit } : { limit: 15 }),
      _page,
      sort: { [orderBy]: sortBy === 'asc' ? 1 : -1 },
      ...options,
    }
  );
  return posts;
};

module.exports = {
  uploadPost,
  updatePostWithId,
  deletPost,
  getSinglePost,
  queryPosts,
};
