const userModel = require('../models/userModel');
let bcryptjs = require('bcryptjs');
let crypto = require('crypto');
let jsonwebtoken = require('jsonwebtoken');
const sendEmail = require('../mailtrapConfig/sendEmail');
const WelcomeEmail = require('../mailtrapConfig/welcomeEmail');
const resetPassword = require('../mailtrapConfig/resetPassword');
const changeSuccess = require('../mailtrapConfig/changeSuccess');
let { validationResult } = require('express-validator');
//////////////////////////////////////////////////////////////
let Register = async (req, res) => {
  try {
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return res.send({ success: false, message: error.array()[0].msg });
    } else {
      let { email, userName, password } = req.body;

      let hash = await bcryptjs.hash(password, 10);

      let createRandomCode = Math.floor(
        10000000 + Math.random() * 99999999
      ).toString();

      let newUser = await new userModel({
        userName,
        password: hash,
        email,
        randomCode: createRandomCode,
        verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
      }).save();

      sendEmail(newUser.email, createRandomCode, newUser.userName);
      let token = jsonwebtoken.sign(
        { id: newUser._id },
        process.env.SECRET_PASS_TOKEN,
        { expiresIn: '3d' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        success: true,
        message: 'User created successfully',
        userDoc: {
          ...newUser._doc,
          password: undefined,
        },
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error?.message, newUser });
  }
};
//verify email
let verifyEmail = async (req, res) => {
  try {
    let { code } = req.body;
    console.log(code);
    let user = await userModel.findOne({
      randomCode: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res.json({
        success: false,
        message: 'The code is not valid or has expire',
      });
    } else {
      user.randomCode = undefined;
      user.isVerified = true;
      user.verificationTokenExpiresAt = undefined;
      await user.save();
      console.log(user.email);

      await WelcomeEmail(user.email, user.userName);

      return res.json({ success: true, message: 'Register successfully' });
    }
  } catch (err) {
    console.log(err);
  }
};
//////////////////////////////////////////////////////////////
let Login = async (req, res) => {
  try {
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return res.json({ success: false, message: error.array()[0].msg });
    } else {
      let { email, password } = req.body;

      let user = await userModel.findOne({ email });

      let comparePass = await bcryptjs.compare(password, user.password);
      if (!comparePass) {
        return res.json({
          success: false,
          message: 'The password is not matchd',
        });
      } else {
        let token = await jsonwebtoken.sign(
          { id: user._id },
          process.env.SECRET_PASS_TOKEN,
          { expiresIn: '3d' }
        );
        res.cookie('token', token, {
          httpOnly: true,
          maxAge: 3 * 24 * 60 * 60 * 1000,
        });

        user.lastLogin = Date.now();
        await user.save();

        return res.json({
          success: true,
          message: 'Login successfully',
          user: {
            ...user._doc,
            password: undefined,
          },
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error });
  }
};
//////////////////////////////////////////////////////////////
let ForgetPassword = async (req, res) => {
  try {
    let { email } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    } else {
      let customeToken = crypto.randomBytes(30).toString('hex');
      let resetToken = Date.now() + 1 * 60 * 60 * 1000;
      user.resetPasswordWithTokent = customeToken;
      user.resetPasswordExpiresAt = resetToken;
      await user.save();
      await resetPassword(user.email, (port = 5173), customeToken);
      return res.json({
        success: true,
        message: 'Successfull message sending',
      });
    }
  } catch (error) {
    console.log(error);
  }
};
//////////////////////////////////////////////////////////////
let ResetPassword = async (req, res) => {
  try {
    let { password } = req.body;
    let token = req.params.token;
    let user = await userModel.findOne({
      resetPasswordWithTokent: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res.json({
        success: false,
        message: 'Token is not valid or expired',
      });
    } else {
      let hash = await bcryptjs.hash(password, 10);
      user.password = hash;
      user.resetPasswordExpiresAt = undefined;
      user.resetPasswordWithTokent = undefined;
      await user.save();
      changeSuccess(user.email);
      return res.json({
        success: true,
        message: 'Password changed succesfully',
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//////////////////////////////////////////////////////////////
let Logout = async (req, res) => {
  res.clearCookie('token');
  return res.json({ success: true, message: 'Logout successfully' });
};

module.exports = {
  Register,
  Login,
  ForgetPassword,
  verifyEmail,
  Logout,
  ResetPassword,
};
