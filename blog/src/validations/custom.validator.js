/**
 * @author Utibeabasi Ekong <https://github.com/Xlaez>
 */

const password = (value, helpers) => {
  if (value.length < 6) {
    return helpers.message('password must be at least 6 characters');
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message('password must contain at least 1 letter and 1 number');
  }
  return value;
};
module.exports = {
  password,
};
