let jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
let decodeToken = async (req, res) => {
  try {
    let token = req?.headers?.cookie?.split('=')[1];
    if (!token) {
      return res.json({ success: false, message: 'Token not found' });
    } else {
      let decode = jwt.verify(token, process.env.SECRET_PASS_TOKEN);
      if (!decode) {
        return res.json({ success: false, message: 'Invalid token' });
      } else {
        let user = await userModel.findById(decode.id);
        if (!user) {
          return res
            .cookie('token', '', { maxAge: 0 })
            .json({ success: false, message: 'User not found' });
        } else {
          return res.json({ success: true, user });
        }
      }
    }
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: err.message });
  }
};
module.exports = decodeToken;
