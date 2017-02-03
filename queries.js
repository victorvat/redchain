var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var fs = require('fs');
var ini = require('ini');
var config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'))
var connectionString = config.database.connectionString;
var db = pgp(connectionString);

function makeWhere(whereStr)
{
   if(whereStr)
   {
      whereStr += "AND ";
   } else {
      whereStr = "WHERE ";
   }
   return whereStr;
}

// ---------------------------------------------------------
//  The function retrieves ALL data from docSpec
//  Be carefully !!
//  URL : GET /docSpec/all
//  BODY: without BODY !!!
// ---------------------------------------------------------
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

// ---------------------------------------------------------
//  The function retrieves data from docSpec via primary key
//  URL : GET /docSpec/one/?cSpec=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getSingle_docSpec(req, res, next) {
    var errStr = '';
    if(!req.query.cSpec)
        errStr += 'cSpec undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.one('select * from docSpec where cSpec = $1',req.query.cSpec)
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

// ---------------------------------------------------------
//  The function retrieves data from docSpec using WHERE clause
//  URL : GET /docSpec/any/?spec=...&spec_en=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getWhere_docSpec(req, res, next) {
   var whereStr = '';
   if(req.query.spec)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " spec LIKE '%" + req.query.spec.trim() + "%'";
   }
   if(req.query.spec_en)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " spec_en LIKE '%" + req.query.spec_en.trim() + "%'";
   }
    if(whereStr.length==0)
    {
        next(new Error("No any predicates!"));
        return;
    }
    db.one('select * from docSpec ' + whereStr)
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

// ---------------------------------------------------------
//  The function insert data into docSpec
//  URL : POST /docSpec
//  BODY:spec=...&spec_en=...
// ---------------------------------------------------------
function create_docSpec(req, res, next) {
    db.one('insert into docSpec(spec,spec_en)' +
            'values(${spec},${spec_en}) returning cSpec',
             req.body)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Inserted one docSpec'
                });
        })
        .catch(function (err) {
            return next(err);
    });
}

// ---------------------------------------------------------
//  The function update data in docSpec
//  URL : PUT /docSpec
//  BODY: cSpec=...&spec=...&spec_en=...
// ---------------------------------------------------------
function update_docSpec(req, res, next) {
    var errStr = '';
    if(!req.body.cSpec)
        errStr += 'cSpec undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('update docSpec set spec=${spec}, spec_en=${spec_en} where cSpec=${cSpec}',
             req.body)
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

// ---------------------------------------------------------
//  The function deletes data from docSpec
//  URL : DELETE /docSpec/
//  BODY: cSpec=...
// ---------------------------------------------------------
function remove_docSpec(req, res, next) {
    var errStr = '';
    if(!req.body.cSpec)
        errStr += 'cSpec undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.result('delete from docSpec where cSpec = $1',req.body.cSpec)
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


// ---------------------------------------------------------
//  The function retrieves ALL data from doc
//  Be carefully !!
//  URL : GET /doc/all
//  BODY: without BODY !!!
// ---------------------------------------------------------
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

// ---------------------------------------------------------
//  The function retrieves data from doc via primary key
//  URL : GET /doc/one/?cDoc=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getSingle_doc(req, res, next) {
    var errStr = '';
    if(!req.query.cDoc)
        errStr += 'cDoc undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.one('select * from doc where cDoc = $1',req.query.cDoc)
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

// ---------------------------------------------------------
//  The function retrieves data from doc using WHERE clause
//  URL : GET /doc/any/?cSpec=...&pId=...&cState=...&docN=...&docDate=...&docEnd=...&docAuth=...&Memo=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getWhere_doc(req, res, next) {
   var whereStr = '';
   if(req.query.cSpec)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " cSpec = " + req.query.cSpec.trim();
   }
   if(req.query.pId)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " pId = " + req.query.pId.trim();
   }
   if(req.query.cState)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " cState = " + req.query.cState.trim();
   }
   if(req.query.docN)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " docN LIKE '%" + req.query.docN.trim() + "%'";
   }
   if(req.query.docDate)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " docDate = '" + req.query.docDate.trim() + "'";
   }
   if(req.query.docEnd)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " docEnd = '" + req.query.docEnd.trim() + "'";
   }
   if(req.query.docAuth)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " docAuth LIKE '%" + req.query.docAuth.trim() + "%'";
   }
   if(req.query.Memo)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " Memo = " + req.query.Memo.trim();
   }
    if(whereStr.length==0)
    {
        next(new Error("No any predicates!"));
        return;
    }
    db.one('select * from doc ' + whereStr)
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

// ---------------------------------------------------------
//  The function insert data into doc
//  URL : POST /doc
//  BODY:cSpec=...&pId=...&cState=...&docN=...&docDate=...&docEnd=...&docAuth=...&Memo=...
// ---------------------------------------------------------
function create_doc(req, res, next) {
    db.one('insert into doc(cSpec,pId,cState,docN,docDate,docEnd,docAuth,Memo)' +
            'values(${cSpec},${pId},${cState},${docN},${docDate},${docEnd},${docAuth},${Memo}) returning cDoc',
             req.body)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Inserted one doc'
                });
        })
        .catch(function (err) {
            return next(err);
    });
}

