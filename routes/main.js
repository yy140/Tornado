const express = require('express');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const User = require('../models/users');
 
const router = express.Router();
 
router.get('/', function (req, res) {
  res.render('index');
});

router.post('/signup', asyncMiddleware( async (req, res, next) => {
  var { username, password } = req.body;
    await User.create({ username, password });
  res.redirect('/game')
}));
 
// router.post('/login', (req, res, next) => {
//   res.status(200);
//   res.json({ 'status': 'ok' });
// });
 
// router.post('/logout', (req, res, next) => {
//   res.status(200);
//   res.json({ 'status': 'ok' });
// });
 
// router.post('/token', (req, res, next) => {
//   res.status(200);
//   res.json({ 'status': 'ok' });
// });
 
module.exports = router;