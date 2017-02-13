var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const extRouter= require('./routes/extRouter');
const apiRouter = require('./routes/index');

var app = express();

// console debug trace
app.use((req, res, next) => {
    console.log('URL:', req.path);
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public', 'stylesheets')));
app.use(express.static(path.join(__dirname, 'public', 'javascripts')));
app.use(express.static(path.join(__dirname, 'build')));

app.get('/d/*', (req, res) => {
    console.log('HTML:', req.path);
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

const jsonParser = bodyParser.json();
app.use('/ext', jsonParser, extRouter);
app.use('/api', jsonParser, apiRouter); 

// app.get('*', (req, res) => {
//     console.log('HTML:', req.path);
//     res.sendFile(path.resolve(__dirname, '..', 'www', 'index.html'));
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
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
