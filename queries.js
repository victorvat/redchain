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

// ---------------------------------------------------------
//  The function retrieves ALL data from docSpec
//  Be carefully !!
//  URL : GET /redchain/api/docSpec/all
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
//  The function retrieves data from docSpec
//  URL : GET /redchain/api/docSpec/?cSpec=...
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
//  The function insert data into docSpec
//  URL : POST /redchain/api/docSpec
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
//  URL : PUT /redchain/api/docSpec
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
//  URL : DELETE /redchain/api/docSpec/
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
//  URL : GET /redchain/api/doc/all
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
//  The function retrieves data from doc
//  URL : GET /redchain/api/doc/?cDoc=...
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
//  The function insert data into doc
//  URL : POST /redchain/api/doc
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
//  URL : PUT /redchain/api/doc
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
//  URL : DELETE /redchain/api/doc/
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
//  URL : GET /redchain/api/State/all
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
//  The function retrieves data from State
//  URL : GET /redchain/api/State/?cState=...
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
//  The function insert data into State
//  URL : POST /redchain/api/State
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
//  URL : PUT /redchain/api/State
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
//  URL : DELETE /redchain/api/State/
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
//  URL : GET /redchain/api/person/all
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
//  The function retrieves data from person
//  URL : GET /redchain/api/person/?pId=...
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
//  The function insert data into person
//  URL : POST /redchain/api/person
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
//  URL : PUT /redchain/api/person
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
//  URL : DELETE /redchain/api/person/
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
//  URL : GET /redchain/api/photoData/all
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
//  The function retrieves data from photoData
//  URL : GET /redchain/api/photoData/?pId=...
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
//  The function insert data into photoData
//  URL : POST /redchain/api/photoData
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
//  URL : PUT /redchain/api/photoData
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
//  URL : DELETE /redchain/api/photoData/
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
//  URL : GET /redchain/api/photoSpec/all
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
//  The function retrieves data from photoSpec
//  URL : GET /redchain/api/photoSpec/?cPhoto=...
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
//  The function insert data into photoSpec
//  URL : POST /redchain/api/photoSpec
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
//  URL : PUT /redchain/api/photoSpec
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
//  URL : DELETE /redchain/api/photoSpec/
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
//  URL : GET /redchain/api/audioDatа/all
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
//  The function retrieves data from audioDatа
//  URL : GET /redchain/api/audioDatа/?pId=...
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
//  The function insert data into audioDatа
//  URL : POST /redchain/api/audioDatа
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
//  URL : PUT /redchain/api/audioDatа
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
//  URL : DELETE /redchain/api/audioDatа/
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
//  URL : GET /redchain/api/operator/all
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
//  The function retrieves data from operator
//  URL : GET /redchain/api/operator/?cOper=...
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
//  The function insert data into operator
//  URL : POST /redchain/api/operator
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
//  URL : PUT /redchain/api/operator
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
//  URL : DELETE /redchain/api/operator/
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
//  URL : GET /redchain/api/regPoint/all
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
//  The function retrieves data from regPoint
//  URL : GET /redchain/api/regPoint/?cPoint=...
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
//  The function insert data into regPoint
//  URL : POST /redchain/api/regPoint
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
//  URL : PUT /redchain/api/regPoint
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
//  URL : DELETE /redchain/api/regPoint/
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
//  URL : GET /redchain/api/opRule/all
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
//  The function retrieves data from opRule
//  URL : GET /redchain/api/opRule/?cRule=...
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
//  The function insert data into opRule
//  URL : POST /redchain/api/opRule
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
//  URL : PUT /redchain/api/opRule
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
//  URL : DELETE /redchain/api/opRule/
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
//  URL : GET /redchain/api/Contact/all
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
//  The function retrieves data from Contact
//  URL : GET /redchain/api/Contact/?cContact=...
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
//  The function insert data into Contact
//  URL : POST /redchain/api/Contact
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
//  URL : PUT /redchain/api/Contact
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
//  URL : DELETE /redchain/api/Contact/
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
//  URL : GET /redchain/api/Agent/all
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
//  The function retrieves data from Agent
//  URL : GET /redchain/api/Agent/?cAgent=...
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
//  The function insert data into Agent
//  URL : POST /redchain/api/Agent
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
//  URL : PUT /redchain/api/Agent
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
//  URL : DELETE /redchain/api/Agent/
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
//  URL : GET /redchain/api/access/all
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
//  The function retrieves data from access
//  URL : GET /redchain/api/access/?cOper=...&pId=...
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
//  The function insert data into access
//  URL : POST /redchain/api/access
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
//  URL : PUT /redchain/api/access
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
//  URL : DELETE /redchain/api/access/
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
//  URL : GET /redchain/api/docImage/all
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
//  The function retrieves data from docImage
//  URL : GET /redchain/api/docImage/?pageN=...
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
//  The function insert data into docImage
//  URL : POST /redchain/api/docImage
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
//  URL : PUT /redchain/api/docImage
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
//  URL : DELETE /redchain/api/docImage/
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
//  URL : GET /redchain/api/ref/all
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
//  The function retrieves data from ref
//  URL : GET /redchain/api/ref/?pId=...&per_pId=...
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
//  The function insert data into ref
//  URL : POST /redchain/api/ref
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
//  URL : PUT /redchain/api/ref
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
//  URL : DELETE /redchain/api/ref/
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
