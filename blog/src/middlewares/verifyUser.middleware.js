/**
 * @author Utibeabasi Ekong <https://github.com/Xlaez>
 */
const { httpStatus, catchAsync, AppRes } = require('@dolphjs/core');
const { verify } = require('jsonwebtoken');
const { jwt } = require('../configs');
const User = require('../models/user.models');

const validateUser = catchAsync(async (req, res, next) => {
  const token = req.headers['x-auth-token'];
  if (!token) return next(new AppRes(httpStatus.UNAUTHORIZED, 'provide a valid token header'));
  if (typeof token !== 'string') return next(new AppRes(httpStatus.UNAUTHORIZED, 'provide a valid token type [string]'));

  const payload = verify(token, jwt.secret);
  const user = await User.findById(payload.sub);
  if (!user) return next(new AppRes(httpStatus.NOT_FOUND, 'user not found'));
  if (!user.isAccountVerified) return next(new AppRes(httpStatus.UNAUTHORIZED, 'please validate account'));
  req.user = user._id;
  req.role = user.role;
  next();
});

module.exports = validateUser;
