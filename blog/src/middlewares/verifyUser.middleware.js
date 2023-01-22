const { httpStatus, catchAsync, AppRes } = require('owl-factory');
const { verify } = require('jsonwebtoken');
const { jwt } = require('../configs');
const User = require('../models/user.models');

const validateUser = catchAsync(async (req, res, next) => {
	const token = req.header['x-auth-token'];

	if (!token)
		return next(
			new AppRes(httpStatus.UNAUTHORIZED, 'provide a valid token header')
		);
	if (typeof token !== 'string')
		return next(
			new AppRes(httpStatus.UNAUTHORIZED, 'provide a valid token type [string]')
		);

	const payload = verify(token, jwt.secret);
	const user = await User.findById(payload.sub);
	if (!user) return next(new AppRes(httpStatus.NOT_FOUND, 'user not found'));
	req.user = user;
	next();
});

module.exports = validateUser;
