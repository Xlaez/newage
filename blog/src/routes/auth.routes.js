const { Router } = require('owl-factory');
const { registerUser, validateAccount, login, updatePassword } = require('../controllers/auth.controller');
const validateUser = require('../middlewares/verifyUser.middleware');
const authValidfate = require('../validations/auth.validator');
const validate = require('../validations/validate.validator');

class AuthRouter {
  constructor() {
    this.router = Router();
    this.path = '/api/v1/auth';
    this.Routes();
  }

  Routes() {
    this.router.post(`${this.path}/register`, validate(authValidfate.signup), registerUser);
    this.router.post(`${this.path}/validate`, validate(authValidfate.validateAcc), validateAccount);
    this.router.post(`${this.path}/login`, validate(authValidfate.login), login);
    this.router.patch(`${this.path}/update/password`, validate(authValidfate.updatePassword), validateUser, updatePassword);
  }
}

module.exports = AuthRouter;
