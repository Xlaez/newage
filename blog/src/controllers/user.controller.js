const { catchAsync, AppRes } = require('owl-factory');
const { updateUser } = require('../services/auth/user.service');

const updateProfile = catchAsync(async (req, res) => {
  const profile = await updateUser(req.user, req.body);
  if (!profile) throw new AppRes(500).send('cannot update profile');
  res.status(200).send('updated');
});

module.exports = {
  updateProfile,
};