// ---------------------------------------------------------
//  The function update data in doc
//  URL : PUT /doc
//  BODY: cDoc=...&cSpec=...&pId=...&cState=...&docN=...&docDate=...&docEnd=...&docAuth=...&Memo=...
// ---------------------------------------------------------
function update_doc(req, res, next) {
    var errStr = '';
    if(!req.body.cDoc)
        errStr += 'cDoc undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('update doc set cSpec=${cSpec}, pId=${pId}, cState=${cState}, docN=${docN}, docDate=${docDate}, docEnd=${docEnd}, docAuth=${docAuth}, Memo=${Memo} where cDoc=${cDoc}',
             req.body)
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

// ---------------------------------------------------------
//  The function deletes data from doc
//  URL : DELETE /doc/
//  BODY: cDoc=...
// ---------------------------------------------------------
function remove_doc(req, res, next) {
    var errStr = '';
    if(!req.body.cDoc)
        errStr += 'cDoc undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.result('delete from doc where cDoc = $1',req.body.cDoc)
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


// ---------------------------------------------------------
//  The function retrieves ALL data from State
//  Be carefully !!
//  URL : GET /State/all
//  BODY: without BODY !!!
// ---------------------------------------------------------
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

// ---------------------------------------------------------
//  The function retrieves data from State via primary key
//  URL : GET /State/one/?cState=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getSingle_State(req, res, next) {
    var errStr = '';
    if(!req.query.cState)
        errStr += 'cState undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.one('select * from State where cState = $1',req.query.cState)
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

// ---------------------------------------------------------
//  The function retrieves data from State using WHERE clause
//  URL : GET /State/any/?State=...&State_en=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getWhere_State(req, res, next) {
   var whereStr = '';
   if(req.query.State)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " State LIKE '%" + req.query.State.trim() + "%'";
   }
   if(req.query.State_en)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " State_en LIKE '%" + req.query.State_en.trim() + "%'";
   }
    if(whereStr.length==0)
    {
        next(new Error("No any predicates!"));
        return;
    }
    db.one('select * from State ' + whereStr)
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

// ---------------------------------------------------------
//  The function insert data into State
//  URL : POST /State
//  BODY:State=...&State_en=...
// ---------------------------------------------------------
function create_State(req, res, next) {
    db.one('insert into State(State,State_en)' +
            'values(${State},${State_en}) returning cState',
             req.body)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Inserted one State'
                });
        })
        .catch(function (err) {
            return next(err);
    });
}

// ---------------------------------------------------------
//  The function update data in State
//  URL : PUT /State
//  BODY: cState=...&State=...&State_en=...
// ---------------------------------------------------------
function update_State(req, res, next) {
    var errStr = '';
    if(!req.body.cState)
        errStr += 'cState undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('update State set State=${State}, State_en=${State_en} where cState=${cState}',
             req.body)
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

// ---------------------------------------------------------
//  The function deletes data from State
//  URL : DELETE /State/
//  BODY: cState=...
// ---------------------------------------------------------
function remove_State(req, res, next) {
    var errStr = '';
    if(!req.body.cState)
        errStr += 'cState undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.result('delete from State where cState = $1',req.body.cState)
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


// ---------------------------------------------------------
//  The function retrieves ALL data from person
//  Be carefully !!
//  URL : GET /person/all
//  BODY: without BODY !!!
// ---------------------------------------------------------
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

// ---------------------------------------------------------
//  The function retrieves data from person via primary key
//  URL : GET /person/one/?pId=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getSingle_person(req, res, next) {
    var errStr = '';
    if(!req.query.pId)
        errStr += 'pId undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.one('select * from person where pId = $1',req.query.pId)
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

// ---------------------------------------------------------
//  The function retrieves data from person using WHERE clause
//  URL : GET /person/any/?cState=...&shortName=...&fullName=...&legalName=...&bornDate=...&sexId=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getWhere_person(req, res, next) {
   var whereStr = '';
   if(req.query.cState)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " cState = " + req.query.cState.trim();
   }
   if(req.query.shortName)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " shortName LIKE '%" + req.query.shortName.trim() + "%'";
   }
   if(req.query.fullName)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " fullName LIKE '%" + req.query.fullName.trim() + "%'";
   }
   if(req.query.legalName)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " legalName LIKE '%" + req.query.legalName.trim() + "%'";
   }
   if(req.query.bornDate)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " bornDate = '" + req.query.bornDate.trim() + "'";
   }
   if(req.query.sexId)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " sexId = " + req.query.sexId.trim();
   }
    if(whereStr.length==0)
    {
        next(new Error("No any predicates!"));
        return;
    }
    db.one('select * from person ' + whereStr)
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

