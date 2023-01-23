const { Schema, model } = require('mongoose');

const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
});

const exampleModel = model('example', schema);

module.exports = exampleModel;
