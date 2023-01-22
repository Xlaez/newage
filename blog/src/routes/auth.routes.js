const { Router } = require('owl-factory');
const { registerUser, validateAccount } = require('../controllers/auth.controller');

class AuthRouter {
  constructor() {
    this.router = Router();
    this.path = '/api/v1/auth';
    this.Routes();
  }

  Routes() {
    this.router.post(`${this.path}/register`, registerUser);
    this.router.post(`${this.path}/validate`, validateAccount);
  }
}

module.exports = AuthRouter;
