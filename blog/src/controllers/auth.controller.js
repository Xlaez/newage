const { catchAsync, httpStatus } = require('owl-factory');
const {
  createUser,
  loginWithUsernameOrEmail,
  sendVerificationDigits,
  verifyAccount,
} = require('../services/auth/user.service');

const registerUser = catchAsync(async (req, res) => {
  await createUser(req.body);
  await sendVerificationDigits(req, req.body);
  res.status(httpStatus.CREATED).send('created');
});

const validateAccount = catchAsync(async (req, res) => {
  const user = await verifyAccount(req.body.digits);
  res.status(httpStatus.OK).send(user);
});

module.exports = {
  registerUser,
  validateAccount,
};