// ---------------------------------------------------------
//  The function insert data into person
//  URL : POST /person
//  BODY:pId=...&cState=...&shortName=...&fullName=...&legalName=...&bornDate=...&sexId=...
// ---------------------------------------------------------
function create_person(req, res, next) {
    var errStr = '';
    if(!req.body.pId)
        errStr += 'pId undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('insert into person(pId,cState,shortName,fullName,legalName,bornDate,sexId)' +
            'values(${pId},${cState},${shortName},${fullName},${legalName},${bornDate},${sexId})',
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

// ---------------------------------------------------------
//  The function update data in person
//  URL : PUT /person
//  BODY: pId=...&cState=...&shortName=...&fullName=...&legalName=...&bornDate=...&sexId=...
// ---------------------------------------------------------
function update_person(req, res, next) {
    var errStr = '';
    if(!req.body.pId)
        errStr += 'pId undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('update person set cState=${cState}, shortName=${shortName}, fullName=${fullName}, legalName=${legalName}, bornDate=${bornDate}, sexId=${sexId} where pId=${pId}',
             req.body)
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

// ---------------------------------------------------------
//  The function deletes data from person
//  URL : DELETE /person/
//  BODY: pId=...
// ---------------------------------------------------------
function remove_person(req, res, next) {
    var errStr = '';
    if(!req.body.pId)
        errStr += 'pId undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.result('delete from person where pId = $1',req.body.pId)
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


// ---------------------------------------------------------
//  The function retrieves ALL data from photoData
//  Be carefully !!
//  URL : GET /photoData/all
//  BODY: without BODY !!!
// ---------------------------------------------------------
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

// ---------------------------------------------------------
//  The function retrieves data from photoData via primary key
//  URL : GET /photoData/one/?pId=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getSingle_photoData(req, res, next) {
    var errStr = '';
    if(!req.query.pId)
        errStr += 'pId undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.one('select * from photoData where pId = $1',req.query.pId)
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

// ---------------------------------------------------------
//  The function retrieves data from photoData using WHERE clause
//  URL : GET /photoData/any/?cPhoto=...&photo=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getWhere_photoData(req, res, next) {
   var whereStr = '';
   if(req.query.cPhoto)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " cPhoto = " + req.query.cPhoto.trim();
   }
   if(req.query.photo)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " photo LIKE '%" + req.query.photo.trim() + "%'";
   }
    if(whereStr.length==0)
    {
        next(new Error("No any predicates!"));
        return;
    }
    db.one('select * from photoData ' + whereStr)
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

// ---------------------------------------------------------
//  The function insert data into photoData
//  URL : POST /photoData
//  BODY:pId=...&cPhoto=...&photo=...
// ---------------------------------------------------------
function create_photoData(req, res, next) {
    var errStr = '';
    if(!req.body.pId)
        errStr += 'pId undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('insert into photoData(pId,cPhoto,photo)' +
            'values(${pId},${cPhoto},${photo})',
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

// ---------------------------------------------------------
//  The function update data in photoData
//  URL : PUT /photoData
//  BODY: pId=...&cPhoto=...&photo=...
// ---------------------------------------------------------
function update_photoData(req, res, next) {
    var errStr = '';
    if(!req.body.pId)
        errStr += 'pId undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('update photoData set cPhoto=${cPhoto}, photo=${photo} where pId=${pId}',
             req.body)
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

// ---------------------------------------------------------
//  The function deletes data from photoData
//  URL : DELETE /photoData/
//  BODY: pId=...
// ---------------------------------------------------------
function remove_photoData(req, res, next) {
    var errStr = '';
    if(!req.body.pId)
        errStr += 'pId undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.result('delete from photoData where pId = $1',req.body.pId)
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


// ---------------------------------------------------------
//  The function retrieves ALL data from photoSpec
//  Be carefully !!
//  URL : GET /photoSpec/all
//  BODY: without BODY !!!
// ---------------------------------------------------------
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

// ---------------------------------------------------------
//  The function retrieves data from photoSpec via primary key
//  URL : GET /photoSpec/one/?cPhoto=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getSingle_photoSpec(req, res, next) {
    var errStr = '';
    if(!req.query.cPhoto)
        errStr += 'cPhoto undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.one('select * from photoSpec where cPhoto = $1',req.query.cPhoto)
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

// ---------------------------------------------------------
//  The function retrieves data from photoSpec using WHERE clause
//  URL : GET /photoSpec/any/?photoSpec=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getWhere_photoSpec(req, res, next) {
   var whereStr = '';
   if(req.query.photoSpec)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " photoSpec LIKE '%" + req.query.photoSpec.trim() + "%'";
   }
    if(whereStr.length==0)
    {
        next(new Error("No any predicates!"));
        return;
    }
    db.one('select * from photoSpec ' + whereStr)
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

// ---------------------------------------------------------
//  The function insert data into photoSpec
//  URL : POST /photoSpec
//  BODY:photoSpec=...
// ---------------------------------------------------------
function create_photoSpec(req, res, next) {
    db.one('insert into photoSpec(photoSpec)' +
            'values(${photoSpec}) returning cPhoto',
             req.body)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Inserted one photoSpec'
                });
        })
        .catch(function (err) {
            return next(err);
    });
}

// ---------------------------------------------------------
//  The function update data in photoSpec
//  URL : PUT /photoSpec
//  BODY: cPhoto=...&photoSpec=...
// ---------------------------------------------------------
function update_photoSpec(req, res, next) {
    var errStr = '';
    if(!req.body.cPhoto)
        errStr += 'cPhoto undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('update photoSpec set photoSpec=${photoSpec} where cPhoto=${cPhoto}',
             req.body)
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

