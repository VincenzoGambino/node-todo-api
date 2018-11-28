const mongoose = require('mongoose');
const validator =  require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');


/**
 * User schema.
 * - email
 * - password
 * - tokens
 * -- access
 * -- token
 */
var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} not a valid email.'
    },
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens:[{
    access: {
      type: String,
      require: true
    },
    token: {
      type: String,
      require: true
    }
  }]
});

/**
 * Override .toJSON method to return only id and email.
 *
 * @returns Object
 */
UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

/**
 * Generates auth token upon user save.
 *
 * @returns Promise.
 */
UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    user.tokens.push({access, token});

    return user.save().then(() => {
      return token;
    });
};

var User = mongoose.model('User', UserSchema);

module.exports = {User};