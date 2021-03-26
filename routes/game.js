const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) => {
    res.render('game/game', { title: 'hello'});
  });





 
module.exports = router;