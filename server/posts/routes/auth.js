var express = require('express');
var router = express.Router();
const AuthModel = require("../models/auth");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// user registration
router.post("/register", async (req, res) => {
  try {
    const newUser = new AuthModel({
      ...req.body
    });
    let userData = await newUser.save();
    return res.status(200).send({
      message: 'Registration successfull',
      data: userData
    });
  } catch (err) {
    return res.status(400).send({
      status: 400,
      message: err.message,
    });
  }
});


router.post("/login", async (req, res) => {
  try {
    const user = await AuthModel.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        // create a jwt token
        let token = jwt.sign({
          data: user
        }, 'mysecret', { expiresIn: '1h' });
        return res.status(200).send({
          message: 'Login successfull',
          data: user,
          token: token
        });
      } else {
        return res.status(400).send({
          message: 'Incorrect credentials',
          data: {}
        });
      }
    } else {
      return res.status(400).send({
        message: 'User not registered',
        data: user
      });
    }
  } catch (err) {
    return res.status(400).send({
      status: 400,
      message: err.message,
    });
  }
});

module.exports = router;