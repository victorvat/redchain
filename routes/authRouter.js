var express = require('express');
var router = express.Router();
var passport = require('passport');
var authUser = require('../models/authUser');
var verifyUser  = require('../server/verifyUser');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.get(
    '/login',
    function(req, res, next){
	console.log('The login page should be here');
	// res.render('login');
	res.send('Please, send username and password!');
    }
);

router.post('/register', function(req, res) {
    return res.status(500).json({err: 'Not realized yet'});
//    authUser.register(new authUser({ username : req.body.username }),
//      req.body.password, function(err, user) {
//        if (err) {
//            return res.status(500).json({err: err});
//        }
//        passport.authenticate('local')(req, res, function () {
//            return res.status(200).json({status: 'Registration Successful!'});
//        });
//    });
});

router.post('/login', function(req, res, next) {
    passport.authenticate(
	'local',
	function(err, user, info) {
	    if (err) {
		console.log('Error when authenticate');
		return next(err);
	    }
	    if (!user) {
		console.log('Missing user when authenticate');
		return res.status(401).json({
		    err: info
		});
	    }
	    req.logIn(user, function(err) {
		if (err) {
		    console.log('err is ' + err);
		    return res.status(500).json({
			err: 'Could not log in user'
		    });
		}
		
		var token = verifyUser.getToken(user);
		res.status(200).json({
		    status: 'Login successful!',
		    success: true,
		    token: token
		});
	    });
	})(req,res,next);
});

function doLogout(req, res) {
    req.logout();
    res.status(200).json({
	status: 'Bye!'
    });
}

router.get(
    '/logout',
    function(req, res) {
	doLogout(req, res);
    }
);

router.post(
    '/logout',
    function(req, res) {
	doLogout(req, res);
    }
);

module.exports = router;