// ---------------------------------------------------------
//  The function deletes data from photoSpec
//  URL : DELETE /photoSpec/
//  BODY: cPhoto=...
// ---------------------------------------------------------
function remove_photoSpec(req, res, next) {
    var errStr = '';
    if(!req.body.cPhoto)
        errStr += 'cPhoto undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.result('delete from photoSpec where cPhoto = $1',req.body.cPhoto)
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


// ---------------------------------------------------------
//  The function retrieves ALL data from audioDatа
//  Be carefully !!
//  URL : GET /audioDatа/all
//  BODY: without BODY !!!
// ---------------------------------------------------------
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

// ---------------------------------------------------------
//  The function retrieves data from audioDatа via primary key
//  URL : GET /audioDatа/one/?pId=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getSingle_audioDatа(req, res, next) {
    var errStr = '';
    if(!req.query.pId)
        errStr += 'pId undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.one('select * from audioDatа where pId = $1',req.query.pId)
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

// ---------------------------------------------------------
//  The function retrieves data from audioDatа using WHERE clause
//  URL : GET /audioDatа/any/?audioFull=...&audioMemo=...&Memo=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getWhere_audioDatа(req, res, next) {
   var whereStr = '';
   if(req.query.audioFull)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " audioFull LIKE '%" + req.query.audioFull.trim() + "%'";
   }
   if(req.query.audioMemo)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " audioMemo LIKE '%" + req.query.audioMemo.trim() + "%'";
   }
   if(req.query.Memo)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " Memo = " + req.query.Memo.trim();
   }
    if(whereStr.length==0)
    {
        next(new Error("No any predicates!"));
        return;
    }
    db.one('select * from audioDatа ' + whereStr)
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

// ---------------------------------------------------------
//  The function insert data into audioDatа
//  URL : POST /audioDatа
//  BODY:pId=...&audioFull=...&audioMemo=...&Memo=...
// ---------------------------------------------------------
function create_audioDatа(req, res, next) {
    var errStr = '';
    if(!req.body.pId)
        errStr += 'pId undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('insert into audioDatа(pId,audioFull,audioMemo,Memo)' +
            'values(${pId},${audioFull},${audioMemo},${Memo})',
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

// ---------------------------------------------------------
//  The function update data in audioDatа
//  URL : PUT /audioDatа
//  BODY: pId=...&audioFull=...&audioMemo=...&Memo=...
// ---------------------------------------------------------
function update_audioDatа(req, res, next) {
    var errStr = '';
    if(!req.body.pId)
        errStr += 'pId undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('update audioDatа set audioFull=${audioFull}, audioMemo=${audioMemo}, Memo=${Memo} where pId=${pId}',
             req.body)
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

// ---------------------------------------------------------
//  The function deletes data from audioDatа
//  URL : DELETE /audioDatа/
//  BODY: pId=...
// ---------------------------------------------------------
function remove_audioDatа(req, res, next) {
    var errStr = '';
    if(!req.body.pId)
        errStr += 'pId undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.result('delete from audioDatа where pId = $1',req.body.pId)
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


// ---------------------------------------------------------
//  The function retrieves ALL data from operator
//  Be carefully !!
//  URL : GET /operator/all
//  BODY: without BODY !!!
// ---------------------------------------------------------
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

// ---------------------------------------------------------
//  The function retrieves data from operator via primary key
//  URL : GET /operator/one/?cOper=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getSingle_operator(req, res, next) {
    var errStr = '';
    if(!req.query.cOper)
        errStr += 'cOper undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.one('select * from operator where cOper = $1',req.query.cOper)
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

// ---------------------------------------------------------
//  The function retrieves data from operator using WHERE clause
//  URL : GET /operator/any/?cRule=...&cPoint=...&Stuff=...&Stuff_en=...&key=...&phrase=...&stateId=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getWhere_operator(req, res, next) {
   var whereStr = '';
   if(req.query.cRule)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " cRule = " + req.query.cRule.trim();
   }
   if(req.query.cPoint)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " cPoint = " + req.query.cPoint.trim();
   }
   if(req.query.Stuff)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " Stuff LIKE '%" + req.query.Stuff.trim() + "%'";
   }
   if(req.query.Stuff_en)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " Stuff_en LIKE '%" + req.query.Stuff_en.trim() + "%'";
   }
   if(req.query.key)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " key LIKE '%" + req.query.key.trim() + "%'";
   }
   if(req.query.phrase)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " phrase LIKE '%" + req.query.phrase.trim() + "%'";
   }
   if(req.query.stateId)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " stateId = " + req.query.stateId.trim();
   }
    if(whereStr.length==0)
    {
        next(new Error("No any predicates!"));
        return;
    }
    db.one('select * from operator ' + whereStr)
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

// ---------------------------------------------------------
//  The function insert data into operator
//  URL : POST /operator
//  BODY:cRule=...&cPoint=...&Stuff=...&Stuff_en=...&key=...&phrase=...&stateId=...
// ---------------------------------------------------------
function create_operator(req, res, next) {
    db.one('insert into operator(cRule,cPoint,Stuff,Stuff_en,key,phrase,stateId)' +
            'values(${cRule},${cPoint},${Stuff},${Stuff_en},${key},${phrase},${stateId}) returning cOper',
             req.body)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Inserted one operator'
                });
        })
        .catch(function (err) {
            return next(err);
    });
}

// ---------------------------------------------------------
//  The function update data in operator
//  URL : PUT /operator
//  BODY: cOper=...&cRule=...&cPoint=...&Stuff=...&Stuff_en=...&key=...&phrase=...&stateId=...
// ---------------------------------------------------------
function update_operator(req, res, next) {
    var errStr = '';
    if(!req.body.cOper)
        errStr += 'cOper undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('update operator set cRule=${cRule}, cPoint=${cPoint}, Stuff=${Stuff}, Stuff_en=${Stuff_en}, key=${key}, phrase=${phrase}, stateId=${stateId} where cOper=${cOper}',
             req.body)
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

