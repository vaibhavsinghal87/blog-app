const jwt = require('jsonwebtoken');

const AuthMiddleware = (req, res, next) => {
  var token = req.headers['authorization'];
  if (!token) {
    return res.status(401).send({
      message: "Please login to continue"
    })
  } else {
    let jwt_secret = 'mysecret';
    try {
      var decoded = jwt.verify(token, jwt_secret);
      if (decoded) {
        req.user = decoded.data;
      } else {
        return res.status(401).send({
          message: "Please login to continue.",
          data: {}
        });
      }
    } catch (err) {
      return res.status(401).send({
        message: "Please login to continue.",
        data: {}
      })
    }
    next();
  }
}

module.exports = AuthMiddleware;