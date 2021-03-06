require('dotenv').config();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var exphbs = require('express-handlebars');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var session = require('express-session');
var mongoose = require('mongoose');

// setup mongo connection
const uri = process.env.MONGO_CONNECTION_URI;
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
mongoose.connection.on('error', (error) => {
  console.log(error);
  process.exit(1);
});
mongoose.connection.on('connected', function () {
  console.log('connected to mongo');
});



app.engine('handlebars', exphbs());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');



var router = require('./routes/main');
var scoreRouter = require('./routes/score');
var gameRouter = require('./routes/game')



app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname + '/public')));
app.use(morgan('dev'));
app.use(cookieParser());

app.use(session({
  key: 'user_sid',
  secret: 'secrets',
  resave: false,
  saveUninitialized: false,
  cookie: {
      expires: 600000
  }
}));

app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
      res.clearCookie('user_sid');        
  }
  next();
});

var sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    next();
  } else {
    res.redirect('/');
  }    
};


//set up routes
app.use('/', router);
app.use('/score', sessionChecker, scoreRouter);
app.use('/game', sessionChecker, gameRouter);

// catch all other routes
app.use((req, res, next) => {
  res.status(404);
  res.json({ message: '404 - Not Found' });
});
 
// handle errors
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error : err });
});



io.on('connection', function (socket) {
  console.log('a user connected');
  
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});

app.listen(process.env.PORT || 8081, () => {
  console.log(`Server started on port ${process.env.PORT || 8081}`);
});