var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://user:passwd@localhost:5432/redchain';
var db = pgp(connectionString);
   
function getAll_docSpec(req, res, next) {
  db.any('select * from docSpec')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL from docSpec'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingle_docSpec(req, res, next) {
  var pupID = parseInt(req.params.id);
  db.one('select * from docSpec where id = $1', pupID)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE docSpec'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function create_docSpec(req, res, next) {
  req.body.age = parseInt(req.body.age);
  db.none('insert into pups(name, breed, age, sex)' +
      'values(${name}, ${breed}, ${age}, ${sex})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one docSpec'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function update_docSpec(req, res, next) {
  db.none('update docSpec set name=$1, breed=$2, age=$3, sex=$4 where id=$5',
    req.body.name, req.body.breed, parseInt(req.body.age),
      req.body.sex, parseInt(req.params.id))
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated docSpec'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function remove_docSpec(req, res, next) {
  var pupID = parseInt(req.params.id);
  db.result('delete from docSpec where id = $1', pupID)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} docSpec`
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}

   
function getAll_doc(req, res, next) {
  db.any('select * from doc')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL from doc'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingle_doc(req, res, next) {
  var pupID = parseInt(req.params.id);
  db.one('select * from doc where id = $1', pupID)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE doc'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function create_doc(req, res, next) {
  req.body.age = parseInt(req.body.age);
  db.none('insert into pups(name, breed, age, sex)' +
      'values(${name}, ${breed}, ${age}, ${sex})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one doc'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function update_doc(req, res, next) {
  db.none('update doc set name=$1, breed=$2, age=$3, sex=$4 where id=$5',
    req.body.name, req.body.breed, parseInt(req.body.age),
      req.body.sex, parseInt(req.params.id))
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated doc'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function remove_doc(req, res, next) {
  var pupID = parseInt(req.params.id);
  db.result('delete from doc where id = $1', pupID)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} doc`
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}

   
function getAll_State(req, res, next) {
  db.any('select * from State')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL from State'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingle_State(req, res, next) {
  var pupID = parseInt(req.params.id);
  db.one('select * from State where id = $1', pupID)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE State'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function create_State(req, res, next) {
  req.body.age = parseInt(req.body.age);
  db.none('insert into pups(name, breed, age, sex)' +
      'values(${name}, ${breed}, ${age}, ${sex})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one State'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function update_State(req, res, next) {
  db.none('update State set name=$1, breed=$2, age=$3, sex=$4 where id=$5',
    req.body.name, req.body.breed, parseInt(req.body.age),
      req.body.sex, parseInt(req.params.id))
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated State'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function remove_State(req, res, next) {
  var pupID = parseInt(req.params.id);
  db.result('delete from State where id = $1', pupID)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} State`
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}

   
function getAll_person(req, res, next) {
  db.any('select * from person')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL from person'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingle_person(req, res, next) {
  var pupID = parseInt(req.params.id);
  db.one('select * from person where id = $1', pupID)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE person'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function create_person(req, res, next) {
  req.body.age = parseInt(req.body.age);
  db.none('insert into pups(name, breed, age, sex)' +
      'values(${name}, ${breed}, ${age}, ${sex})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one person'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function update_person(req, res, next) {
  db.none('update person set name=$1, breed=$2, age=$3, sex=$4 where id=$5',
    req.body.name, req.body.breed, parseInt(req.body.age),
      req.body.sex, parseInt(req.params.id))
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated person'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function remove_person(req, res, next) {
  var pupID = parseInt(req.params.id);
  db.result('delete from person where id = $1', pupID)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} person`
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}

   
function getAll_photoData(req, res, next) {
  db.any('select * from photoData')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL from photoData'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingle_photoData(req, res, next) {
  var pupID = parseInt(req.params.id);
  db.one('select * from photoData where id = $1', pupID)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE photoData'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function create_photoData(req, res, next) {
  req.body.age = parseInt(req.body.age);
  db.none('insert into pups(name, breed, age, sex)' +
      'values(${name}, ${breed}, ${age}, ${sex})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one photoData'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function update_photoData(req, res, next) {
  db.none('update photoData set name=$1, breed=$2, age=$3, sex=$4 where id=$5',
    req.body.name, req.body.breed, parseInt(req.body.age),
      req.body.sex, parseInt(req.params.id))
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated photoData'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function remove_photoData(req, res, next) {
  var pupID = parseInt(req.params.id);
  db.result('delete from photoData where id = $1', pupID)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} photoData`
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}

   
function getAll_photoSpec(req, res, next) {
  db.any('select * from photoSpec')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL from photoSpec'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingle_photoSpec(req, res, next) {
  var pupID = parseInt(req.params.id);
  db.one('select * from photoSpec where id = $1', pupID)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE photoSpec'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function create_photoSpec(req, res, next) {
  req.body.age = parseInt(req.body.age);
  db.none('insert into pups(name, breed, age, sex)' +
      'values(${name}, ${breed}, ${age}, ${sex})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one photoSpec'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function update_photoSpec(req, res, next) {
  db.none('update photoSpec set name=$1, breed=$2, age=$3, sex=$4 where id=$5',
    req.body.name, req.body.breed, parseInt(req.body.age),
      req.body.sex, parseInt(req.params.id))
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated photoSpec'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function remove_photoSpec(req, res, next) {
  var pupID = parseInt(req.params.id);
  db.result('delete from photoSpec where id = $1', pupID)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} photoSpec`
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}

   
function getAll_audioDatа(req, res, next) {
  db.any('select * from audioDatа')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL from audioDatа'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingle_audioDatа(req, res, next) {
  var pupID = parseInt(req.params.id);
  db.one('select * from audioDatа where id = $1', pupID)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE audioDatа'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function create_audioDatа(req, res, next) {
  req.body.age = parseInt(req.body.age);
  db.none('insert into pups(name, breed, age, sex)' +
      'values(${name}, ${breed}, ${age}, ${sex})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one audioDatа'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function update_audioDatа(req, res, next) {
  db.none('update audioDatа set name=$1, breed=$2, age=$3, sex=$4 where id=$5',
    req.body.name, req.body.breed, parseInt(req.body.age),
      req.body.sex, parseInt(req.params.id))
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated audioDatа'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function remove_audioDatа(req, res, next) {
  var pupID = parseInt(req.params.id);
  db.result('delete from audioDatа where id = $1', pupID)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} audioDatа`
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}

   
function getAll_operator(req, res, next) {
  db.any('select * from operator')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL from operator'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingle_operator(req, res, next) {
  var pupID = parseInt(req.params.id);
  db.one('select * from operator where id = $1', pupID)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE operator'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function create_operator(req, res, next) {
  req.body.age = parseInt(req.body.age);
  db.none('insert into pups(name, breed, age, sex)' +
      'values(${name}, ${breed}, ${age}, ${sex})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one operator'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function update_operator(req, res, next) {
  db.none('update operator set name=$1, breed=$2, age=$3, sex=$4 where id=$5',
    req.body.name, req.body.breed, parseInt(req.body.age),
      req.body.sex, parseInt(req.params.id))
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated operator'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function remove_operator(req, res, next) {
  var pupID = parseInt(req.params.id);
  db.result('delete from operator where id = $1', pupID)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} operator`
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}

   
function getAll_regPoint(req, res, next) {
  db.any('select * from regPoint')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL from regPoint'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingle_regPoint(req, res, next) {
  var pupID = parseInt(req.params.id);
  db.one('select * from regPoint where id = $1', pupID)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE regPoint'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function create_regPoint(req, res, next) {
  req.body.age = parseInt(req.body.age);
  db.none('insert into pups(name, breed, age, sex)' +
      'values(${name}, ${breed}, ${age}, ${sex})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one regPoint'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function update_regPoint(req, res, next) {
  db.none('update regPoint set name=$1, breed=$2, age=$3, sex=$4 where id=$5',
    req.body.name, req.body.breed, parseInt(req.body.age),
      req.body.sex, parseInt(req.params.id))
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated regPoint'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function remove_regPoint(req, res, next) {
  var pupID = parseInt(req.params.id);
  db.result('delete from regPoint where id = $1', pupID)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} regPoint`
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}

   
function getAll_opRule(req, res, next) {
  db.any('select * from opRule')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL from opRule'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingle_opRule(req, res, next) {
  var pupID = parseInt(req.params.id);
  db.one('select * from opRule where id = $1', pupID)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE opRule'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function create_opRule(req, res, next) {
  req.body.age = parseInt(req.body.age);
  db.none('insert into pups(name, breed, age, sex)' +
      'values(${name}, ${breed}, ${age}, ${sex})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one opRule'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function update_opRule(req, res, next) {
  db.none('update opRule set name=$1, breed=$2, age=$3, sex=$4 where id=$5',
    req.body.name, req.body.breed, parseInt(req.body.age),
      req.body.sex, parseInt(req.params.id))
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated opRule'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function remove_opRule(req, res, next) {
  var pupID = parseInt(req.params.id);
  db.result('delete from opRule where id = $1', pupID)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} opRule`
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}

   
function getAll_Contact(req, res, next) {
  db.any('select * from Contact')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL from Contact'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingle_Contact(req, res, next) {
  var pupID = parseInt(req.params.id);
  db.one('select * from Contact where id = $1', pupID)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE Contact'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function create_Contact(req, res, next) {
  req.body.age = parseInt(req.body.age);
  db.none('insert into pups(name, breed, age, sex)' +
      'values(${name}, ${breed}, ${age}, ${sex})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one Contact'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function update_Contact(req, res, next) {
  db.none('update Contact set name=$1, breed=$2, age=$3, sex=$4 where id=$5',
    req.body.name, req.body.breed, parseInt(req.body.age),
      req.body.sex, parseInt(req.params.id))
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated Contact'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function remove_Contact(req, res, next) {
  var pupID = parseInt(req.params.id);
  db.result('delete from Contact where id = $1', pupID)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} Contact`
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}

   
function getAll_Agent(req, res, next) {
  db.any('select * from Agent')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL from Agent'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingle_Agent(req, res, next) {
  var pupID = parseInt(req.params.id);
  db.one('select * from Agent where id = $1', pupID)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE Agent'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function create_Agent(req, res, next) {
  req.body.age = parseInt(req.body.age);
  db.none('insert into pups(name, breed, age, sex)' +
      'values(${name}, ${breed}, ${age}, ${sex})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one Agent'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function update_Agent(req, res, next) {
  db.none('update Agent set name=$1, breed=$2, age=$3, sex=$4 where id=$5',
    req.body.name, req.body.breed, parseInt(req.body.age),
      req.body.sex, parseInt(req.params.id))
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated Agent'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function remove_Agent(req, res, next) {
  var pupID = parseInt(req.params.id);
  db.result('delete from Agent where id = $1', pupID)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} Agent`
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}

   
function getAll_access(req, res, next) {
  db.any('select * from access')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL from access'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingle_access(req, res, next) {
  var pupID = parseInt(req.params.id);
  db.one('select * from access where id = $1', pupID)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE access'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function create_access(req, res, next) {
  req.body.age = parseInt(req.body.age);
  db.none('insert into pups(name, breed, age, sex)' +
      'values(${name}, ${breed}, ${age}, ${sex})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one access'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function update_access(req, res, next) {
  db.none('update access set name=$1, breed=$2, age=$3, sex=$4 where id=$5',
    req.body.name, req.body.breed, parseInt(req.body.age),
      req.body.sex, parseInt(req.params.id))
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated access'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function remove_access(req, res, next) {
  var pupID = parseInt(req.params.id);
  db.result('delete from access where id = $1', pupID)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} access`
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}

   
function getAll_docImage(req, res, next) {
  db.any('select * from docImage')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL from docImage'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingle_docImage(req, res, next) {
  var pupID = parseInt(req.params.id);
  db.one('select * from docImage where id = $1', pupID)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE docImage'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function create_docImage(req, res, next) {
  req.body.age = parseInt(req.body.age);
  db.none('insert into pups(name, breed, age, sex)' +
      'values(${name}, ${breed}, ${age}, ${sex})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one docImage'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function update_docImage(req, res, next) {
  db.none('update docImage set name=$1, breed=$2, age=$3, sex=$4 where id=$5',
    req.body.name, req.body.breed, parseInt(req.body.age),
      req.body.sex, parseInt(req.params.id))
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated docImage'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function remove_docImage(req, res, next) {
  var pupID = parseInt(req.params.id);
  db.result('delete from docImage where id = $1', pupID)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} docImage`
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}

   
function getAll_ref(req, res, next) {
  db.any('select * from ref')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL from ref'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingle_ref(req, res, next) {
  var pupID = parseInt(req.params.id);
  db.one('select * from ref where id = $1', pupID)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE ref'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function create_ref(req, res, next) {
  req.body.age = parseInt(req.body.age);
  db.none('insert into pups(name, breed, age, sex)' +
      'values(${name}, ${breed}, ${age}, ${sex})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one ref'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function update_ref(req, res, next) {
  db.none('update ref set name=$1, breed=$2, age=$3, sex=$4 where id=$5',
    req.body.name, req.body.breed, parseInt(req.body.age),
      req.body.sex, parseInt(req.params.id))
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated ref'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function remove_ref(req, res, next) {
  var pupID = parseInt(req.params.id);
  db.result('delete from ref where id = $1', pupID)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} ref`
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {  getAll_docSpec: getAll_docSpec,
  getSingle_docSpec: getSingle_docSpec,
  create_docSpec: create_docSpec,
  update_docSpec: update_docSpec,
  remove_docSpec: remove_docSpec,

  getAll_doc: getAll_doc,
  getSingle_doc: getSingle_doc,
  create_doc: create_doc,
  update_doc: update_doc,
  remove_doc: remove_doc,

  getAll_State: getAll_State,
  getSingle_State: getSingle_State,
  create_State: create_State,
  update_State: update_State,
  remove_State: remove_State,

  getAll_person: getAll_person,
  getSingle_person: getSingle_person,
  create_person: create_person,
  update_person: update_person,
  remove_person: remove_person,

  getAll_photoData: getAll_photoData,
  getSingle_photoData: getSingle_photoData,
  create_photoData: create_photoData,
  update_photoData: update_photoData,
  remove_photoData: remove_photoData,

  getAll_photoSpec: getAll_photoSpec,
  getSingle_photoSpec: getSingle_photoSpec,
  create_photoSpec: create_photoSpec,
  update_photoSpec: update_photoSpec,
  remove_photoSpec: remove_photoSpec,

  getAll_audioDatа: getAll_audioDatа,
  getSingle_audioDatа: getSingle_audioDatа,
  create_audioDatа: create_audioDatа,
  update_audioDatа: update_audioDatа,
  remove_audioDatа: remove_audioDatа,

  getAll_operator: getAll_operator,
  getSingle_operator: getSingle_operator,
  create_operator: create_operator,
  update_operator: update_operator,
  remove_operator: remove_operator,

  getAll_regPoint: getAll_regPoint,
  getSingle_regPoint: getSingle_regPoint,
  create_regPoint: create_regPoint,
  update_regPoint: update_regPoint,
  remove_regPoint: remove_regPoint,

  getAll_opRule: getAll_opRule,
  getSingle_opRule: getSingle_opRule,
  create_opRule: create_opRule,
  update_opRule: update_opRule,
  remove_opRule: remove_opRule,

  getAll_Contact: getAll_Contact,
  getSingle_Contact: getSingle_Contact,
  create_Contact: create_Contact,
  update_Contact: update_Contact,
  remove_Contact: remove_Contact,

  getAll_Agent: getAll_Agent,
  getSingle_Agent: getSingle_Agent,
  create_Agent: create_Agent,
  update_Agent: update_Agent,
  remove_Agent: remove_Agent,

  getAll_access: getAll_access,
  getSingle_access: getSingle_access,
  create_access: create_access,
  update_access: update_access,
  remove_access: remove_access,

  getAll_docImage: getAll_docImage,
  getSingle_docImage: getSingle_docImage,
  create_docImage: create_docImage,
  update_docImage: update_docImage,
  remove_docImage: remove_docImage,

  getAll_ref: getAll_ref,
  getSingle_ref: getSingle_ref,
  create_ref: create_ref,
  update_ref: update_ref,
  remove_ref: remove_ref
};
