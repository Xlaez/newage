/**
 * @author Utibeabasi Ekong <https://github.com/Xlaez>
 */

const Joi = require('joi');

const getUserNotification = {
  query: Joi.object().keys({
    limit: Joi.string().required(),
    page: Joi.string().required(),
  }),
};

module.exports = {
  getUserNotification,
};
