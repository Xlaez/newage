/**
 * @author Utibeabasi Ekong <https://github.com/Xlaez>
 */

const { AppRes, catchAsync, httpStatus } = require('@dolphjs/core');

const { getOneNotification, getallUserNotification, setNotificationAsSeen } = require('../services/notification.service');

const getAllNotifications = catchAsync(async (req, res, next) => {
  const { limit, page } = req.query;
  const notifications = await getallUserNotification({ limit, page }, { userId: req.user });
  if (!notifications) return next(new AppRes(httpStatus.NOT_FOUND, 'resource not found'));
  res.status(200).json(notifications);
});

const getNotificationById = catchAsync(async (req, res, next) => {
  const notification = await getOneNotification(req.params.notificationId);
  if (!notification) return next(new AppRes(httpStatus.NOT_FOUND, 'resource not found'));
  res.status(200).json(notification);
});

const setNotificationSeen = catchAsync(async (req, res, next) => {
  const result = await setNotificationAsSeen(req.user);
  if (result.modifiedCount === 0) return next(new AppRes(httpStatus.INTERNAL_SERVER_ERROR, 'cannot perform action'));
  res.status(200).send('seen');
});

module.exports = {
  getAllNotifications,
  getNotificationById,
  setNotificationSeen,
};
