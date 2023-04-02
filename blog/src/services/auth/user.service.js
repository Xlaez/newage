/**
 * @author Utibeabasi Ekong <https://github.com/Xlaez>
 */

const { AppRes, httpStatus } = require('@dolphjs/core');
const tokenService = require('./token.service');
const mailSender = require('./email.service');
const User = require('../../models/user.models');
const { Follow, Request } = require('../../models/followers.model');
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
      ...searchParam,
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

const uploadAvatar = async (_id, url) => {
  return User.updateOne({ _id }, { avatar: url });
};

const isRequestSent = async (userId) => {
  return Request.findOne({ userFrom: userId });
};

// RECOMMENDATION: use transactions
const followUser = async (currentUser, userId) => {
  const _isRequestSent = await isRequestSent(currentUser);
  if (_isRequestSent) throw new AppRes(httpStatus.BAD_REQUEST, 'request already sent');
  await User.updateOne({ _id: userId }, { $inc: { receivedRequests: 1 } });
  await User.updateOne({ _id: currentUser }, { $inc: { sentRequests: 1 } });
  return Request.create({
    userTo: userId,
    userFrom: currentUser,
  });
};

const cancelFollow = async (_id) => {
  const result = await Request.findOneAndDelete({ _id });
  await User.updateOne({ _id: result.userTo }, { $inc: { receivedRequests: -1 } });
  return User.updateOne({ _id: result.userFrom }, { $inc: { sentRequests: -1 } });
};

const acceptFollow = async (_id) => {
  const session = await User.startSession();
  const transactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' },
  };
  // eslint-disable-next-line one-var
  let user1, user2;
  try {
    await session.withTransaction(async () => {
      const deleteRequest = await Request.findById({ _id });
      if (!deleteRequest) throw new AppRes(httpStatus.NOT_FOUND, 'cannot find request');

      const makeFollower = await Follow.create({
        followedUser: deleteRequest.userTo,
        followingUser: deleteRequest.userFrom,
      });

      if (!makeFollower) {
        await session.abortTransaction();
        throw new AppRes(httpStatus.INTERNAL_SERVER_ERROR, 'cannot follow user');
      }

      user1 = await User.findOneAndUpdate({ _id: deleteRequest.userTo }, { $inc: { followers: 1 } }, session);

      if (!user1) {
        await session.abortTransaction();
        throw new AppRes(httpStatus.INTERNAL_SERVER_ERROR, 'cannot follow user');
      }

      user2 = await User.findOneAndUpdate({ _id: deleteRequest.userFrom }, { $inc: { followings: 1 } }, session);
      if (!user2) {
        await session.abortTransaction();
        throw new AppRes(httpStatus.INTERNAL_SERVER_ERROR, ' cannot follow user');
      }
      await Request.findByIdAndDelete(_id);
    }, transactionOptions);
  } catch (e) {
    throw new AppRes(httpStatus.INTERNAL_SERVER_ERROR, e);
  } finally {
    session.endSession();
  }
};

const unfollow = async (currentUser, userId) => {
  const session = await User.startSession();
  const transactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' },
  };
  try {
    return session.withTransaction(async () => {
      const deleteFollowDoc = await Follow.deleteOne(
        {
          $and: [{ followedUser: userId }, { followingUser: currentUser }],
        },
        session
      );

      if (deleteFollowDoc.deletedCount === 0) {
        await session.abortTransaction();
        throw new AppRes(httpStatus.INTERNAL_SERVER_ERROR, 'cannot unfollow user');
      }

      const user1 = await User.updateOne({ _id: userId }, { $inc: { followers: -1 } }, session);
      if (user1.modifiedCount === 0) {
        await session.abortTransaction();
        throw new AppRes(httpStatus.INTERNAL_SERVER_ERROR, 'cannot unfollow user');
      }
      const user2 = await User.updateOne({ _id: currentUser }, { $inc: { following: -1 } }, session);
      if (user2.modifiedCount === 0) {
        await session.abortTransaction();
        throw new AppRes(httpStatus.INTERNAL_SERVER_ERROR, 'cannot unfollow user');
      }
    }, transactionOptions);
  } catch (e) {
    throw new AppRes(httpStatus.INTERNAL_SERVER_ERROR, e);
  } finally {
    session.endSession();
  }
};

module.exports = {
  createUser,
  loginWithUsernameOrEmail,
  sendVerificationDigits,
  verifyAccount,
  updateUser,
  getUserById,
  queryUsers,
  uploadAvatar,
  followUser,
  cancelFollow,
  acceptFollow,
  unfollow,
};
