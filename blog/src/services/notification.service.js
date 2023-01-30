/**
 * @author Utibeabasi Ekong <https://github.com/Xlaez>
 */

const Notification = require('../models/notification.model');
const paginateLabel = require('../utils/paginationLabel.utils');

const createNewNotification = async (data) => {
  return Notification.create(data);
};

const getOneNotification = async (notificationId) => {
  return Notification.findById(notificationId);
};

const getallUserNotification = async ({ limit, page }, { userId }) => {
  const options = {
    lean: true,
    customLabels: paginateLabel,
  };

  const _page = +page;

  const notifications = Notification.paginate(
    {
      userId,
    },
    {
      ...(limit ? { limit: +limit } : { limit: 15 }),
      page: _page,
      ...options,
      select: ['-updatedAt', '-userId'],
    }
  );
  return notifications;
};

const setNotificationAsSeen = async (userId) => {
  return Notification.updateMany({ userId }, { seen: true });
};

module.exports = {
  createNewNotification,
  getOneNotification,
  getallUserNotification,
  setNotificationAsSeen,
};
