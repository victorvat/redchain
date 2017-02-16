var records = [
    { id: 1, username: 'mars', password: 'secret', displayName: 'Mars Garai', emails: [ { value: 'mars@redchain.com' } ] }
  , { id: 2, username: 'vic', password: '0', displayName: 'Viktor Ilin', emails: [ { value: 'vic@redchain.com' } ] }
  , { id: 3, username: 'vvg', password: '666', displayName: 'Victor Vat', emails: [ { value: 'vvg@redchain.com' } ] }
  // , { id: 4, username: 'test', password: 'qwert1', displayName: 'Test User', emails: [ { value: 'test@redchain.com' } ] }
];

function findById(id, cb) {
    var idx = id - 1;
    if (records[idx])
    {
	cb(null, records[idx]);
    } else {
	cb(new Error('User ' + id + ' does not exist'));
    }
}

function findByUsername(username, cb) {
    // console.log('findByUsername will search ' + username);
    for (var i = 0, len = records.length; i < len; i++) {
	var record = records[i];
	if (record.username === username) {
	    // console.log('findByUsername found ' + username);
            return cb(null, record);
	}
    }
    return cb(null, null);
}

function authenticate(username, password, cb) {
    console.log('AuthUser.authenticate', username, password);
    // database dummy - find user and verify password
    // console.log('authenticate will call findByUsername');
    findByUsername(username, function(err, user) {
	if (err) { return cb(err); }
	if (!user) { return cb(null, false); }
	if (user.password != password) { return cb(null, false); }
	return cb(null, user);
    });
}

function serializeUser(user, cb) {
  cb(null, user.id);
}

function deserializeUser(id, cb) {
    findById(
	id,
	function (err, user) {
	    if (err)
	    {
		return cb(err);
	    }
	    cb(null, user);
	}
    );
}

module.exports = {
   authenticate: authenticate,
   serializeUser: serializeUser,
   deserializeUser: deserializeUser
};
