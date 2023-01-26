/**
 * @author Utibeabasi Ekong <https://github.com/Xlaez>
 */

const { Router } = require('owl-factory');
const { updateProfile, getUsers, getUser, uploadUserAvatar } = require('../controllers/user.controller');
const validateUser = require('../middlewares/verifyUser.middleware');
const validate = require('../validations/validate.validator');
const userValidator = require('../validations/user.validator');
const { singleUpload } = require('../libs/multer.libs');

class UserRouter {
  constructor() {
    this.router = Router();
    this.path = '/api/v1/user';
    this.Routes();
  }

  Routes() {
    this.router.patch(`${this.path}/update/profile`, validate(userValidator.updateProfile), validateUser, updateProfile);
    this.router.patch(`${this.path}/update/avatar`, singleUpload, validateUser, uploadUserAvatar);
    this.router.get(`${this.path}/users`, validate(userValidator.queryUsers), validateUser, getUsers);
    this.router.get(`${this.path}/me`, validateUser, getUser);
  }
}

module.exports = UserRouter;
