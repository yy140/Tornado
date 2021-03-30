const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    res.render('indexUser', {name: req.session.user.username});
  } else {
    res.redirect('/login')
  }
});

router.get('/menu', (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
  res.render('game/gameIndex', {name: req.session.user.username});
  } else {
    res.redirect('/login');
  }
});

router.get('/1', (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
  res.render('game/game1');
 } else{
  res.redirect('/login');
 }
});

router.get('/2', (req, res, next) => {
if (req.session.user && req.cookies.user_sid) {
  res.render('game/game2');
} else {
  res.redirect('/login');
}
  });

  router.get('/3', (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
      res.render('game/game3');
    } else {
      res.redirect('/login');
    }
      });





 
module.exports = router;