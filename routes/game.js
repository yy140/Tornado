const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) => {
    res.render('game/gameIndex');
});
  router.get('/1', (req, res, next) => {
    res.render('game/game1');
  });
  router.get('/2', (req, res, next) => {
    res.render('game/game2');
  });





 
module.exports = router;