var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://user:passwd@localhost:5432/redchain';
var db = pgp(connectionString);

// --------------------------------------------------------- 
//  The function retrieves data from docSpec
//  URL : GET /redchain/docSpec/?cSpec=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getSingle_docSpec(req, res, next) {
    var errStr = '';
    if(!req.query.cSpec)
        errStr += 'cSpec undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.one('select * from docSpec where cSpec = $1',cSpec)
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
//  URL : POST /redchain/docSpec
//  BODY: cSpec=...&spec=...&spec_en=...
// ---------------------------------------------------------
function create_docSpec(req, res, next) {
    var errStr = '';
    if(!req.body.cSpec)
        errStr += 'cSpec undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('insert into docSpec(cSpec,spec,spec_en' +
            'values(${cSpec},${spec},${spec_en})',
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

// --------------------------------------------------------- 
//  The function update data in docSpec
//  URL : PUT /redchain/docSpec
//  BODY: cSpec=...&spec=...&spec_en=...
// ---------------------------------------------------------
function update_docSpec(req, res, next) {
    var errStr = '';
    if(!req.body.cSpec)
        errStr += 'cSpec undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('update docSpec set cSpec=$1, spec=$2, spec_en=$3 where cSpec=$4',
            req.body.cSpec, req.body.spec, req.body.spec_en,
            req.body.cSpec)
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
//  URL : DELETE /redchain/docSpec/
//  BODY: cSpec=...
// ---------------------------------------------------------
function remove_docSpec(req, res, next) {
    var errStr = '';
    if(!req.body.cSpec)
        errStr += 'cSpec undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.result('delete from docSpec where cSpec = $1',cSpec)
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
//  The function retrieves data from doc
//  URL : GET /redchain/doc/?cDoc=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getSingle_doc(req, res, next) {
    var errStr = '';
    if(!req.query.cDoc)
        errStr += 'cDoc undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.one('select * from doc where cDoc = $1',cDoc)
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
//  URL : POST /redchain/doc
//  BODY: cDoc=...&cSpec=...&pId=...&cState=...&docN=...&docDate=...&docEnd=...&docAuth=...&Memo=...
// ---------------------------------------------------------
function create_doc(req, res, next) {
    var errStr = '';
    if(!req.body.cDoc)
        errStr += 'cDoc undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('insert into doc(cDoc,cSpec,pId,cState,docN,docDate,docEnd,docAuth,Memo' +
            'values(${cDoc},${cSpec},${pId},${cState},${docN},${docDate},${docEnd},${docAuth},${Memo})',
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

// --------------------------------------------------------- 
//  The function update data in doc
//  URL : PUT /redchain/doc
//  BODY: cDoc=...&cSpec=...&pId=...&cState=...&docN=...&docDate=...&docEnd=...&docAuth=...&Memo=...
// ---------------------------------------------------------
function update_doc(req, res, next) {
    var errStr = '';
    if(!req.body.cDoc)
        errStr += 'cDoc undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('update doc set cDoc=$1, cSpec=$2, pId=$3, cState=$4, docN=$5, docDate=$6, docEnd=$7, docAuth=$8, Memo=$9 where cDoc=$10',
            req.body.cDoc, req.body.cSpec, req.body.pId, req.body.cState, req.body.docN, req.body.docDate, req.body.docEnd, req.body.docAuth, req.body.Memo,
            req.body.cDoc)
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
//  URL : DELETE /redchain/doc/
//  BODY: cDoc=...
// ---------------------------------------------------------
function remove_doc(req, res, next) {
    var errStr = '';
    if(!req.body.cDoc)
        errStr += 'cDoc undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.result('delete from doc where cDoc = $1',cDoc)
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
//  The function retrieves data from State
//  URL : GET /redchain/State/?cState=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getSingle_State(req, res, next) {
    var errStr = '';
    if(!req.query.cState)
        errStr += 'cState undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.one('select * from State where cState = $1',cState)
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
//  URL : POST /redchain/State
//  BODY: cState=...&State=...&State_en=...
// ---------------------------------------------------------
function create_State(req, res, next) {
    var errStr = '';
    if(!req.body.cState)
        errStr += 'cState undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('insert into State(cState,State,State_en' +
            'values(${cState},${State},${State_en})',
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

// --------------------------------------------------------- 
//  The function update data in State
//  URL : PUT /redchain/State
//  BODY: cState=...&State=...&State_en=...
// ---------------------------------------------------------
function update_State(req, res, next) {
    var errStr = '';
    if(!req.body.cState)
        errStr += 'cState undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('update State set cState=$1, State=$2, State_en=$3 where cState=$4',
            req.body.cState, req.body.State, req.body.State_en,
            req.body.cState)
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
//  URL : DELETE /redchain/State/
//  BODY: cState=...
// ---------------------------------------------------------
function remove_State(req, res, next) {
    var errStr = '';
    if(!req.body.cState)
        errStr += 'cState undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.result('delete from State where cState = $1',cState)
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
//  The function retrieves data from person
//  URL : GET /redchain/person/?pId=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getSingle_person(req, res, next) {
    var errStr = '';
    if(!req.query.pId)
        errStr += 'pId undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.one('select * from person where pId = $1',pId)
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
//  URL : POST /redchain/person
//  BODY: pId=...&cState=...&shortName=...&fullName=...&legalName=...&bornDate=...&sexId=...
// ---------------------------------------------------------
function create_person(req, res, next) {
    var errStr = '';
    if(!req.body.pId)
        errStr += 'pId undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('insert into person(pId,cState,shortName,fullName,legalName,bornDate,sexId' +
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
//  URL : PUT /redchain/person
//  BODY: pId=...&cState=...&shortName=...&fullName=...&legalName=...&bornDate=...&sexId=...
// ---------------------------------------------------------
function update_person(req, res, next) {
    var errStr = '';
    if(!req.body.pId)
        errStr += 'pId undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('update person set pId=$1, cState=$2, shortName=$3, fullName=$4, legalName=$5, bornDate=$6, sexId=$7 where pId=$8',
            req.body.pId, req.body.cState, req.body.shortName, req.body.fullName, req.body.legalName, req.body.bornDate, req.body.sexId,
            req.body.pId)
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
//  URL : DELETE /redchain/person/
//  BODY: pId=...
// ---------------------------------------------------------
function remove_person(req, res, next) {
    var errStr = '';
    if(!req.body.pId)
        errStr += 'pId undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.result('delete from person where pId = $1',pId)
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
//  The function retrieves data from photoData
//  URL : GET /redchain/photoData/?pId=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getSingle_photoData(req, res, next) {
    var errStr = '';
    if(!req.query.pId)
        errStr += 'pId undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.one('select * from photoData where pId = $1',pId)
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
//  URL : POST /redchain/photoData
//  BODY: pId=...&cPhoto=...&photo=...
// ---------------------------------------------------------
function create_photoData(req, res, next) {
    var errStr = '';
    if(!req.body.pId)
        errStr += 'pId undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('insert into photoData(pId,cPhoto,photo' +
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
//  URL : PUT /redchain/photoData
//  BODY: pId=...&cPhoto=...&photo=...
// ---------------------------------------------------------
function update_photoData(req, res, next) {
    var errStr = '';
    if(!req.body.pId)
        errStr += 'pId undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('update photoData set pId=$1, cPhoto=$2, photo=$3 where pId=$4',
            req.body.pId, req.body.cPhoto, req.body.photo,
            req.body.pId)
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
//  URL : DELETE /redchain/photoData/
//  BODY: pId=...
// ---------------------------------------------------------
function remove_photoData(req, res, next) {
    var errStr = '';
    if(!req.body.pId)
        errStr += 'pId undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.result('delete from photoData where pId = $1',pId)
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
//  The function retrieves data from photoSpec
//  URL : GET /redchain/photoSpec/?cPhoto=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getSingle_photoSpec(req, res, next) {
    var errStr = '';
    if(!req.query.cPhoto)
        errStr += 'cPhoto undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.one('select * from photoSpec where cPhoto = $1',cPhoto)
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
//  URL : POST /redchain/photoSpec
//  BODY: cPhoto=...&photoSpec=...
// ---------------------------------------------------------
function create_photoSpec(req, res, next) {
    var errStr = '';
    if(!req.body.cPhoto)
        errStr += 'cPhoto undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('insert into photoSpec(cPhoto,photoSpec' +
            'values(${cPhoto},${photoSpec})',
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

// --------------------------------------------------------- 
//  The function update data in photoSpec
//  URL : PUT /redchain/photoSpec
//  BODY: cPhoto=...&photoSpec=...
// ---------------------------------------------------------
function update_photoSpec(req, res, next) {
    var errStr = '';
    if(!req.body.cPhoto)
        errStr += 'cPhoto undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('update photoSpec set cPhoto=$1, photoSpec=$2 where cPhoto=$3',
            req.body.cPhoto, req.body.photoSpec,
            req.body.cPhoto)
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
//  URL : DELETE /redchain/photoSpec/
//  BODY: cPhoto=...
// ---------------------------------------------------------
function remove_photoSpec(req, res, next) {
    var errStr = '';
    if(!req.body.cPhoto)
        errStr += 'cPhoto undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.result('delete from photoSpec where cPhoto = $1',cPhoto)
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
//  The function retrieves data from audioDatа
//  URL : GET /redchain/audioDatа/?pId=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getSingle_audioDatа(req, res, next) {
    var errStr = '';
    if(!req.query.pId)
        errStr += 'pId undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.one('select * from audioDatа where pId = $1',pId)
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
//  URL : POST /redchain/audioDatа
//  BODY: pId=...&audioFull=...&audioMemo=...&Memo=...
// ---------------------------------------------------------
function create_audioDatа(req, res, next) {
    var errStr = '';
    if(!req.body.pId)
        errStr += 'pId undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('insert into audioDatа(pId,audioFull,audioMemo,Memo' +
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
//  URL : PUT /redchain/audioDatа
//  BODY: pId=...&audioFull=...&audioMemo=...&Memo=...
// ---------------------------------------------------------
function update_audioDatа(req, res, next) {
    var errStr = '';
    if(!req.body.pId)
        errStr += 'pId undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('update audioDatа set pId=$1, audioFull=$2, audioMemo=$3, Memo=$4 where pId=$5',
            req.body.pId, req.body.audioFull, req.body.audioMemo, req.body.Memo,
            req.body.pId)
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
//  URL : DELETE /redchain/audioDatа/
//  BODY: pId=...
// ---------------------------------------------------------
function remove_audioDatа(req, res, next) {
    var errStr = '';
    if(!req.body.pId)
        errStr += 'pId undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.result('delete from audioDatа where pId = $1',pId)
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
//  The function retrieves data from operator
//  URL : GET /redchain/operator/?cOper=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getSingle_operator(req, res, next) {
    var errStr = '';
    if(!req.query.cOper)
        errStr += 'cOper undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.one('select * from operator where cOper = $1',cOper)
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
//  URL : POST /redchain/operator
//  BODY: cOper=...&cRule=...&cPoint=...&Stuff=...&Stuff_en=...&key=...&phrase=...&stateId=...
// ---------------------------------------------------------
function create_operator(req, res, next) {
    var errStr = '';
    if(!req.body.cOper)
        errStr += 'cOper undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('insert into operator(cOper,cRule,cPoint,Stuff,Stuff_en,key,phrase,stateId' +
            'values(${cOper},${cRule},${cPoint},${Stuff},${Stuff_en},${key},${phrase},${stateId})',
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

// --------------------------------------------------------- 
//  The function update data in operator
//  URL : PUT /redchain/operator
//  BODY: cOper=...&cRule=...&cPoint=...&Stuff=...&Stuff_en=...&key=...&phrase=...&stateId=...
// ---------------------------------------------------------
function update_operator(req, res, next) {
    var errStr = '';
    if(!req.body.cOper)
        errStr += 'cOper undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('update operator set cOper=$1, cRule=$2, cPoint=$3, Stuff=$4, Stuff_en=$5, key=$6, phrase=$7, stateId=$8 where cOper=$9',
            req.body.cOper, req.body.cRule, req.body.cPoint, req.body.Stuff, req.body.Stuff_en, req.body.key, req.body.phrase, req.body.stateId,
            req.body.cOper)
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
//  URL : DELETE /redchain/operator/
//  BODY: cOper=...
// ---------------------------------------------------------
function remove_operator(req, res, next) {
    var errStr = '';
    if(!req.body.cOper)
        errStr += 'cOper undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.result('delete from operator where cOper = $1',cOper)
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
//  The function retrieves data from regPoint
//  URL : GET /redchain/regPoint/?cPoint=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getSingle_regPoint(req, res, next) {
    var errStr = '';
    if(!req.query.cPoint)
        errStr += 'cPoint undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.one('select * from regPoint where cPoint = $1',cPoint)
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
//  URL : POST /redchain/regPoint
//  BODY: cPoint=...&cState=...&point=...&point_en=...&location=...&location_en=...
// ---------------------------------------------------------
function create_regPoint(req, res, next) {
    var errStr = '';
    if(!req.body.cPoint)
        errStr += 'cPoint undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('insert into regPoint(cPoint,cState,point,point_en,location,location_en' +
            'values(${cPoint},${cState},${point},${point_en},${location},${location_en})',
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

// --------------------------------------------------------- 
//  The function update data in regPoint
//  URL : PUT /redchain/regPoint
//  BODY: cPoint=...&cState=...&point=...&point_en=...&location=...&location_en=...
// ---------------------------------------------------------
function update_regPoint(req, res, next) {
    var errStr = '';
    if(!req.body.cPoint)
        errStr += 'cPoint undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('update regPoint set cPoint=$1, cState=$2, point=$3, point_en=$4, location=$5, location_en=$6 where cPoint=$7',
            req.body.cPoint, req.body.cState, req.body.point, req.body.point_en, req.body.location, req.body.location_en,
            req.body.cPoint)
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
//  URL : DELETE /redchain/regPoint/
//  BODY: cPoint=...
// ---------------------------------------------------------
function remove_regPoint(req, res, next) {
    var errStr = '';
    if(!req.body.cPoint)
        errStr += 'cPoint undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.result('delete from regPoint where cPoint = $1',cPoint)
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
//  The function retrieves data from opRule
//  URL : GET /redchain/opRule/?cRule=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getSingle_opRule(req, res, next) {
    var errStr = '';
    if(!req.query.cRule)
        errStr += 'cRule undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.one('select * from opRule where cRule = $1',cRule)
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
//  URL : POST /redchain/opRule
//  BODY: cRule=...&Rule=...&Rule_en=...
// ---------------------------------------------------------
function create_opRule(req, res, next) {
    var errStr = '';
    if(!req.body.cRule)
        errStr += 'cRule undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('insert into opRule(cRule,Rule,Rule_en' +
            'values(${cRule},${Rule},${Rule_en})',
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

// --------------------------------------------------------- 
//  The function update data in opRule
//  URL : PUT /redchain/opRule
//  BODY: cRule=...&Rule=...&Rule_en=...
// ---------------------------------------------------------
function update_opRule(req, res, next) {
    var errStr = '';
    if(!req.body.cRule)
        errStr += 'cRule undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('update opRule set cRule=$1, Rule=$2, Rule_en=$3 where cRule=$4',
            req.body.cRule, req.body.Rule, req.body.Rule_en,
            req.body.cRule)
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
//  URL : DELETE /redchain/opRule/
//  BODY: cRule=...
// ---------------------------------------------------------
function remove_opRule(req, res, next) {
    var errStr = '';
    if(!req.body.cRule)
        errStr += 'cRule undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.result('delete from opRule where cRule = $1',cRule)
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
//  The function retrieves data from Contact
//  URL : GET /redchain/Contact/?cContact=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getSingle_Contact(req, res, next) {
    var errStr = '';
    if(!req.query.cContact)
        errStr += 'cContact undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.one('select * from Contact where cContact = $1',cContact)
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
//  URL : POST /redchain/Contact
//  BODY: cContact=...&cAgent=...&pId=...&key=...&phrase=...&Memo=...&stateId=...
// ---------------------------------------------------------
function create_Contact(req, res, next) {
    var errStr = '';
    if(!req.body.cContact)
        errStr += 'cContact undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('insert into Contact(cContact,cAgent,pId,key,phrase,Memo,stateId' +
            'values(${cContact},${cAgent},${pId},${key},${phrase},${Memo},${stateId})',
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

// --------------------------------------------------------- 
//  The function update data in Contact
//  URL : PUT /redchain/Contact
//  BODY: cContact=...&cAgent=...&pId=...&key=...&phrase=...&Memo=...&stateId=...
// ---------------------------------------------------------
function update_Contact(req, res, next) {
    var errStr = '';
    if(!req.body.cContact)
        errStr += 'cContact undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('update Contact set cContact=$1, cAgent=$2, pId=$3, key=$4, phrase=$5, Memo=$6, stateId=$7 where cContact=$8',
            req.body.cContact, req.body.cAgent, req.body.pId, req.body.key, req.body.phrase, req.body.Memo, req.body.stateId,
            req.body.cContact)
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
//  URL : DELETE /redchain/Contact/
//  BODY: cContact=...
// ---------------------------------------------------------
function remove_Contact(req, res, next) {
    var errStr = '';
    if(!req.body.cContact)
        errStr += 'cContact undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.result('delete from Contact where cContact = $1',cContact)
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
//  The function retrieves data from Agent
//  URL : GET /redchain/Agent/?cAgent=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getSingle_Agent(req, res, next) {
    var errStr = '';
    if(!req.query.cAgent)
        errStr += 'cAgent undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.one('select * from Agent where cAgent = $1',cAgent)
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
//  URL : POST /redchain/Agent
//  BODY: cAgent=...&Agent=...&Memo=...
// ---------------------------------------------------------
function create_Agent(req, res, next) {
    var errStr = '';
    if(!req.body.cAgent)
        errStr += 'cAgent undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('insert into Agent(cAgent,Agent,Memo' +
            'values(${cAgent},${Agent},${Memo})',
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

// --------------------------------------------------------- 
//  The function update data in Agent
//  URL : PUT /redchain/Agent
//  BODY: cAgent=...&Agent=...&Memo=...
// ---------------------------------------------------------
function update_Agent(req, res, next) {
    var errStr = '';
    if(!req.body.cAgent)
        errStr += 'cAgent undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('update Agent set cAgent=$1, Agent=$2, Memo=$3 where cAgent=$4',
            req.body.cAgent, req.body.Agent, req.body.Memo,
            req.body.cAgent)
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
//  URL : DELETE /redchain/Agent/
//  BODY: cAgent=...
// ---------------------------------------------------------
function remove_Agent(req, res, next) {
    var errStr = '';
    if(!req.body.cAgent)
        errStr += 'cAgent undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.result('delete from Agent where cAgent = $1',cAgent)
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
//  The function retrieves data from access
//  URL : GET /redchain/access/?cOper=...&pId=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getSingle_access(req, res, next) {
    var errStr = '';
    if(!req.query.cOper)
        errStr += 'cOper undefined!';
    if(!req.query.pId)
        errStr += 'pId undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.one('select * from access where cOper = $1 and pId = $2',cOper, pId)
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
//  URL : POST /redchain/access
//  BODY: cOper=...&pId=...&stateId=...
// ---------------------------------------------------------
function create_access(req, res, next) {
    var errStr = '';
    if(!req.body.cOper)
        errStr += 'cOper undefined!';
    if(!req.body.pId)
        errStr += 'pId undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('insert into access(cOper,pId,stateId' +
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
//  URL : PUT /redchain/access
//  BODY: cOper=...&pId=...&stateId=...
// ---------------------------------------------------------
function update_access(req, res, next) {
    var errStr = '';
    if(!req.body.cOper)
        errStr += 'cOper undefined!';
    if(!req.body.pId)
        errStr += 'pId undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('update access set cOper=$1, pId=$2, stateId=$3 where cOper=$4 and pId=$5',
            req.body.cOper, req.body.pId, req.body.stateId,
            req.body.cOper, req.body.pId)
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
//  URL : DELETE /redchain/access/
//  BODY: cOper=...&pId=...
// ---------------------------------------------------------
function remove_access(req, res, next) {
    var errStr = '';
    if(!req.body.cOper)
        errStr += 'cOper undefined!';
    if(!req.body.pId)
        errStr += 'pId undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.result('delete from access where cOper = $1 and pId = $2',cOper, pId)
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
//  The function retrieves data from docImage
//  URL : GET /redchain/docImage/?pageN=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getSingle_docImage(req, res, next) {
    var errStr = '';
    if(!req.query.pageN)
        errStr += 'pageN undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.one('select * from docImage where pageN = $1',pageN)
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
//  URL : POST /redchain/docImage
//  BODY: pageN=...&cDoc=...&image=...
// ---------------------------------------------------------
function create_docImage(req, res, next) {
    var errStr = '';
    if(!req.body.pageN)
        errStr += 'pageN undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('insert into docImage(pageN,cDoc,image' +
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
//  URL : PUT /redchain/docImage
//  BODY: pageN=...&cDoc=...&image=...
// ---------------------------------------------------------
function update_docImage(req, res, next) {
    var errStr = '';
    if(!req.body.pageN)
        errStr += 'pageN undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('update docImage set pageN=$1, cDoc=$2, image=$3 where pageN=$4',
            req.body.pageN, req.body.cDoc, req.body.image,
            req.body.pageN)
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
//  URL : DELETE /redchain/docImage/
//  BODY: pageN=...
// ---------------------------------------------------------
function remove_docImage(req, res, next) {
    var errStr = '';
    if(!req.body.pageN)
        errStr += 'pageN undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.result('delete from docImage where pageN = $1',pageN)
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
//  The function retrieves data from ref
//  URL : GET /redchain/ref/?pId=...&per_pId=...
//  BODY: without BODY !!!
// ---------------------------------------------------------
function getSingle_ref(req, res, next) {
    var errStr = '';
    if(!req.query.pId)
        errStr += 'pId undefined!';
    if(!req.query.per_pId)
        errStr += 'per_pId undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.one('select * from ref where pId = $1 and per_pId = $2',pId, per_pId)
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
//  URL : POST /redchain/ref
//  BODY: pId=...&per_pId=...&Memo=...
// ---------------------------------------------------------
function create_ref(req, res, next) {
    var errStr = '';
    if(!req.body.pId)
        errStr += 'pId undefined!';
    if(!req.body.per_pId)
        errStr += 'per_pId undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('insert into ref(pId,per_pId,Memo' +
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
//  URL : PUT /redchain/ref
//  BODY: pId=...&per_pId=...&Memo=...
// ---------------------------------------------------------
function update_ref(req, res, next) {
    var errStr = '';
    if(!req.body.pId)
        errStr += 'pId undefined!';
    if(!req.body.per_pId)
        errStr += 'per_pId undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.none('update ref set pId=$1, per_pId=$2, Memo=$3 where pId=$4 and per_pId=$5',
            req.body.pId, req.body.per_pId, req.body.Memo,
            req.body.pId, req.body.per_pId)
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
//  URL : DELETE /redchain/ref/
//  BODY: pId=...&per_pId=...
// ---------------------------------------------------------
function remove_ref(req, res, next) {
    var errStr = '';
    if(!req.body.pId)
        errStr += 'pId undefined!';
    if(!req.body.per_pId)
        errStr += 'per_pId undefined!';
    if (errStr.length > 0)
    {
        next(new Error(errStr));
        return;
    }
    db.result('delete from ref where pId = $1 and per_pId = $2',pId, per_pId)
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
  getSingle_docSpec: getSingle_docSpec,
  create_docSpec: create_docSpec,
  update_docSpec: update_docSpec,
  remove_docSpec: remove_docSpec,

  getSingle_doc: getSingle_doc,
  create_doc: create_doc,
  update_doc: update_doc,
  remove_doc: remove_doc,

  getSingle_State: getSingle_State,
  create_State: create_State,
  update_State: update_State,
  remove_State: remove_State,

  getSingle_person: getSingle_person,
  create_person: create_person,
  update_person: update_person,
  remove_person: remove_person,

  getSingle_photoData: getSingle_photoData,
  create_photoData: create_photoData,
  update_photoData: update_photoData,
  remove_photoData: remove_photoData,

  getSingle_photoSpec: getSingle_photoSpec,
  create_photoSpec: create_photoSpec,
  update_photoSpec: update_photoSpec,
  remove_photoSpec: remove_photoSpec,

  getSingle_audioDatа: getSingle_audioDatа,
  create_audioDatа: create_audioDatа,
  update_audioDatа: update_audioDatа,
  remove_audioDatа: remove_audioDatа,

  getSingle_operator: getSingle_operator,
  create_operator: create_operator,
  update_operator: update_operator,
  remove_operator: remove_operator,

  getSingle_regPoint: getSingle_regPoint,
  create_regPoint: create_regPoint,
  update_regPoint: update_regPoint,
  remove_regPoint: remove_regPoint,

  getSingle_opRule: getSingle_opRule,
  create_opRule: create_opRule,
  update_opRule: update_opRule,
  remove_opRule: remove_opRule,

  getSingle_Contact: getSingle_Contact,
  create_Contact: create_Contact,
  update_Contact: update_Contact,
  remove_Contact: remove_Contact,

  getSingle_Agent: getSingle_Agent,
  create_Agent: create_Agent,
  update_Agent: update_Agent,
  remove_Agent: remove_Agent,

  getSingle_access: getSingle_access,
  create_access: create_access,
  update_access: update_access,
  remove_access: remove_access,

  getSingle_docImage: getSingle_docImage,
  create_docImage: create_docImage,
  update_docImage: update_docImage,
  remove_docImage: remove_docImage,

  getSingle_ref: getSingle_ref,
  create_ref: create_ref,
  update_ref: update_ref,
  remove_ref: remove_ref
};
