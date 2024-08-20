const { Origins } = require('../corsConfig/Origin');

let withCredentials = (req, res, next) => {
  let origin = req.headers.origin;
  if (Origins.includes(origin)) {
    res.header('Access-Control-Allow-Credentials', true);
  }
  next();
};
module.exports = withCredentials;
