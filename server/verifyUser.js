var authUser = require('../models/authUser');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var config = require('./config');
var secretKey = config.security.secretKey;
var configExpiresIn = parseInt(config.security.expiresIn);

// console.log('configExpiresIn is ' + configExpiresIn);

exports.getToken = function (user) {
    // console.log('getToken has user = ' + user);
    var newToken = jwt.sign(user,
			    secretKey,
			    {
				expiresIn: configExpiresIn // 300 // expiresIn /* 3600 */
			    });
    // jwt.verify(newToken, secretKey,
    // 	       function (err, decoded) {
    // 		   var today = new Date();
    // 		   console.log('Verify: Current is ' + today + ' UTC=' + today.getTime());
    // 		   if(decoded) {
    // 		       if(decoded.iat){
    // 			   var iat = new Date(1000*decoded.iat);
    // 			   console.log('Verify: Issued at ' + iat + ' UTC=' + decoded.iat + "000");
    // 		       }
    // 		       if(decoded.exp){
    // 			   var exp = new Date(1000*decoded.exp);
    // 			   console.log('Verify: Expired at ' + exp + ' UTC=' + decoded.exp + "000");
    // 		       }
    // 		   }
    // 		   if (err) {
    // 		       console.log('Verify: ' + err.name + ' ' + err.message);
    // 		   } else {
    // 		       console.log('Verify: User ' + decoded.username + ' is authenticated');
    // 		   }
    //            });
    return newToken;
};

exports.verifyOrdinaryUser = function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
	// console.log('Found token ' + token);
        // verifies secret and checks exp
	jwt.verify(token, secretKey, function (err, decoded) {
            if (err) {
                // var err = new Error('You are not authenticated!');
                // err.status = 401;
		// var today = new Date();
		// console.log('Current is ' + today + ' UTC=' + today.getTime());
		// if(decoded) {
		//     if(decoded.iat){
		// 	var iat = new Date(1000*decoded.iat);
		// 	console.log('Issued at ' + iat + ' UTC=' + decoded.iat + "000");
		//     }
		//     if(decoded.exp){
		// 	var exp = new Date(1000*decoded.exp);
		// 	console.log('Expired at ' + exp + ' UTC=' + decoded.exp + "000");
		//     }
		// }
		console.log(err.name + ' ' + err.message);
		console.log('User is not authenticated');
		res.redirect('/users/login');
                // return next(err);
            } else {
                // if everything is good, save to request for use in other routes
		// console.log(decoded);
		///////////////////////////////////////////////////////
		// We should to ensure that user exists in database !!
		///////////////////////////////////////////////////////
		var userExists = true;
		authUser.deserializeUser(
		    decoded.id,
		    function(err, user){
			if(err)
			{
			    userExists = false;
			    next(err);
			}
		    });
		if(userExists)
		{
		    console.log('User ' + decoded.username + ' is authenticated');
                    req.decoded = decoded;
                    next();
		}
            }
        });
    } else {
        // if there is no token
        // return an error
        // var err = new Error('No token provided!');
        // err.status = 403;
	// err.code = 403;
	console.log('User did not provide token');
	res.redirect('/users/login');
        // return next(err);
    }
};
