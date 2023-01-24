/**
 * @author Utibeabasi Ekong <https://github.com/Xlaez>
 */

const { Router } = require('owl-factory');
const { updateProfile, getUsers, getUser } = require('../controllers/user.controller');
const validateUser = require('../middlewares/verifyUser.middleware');
const validate = require('../validations/validate.validator');
const userValidator = require('../validations/user.validator');

class UserRouter {
  constructor() {
    this.router = Router();
    this.path = '/api/v1/user';
    this.Routes();
  }

  Routes() {
    this.router.patch(`${this.path}/update/profile`, validate(userValidator.updateProfile), validateUser, updateProfile);
    this.router.get(`${this.path}/users`, validate(userValidator.queryUsers), validateUser, getUsers);
    this.router.get(`${this.path}/me`, validateUser, getUser);
  }
}

module.exports = UserRouter;
