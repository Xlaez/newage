const { Schema, model } = require('mongoose');
const paginate = require('mongoose-paginate-v2');

const schema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
  },
  descr: {
    type: String,
    required: true,
    minlength: 10,
  },
  body: {
    type: String,
    required: true,
    minlength: 20, // inrease later
  },
  views: {
    type: Number,
    default: 0,
  },
  likedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
  ],
  likes: {
    type: Number,
    default: 0,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  commentCount: {
    type: Number,
    default: 0,
  },
});

schema.plugin(paginate);

const Post = model('posts', schema);
module.exports = Post;
