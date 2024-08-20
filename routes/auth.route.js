let express = require('express');
const registerValidator = require('../helper/validation');
const {
  Register,
  verifyEmail,
  Login,
  ForgetPassword,
  ResetPassword,
  Logout,
} = require('../controllers/auth.controller');
const loginValidator = require('../helper/loginValidation');

let router = express.Router();
router.post('/register', registerValidator(), Register);
router.post('/verify-email', verifyEmail);
router.post('/login', loginValidator(), Login);
router.post('/forget-password', ForgetPassword);
router.post('/reset-password/:token', ResetPassword);
router.post('/logout', Logout);

module.exports = router;
