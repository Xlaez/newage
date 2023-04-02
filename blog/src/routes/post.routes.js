/**
 * @author Utibeabasi Ekong <https://github.com/Xlaez>
 */
const { Router } = require('@dolphjs/core');

const {
  uploadNewPost,
  updatePost,
  deletePost,
  getPost,
  getPosts,
  likePost,
  unlikePost,
  addViewsCount,
  queryUsersWhoLikedPost,
} = require('../controllers/post.controller');
const {
  createComment,
  deleteComment,
  getReplies,
  getComments,
  updateComment,
  addLikes,
  removeLike,
} = require('../controllers/comment.controller');

const validate = require('../validations/validate.validator');
const postValidation = require('../validations/post.validator');
const uservalidation = require('../validations/user.validator');
const { multipleUpload } = require('../libs/multer.libs');
const verifyAcc = require('../middlewares/verifyUser.middleware');

class PostRouter {
  constructor() {
    this.router = Router();
    this.path = '/api/v1/post';
    this.Routes();
  }

  Routes() {
    this.router.post(`${this.path}`, multipleUpload, validate(postValidation.uploadPost), verifyAcc, uploadNewPost);
    this.router.get(`${this.path}/query`, validate(uservalidation.queryUsers), verifyAcc, getPosts);
    this.router.patch(`${this.path}/:id`, validate(postValidation.updatePost), verifyAcc, updatePost);
    this.router.delete(`${this.path}/:id`, validate(postValidation.deletePost), verifyAcc, deletePost);
    this.router.get(`${this.path}/:id`, validate(postValidation.deletePost), verifyAcc, getPost);
    this.router.get(`${this.path}/:id`, validate(postValidation.deletePost), verifyAcc, getPost);
    this.router.put(`${this.path}/like/:id`, validate(postValidation.deletePost), verifyAcc, likePost);
    this.router.get(`${this.path}/likedBy/users`, verifyAcc, queryUsersWhoLikedPost);

    this.router.purge(`${this.path}/unlike/:id`, validate(postValidation.deletePost), verifyAcc, unlikePost);
    this.router.put(`${this.path}/views/:id`, validate(postValidation.deletePost), verifyAcc, addViewsCount);

    this.router.post(`${this.path}/comment`, validate(postValidation.createComment), verifyAcc, createComment);
    this.router.delete(`${this.path}/comment/:commentId`, validate(postValidation.deleteComment), verifyAcc, deleteComment);
    this.router.get(`${this.path}/comment/replies`, validate(postValidation.getReplies), verifyAcc, getReplies);
    this.router.get(`${this.path}/comment/query`, validate(postValidation.getComments), verifyAcc, getComments);
    this.router.patch(`${this.path}/comment/update`, validate(postValidation.updateComment), verifyAcc, updateComment);
    this.router.put(`${this.path}/comment/like/:id`, validate(postValidation.likeComment), verifyAcc, addLikes);
    this.router.purge(`${this.path}/comment/unlike/:id`, validate(postValidation.likeComment), verifyAcc, removeLike);
  }
}

module.exports = PostRouter;
