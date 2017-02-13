var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const passport = require('passport');
const Strategy = require('passport-local');
const authUser = require('./models/authUser');
const authRouter = require('./routes/authRouter');

// const extRouter= require('./routes/extRouter');
const apiRouter = require('./routes/index');

var app = express();

// console debug trace
if (app.get('env') === 'development') {
    app.use((req, res, next) => {
	console.log('URL:', req.path);
	next();
    });
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// Configure view engine to render EJS templates.
// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public', 'stylesheets')));
app.use(express.static(path.join(__dirname, 'public', 'javascripts')));
app.use(express.static(path.join(__dirname, 'build')));

app.use(passport.initialize());
passport.use(new Strategy(
    function(username, password, done) {
	// console.log('passport will call authUser.authenticate');
	authUser.authenticate(username, password, done);
    }
));
passport.serializeUser(
    function(user, cb) {
	// console.log('passport will call authUser.serializeUser');
	authUser.serializeUser(user, cb);
    }
);
passport.deserializeUser(
    function(id, cb) {
	// console.log('passport will call deserializeUser');
	authUser.deserializeUser(id, cb);
    }
);

//const jsonParser = bodyParser.json();
// app.use('/ext', jsonParser, extRouter);

verifyUser = require('./verifyUser');

app.use('/api', verifyUser.verifyOrdinaryUser, apiRouter,
	function (req, res, next) {
	    // console.log('res is ' + res);
	    // console.log('decoded is ' + req.decoded);
	    // console.log('decoded.id is ' + req.decoded.id);
	    // console.log('decoded.username is ' + req.decoded.username);
	    authUser.deserializeUser(
		req.decoded.id,
		function(err, user){
		    var newToken = verifyUser.getToken(user);
		    // console.log('new token is ' + newToken);
		    req.dbAnswer['nexttoken'] = newToken;
		}
	    );
	    res.status(200).json(req.dbAnswer);
	});
app.use('/users', authRouter);
	
// app.get('*', (req, res) => {
//     console.log('HTML:', req.path);
//     res.sendFile(path.resolve(__dirname, '..', 'www', 'index.html'));
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('path ' + req.path + ' not found at the server');
    err.status = 404;
    err.code = 404;
    
    next(err);
});

// error handlers

/// app.use(function(err, req, res, next) {
///   // set locals, only providing error in development
///   res.locals.message = err.message;
///   res.locals.error = req.app.get('env') === 'development' ? err : {};
/// 
///   // render the error page
///   res.status(err.status || 500);
///   res.render('error');
/// });

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
	// res.locals.message = err.message;
	// res.locals.error = req.app.get('env') === 'development' ? err : {};
	
	res.status( err.code || 500 )
	    .json({
		status: 'error',
		message: err.message,
		stack: err.stack
	    });
	
	// res.status(err.status || 500);
	// res.render('error');
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  .json({
    status: 'error',
    message: err.message
  });
});

module.exports = app;