// ---------------------------------------------------------
//  The function deletes data from operator
//  URL : DELETE /operator/
//  BODY: cOper=...
// ---------------------------------------------------------
function remove_operator(req, res, next) {
    var errStr = '';
    if(!req.body.cOper)
        errStr += 'cOper undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.result('delete from operator where cOper = $1',req.body.cOper)
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


// ---------------------------------------------------------
//  The function retrieves ALL data from regPoint
//  Be carefully !!
//  URL : GET /regPoint/all
//  BODY: without BODY !!!
// ---------------------------------------------------------
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

// ---------------------------------------------------------
//  The function retrieves data from regPoint via primary key
//  URL : GET /regPoint/one/?cPoint=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getSingle_regPoint(req, res, next) {
    var errStr = '';
    if(!req.query.cPoint)
        errStr += 'cPoint undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.one('select * from regPoint where cPoint = $1',req.query.cPoint)
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

// ---------------------------------------------------------
//  The function retrieves data from regPoint using WHERE clause
//  URL : GET /regPoint/any/?cState=...&point=...&point_en=...&location=...&location_en=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getWhere_regPoint(req, res, next) {
   var whereStr = '';
   if(req.query.cState)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " cState = " + req.query.cState.trim();
   }
   if(req.query.point)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " point LIKE '%" + req.query.point.trim() + "%'";
   }
   if(req.query.point_en)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " point_en LIKE '%" + req.query.point_en.trim() + "%'";
   }
   if(req.query.location)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " location LIKE '%" + req.query.location.trim() + "%'";
   }
   if(req.query.location_en)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " location_en LIKE '%" + req.query.location_en.trim() + "%'";
   }
    if(whereStr.length==0)
    {
        next(new Error("No any predicates!"));
        return;
    }
    db.one('select * from regPoint ' + whereStr)
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

// ---------------------------------------------------------
//  The function insert data into regPoint
//  URL : POST /regPoint
//  BODY:cState=...&point=...&point_en=...&location=...&location_en=...
// ---------------------------------------------------------
function create_regPoint(req, res, next) {
    db.one('insert into regPoint(cState,point,point_en,location,location_en)' +
            'values(${cState},${point},${point_en},${location},${location_en}) returning cPoint',
             req.body)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Inserted one regPoint'
                });
        })
        .catch(function (err) {
            return next(err);
    });
}

// ---------------------------------------------------------
//  The function update data in regPoint
//  URL : PUT /regPoint
//  BODY: cPoint=...&cState=...&point=...&point_en=...&location=...&location_en=...
// ---------------------------------------------------------
function update_regPoint(req, res, next) {
    var errStr = '';
    if(!req.body.cPoint)
        errStr += 'cPoint undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('update regPoint set cState=${cState}, point=${point}, point_en=${point_en}, location=${location}, location_en=${location_en} where cPoint=${cPoint}',
             req.body)
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

// ---------------------------------------------------------
//  The function deletes data from regPoint
//  URL : DELETE /regPoint/
//  BODY: cPoint=...
// ---------------------------------------------------------
function remove_regPoint(req, res, next) {
    var errStr = '';
    if(!req.body.cPoint)
        errStr += 'cPoint undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.result('delete from regPoint where cPoint = $1',req.body.cPoint)
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


// ---------------------------------------------------------
//  The function retrieves ALL data from opRule
//  Be carefully !!
//  URL : GET /opRule/all
//  BODY: without BODY !!!
// ---------------------------------------------------------
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

// ---------------------------------------------------------
//  The function retrieves data from opRule via primary key
//  URL : GET /opRule/one/?cRule=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getSingle_opRule(req, res, next) {
    var errStr = '';
    if(!req.query.cRule)
        errStr += 'cRule undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.one('select * from opRule where cRule = $1',req.query.cRule)
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

// ---------------------------------------------------------
//  The function retrieves data from opRule using WHERE clause
//  URL : GET /opRule/any/?Rule=...&Rule_en=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getWhere_opRule(req, res, next) {
   var whereStr = '';
   if(req.query.Rule)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " Rule LIKE '%" + req.query.Rule.trim() + "%'";
   }
   if(req.query.Rule_en)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " Rule_en LIKE '%" + req.query.Rule_en.trim() + "%'";
   }
    if(whereStr.length==0)
    {
        next(new Error("No any predicates!"));
        return;
    }
    db.one('select * from opRule ' + whereStr)
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

// ---------------------------------------------------------
//  The function insert data into opRule
//  URL : POST /opRule
//  BODY:Rule=...&Rule_en=...
// ---------------------------------------------------------
function create_opRule(req, res, next) {
    db.one('insert into opRule(Rule,Rule_en)' +
            'values(${Rule},${Rule_en}) returning cRule',
             req.body)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Inserted one opRule'
                });
        })
        .catch(function (err) {
            return next(err);
    });
}

// ---------------------------------------------------------
//  The function update data in opRule
//  URL : PUT /opRule
//  BODY: cRule=...&Rule=...&Rule_en=...
// ---------------------------------------------------------
function update_opRule(req, res, next) {
    var errStr = '';
    if(!req.body.cRule)
        errStr += 'cRule undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('update opRule set Rule=${Rule}, Rule_en=${Rule_en} where cRule=${cRule}',
             req.body)
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

