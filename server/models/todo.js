const mongoose = require('mongoose');


/**
 * To do model
 * - text
 * - completed
 * - completed at
 *
 * @type {Model}
 */
var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength:  1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

module.exports = {Todo};