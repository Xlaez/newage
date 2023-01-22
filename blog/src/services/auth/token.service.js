const { sign, verify } = require('jsonwebtoken');
const { jwt } = require('../../configs');

const generateToken = (userId, expires, secret = jwt.secret) => {
	const payload = {
		sub: userId,
		exp: expires.unix(),
	};
	return sign(payload, secret);
};

const verifyToken = (token, secret = jwt.secret) => {
	const payload = verify(token, secret);
	return payload;
};

module.exports = {
	generateToken,
	verifyToken,
};