// ---------------------------------------------------------
//  The function deletes data from opRule
//  URL : DELETE /opRule/
//  BODY: cRule=...
// ---------------------------------------------------------
function remove_opRule(req, res, next) {
    var errStr = '';
    if(!req.body.cRule)
        errStr += 'cRule undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.result('delete from opRule where cRule = $1',req.body.cRule)
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


// ---------------------------------------------------------
//  The function retrieves ALL data from Contact
//  Be carefully !!
//  URL : GET /Contact/all
//  BODY: without BODY !!!
// ---------------------------------------------------------
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

// ---------------------------------------------------------
//  The function retrieves data from Contact via primary key
//  URL : GET /Contact/one/?cContact=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getSingle_Contact(req, res, next) {
    var errStr = '';
    if(!req.query.cContact)
        errStr += 'cContact undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.one('select * from Contact where cContact = $1',req.query.cContact)
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

// ---------------------------------------------------------
//  The function retrieves data from Contact using WHERE clause
//  URL : GET /Contact/any/?cAgent=...&pId=...&key=...&phrase=...&Memo=...&stateId=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getWhere_Contact(req, res, next) {
   var whereStr = '';
   if(req.query.cAgent)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " cAgent = " + req.query.cAgent.trim();
   }
   if(req.query.pId)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " pId = " + req.query.pId.trim();
   }
   if(req.query.key)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " key LIKE '%" + req.query.key.trim() + "%'";
   }
   if(req.query.phrase)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " phrase LIKE '%" + req.query.phrase.trim() + "%'";
   }
   if(req.query.Memo)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " Memo = " + req.query.Memo.trim();
   }
   if(req.query.stateId)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " stateId = " + req.query.stateId.trim();
   }
    if(whereStr.length==0)
    {
        next(new Error("No any predicates!"));
        return;
    }
    db.one('select * from Contact ' + whereStr)
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

// ---------------------------------------------------------
//  The function insert data into Contact
//  URL : POST /Contact
//  BODY:cAgent=...&pId=...&key=...&phrase=...&Memo=...&stateId=...
// ---------------------------------------------------------
function create_Contact(req, res, next) {
    db.one('insert into Contact(cAgent,pId,key,phrase,Memo,stateId)' +
            'values(${cAgent},${pId},${key},${phrase},${Memo},${stateId}) returning cContact',
             req.body)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Inserted one Contact'
                });
        })
        .catch(function (err) {
            return next(err);
    });
}

// ---------------------------------------------------------
//  The function update data in Contact
//  URL : PUT /Contact
//  BODY: cContact=...&cAgent=...&pId=...&key=...&phrase=...&Memo=...&stateId=...
// ---------------------------------------------------------
function update_Contact(req, res, next) {
    var errStr = '';
    if(!req.body.cContact)
        errStr += 'cContact undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('update Contact set cAgent=${cAgent}, pId=${pId}, key=${key}, phrase=${phrase}, Memo=${Memo}, stateId=${stateId} where cContact=${cContact}',
             req.body)
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

// ---------------------------------------------------------
//  The function deletes data from Contact
//  URL : DELETE /Contact/
//  BODY: cContact=...
// ---------------------------------------------------------
function remove_Contact(req, res, next) {
    var errStr = '';
    if(!req.body.cContact)
        errStr += 'cContact undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.result('delete from Contact where cContact = $1',req.body.cContact)
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


// ---------------------------------------------------------
//  The function retrieves ALL data from Agent
//  Be carefully !!
//  URL : GET /Agent/all
//  BODY: without BODY !!!
// ---------------------------------------------------------
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

// ---------------------------------------------------------
//  The function retrieves data from Agent via primary key
//  URL : GET /Agent/one/?cAgent=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getSingle_Agent(req, res, next) {
    var errStr = '';
    if(!req.query.cAgent)
        errStr += 'cAgent undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.one('select * from Agent where cAgent = $1',req.query.cAgent)
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

// ---------------------------------------------------------
//  The function retrieves data from Agent using WHERE clause
//  URL : GET /Agent/any/?Agent=...&Memo=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getWhere_Agent(req, res, next) {
   var whereStr = '';
   if(req.query.Agent)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " Agent LIKE '%" + req.query.Agent.trim() + "%'";
   }
   if(req.query.Memo)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " Memo = " + req.query.Memo.trim();
   }
    if(whereStr.length==0)
    {
        next(new Error("No any predicates!"));
        return;
    }
    db.one('select * from Agent ' + whereStr)
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

// ---------------------------------------------------------
//  The function insert data into Agent
//  URL : POST /Agent
//  BODY:Agent=...&Memo=...
// ---------------------------------------------------------
function create_Agent(req, res, next) {
    db.one('insert into Agent(Agent,Memo)' +
            'values(${Agent},${Memo}) returning cAgent',
             req.body)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Inserted one Agent'
                });
        })
        .catch(function (err) {
            return next(err);
    });
}

// ---------------------------------------------------------
//  The function update data in Agent
//  URL : PUT /Agent
//  BODY: cAgent=...&Agent=...&Memo=...
// ---------------------------------------------------------
function update_Agent(req, res, next) {
    var errStr = '';
    if(!req.body.cAgent)
        errStr += 'cAgent undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('update Agent set Agent=${Agent}, Memo=${Memo} where cAgent=${cAgent}',
             req.body)
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

