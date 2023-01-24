/**
 * @author Utibeabasi Ekong <https://github.com/Xlaez>
 */

const { mongoose } = require('./index');

const mongoConfig = {
  url: mongoose.url,
  options: mongoose.options,
};

module.exports = mongoConfig;
