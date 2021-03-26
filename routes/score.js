var express = require('express');
var asyncMiddleware = require('../middleware/asyncMiddleware');
var UserModel = require('../models/users');
 
var router = express.Router();
 
router.post('/submit-score', asyncMiddleware(async (req, res, next) => {
  var { username, score } = req.body;
  await UserModel.updateOne({ username }, { highScore: score });
  res.status(200).json({ status: 'ok' });
}));
 
router.get('/scores', asyncMiddleware(async (req, res, next) => {
  var users = await UserModel.find({}, 'name highScore -_id').sort({ highScore: -1}).limit(10);
  res.status(200).json(users);
}));
 
module.exports = router;