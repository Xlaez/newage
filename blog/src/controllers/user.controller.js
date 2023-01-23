const { catchAsync, AppRes } = require('owl-factory');
const { updateUser, queryUsers, getUserById } = require('../services/auth/user.service');

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

module.exports = {
  updateProfile,
  getUsers,
  getUser,
};
