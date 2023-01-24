const { Router } = require('owl-factory');
const { registerUser, validateAccount, login, updatePassword } = require('../controllers/auth.controller');
const validateUser = require('../middlewares/verifyUser.middleware');
const authValidate = require('../validations/auth.validator');
const validate = require('../validations/validate.validator');

class AuthRouter {
  constructor() {
    this.router = Router();
    this.path = '/api/v1/auth';
    this.Routes();
  }

  Routes() {
    this.router.post(`${this.path}/register`, validate(authValidate.signup), registerUser);
    this.router.post(`${this.path}/validate`, validate(authValidate.validateAcc), validateAccount);
    this.router.post(`${this.path}/login`, validate(authValidate.login), login);
    this.router.patch(`${this.path}/update/password`, validate(authValidate.updatePassword), validateUser, updatePassword);
  }
}

module.exports = AuthRouter;
