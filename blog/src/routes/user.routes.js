const { Router } = require('owl-factory');
const { updateProfile } = require('../controllers/user.controller');
const validateUser = require('../middlewares/verifyUser.middleware');

class UserRouter {
  constructor() {
    this.router = Router();
    this.path = '/api/v1/user';
    this.Routes();
  }

  Routes() {
    this.router.patch(`${this.path}/update/profile`, validateUser, updateProfile);
  }
}

module.exports = UserRouter;