// ---------------------------------------------------------
//  The function deletes data from Agent
//  URL : DELETE /Agent/
//  BODY: cAgent=...
// ---------------------------------------------------------
function remove_Agent(req, res, next) {
    var errStr = '';
    if(!req.body.cAgent)
        errStr += 'cAgent undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.result('delete from Agent where cAgent = $1',req.body.cAgent)
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


// ---------------------------------------------------------
//  The function retrieves ALL data from access
//  Be carefully !!
//  URL : GET /access/all
//  BODY: without BODY !!!
// ---------------------------------------------------------
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

// ---------------------------------------------------------
//  The function retrieves data from access via primary key
//  URL : GET /access/one/?cOper=...&pId=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getSingle_access(req, res, next) {
    var errStr = '';
    if(!req.query.cOper)
        errStr += 'cOper undefined! ';
    if(!req.query.pId)
        errStr += 'pId undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.one('select * from access where cOper = $1 and pId = $2',req.query.cOper, req.query.pId)
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

// ---------------------------------------------------------
//  The function retrieves data from access using WHERE clause
//  URL : GET /access/any/?stateId=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getWhere_access(req, res, next) {
   var whereStr = '';
   if(req.query.stateId)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " stateId = " + req.query.stateId.trim();
   }
    if(whereStr.length==0)
    {
        next(new Error("No any predicates!"));
        return;
    }
    db.one('select * from access ' + whereStr)
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

// ---------------------------------------------------------
//  The function insert data into access
//  URL : POST /access
//  BODY:cOper=...&pId=...&stateId=...
// ---------------------------------------------------------
function create_access(req, res, next) {
    var errStr = '';
    if(!req.body.cOper)
        errStr += 'cOper undefined! ';
    if(!req.body.pId)
        errStr += 'pId undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('insert into access(cOper,pId,stateId)' +
            'values(${cOper},${pId},${stateId})',
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

// ---------------------------------------------------------
//  The function update data in access
//  URL : PUT /access
//  BODY: cOper=...&pId=...&stateId=...
// ---------------------------------------------------------
function update_access(req, res, next) {
    var errStr = '';
    if(!req.body.cOper)
        errStr += 'cOper undefined! ';
    if(!req.body.pId)
        errStr += 'pId undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('update access set stateId=${stateId} where cOper=${cOper} and pId=${pId}',
             req.body)
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

// ---------------------------------------------------------
//  The function deletes data from access
//  URL : DELETE /access/
//  BODY: cOper=...&pId=...
// ---------------------------------------------------------
function remove_access(req, res, next) {
    var errStr = '';
    if(!req.body.cOper)
        errStr += 'cOper undefined! ';
    if(!req.body.pId)
        errStr += 'pId undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.result('delete from access where cOper = $1 and pId = $2',req.body.cOper, req.body.pId)
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


// ---------------------------------------------------------
//  The function retrieves ALL data from docImage
//  Be carefully !!
//  URL : GET /docImage/all
//  BODY: without BODY !!!
// ---------------------------------------------------------
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

// ---------------------------------------------------------
//  The function retrieves data from docImage via primary key
//  URL : GET /docImage/one/?pageN=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getSingle_docImage(req, res, next) {
    var errStr = '';
    if(!req.query.pageN)
        errStr += 'pageN undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.one('select * from docImage where pageN = $1',req.query.pageN)
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

// ---------------------------------------------------------
//  The function retrieves data from docImage using WHERE clause
//  URL : GET /docImage/any/?cDoc=...&image=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getWhere_docImage(req, res, next) {
   var whereStr = '';
   if(req.query.cDoc)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " cDoc = " + req.query.cDoc.trim();
   }
   if(req.query.image)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " image LIKE '%" + req.query.image.trim() + "%'";
   }
    if(whereStr.length==0)
    {
        next(new Error("No any predicates!"));
        return;
    }
    db.one('select * from docImage ' + whereStr)
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

