/**
 * @author Utibeabasi Ekong <https://github.com/Xlaez>
 */
const { Router } = require('@dolphjs/core');

const validate = require('../validations/validate.validator');
const notificationValidation = require('../validations/notification.validator');
const verifyAcc = require('../middlewares/verifyUser.middleware');
const { getAllNotifications, getNotificationById, setNotificationSeen } = require('../controllers/notification.controller');

class NotificationRouter {
  constructor() {
    this.router = Router();
    this.path = '/api/v1/notification';
    this.Routes();
  }

  Routes() {
    this.router.get(`${this.path}/query`, verifyAcc, validate(notificationValidation), getAllNotifications);
    this.router.get(`${this.path}/:notificationId`, verifyAcc, getNotificationById);
    this.router.patch(`${this.path}/view`, verifyAcc, setNotificationSeen);
  }
}

module.exports = NotificationRouter;
