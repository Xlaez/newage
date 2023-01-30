/**
 * @author Utibeabasi Ekong <https://github.com/Xlaez>
 */

const { Schema, model } = require('mongoose');
const paginate = require('mongoose-paginate-v2');

const requestSchema = new Schema({
  userFrom: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  userTo: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  sentAt: {
    type: Date,
    default: new Date(),
  },
});

const followSchema = new Schema({
  followedUser: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  followingUser: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  followedAt: {
    type: Date,
    default: new Date(),
  },
});

requestSchema.plugin(paginate);
followSchema.plugin(paginate);

const Request = model('requests', requestSchema);
const Follow = model('follow', followSchema);

module.exports = {
  Request,
  Follow,
};
