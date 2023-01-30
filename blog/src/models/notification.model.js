/**
 * @author Utibeabasi Ekong <https://github.com/Xlaez>
 */
const { Schema, model } = require('mongoose');
const paginate = require('mongoose-paginate-v2');
const imageType = require('./other/imageType.notification.model');

const schema = new Schema(
  {
    image: {
      type: String,
      required: 'true',
      enum: imageType,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    seen: {
      type: Boolean,
      default: false,
    },
    heading: {
      type: String,
      required: true,
      minlength: 2,
      maxlenght: 20,
    },
    message: {
      type: String,
      required: true,
      minlength: 5,
    },
    link: {
      type: String,
      required: false,
      default: 'http://localhost:7171/api/v1', // would be updated to match home page of the app upon deploment
    },
  },
  {
    timestamps: true,
  }
);
schema.plugin(paginate);

const Notification = model('notifications', schema);

module.exports = Notification;
