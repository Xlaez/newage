const { catchAsync, httpStatus, AppRes } = require('@dolphjs/core');
const { hashSync } = require('bcryptjs');
const {
  createUser,
  loginWithUsernameOrEmail,
  sendVerificationDigits,
  verifyAccount,
  getUserById,
  updateUser,
} = require('../services/auth/user.service');

const registerUser = catchAsync(async (req, res) => {
  await createUser(req.body);
  await sendVerificationDigits(req, { username: req.body.username, email: req.body.email });
  res.status(httpStatus.CREATED).send('created');
});

const validateAccount = catchAsync(async (req, res) => {
  const user = await verifyAccount(req.body.digits);
  res.status(httpStatus.OK).json({ token: user });
});

const sendVerificationCode = catchAsync(async (req, res) => {
  const { username, email } = req.body;
  await sendVerificationDigits(req, { username, email });
  res.status(httpStatus.OK).send('sent');
});

const login = catchAsync(async (req, res) => {
  const { emailOrUsername, password } = req.body;
  const result = await loginWithUsernameOrEmail(emailOrUsername, password);
  res.status(httpStatus.OK).json(result);
});

const updatePassword = catchAsync(async (req, res) => {
  const { user } = req;
  const { newPassword, oldPassword } = req.body;
  const userData = await getUserById(user);
  if (!userData) throw new AppRes(404, 'user not found');
  if (!(await userData.doesPasswordMatch(oldPassword))) throw new AppRes(400, 'password does not match');
  const password = await hashSync(newPassword, 11);
  await updateUser(userData._id, { password });
  res.status(200).send('updated');
});

module.exports = {
  registerUser,
  validateAccount,
  sendVerificationCode,
  updatePassword,
  login,
};
