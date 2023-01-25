/**
 * @author Utibeabasi Ekong <https://github.com/Xlaez>
 */
const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const schema = new Schema(
  {
    body: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'posts',
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    likes: {
      type: Number,
      default: 0,
    },
    replyCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

schema.plugin(mongoosePaginate);

const Comments = model('comments', schema);

module.exports = Comments;
