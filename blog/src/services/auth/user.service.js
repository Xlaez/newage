const { AppRes, httpStatus } = require('owl-factory');
const tokenService = require('./token.service');
const mailSender = require('./email.service');
const User = require('../../models/user.models');
const { uniqueFiveDigits } = require('../../utils/randomGenerator.utils');
const { getValueFromRedis, addToRedis } = require('../../libs/redis.libs');
const { app } = require('../../configs');

const isUserInDb = async (email, username) => {
  return User.findOne({ $or: [{ email }, { username }] });
};

const createUser = async (data) => {
  if (await isUserInDb(data.email, data.username)) throw new AppRes(httpStatus.BAD_REQUEST, 'email or username taken');
  return User.create(data);
};

const loginWithUsernameOrEmail = async (emailOrUsername, password) => {
  const user = await isUserInDb(emailOrUsername, emailOrUsername);
  if (!user || !(await user.doesPasswordMatch(password))) {
    throw new AppRes(httpStatus.BAD_REQUEST, 'Incorrect data; email, username or password does not match');
  }
  return user;
};

const verifyAccount = async (digits) => {
  const value = await getValueFromRedis(digits);
  if (!value) throw new AppRes(httpStatus.BAD_REQUEST, 'digits is wrong or has expired');
  const user = await User.findOneAndUpdate({ _id: value }, { isAccountVerified: true }, { new: true });
  const token = tokenService.generateToken(user._id, 60 * 60 * 3);
  return token;
};

const sendVerificationDigits = async (req, user) => {
  const digits = uniqueFiveDigits();
  const link = `${req.protocol}://${req.get('host')}${req.url}`;
  await addToRedis(digits.toString(), user.toString());

  return mailSender(user.email, 'Verify Account', {
    digits,
    link,
    name: user.username,
    app_name: app.name,
  });
};

module.exports = {
  createUser,
  loginWithUsernameOrEmail,
  sendVerificationDigits,
  verifyAccount,
};
