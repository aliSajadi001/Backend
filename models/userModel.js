let mongoos = require('mongoose');

let user = new mongoos.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: Date.now(),
    },
    resetPasswordWithTokent: String,
    resetPasswordExpiresAt: Date,
    randomCode: String,
    verificationTokenExpiresAt: Date,
  },
  { timestamps: true }
);

let userModel = mongoos.model('User', user);
module.exports = userModel;
