/**
 * @author Utibeabasi Ekong <https://github.com/Xlaez>
 */

const Joi = require('joi');

const updateProfile = {
  body: Joi.object().keys({
    social: Joi.object().keys({
      twitter: Joi.string(),
      linkedIn: Joi.string(),
      medium: Joi.string(),
      instagram: Joi.string(),
      facebook: Joi.string(),
      github: Joi.string(),
      phone: Joi.string(),
    }),
    about: Joi.string().min(20),
  }),
};

const queryUsers = {
  query: Joi.object().keys({
    page: Joi.string(),
    limit: Joi.string(),
    orderBy: Joi.string().optional(),
    sortBy: Joi.string().optional(),
    filter: Joi.string().optional(),
    search: Joi.string().optional(),
  }),
};

module.exports = {
  queryUsers,
  updateProfile,
};
