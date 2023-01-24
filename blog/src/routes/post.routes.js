/**
 * @author Utibeabasi Ekong <https://github.com/Xlaez>
 */
const { Router } = require('owl-factory');
const { uploadNewPost, updatePost, deletePost, getPost } = require('../controllers/post.controller');
const validate = require('../validations/validate.validator');
const postValidation = require('../validations/post.validator');
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
    this.router.patch(`${this.path}/:id`, validate(postValidation.updatePost), verifyAcc, updatePost);
    this.router.delete(`${this.path}/:id`, validate(postValidation.deletePost), verifyAcc, deletePost);
    this.router.get(`${this.path}/:id`, validate(postValidation.deletePost), verifyAcc, getPost);
  }
}

module.exports = PostRouter;
