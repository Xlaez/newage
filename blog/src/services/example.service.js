const { logger } = require('owl-factory');
const exampleModel = require('../models/example.models');

/**
 *
 * @param {object} name
 */
const save = (name, age) => {
  logger.info({ name, age });
  return exampleModel.create({ name, age });
};

module.exports = {
  save,
};
