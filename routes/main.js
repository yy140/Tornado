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
  console.log(req.body.username)
      User.findOne({
      username: req.body.username,
      }).then(function (user) {
        console.log(user)
      if (!user) {
        res.render("index"); 
      } else {
        bcrypt.compare(
          req.body.password,
          user.password,
          function (err, result) {
            if (result == true) {
              req.session.user = user;
              console.log(user.password)
              res.redirect("/game");
            } else {
              console.log(user.password)
              res.render("index");
            }
          }
        );
      }
    })
    });
 
// router.post('/logout', (req, res, next) => {
//   res.status(200);
//   res.json({ 'status': 'ok' });
// });
 
// router.post('/token', (req, res, next) => {
//   res.status(200);
//   res.json({ 'status': 'ok' });
// });
 
module.exports = router;