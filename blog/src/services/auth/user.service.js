const { AppRes, httpStatus } = require('owl-factory');
const tokenService = require('./token.service');
const mailSender = require('./email.service');
const User = require('../../models/user.models');
const { uniqueFiveDigits } = require('../../utils/randomGenerator.utils');
const { getValueFromRedis, addToRedis } = require('../../libs/redis.libs');
const { app } = require('../../configs');
const paginateLabel = require('../../utils/paginationLabel.utils');

const isUserInDb = async (email, username) => {
  return User.findOne({ $or: [{ email }, { username }] });
};

const getUserById = async (id, removeField) => {
  return User.findById(id).select([`-${removeField}`]);
};

const queryUsers = async ({ search, filter }, { limit, page, orderBy, sortedBy }) => {
  const options = {
    lean: true,
    customLabels: paginateLabel,
  };

  let searchParam = { isAccountVerified: true };
  if (search) {
    searchParam = { $or: [{ username: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] };
  }

  const users = await User.paginate(
    {
      searchParam,
      ...filter,
    },
    {
      ...(limit ? { limit } : { limit: 10 }),
      page,
      sort: { [orderBy]: sortedBy === 'asc' ? 1 : -1 },
      ...options,
      select: ['-password', '-updatedAt', '-isAccountVerified', '-__v'],
    }
  );
  return users;
};

const createUser = async (data) => {
  if (await isUserInDb(data.email, data.username)) throw new AppRes(httpStatus.BAD_REQUEST, 'email or username taken');
  return User.create(data);
};

const updateUser = async (idOrUsernameOrEmail, data) => {
  const filter = idOrUsernameOrEmail;
  const user = await User.findOneAndUpdate(
    { $or: [{ username: filter }, { email: filter }, { _id: filter }] },
    { ...data },
    { new: true }
  ).select(['-password']);
  return user;
};

const loginWithUsernameOrEmail = async (emailOrUsername, password) => {
  const user = await isUserInDb(emailOrUsername, emailOrUsername);
  if (!user || !(await user.doesPasswordMatch(password))) {
    throw new AppRes(httpStatus.BAD_REQUEST, 'Incorrect data; email, username or password does not match');
  }
  const token = tokenService.generateToken(user._id, 60 * 60 * 30);
  return {
    user: {
      username: user.username,
      email: user.email,
      id: user._id,
      created_at: user.createdAt,
      social: user.social,
    },
    token,
  };
};

const verifyAccount = async (digits) => {
  const value = await getValueFromRedis(digits.toString());
  if (!value) throw new AppRes(httpStatus.BAD_REQUEST, 'digits is wrong or has expired');
  const user = await User.findOneAndUpdate({ email: value }, { isAccountVerified: true }, { new: true });
  const token = tokenService.generateToken(user._id, 60 * 60 * 3);
  return token;
};

const sendVerificationDigits = async (req, user) => {
  const digits = uniqueFiveDigits();
  const link = `${req.protocol}://${req.get('host')}${req.url}`;
  await addToRedis(digits.toString(), user.email.toString());
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
  updateUser,
  getUserById,
  queryUsers,
};
