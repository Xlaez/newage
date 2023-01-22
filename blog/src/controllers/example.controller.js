const { httpStatus, catchAsync, AppRes } = require('owl-factory');
const { save } = require('../services/example.service');

const saveData = catchAsync(async (req, res) => {
  const { name, age } = req.body;
  if (!name || !age) throw new AppRes(httpStatus.BAD_REQUEST, 'provide both name and age fields');
  const data = await save(name, age);
  res.status(httpStatus.CREATED).send(data);
});

module.exports = {
  saveData,
};
