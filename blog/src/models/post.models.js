/**
 * @author Utibeabasi Ekong <https://github.com/Xlaez>
 */
const { Schema, model } = require('mongoose');
const paginate = require('mongoose-paginate-v2');
const categories = require('./other/category.post.models');

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
    minlength: 20, // inrease later
  },
  image: {
    type: Schema.Types.Mixed, // to allow for multiple file upload
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
  category: {
    type: String,
    enum: categories, // you can update to suit your needs
  },
  commentCount: {
    type: Number,
    default: 0,
  },
});

schema.plugin(paginate);

const Post = model('posts', schema);
module.exports = Post;
