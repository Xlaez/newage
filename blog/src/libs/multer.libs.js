const multer = require('multer');
const path = require('path');
const { httpStatus, AppRes } = require('@dolphjs/core');
const allowedFileExtensions = require('../utils/allowedFileTypes.utils');

const storage = multer.diskStorage({});

const fileFilter = function (req, file, callback) {
  const fileExtCheck = allowedFileExtensions.includes(path.extname(file.originalname).toLowerCase());

  if (!fileExtCheck && file.originalname !== 'blob') {
    callback(new AppRes(httpStatus.NOT_ACCEPTABLE, 'file is not acceptable'), false);
  } else {
    callback(null, true);
  }
};

const singleUpload = multer({
  storage,
  fileFilter,
}).single('upload');

const multipleUpload = multer({
  storage,
  fileFilter,
}).array('uploads', 10);

module.exports = {
  singleUpload,
  multipleUpload,
};
