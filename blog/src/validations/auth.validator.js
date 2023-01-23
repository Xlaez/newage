const Joi = require('joi');
const { password } = require('./custom.validator');

const signup = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string().email().trim().required(),
    password: Joi.string().required().custom(password),
    role: Joi.string().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    emailOrUsername: Joi.string().required(),
    password: Joi.string().required().custom(password),
  }),
};

const updatePassword = {
  body: Joi.object().keys({
    oldPassword: Joi.string().required().custom(password),
    newPassword: Joi.string().required().custom(password),
  }),
};

const validateAcc = {
  body: Joi.object().keys({
    digits: Joi.string().required().min(6),
  }),
};

module.exports = {
  signup,
  updatePassword,
  login,
  validateAcc,
};
