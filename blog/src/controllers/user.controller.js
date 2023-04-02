/**
 * @author Utibeabasi Ekong <https://github.com/Xlaez>
 */
const { catchAsync, AppRes } = require('@dolphjs/core');
const { updateUser, queryUsers, getUserById, uploadAvatar } = require('../services/auth/user.service');
const { uploadSingle } = require('../libs/cloudinary.libs');

const updateProfile = catchAsync(async (req, res) => {
  const profile = await updateUser(req.user, req.body);
  if (!profile) throw new AppRes(500).send('cannot update profile');
  res.status(200).send('updated');
});

const getUsers = catchAsync(async (req, res) => {
  const { limit, page, sortBy, orderBy, search, filter } = req.query;
  const users = await queryUsers({ search, filter }, { limit: +limit, page: +page, orderBy, sortedBy: sortBy });
  if (!users) throw new AppRes(404).send('resource not found');
  res.status(200).json(users);
});

const getUser = catchAsync(async (req, res) => {
  const { user } = req;
  const profile = await getUserById(user, 'password');
  res.status(200).json(profile);
});

const uploadUserAvatar = catchAsync(async (req, res) => {
  const { file } = req;
  const { url } = await uploadSingle(file.path);
  await uploadAvatar(req.user, url);
  res.status(200).send('uploaded');
});

module.exports = {
  updateProfile,
  getUsers,
  getUser,
  uploadUserAvatar,
};