// ---------------------------------------------------------
//  The function insert data into docImage
//  URL : POST /docImage
//  BODY:pageN=...&cDoc=...&image=...
// ---------------------------------------------------------
function create_docImage(req, res, next) {
    var errStr = '';
    if(!req.body.pageN)
        errStr += 'pageN undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('insert into docImage(pageN,cDoc,image)' +
            'values(${pageN},${cDoc},${image})',
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

// ---------------------------------------------------------
//  The function update data in docImage
//  URL : PUT /docImage
//  BODY: pageN=...&cDoc=...&image=...
// ---------------------------------------------------------
function update_docImage(req, res, next) {
    var errStr = '';
    if(!req.body.pageN)
        errStr += 'pageN undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('update docImage set cDoc=${cDoc}, image=${image} where pageN=${pageN}',
             req.body)
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

// ---------------------------------------------------------
//  The function deletes data from docImage
//  URL : DELETE /docImage/
//  BODY: pageN=...
// ---------------------------------------------------------
function remove_docImage(req, res, next) {
    var errStr = '';
    if(!req.body.pageN)
        errStr += 'pageN undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.result('delete from docImage where pageN = $1',req.body.pageN)
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


// ---------------------------------------------------------
//  The function retrieves ALL data from ref
//  Be carefully !!
//  URL : GET /ref/all
//  BODY: without BODY !!!
// ---------------------------------------------------------
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

// ---------------------------------------------------------
//  The function retrieves data from ref via primary key
//  URL : GET /ref/one/?pId=...&per_pId=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getSingle_ref(req, res, next) {
    var errStr = '';
    if(!req.query.pId)
        errStr += 'pId undefined! ';
    if(!req.query.per_pId)
        errStr += 'per_pId undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.one('select * from ref where pId = $1 and per_pId = $2',req.query.pId, req.query.per_pId)
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

// ---------------------------------------------------------
//  The function retrieves data from ref using WHERE clause
//  URL : GET /ref/any/?Memo=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getWhere_ref(req, res, next) {
   var whereStr = '';
   if(req.query.Memo)
   {
      whereStr = makeWhere(whereStr);
      whereStr += " Memo = " + req.query.Memo.trim();
   }
    if(whereStr.length==0)
    {
        next(new Error("No any predicates!"));
        return;
    }
    db.one('select * from ref ' + whereStr)
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

// ---------------------------------------------------------
//  The function insert data into ref
//  URL : POST /ref
//  BODY:pId=...&per_pId=...&Memo=...
// ---------------------------------------------------------
function create_ref(req, res, next) {
    var errStr = '';
    if(!req.body.pId)
        errStr += 'pId undefined! ';
    if(!req.body.per_pId)
        errStr += 'per_pId undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('insert into ref(pId,per_pId,Memo)' +
            'values(${pId},${per_pId},${Memo})',
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

// ---------------------------------------------------------
//  The function update data in ref
//  URL : PUT /ref
//  BODY: pId=...&per_pId=...&Memo=...
// ---------------------------------------------------------
function update_ref(req, res, next) {
    var errStr = '';
    if(!req.body.pId)
        errStr += 'pId undefined! ';
    if(!req.body.per_pId)
        errStr += 'per_pId undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('update ref set Memo=${Memo} where pId=${pId} and per_pId=${per_pId}',
             req.body)
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

// ---------------------------------------------------------
//  The function deletes data from ref
//  URL : DELETE /ref/
//  BODY: pId=...&per_pId=...
// ---------------------------------------------------------
function remove_ref(req, res, next) {
    var errStr = '';
    if(!req.body.pId)
        errStr += 'pId undefined! ';
    if(!req.body.per_pId)
        errStr += 'per_pId undefined! ';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.result('delete from ref where pId = $1 and per_pId = $2',req.body.pId, req.body.per_pId)
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

module.exports = {
  getAll_docSpec: getAll_docSpec,
  getSingle_docSpec: getSingle_docSpec,
  getWhere_docSpec: getWhere_docSpec,
  create_docSpec: create_docSpec,
  update_docSpec: update_docSpec,
  remove_docSpec: remove_docSpec,

  getAll_doc: getAll_doc,
  getSingle_doc: getSingle_doc,
  getWhere_doc: getWhere_doc,
  create_doc: create_doc,
  update_doc: update_doc,
  remove_doc: remove_doc,

  getAll_State: getAll_State,
  getSingle_State: getSingle_State,
  getWhere_State: getWhere_State,
  create_State: create_State,
  update_State: update_State,
  remove_State: remove_State,

  getAll_person: getAll_person,
  getSingle_person: getSingle_person,
  getWhere_person: getWhere_person,
  create_person: create_person,
  update_person: update_person,
  remove_person: remove_person,

  getAll_photoData: getAll_photoData,
  getSingle_photoData: getSingle_photoData,
  getWhere_photoData: getWhere_photoData,
  create_photoData: create_photoData,
  update_photoData: update_photoData,
  remove_photoData: remove_photoData,

  getAll_photoSpec: getAll_photoSpec,
  getSingle_photoSpec: getSingle_photoSpec,
  getWhere_photoSpec: getWhere_photoSpec,
  create_photoSpec: create_photoSpec,
  update_photoSpec: update_photoSpec,
  remove_photoSpec: remove_photoSpec,

  getAll_audioDatа: getAll_audioDatа,
  getSingle_audioDatа: getSingle_audioDatа,
  getWhere_audioDatа: getWhere_audioDatа,
  create_audioDatа: create_audioDatа,
  update_audioDatа: update_audioDatа,
  remove_audioDatа: remove_audioDatа,

  getAll_operator: getAll_operator,
  getSingle_operator: getSingle_operator,
  getWhere_operator: getWhere_operator,
  create_operator: create_operator,
  update_operator: update_operator,
  remove_operator: remove_operator,

  getAll_regPoint: getAll_regPoint,
  getSingle_regPoint: getSingle_regPoint,
  getWhere_regPoint: getWhere_regPoint,
  create_regPoint: create_regPoint,
  update_regPoint: update_regPoint,
  remove_regPoint: remove_regPoint,

  getAll_opRule: getAll_opRule,
  getSingle_opRule: getSingle_opRule,
  getWhere_opRule: getWhere_opRule,
  create_opRule: create_opRule,
  update_opRule: update_opRule,
  remove_opRule: remove_opRule,

  getAll_Contact: getAll_Contact,
  getSingle_Contact: getSingle_Contact,
  getWhere_Contact: getWhere_Contact,
  create_Contact: create_Contact,
  update_Contact: update_Contact,
  remove_Contact: remove_Contact,

  getAll_Agent: getAll_Agent,
  getSingle_Agent: getSingle_Agent,
  getWhere_Agent: getWhere_Agent,
  create_Agent: create_Agent,
  update_Agent: update_Agent,
  remove_Agent: remove_Agent,

  getAll_access: getAll_access,
  getSingle_access: getSingle_access,
  getWhere_access: getWhere_access,
  create_access: create_access,
  update_access: update_access,
  remove_access: remove_access,

  getAll_docImage: getAll_docImage,
  getSingle_docImage: getSingle_docImage,
  getWhere_docImage: getWhere_docImage,
  create_docImage: create_docImage,
  update_docImage: update_docImage,
  remove_docImage: remove_docImage,

  getAll_ref: getAll_ref,
  getSingle_ref: getSingle_ref,
  getWhere_ref: getWhere_ref,
  create_ref: create_ref,
  update_ref: update_ref,
  remove_ref: remove_ref
};
