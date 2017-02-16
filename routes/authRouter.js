var express = require('express');
var router = express.Router();
var passport = require('passport');
var authUser = require('../models/authUser');
var verifyUser = require('../server/verifyUser');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.get('/login',
  (req, res, next) => {
		console.log('The login page should be /login');
		res.redirect('/login');
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

router.post('/login', 
  (req, res, next) => {
		console.log('>>> passport.authenticate');
    passport.authenticate('local',
			(err, user, info) => {
				///// >>> 1
				if (err) {
				  console.log('Error when authenticate', err);
				  return next(err);
				}
				if (!user) {
				  console.log('Missing user when authenticate', info);
				  return res.status(401).json({
					  err: {message: info}
				  });
				}
				req.logIn(user, function(err) {
					if (err) {
						console.log('err is ' + err);
						return res.status(500).json({
							err: {message:'Could not log in user'}
						});
					}
				
					var token = verifyUser.getToken(user);
					res.status(200).json({
						status: 'Login successful!',
						success: true,
						token: token
					});
	      });
				///// <<< 1
	    }
		)(req,res,next);
		console.log('<<< passport.authenticate');
  }
);

function doLogout(req, res) {
    req.logout();
    res.status(200).json({
	  status: 'Bye!'
    });
}

router.use('/logout',
    function(req, res) {
		doLogout(req, res);
    }
)

module.exports = router;
