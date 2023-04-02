/**
 * @author Utibeabasi Ekong <https://github.com/Xlaez>
 */

const { catchAsync, AppRes, httpStatus } = require('@dolphjs/core');
const { uploadMany } = require('../libs/cloudinary.libs');
const {
  uploadPost,
  updatePostWithId,
  deletPost,
  getSinglePost,
  queryPosts,
  getUsersWhoLikedPost,
} = require('../services/post.service');

const uploadNewPost = catchAsync(async (req, res) => {
  const { user, body, files } = req;

  let uploadObj = { ...body, author: user };
  if (body && files.length) {
    const filePaths = files.map((file) => file.path);
    const image = await uploadMany(filePaths);
    uploadObj = { ...body, author: user, image };
  } else if (!body) {
    throw new AppRes(httpStatus.BAD_REQUEST, 'provide a title, category and description');
  }
  const post = await uploadPost(uploadObj);
  if (!post) throw new AppRes(httpStatus.INTERNAL_SERVER_ERROR, 'cannot create new post');
  res.status(httpStatus.CREATED).send('upload successful');
});

const updatePost = catchAsync(async (req, res) => {
  const update = await updatePostWithId(req.params.id, req.body);
  if (update.modifiedCount === 0) throw new AppRes(httpStatus.INTERNAL_SERVER_ERROR, 'cannot update resource');
  res.status(httpStatus.OK).send('updated successfully');
});

const deletePost = catchAsync(async (req, res) => {
  const result = await deletPost(req.params.id);
  if (result.deletedCount === 0) throw new AppRes(httpStatus.INTERNAL_SERVER_ERROR, 'cannot delete resource');
  res.status(httpStatus.OK).send('updated successfully');
});

const getPost = catchAsync(async (req, res) => {
  const post = await getSinglePost(req.params.id);
  if (!post) throw new AppRes(httpStatus.NOT_FOUND, 'resource not found');
  res.status(httpStatus.OK).json(post);
});

const getPosts = catchAsync(async (req, res) => {
  const { limit, page, orderBy, sortBy, search, filter } = req.query;
  const posts = await queryPosts({ filter, search }, { page, limit, sortBy, orderBy });
  if (!posts) throw new AppRes(httpStatus.NOT_FOUND, 'resource not found');
  res.status(httpStatus.OK).json(posts);
});

const likePost = catchAsync(async (req, res) => {
  const result = await updatePostWithId(req.params.id, { $addToSet: { likedBy: req.user }, $inc: { likes: 1 } });
  if (result.modifiedCount === 0) throw new AppRes(httpStatus.INTERNAL_SERVER_ERROR, 'cannot add like');
  res.status(httpStatus.OK).send('post liked');
});

const unlikePost = catchAsync(async (req, res) => {
  const result = await updatePostWithId(req.params.id, { $pull: { likedBy: req.user }, $inc: { likes: -1 } });
  if (result.modifiedCount === 0) throw new AppRes(httpStatus.INTERNAL_SERVER_ERROR, 'cannot unlike post');
  res.status(httpStatus.OK).send('post unliked');
});

const addViewsCount = catchAsync(async (req, res) => {
  const result = await updatePostWithId(req.params.id, { $inc: { views: 1 } });
  if (result.modifiedCount === 0) throw new AppRes(httpStatus.INTERNAL_SERVER_ERROR, 'cannot unlike post');
  res.status(httpStatus.OK).send('views updated');
});

const queryUsersWhoLikedPost = catchAsync(async (req, res) => {
  const { limit, page, postId, sortBy, orderBy } = req.query;
  const users = await getUsersWhoLikedPost(postId, { page, limit, sortBy, orderBy });
  res.status(httpStatus.OK).json(users);
});

module.exports = {
  uploadNewPost,
  updatePost,
  deletePost,
  getPost,
  getPosts,
  likePost,
  unlikePost,
  addViewsCount,
  queryUsersWhoLikedPost,
};
