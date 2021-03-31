const express = require('express');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const User = require('../models/users');
var bcrypt = require("bcrypt");
const router = express.Router();
 
router.get('/', function (req, res) {
  res.render('index');
});

router.get('/signup', function (req, res) {
  res.render('sign-up');
});

router.post('/signup', asyncMiddleware( async (req, res, next) => {
  var { username, password } = req.body;
    await User.create({ username, password });
  res.redirect('/login')
}));

router.get('/login', function (req, res) {
  res.render('log-in');
});

router.post('/login', (req, res, next) => {
      User.findOne({
      username: req.body.username,
      }).then(function (user) {
        console.log(user)
      if (!user) {
        res.render("log-in", {
          message: "This user is not registered",
          messageClass: "light-danger",
        }); 
      } else {
        bcrypt.compare(
          req.body.password,
          user.password,
          function (err, result) {
            if (result == true) {
              req.session.user = user;
              res.redirect("/game");
            } else {
              res.render("log-in", {
                message: "incorrect password",
                messageClass: "light-danger",
              });
              
            }
          }
        );
      }
    })
    });
 
router.get('/logout', (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    res.clearCookie("user_sid");
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
});
 
// router.post('/token', (req, res, next) => {
//   res.status(200);
//   res.json({ 'status': 'ok' });
// });
 
module.exports = router;