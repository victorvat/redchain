var promise = require('bluebird');
var express = require('express');
var app = express();

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

function makeWhere(whereStr) {
    if(whereStr === undefined || whereStr.length == 0)
    {
        whereStr = " WHERE ";
    } else {
        whereStr += " AND ";
    }
    return whereStr;
}

function makeList(listStr) {
    if(listStr === undefined || listStr.length == 0)
    {
        listStr = '';
    } else {
        listStr += ", ";
    }
    return listStr;
}

function makeSet(setStr) {
    if(setStr === undefined || setStr.length == 0)
    {
        setStr = 'SET ';
    } else {
        setStr += ", ";
    }
    return setStr;
}

var docSpec_collist_all = ['cspec','spec','spec_en'];
function docSpec_HasColname(colname) {
    return (docSpec_collist_all.indexOf(colname.toString().toLowerCase()) > -1);
}

var docSpec_collist_keys = ['cspec'];
function docSpec_HasKeyname(keyname) {
    return (docSpec_collist_keys.indexOf(keyname.toString().toLowerCase()) > -1);
}

function docSpec_makeWhere(req, next) {
    var whereStr = '';
    if(req.body.params === undefined)
        return whereStr;
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(docSpec_HasColname(parstr)) {
            switch(parstr) {
            case 'cspec':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " cspec = ${" + parnext + "}";
                }
                break;
            case 'spec':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " spec LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            case 'spec_en':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " spec_en LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            }
        } else {
            next(new Error('column ' + parnext + " not exists in docspec!"));
            return "ERROR";
        }
    }
    return whereStr;
}

function docSpec_DoSelect(req, res, next) {
    var whereStr = docSpec_makeWhere(req, next);
    if(whereStr == "ERROR")
        return;
    var sqlStr = 'SELECT * FROM docspec ' + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.any(sqlStr, req.body.params)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved from docspec'
            });
        })
        .catch(function (err) {
            return next(err);
    });
}

function docSpec_DoInsert(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('insert params not found!'));
    }
    var parList = '';
    var parValues = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(docSpec_HasColname(parstr)) {
            parList = makeList(parList);
            parList += parstr;
            parValues = makeList(parValues);
            parValues += "${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " not exists in docspec!"));
        }
    }
    if(parList.length == 0)
        return next(new Error('not found any fields for insert into docspec!'));
    var sqlStr = "INSERT INTO docspec(" + parList + ") VALUES (" + parValues + ") RETURNING cspec";
    if (app.get('env') === 'development') {
       // console.log( sqlStr );
       console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.one(sqlStr, req.body.params)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Inserted into docspec'
                });
        })
        .catch(function (err) {
            return next(err);
    });
}

function docSpec_DoUpdate(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('update params not found!'));
    }
    var setStr = '';
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(docSpec_HasKeyname(parstr)) {
            whereStr = makeWhere(whereStr);
            whereStr += parstr + "=${" + parnext + "}";
        } else if(docSpec_HasColname(parstr)) {
            setStr = makeSet(setStr);
            setStr += parstr + "=${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " not exists in docspec!"));
        }
    }
    if(setStr.length == 0)
        return next(new Error('not found any fields for update the docspec!'));
    if(whereStr.length == 0)
        return next(new Error('not found any keys for update the docspec!'));
    var sqlStr = "UPDATE docspec " + setStr + " " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.result(sqlStr, req.body.params)
        .then(function (result) {
            res.status(200)
                .json({
                    status: 'success',
                    message: `Updated ${result.rowCount} from docspec`
                });
        })
        .catch(function (err) {
            return next(err);
    });
}

function docSpec_DoDelete(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('delete params not found!'));
    }
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(docSpec_HasKeyname(parstr)) {
            whereStr = makeWhere(whereStr);
            whereStr += parstr + "=${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " is not key columns in docspec!"));
        }
    }
    if(whereStr.length == 0)
        return next(new Error('not found any keys for delete from the docspec!'));
    var sqlStr = "DELETE FROM docspec " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.result(sqlStr, req.body.params)
        .then(function (result) {
            /* jshint ignore:start */
            res.status(200)
                .json({
                    status: 'success',
                    message: `Removed ${result.rowCount} from docspec`
            });
            /* jshint ignore:end */
        })
        .catch(function (err) {
            return next(err);
    });
}

// ---------------------------------------------------------
//  The function makes SQL for the docSpec from the body
//  URL : POST /docSpec/
//  BODY: 
//  {
//     "cmd": "select" or "insert" or "update or "delete",
//     "row_count": ... ,
//     "params": {
//         "cSpec":...,
//         "spec":"...",
//         "spec_en":"..."
//      }
//  }
// ---------------------------------------------------------
function docSpec_makeQuery(req, res, next) {
    if( req.body.cmd === undefined )
        return next( new Error('keyword cmd not found in the body!'));
    switch(req.body.cmd.toString().toLowerCase()) {
    case 'select':
        docSpec_DoSelect(req, res, next);
        break;
    case 'insert':
        docSpec_DoInsert(req, res, next);
        break;
    case 'update':
        docSpec_DoUpdate(req, res, next);
        break;
    case 'delete':
        docSpec_DoDelete(req, res, next);
        break;
    default:
        return next( new Error('cmd ' + req.body.cmd + " is unknow!"));
    }
}


var doc_collist_all = ['cdoc','cspec','pid','cstate','docn','docdate','docend','docauth','memo'];
function doc_HasColname(colname) {
    return (doc_collist_all.indexOf(colname.toString().toLowerCase()) > -1);
}

var doc_collist_keys = ['cdoc'];
function doc_HasKeyname(keyname) {
    return (doc_collist_keys.indexOf(keyname.toString().toLowerCase()) > -1);
}

function doc_makeWhere(req, next) {
    var whereStr = '';
    if(req.body.params === undefined)
        return whereStr;
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(doc_HasColname(parstr)) {
            switch(parstr) {
            case 'cdoc':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " cdoc = ${" + parnext + "}";
                }
                break;
            case 'cspec':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " cspec = ${" + parnext + "}";
                }
                break;
            case 'pid':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " pid = ${" + parnext + "}";
                }
                break;
            case 'cstate':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " cstate = ${" + parnext + "}";
                }
                break;
            case 'docn':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " docn LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            case 'docdate':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " docdate = ${" + parnext + "}";
                }
                break;
            case 'docend':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " docend = ${" + parnext + "}";
                }
                break;
            case 'docauth':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " docauth LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            case 'memo':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " memo = ${" + parnext + "}";
                }
                break;
            }
        } else {
            next(new Error('column ' + parnext + " not exists in doc!"));
            return "ERROR";
        }
    }
    return whereStr;
}

function doc_DoSelect(req, res, next) {
    var whereStr = doc_makeWhere(req, next);
    if(whereStr == "ERROR")
        return;
    var sqlStr = 'SELECT * FROM doc ' + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.any(sqlStr, req.body.params)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved from doc'
            });
        })
        .catch(function (err) {
            return next(err);
    });
}

function doc_DoInsert(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('insert params not found!'));
    }
    var parList = '';
    var parValues = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(doc_HasColname(parstr)) {
            parList = makeList(parList);
            parList += parstr;
            parValues = makeList(parValues);
            parValues += "${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " not exists in doc!"));
        }
    }
    if(parList.length == 0)
        return next(new Error('not found any fields for insert into doc!'));
    var sqlStr = "INSERT INTO doc(" + parList + ") VALUES (" + parValues + ") RETURNING cdoc";
    if (app.get('env') === 'development') {
       // console.log( sqlStr );
       console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.one(sqlStr, req.body.params)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Inserted into doc'
                });
        })
        .catch(function (err) {
            return next(err);
    });
}

function doc_DoUpdate(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('update params not found!'));
    }
    var setStr = '';
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(doc_HasKeyname(parstr)) {
            whereStr = makeWhere(whereStr);
            whereStr += parstr + "=${" + parnext + "}";
        } else if(doc_HasColname(parstr)) {
            setStr = makeSet(setStr);
            setStr += parstr + "=${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " not exists in doc!"));
        }
    }
    if(setStr.length == 0)
        return next(new Error('not found any fields for update the doc!'));
    if(whereStr.length == 0)
        return next(new Error('not found any keys for update the doc!'));
    var sqlStr = "UPDATE doc " + setStr + " " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.result(sqlStr, req.body.params)
        .then(function (result) {
            res.status(200)
                .json({
                    status: 'success',
                    message: `Updated ${result.rowCount} from doc`
                });
        })
        .catch(function (err) {
            return next(err);
    });
}

function doc_DoDelete(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('delete params not found!'));
    }
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(doc_HasKeyname(parstr)) {
            whereStr = makeWhere(whereStr);
            whereStr += parstr + "=${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " is not key columns in doc!"));
        }
    }
    if(whereStr.length == 0)
        return next(new Error('not found any keys for delete from the doc!'));
    var sqlStr = "DELETE FROM doc " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.result(sqlStr, req.body.params)
        .then(function (result) {
            /* jshint ignore:start */
            res.status(200)
                .json({
                    status: 'success',
                    message: `Removed ${result.rowCount} from doc`
            });
            /* jshint ignore:end */
        })
        .catch(function (err) {
            return next(err);
    });
}

// ---------------------------------------------------------
//  The function makes SQL for the doc from the body
//  URL : POST /doc/
//  BODY: 
//  {
//     "cmd": "select" or "insert" or "update or "delete",
//     "row_count": ... ,
//     "params": {
//         "cDoc":...,
//         "cSpec":...,
//         "pId":"...",
//         "cState":...,
//         "docN":"...",
//         "docDate":"...",
//         "docEnd":"...",
//         "docAuth":"...",
//         "Memo":"..."
//      }
//  }
// ---------------------------------------------------------
function doc_makeQuery(req, res, next) {
    if( req.body.cmd === undefined )
        return next( new Error('keyword cmd not found in the body!'));
    switch(req.body.cmd.toString().toLowerCase()) {
    case 'select':
        doc_DoSelect(req, res, next);
        break;
    case 'insert':
        doc_DoInsert(req, res, next);
        break;
    case 'update':
        doc_DoUpdate(req, res, next);
        break;
    case 'delete':
        doc_DoDelete(req, res, next);
        break;
    default:
        return next( new Error('cmd ' + req.body.cmd + " is unknow!"));
    }
}


var State_collist_all = ['cstate','state','state_en'];
function State_HasColname(colname) {
    return (State_collist_all.indexOf(colname.toString().toLowerCase()) > -1);
}

var State_collist_keys = ['cstate'];
function State_HasKeyname(keyname) {
    return (State_collist_keys.indexOf(keyname.toString().toLowerCase()) > -1);
}

function State_makeWhere(req, next) {
    var whereStr = '';
    if(req.body.params === undefined)
        return whereStr;
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(State_HasColname(parstr)) {
            switch(parstr) {
            case 'cstate':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " cstate = ${" + parnext + "}";
                }
                break;
            case 'state':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " state LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            case 'state_en':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " state_en LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            }
        } else {
            next(new Error('column ' + parnext + " not exists in state!"));
            return "ERROR";
        }
    }
    return whereStr;
}

function State_DoSelect(req, res, next) {
    var whereStr = State_makeWhere(req, next);
    if(whereStr == "ERROR")
        return;
    var sqlStr = 'SELECT * FROM state ' + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.any(sqlStr, req.body.params)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved from state'
            });
        })
        .catch(function (err) {
            return next(err);
    });
}

function State_DoInsert(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('insert params not found!'));
    }
    var parList = '';
    var parValues = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(State_HasColname(parstr)) {
            parList = makeList(parList);
            parList += parstr;
            parValues = makeList(parValues);
            parValues += "${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " not exists in state!"));
        }
    }
    if(parList.length == 0)
        return next(new Error('not found any fields for insert into state!'));
    var sqlStr = "INSERT INTO state(" + parList + ") VALUES (" + parValues + ") RETURNING cstate";
    if (app.get('env') === 'development') {
       // console.log( sqlStr );
       console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.one(sqlStr, req.body.params)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Inserted into state'
                });
        })
        .catch(function (err) {
            return next(err);
    });
}

function State_DoUpdate(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('update params not found!'));
    }
    var setStr = '';
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(State_HasKeyname(parstr)) {
            whereStr = makeWhere(whereStr);
            whereStr += parstr + "=${" + parnext + "}";
        } else if(State_HasColname(parstr)) {
            setStr = makeSet(setStr);
            setStr += parstr + "=${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " not exists in state!"));
        }
    }
    if(setStr.length == 0)
        return next(new Error('not found any fields for update the state!'));
    if(whereStr.length == 0)
        return next(new Error('not found any keys for update the state!'));
    var sqlStr = "UPDATE state " + setStr + " " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.result(sqlStr, req.body.params)
        .then(function (result) {
            res.status(200)
                .json({
                    status: 'success',
                    message: `Updated ${result.rowCount} from state`
                });
        })
        .catch(function (err) {
            return next(err);
    });
}

function State_DoDelete(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('delete params not found!'));
    }
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(State_HasKeyname(parstr)) {
            whereStr = makeWhere(whereStr);
            whereStr += parstr + "=${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " is not key columns in state!"));
        }
    }
    if(whereStr.length == 0)
        return next(new Error('not found any keys for delete from the state!'));
    var sqlStr = "DELETE FROM state " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.result(sqlStr, req.body.params)
        .then(function (result) {
            /* jshint ignore:start */
            res.status(200)
                .json({
                    status: 'success',
                    message: `Removed ${result.rowCount} from state`
            });
            /* jshint ignore:end */
        })
        .catch(function (err) {
            return next(err);
    });
}

// ---------------------------------------------------------
//  The function makes SQL for the State from the body
//  URL : POST /State/
//  BODY: 
//  {
//     "cmd": "select" or "insert" or "update or "delete",
//     "row_count": ... ,
//     "params": {
//         "cState":...,
//         "State":"...",
//         "State_en":"..."
//      }
//  }
// ---------------------------------------------------------
function State_makeQuery(req, res, next) {
    if( req.body.cmd === undefined )
        return next( new Error('keyword cmd not found in the body!'));
    switch(req.body.cmd.toString().toLowerCase()) {
    case 'select':
        State_DoSelect(req, res, next);
        break;
    case 'insert':
        State_DoInsert(req, res, next);
        break;
    case 'update':
        State_DoUpdate(req, res, next);
        break;
    case 'delete':
        State_DoDelete(req, res, next);
        break;
    default:
        return next( new Error('cmd ' + req.body.cmd + " is unknow!"));
    }
}


var person_collist_all = ['pid','cstate','shortname','fullname','legalname','borndate','sexid'];
function person_HasColname(colname) {
    return (person_collist_all.indexOf(colname.toString().toLowerCase()) > -1);
}

var person_collist_keys = ['pid'];
function person_HasKeyname(keyname) {
    return (person_collist_keys.indexOf(keyname.toString().toLowerCase()) > -1);
}

function person_makeWhere(req, next) {
    var whereStr = '';
    if(req.body.params === undefined)
        return whereStr;
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(person_HasColname(parstr)) {
            switch(parstr) {
            case 'pid':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " pid = ${" + parnext + "}";
                }
                break;
            case 'cstate':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " cstate = ${" + parnext + "}";
                }
                break;
            case 'shortname':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " shortname LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            case 'fullname':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " fullname LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            case 'legalname':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " legalname LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            case 'borndate':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " borndate = ${" + parnext + "}";
                }
                break;
            case 'sexid':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " sexid = ${" + parnext + "}";
                }
                break;
            }
        } else {
            next(new Error('column ' + parnext + " not exists in person!"));
            return "ERROR";
        }
    }
    return whereStr;
}

function person_DoSelect(req, res, next) {
    var whereStr = person_makeWhere(req, next);
    if(whereStr == "ERROR")
        return;
    var sqlStr = 'SELECT * FROM person ' + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.any(sqlStr, req.body.params)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved from person'
            });
        })
        .catch(function (err) {
            return next(err);
    });
}

function person_DoInsert(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('insert params not found!'));
    }
    var parList = '';
    var parValues = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(person_HasColname(parstr)) {
            parList = makeList(parList);
            parList += parstr;
            parValues = makeList(parValues);
            parValues += "${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " not exists in person!"));
        }
    }
    if(parList.length == 0)
        return next(new Error('not found any fields for insert into person!'));
    var sqlStr = "INSERT INTO person(" + parList + ") VALUES (" + parValues + ")";
    if (app.get('env') === 'development') {
       // console.log( sqlStr );
       console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.none(sqlStr, req.body.params)
        .then(function () {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Inserted into person'
                });
        })
        .catch(function (err) {
            return next(err);
    });
}

function person_DoUpdate(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('update params not found!'));
    }
    var setStr = '';
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(person_HasKeyname(parstr)) {
            whereStr = makeWhere(whereStr);
            whereStr += parstr + "=${" + parnext + "}";
        } else if(person_HasColname(parstr)) {
            setStr = makeSet(setStr);
            setStr += parstr + "=${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " not exists in person!"));
        }
    }
    if(setStr.length == 0)
        return next(new Error('not found any fields for update the person!'));
    if(whereStr.length == 0)
        return next(new Error('not found any keys for update the person!'));
    var sqlStr = "UPDATE person " + setStr + " " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.result(sqlStr, req.body.params)
        .then(function (result) {
            res.status(200)
                .json({
                    status: 'success',
                    message: `Updated ${result.rowCount} from person`
                });
        })
        .catch(function (err) {
            return next(err);
    });
}

function person_DoDelete(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('delete params not found!'));
    }
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(person_HasKeyname(parstr)) {
            whereStr = makeWhere(whereStr);
            whereStr += parstr + "=${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " is not key columns in person!"));
        }
    }
    if(whereStr.length == 0)
        return next(new Error('not found any keys for delete from the person!'));
    var sqlStr = "DELETE FROM person " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.result(sqlStr, req.body.params)
        .then(function (result) {
            /* jshint ignore:start */
            res.status(200)
                .json({
                    status: 'success',
                    message: `Removed ${result.rowCount} from person`
            });
            /* jshint ignore:end */
        })
        .catch(function (err) {
            return next(err);
    });
}

// ---------------------------------------------------------
//  The function makes SQL for the person from the body
//  URL : POST /person/
//  BODY: 
//  {
//     "cmd": "select" or "insert" or "update or "delete",
//     "row_count": ... ,
//     "params": {
//         "pId":"...",
//         "cState":...,
//         "shortName":"...",
//         "fullName":"...",
//         "legalName":"...",
//         "bornDate":"...",
//         "sexId":"..."
//      }
//  }
// ---------------------------------------------------------
function person_makeQuery(req, res, next) {
    if( req.body.cmd === undefined )
        return next( new Error('keyword cmd not found in the body!'));
    switch(req.body.cmd.toString().toLowerCase()) {
    case 'select':
        person_DoSelect(req, res, next);
        break;
    case 'insert':
        person_DoInsert(req, res, next);
        break;
    case 'update':
        person_DoUpdate(req, res, next);
        break;
    case 'delete':
        person_DoDelete(req, res, next);
        break;
    default:
        return next( new Error('cmd ' + req.body.cmd + " is unknow!"));
    }
}


var photoData_collist_all = ['pid','cphoto','photo'];
function photoData_HasColname(colname) {
    return (photoData_collist_all.indexOf(colname.toString().toLowerCase()) > -1);
}

var photoData_collist_keys = ['pid'];
function photoData_HasKeyname(keyname) {
    return (photoData_collist_keys.indexOf(keyname.toString().toLowerCase()) > -1);
}

function photoData_makeWhere(req, next) {
    var whereStr = '';
    if(req.body.params === undefined)
        return whereStr;
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(photoData_HasColname(parstr)) {
            switch(parstr) {
            case 'pid':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " pid = ${" + parnext + "}";
                }
                break;
            case 'cphoto':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " cphoto = ${" + parnext + "}";
                }
                break;
            case 'photo':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " photo LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            }
        } else {
            next(new Error('column ' + parnext + " not exists in photodata!"));
            return "ERROR";
        }
    }
    return whereStr;
}

function photoData_DoSelect(req, res, next) {
    var whereStr = photoData_makeWhere(req, next);
    if(whereStr == "ERROR")
        return;
    var sqlStr = 'SELECT * FROM photodata ' + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.any(sqlStr, req.body.params)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved from photodata'
            });
        })
        .catch(function (err) {
            return next(err);
    });
}

function photoData_DoInsert(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('insert params not found!'));
    }
    var parList = '';
    var parValues = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(photoData_HasColname(parstr)) {
            parList = makeList(parList);
            parList += parstr;
            parValues = makeList(parValues);
            parValues += "${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " not exists in photodata!"));
        }
    }
    if(parList.length == 0)
        return next(new Error('not found any fields for insert into photodata!'));
    var sqlStr = "INSERT INTO photodata(" + parList + ") VALUES (" + parValues + ")";
    if (app.get('env') === 'development') {
       // console.log( sqlStr );
       console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.none(sqlStr, req.body.params)
        .then(function () {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Inserted into photodata'
                });
        })
        .catch(function (err) {
            return next(err);
    });
}

function photoData_DoUpdate(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('update params not found!'));
    }
    var setStr = '';
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(photoData_HasKeyname(parstr)) {
            whereStr = makeWhere(whereStr);
            whereStr += parstr + "=${" + parnext + "}";
        } else if(photoData_HasColname(parstr)) {
            setStr = makeSet(setStr);
            setStr += parstr + "=${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " not exists in photodata!"));
        }
    }
    if(setStr.length == 0)
        return next(new Error('not found any fields for update the photodata!'));
    if(whereStr.length == 0)
        return next(new Error('not found any keys for update the photodata!'));
    var sqlStr = "UPDATE photodata " + setStr + " " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.result(sqlStr, req.body.params)
        .then(function (result) {
            res.status(200)
                .json({
                    status: 'success',
                    message: `Updated ${result.rowCount} from photodata`
                });
        })
        .catch(function (err) {
            return next(err);
    });
}

function photoData_DoDelete(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('delete params not found!'));
    }
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(photoData_HasKeyname(parstr)) {
            whereStr = makeWhere(whereStr);
            whereStr += parstr + "=${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " is not key columns in photodata!"));
        }
    }
    if(whereStr.length == 0)
        return next(new Error('not found any keys for delete from the photodata!'));
    var sqlStr = "DELETE FROM photodata " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.result(sqlStr, req.body.params)
        .then(function (result) {
            /* jshint ignore:start */
            res.status(200)
                .json({
                    status: 'success',
                    message: `Removed ${result.rowCount} from photodata`
            });
            /* jshint ignore:end */
        })
        .catch(function (err) {
            return next(err);
    });
}

// ---------------------------------------------------------
//  The function makes SQL for the photoData from the body
//  URL : POST /photoData/
//  BODY: 
//  {
//     "cmd": "select" or "insert" or "update or "delete",
//     "row_count": ... ,
//     "params": {
//         "pId":"...",
//         "cPhoto":...,
//         "photo":"..."
//      }
//  }
// ---------------------------------------------------------
function photoData_makeQuery(req, res, next) {
    if( req.body.cmd === undefined )
        return next( new Error('keyword cmd not found in the body!'));
    switch(req.body.cmd.toString().toLowerCase()) {
    case 'select':
        photoData_DoSelect(req, res, next);
        break;
    case 'insert':
        photoData_DoInsert(req, res, next);
        break;
    case 'update':
        photoData_DoUpdate(req, res, next);
        break;
    case 'delete':
        photoData_DoDelete(req, res, next);
        break;
    default:
        return next( new Error('cmd ' + req.body.cmd + " is unknow!"));
    }
}


var photoSpec_collist_all = ['cphoto','photospec'];
function photoSpec_HasColname(colname) {
    return (photoSpec_collist_all.indexOf(colname.toString().toLowerCase()) > -1);
}

var photoSpec_collist_keys = ['cphoto'];
function photoSpec_HasKeyname(keyname) {
    return (photoSpec_collist_keys.indexOf(keyname.toString().toLowerCase()) > -1);
}

function photoSpec_makeWhere(req, next) {
    var whereStr = '';
    if(req.body.params === undefined)
        return whereStr;
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(photoSpec_HasColname(parstr)) {
            switch(parstr) {
            case 'cphoto':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " cphoto = ${" + parnext + "}";
                }
                break;
            case 'photospec':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " photospec LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            }
        } else {
            next(new Error('column ' + parnext + " not exists in photospec!"));
            return "ERROR";
        }
    }
    return whereStr;
}

function photoSpec_DoSelect(req, res, next) {
    var whereStr = photoSpec_makeWhere(req, next);
    if(whereStr == "ERROR")
        return;
    var sqlStr = 'SELECT * FROM photospec ' + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.any(sqlStr, req.body.params)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved from photospec'
            });
        })
        .catch(function (err) {
            return next(err);
    });
}

function photoSpec_DoInsert(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('insert params not found!'));
    }
    var parList = '';
    var parValues = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(photoSpec_HasColname(parstr)) {
            parList = makeList(parList);
            parList += parstr;
            parValues = makeList(parValues);
            parValues += "${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " not exists in photospec!"));
        }
    }
    if(parList.length == 0)
        return next(new Error('not found any fields for insert into photospec!'));
    var sqlStr = "INSERT INTO photospec(" + parList + ") VALUES (" + parValues + ") RETURNING cphoto";
    if (app.get('env') === 'development') {
       // console.log( sqlStr );
       console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.one(sqlStr, req.body.params)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Inserted into photospec'
                });
        })
        .catch(function (err) {
            return next(err);
    });
}

function photoSpec_DoUpdate(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('update params not found!'));
    }
    var setStr = '';
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(photoSpec_HasKeyname(parstr)) {
            whereStr = makeWhere(whereStr);
            whereStr += parstr + "=${" + parnext + "}";
        } else if(photoSpec_HasColname(parstr)) {
            setStr = makeSet(setStr);
            setStr += parstr + "=${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " not exists in photospec!"));
        }
    }
    if(setStr.length == 0)
        return next(new Error('not found any fields for update the photospec!'));
    if(whereStr.length == 0)
        return next(new Error('not found any keys for update the photospec!'));
    var sqlStr = "UPDATE photospec " + setStr + " " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.result(sqlStr, req.body.params)
        .then(function (result) {
            res.status(200)
                .json({
                    status: 'success',
                    message: `Updated ${result.rowCount} from photospec`
                });
        })
        .catch(function (err) {
            return next(err);
    });
}

function photoSpec_DoDelete(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('delete params not found!'));
    }
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(photoSpec_HasKeyname(parstr)) {
            whereStr = makeWhere(whereStr);
            whereStr += parstr + "=${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " is not key columns in photospec!"));
        }
    }
    if(whereStr.length == 0)
        return next(new Error('not found any keys for delete from the photospec!'));
    var sqlStr = "DELETE FROM photospec " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.result(sqlStr, req.body.params)
        .then(function (result) {
            /* jshint ignore:start */
            res.status(200)
                .json({
                    status: 'success',
                    message: `Removed ${result.rowCount} from photospec`
            });
            /* jshint ignore:end */
        })
        .catch(function (err) {
            return next(err);
    });
}

// ---------------------------------------------------------
//  The function makes SQL for the photoSpec from the body
//  URL : POST /photoSpec/
//  BODY: 
//  {
//     "cmd": "select" or "insert" or "update or "delete",
//     "row_count": ... ,
//     "params": {
//         "cPhoto":...,
//         "photoSpec":"..."
//      }
//  }
// ---------------------------------------------------------
function photoSpec_makeQuery(req, res, next) {
    if( req.body.cmd === undefined )
        return next( new Error('keyword cmd not found in the body!'));
    switch(req.body.cmd.toString().toLowerCase()) {
    case 'select':
        photoSpec_DoSelect(req, res, next);
        break;
    case 'insert':
        photoSpec_DoInsert(req, res, next);
        break;
    case 'update':
        photoSpec_DoUpdate(req, res, next);
        break;
    case 'delete':
        photoSpec_DoDelete(req, res, next);
        break;
    default:
        return next( new Error('cmd ' + req.body.cmd + " is unknow!"));
    }
}


var audioDatа_collist_all = ['pid','audiofull','audiomemo','memo'];
function audioDatа_HasColname(colname) {
    return (audioDatа_collist_all.indexOf(colname.toString().toLowerCase()) > -1);
}

var audioDatа_collist_keys = ['pid'];
function audioDatа_HasKeyname(keyname) {
    return (audioDatа_collist_keys.indexOf(keyname.toString().toLowerCase()) > -1);
}

function audioDatа_makeWhere(req, next) {
    var whereStr = '';
    if(req.body.params === undefined)
        return whereStr;
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(audioDatа_HasColname(parstr)) {
            switch(parstr) {
            case 'pid':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " pid = ${" + parnext + "}";
                }
                break;
            case 'audiofull':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " audiofull LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            case 'audiomemo':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " audiomemo LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            case 'memo':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " memo = ${" + parnext + "}";
                }
                break;
            }
        } else {
            next(new Error('column ' + parnext + " not exists in audiodatа!"));
            return "ERROR";
        }
    }
    return whereStr;
}

function audioDatа_DoSelect(req, res, next) {
    var whereStr = audioDatа_makeWhere(req, next);
    if(whereStr == "ERROR")
        return;
    var sqlStr = 'SELECT * FROM audiodatа ' + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.any(sqlStr, req.body.params)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved from audiodatа'
            });
        })
        .catch(function (err) {
            return next(err);
    });
}

function audioDatа_DoInsert(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('insert params not found!'));
    }
    var parList = '';
    var parValues = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(audioDatа_HasColname(parstr)) {
            parList = makeList(parList);
            parList += parstr;
            parValues = makeList(parValues);
            parValues += "${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " not exists in audiodatа!"));
        }
    }
    if(parList.length == 0)
        return next(new Error('not found any fields for insert into audiodatа!'));
    var sqlStr = "INSERT INTO audiodatа(" + parList + ") VALUES (" + parValues + ")";
    if (app.get('env') === 'development') {
       // console.log( sqlStr );
       console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.none(sqlStr, req.body.params)
        .then(function () {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Inserted into audiodatа'
                });
        })
        .catch(function (err) {
            return next(err);
    });
}

function audioDatа_DoUpdate(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('update params not found!'));
    }
    var setStr = '';
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(audioDatа_HasKeyname(parstr)) {
            whereStr = makeWhere(whereStr);
            whereStr += parstr + "=${" + parnext + "}";
        } else if(audioDatа_HasColname(parstr)) {
            setStr = makeSet(setStr);
            setStr += parstr + "=${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " not exists in audiodatа!"));
        }
    }
    if(setStr.length == 0)
        return next(new Error('not found any fields for update the audiodatа!'));
    if(whereStr.length == 0)
        return next(new Error('not found any keys for update the audiodatа!'));
    var sqlStr = "UPDATE audiodatа " + setStr + " " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.result(sqlStr, req.body.params)
        .then(function (result) {
            res.status(200)
                .json({
                    status: 'success',
                    message: `Updated ${result.rowCount} from audiodatа`
                });
        })
        .catch(function (err) {
            return next(err);
    });
}

function audioDatа_DoDelete(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('delete params not found!'));
    }
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(audioDatа_HasKeyname(parstr)) {
            whereStr = makeWhere(whereStr);
            whereStr += parstr + "=${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " is not key columns in audiodatа!"));
        }
    }
    if(whereStr.length == 0)
        return next(new Error('not found any keys for delete from the audiodatа!'));
    var sqlStr = "DELETE FROM audiodatа " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.result(sqlStr, req.body.params)
        .then(function (result) {
            /* jshint ignore:start */
            res.status(200)
                .json({
                    status: 'success',
                    message: `Removed ${result.rowCount} from audiodatа`
            });
            /* jshint ignore:end */
        })
        .catch(function (err) {
            return next(err);
    });
}

// ---------------------------------------------------------
//  The function makes SQL for the audioDatа from the body
//  URL : POST /audioDatа/
//  BODY: 
//  {
//     "cmd": "select" or "insert" or "update or "delete",
//     "row_count": ... ,
//     "params": {
//         "pId":"...",
//         "audioFull":"...",
//         "audioMemo":"...",
//         "Memo":"..."
//      }
//  }
// ---------------------------------------------------------
function audioDatа_makeQuery(req, res, next) {
    if( req.body.cmd === undefined )
        return next( new Error('keyword cmd not found in the body!'));
    switch(req.body.cmd.toString().toLowerCase()) {
    case 'select':
        audioDatа_DoSelect(req, res, next);
        break;
    case 'insert':
        audioDatа_DoInsert(req, res, next);
        break;
    case 'update':
        audioDatа_DoUpdate(req, res, next);
        break;
    case 'delete':
        audioDatа_DoDelete(req, res, next);
        break;
    default:
        return next( new Error('cmd ' + req.body.cmd + " is unknow!"));
    }
}


var operator_collist_all = ['coper','crule','cpoint','stuff','stuff_en','key','phrase','stateid'];
function operator_HasColname(colname) {
    return (operator_collist_all.indexOf(colname.toString().toLowerCase()) > -1);
}

var operator_collist_keys = ['coper'];
function operator_HasKeyname(keyname) {
    return (operator_collist_keys.indexOf(keyname.toString().toLowerCase()) > -1);
}

function operator_makeWhere(req, next) {
    var whereStr = '';
    if(req.body.params === undefined)
        return whereStr;
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(operator_HasColname(parstr)) {
            switch(parstr) {
            case 'coper':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " coper = ${" + parnext + "}";
                }
                break;
            case 'crule':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " crule = ${" + parnext + "}";
                }
                break;
            case 'cpoint':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " cpoint = ${" + parnext + "}";
                }
                break;
            case 'stuff':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " stuff LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            case 'stuff_en':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " stuff_en LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            case 'key':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " key LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            case 'phrase':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " phrase LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            case 'stateid':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " stateid = ${" + parnext + "}";
                }
                break;
            }
        } else {
            next(new Error('column ' + parnext + " not exists in operator!"));
            return "ERROR";
        }
    }
    return whereStr;
}

function operator_DoSelect(req, res, next) {
    var whereStr = operator_makeWhere(req, next);
    if(whereStr == "ERROR")
        return;
    var sqlStr = 'SELECT * FROM operator ' + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.any(sqlStr, req.body.params)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved from operator'
            });
        })
        .catch(function (err) {
            return next(err);
    });
}

function operator_DoInsert(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('insert params not found!'));
    }
    var parList = '';
    var parValues = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(operator_HasColname(parstr)) {
            parList = makeList(parList);
            parList += parstr;
            parValues = makeList(parValues);
            parValues += "${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " not exists in operator!"));
        }
    }
    if(parList.length == 0)
        return next(new Error('not found any fields for insert into operator!'));
    var sqlStr = "INSERT INTO operator(" + parList + ") VALUES (" + parValues + ") RETURNING coper";
    if (app.get('env') === 'development') {
       // console.log( sqlStr );
       console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.one(sqlStr, req.body.params)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Inserted into operator'
                });
        })
        .catch(function (err) {
            return next(err);
    });
}

function operator_DoUpdate(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('update params not found!'));
    }
    var setStr = '';
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(operator_HasKeyname(parstr)) {
            whereStr = makeWhere(whereStr);
            whereStr += parstr + "=${" + parnext + "}";
        } else if(operator_HasColname(parstr)) {
            setStr = makeSet(setStr);
            setStr += parstr + "=${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " not exists in operator!"));
        }
    }
    if(setStr.length == 0)
        return next(new Error('not found any fields for update the operator!'));
    if(whereStr.length == 0)
        return next(new Error('not found any keys for update the operator!'));
    var sqlStr = "UPDATE operator " + setStr + " " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.result(sqlStr, req.body.params)
        .then(function (result) {
            res.status(200)
                .json({
                    status: 'success',
                    message: `Updated ${result.rowCount} from operator`
                });
        })
        .catch(function (err) {
            return next(err);
    });
}

function operator_DoDelete(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('delete params not found!'));
    }
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(operator_HasKeyname(parstr)) {
            whereStr = makeWhere(whereStr);
            whereStr += parstr + "=${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " is not key columns in operator!"));
        }
    }
    if(whereStr.length == 0)
        return next(new Error('not found any keys for delete from the operator!'));
    var sqlStr = "DELETE FROM operator " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.result(sqlStr, req.body.params)
        .then(function (result) {
            /* jshint ignore:start */
            res.status(200)
                .json({
                    status: 'success',
                    message: `Removed ${result.rowCount} from operator`
            });
            /* jshint ignore:end */
        })
        .catch(function (err) {
            return next(err);
    });
}

// ---------------------------------------------------------
//  The function makes SQL for the operator from the body
//  URL : POST /operator/
//  BODY: 
//  {
//     "cmd": "select" or "insert" or "update or "delete",
//     "row_count": ... ,
//     "params": {
//         "cOper":...,
//         "cRule":...,
//         "cPoint":...,
//         "Stuff":"...",
//         "Stuff_en":"...",
//         "key":"...",
//         "phrase":"...",
//         "stateId":"..."
//      }
//  }
// ---------------------------------------------------------
function operator_makeQuery(req, res, next) {
    if( req.body.cmd === undefined )
        return next( new Error('keyword cmd not found in the body!'));
    switch(req.body.cmd.toString().toLowerCase()) {
    case 'select':
        operator_DoSelect(req, res, next);
        break;
    case 'insert':
        operator_DoInsert(req, res, next);
        break;
    case 'update':
        operator_DoUpdate(req, res, next);
        break;
    case 'delete':
        operator_DoDelete(req, res, next);
        break;
    default:
        return next( new Error('cmd ' + req.body.cmd + " is unknow!"));
    }
}


var regPoint_collist_all = ['cpoint','cstate','point','point_en','location','location_en'];
function regPoint_HasColname(colname) {
    return (regPoint_collist_all.indexOf(colname.toString().toLowerCase()) > -1);
}

var regPoint_collist_keys = ['cpoint'];
function regPoint_HasKeyname(keyname) {
    return (regPoint_collist_keys.indexOf(keyname.toString().toLowerCase()) > -1);
}

function regPoint_makeWhere(req, next) {
    var whereStr = '';
    if(req.body.params === undefined)
        return whereStr;
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(regPoint_HasColname(parstr)) {
            switch(parstr) {
            case 'cpoint':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " cpoint = ${" + parnext + "}";
                }
                break;
            case 'cstate':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " cstate = ${" + parnext + "}";
                }
                break;
            case 'point':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " point LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            case 'point_en':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " point_en LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            case 'location':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " location LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            case 'location_en':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " location_en LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            }
        } else {
            next(new Error('column ' + parnext + " not exists in regpoint!"));
            return "ERROR";
        }
    }
    return whereStr;
}

function regPoint_DoSelect(req, res, next) {
    var whereStr = regPoint_makeWhere(req, next);
    if(whereStr == "ERROR")
        return;
    var sqlStr = 'SELECT * FROM regpoint ' + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.any(sqlStr, req.body.params)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved from regpoint'
            });
        })
        .catch(function (err) {
            return next(err);
    });
}

function regPoint_DoInsert(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('insert params not found!'));
    }
    var parList = '';
    var parValues = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(regPoint_HasColname(parstr)) {
            parList = makeList(parList);
            parList += parstr;
            parValues = makeList(parValues);
            parValues += "${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " not exists in regpoint!"));
        }
    }
    if(parList.length == 0)
        return next(new Error('not found any fields for insert into regpoint!'));
    var sqlStr = "INSERT INTO regpoint(" + parList + ") VALUES (" + parValues + ") RETURNING cpoint";
    if (app.get('env') === 'development') {
       // console.log( sqlStr );
       console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.one(sqlStr, req.body.params)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Inserted into regpoint'
                });
        })
        .catch(function (err) {
            return next(err);
    });
}

function regPoint_DoUpdate(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('update params not found!'));
    }
    var setStr = '';
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(regPoint_HasKeyname(parstr)) {
            whereStr = makeWhere(whereStr);
            whereStr += parstr + "=${" + parnext + "}";
        } else if(regPoint_HasColname(parstr)) {
            setStr = makeSet(setStr);
            setStr += parstr + "=${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " not exists in regpoint!"));
        }
    }
    if(setStr.length == 0)
        return next(new Error('not found any fields for update the regpoint!'));
    if(whereStr.length == 0)
        return next(new Error('not found any keys for update the regpoint!'));
    var sqlStr = "UPDATE regpoint " + setStr + " " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.result(sqlStr, req.body.params)
        .then(function (result) {
            res.status(200)
                .json({
                    status: 'success',
                    message: `Updated ${result.rowCount} from regpoint`
                });
        })
        .catch(function (err) {
            return next(err);
    });
}

function regPoint_DoDelete(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('delete params not found!'));
    }
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(regPoint_HasKeyname(parstr)) {
            whereStr = makeWhere(whereStr);
            whereStr += parstr + "=${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " is not key columns in regpoint!"));
        }
    }
    if(whereStr.length == 0)
        return next(new Error('not found any keys for delete from the regpoint!'));
    var sqlStr = "DELETE FROM regpoint " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.result(sqlStr, req.body.params)
        .then(function (result) {
            /* jshint ignore:start */
            res.status(200)
                .json({
                    status: 'success',
                    message: `Removed ${result.rowCount} from regpoint`
            });
            /* jshint ignore:end */
        })
        .catch(function (err) {
            return next(err);
    });
}

// ---------------------------------------------------------
//  The function makes SQL for the regPoint from the body
//  URL : POST /regPoint/
//  BODY: 
//  {
//     "cmd": "select" or "insert" or "update or "delete",
//     "row_count": ... ,
//     "params": {
//         "cPoint":...,
//         "cState":...,
//         "point":"...",
//         "point_en":"...",
//         "location":"...",
//         "location_en":"..."
//      }
//  }
// ---------------------------------------------------------
function regPoint_makeQuery(req, res, next) {
    if( req.body.cmd === undefined )
        return next( new Error('keyword cmd not found in the body!'));
    switch(req.body.cmd.toString().toLowerCase()) {
    case 'select':
        regPoint_DoSelect(req, res, next);
        break;
    case 'insert':
        regPoint_DoInsert(req, res, next);
        break;
    case 'update':
        regPoint_DoUpdate(req, res, next);
        break;
    case 'delete':
        regPoint_DoDelete(req, res, next);
        break;
    default:
        return next( new Error('cmd ' + req.body.cmd + " is unknow!"));
    }
}


var opRule_collist_all = ['crule','rule','rule_en'];
function opRule_HasColname(colname) {
    return (opRule_collist_all.indexOf(colname.toString().toLowerCase()) > -1);
}

var opRule_collist_keys = ['crule'];
function opRule_HasKeyname(keyname) {
    return (opRule_collist_keys.indexOf(keyname.toString().toLowerCase()) > -1);
}

function opRule_makeWhere(req, next) {
    var whereStr = '';
    if(req.body.params === undefined)
        return whereStr;
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(opRule_HasColname(parstr)) {
            switch(parstr) {
            case 'crule':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " crule = ${" + parnext + "}";
                }
                break;
            case 'rule':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " rule LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            case 'rule_en':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " rule_en LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            }
        } else {
            next(new Error('column ' + parnext + " not exists in oprule!"));
            return "ERROR";
        }
    }
    return whereStr;
}

function opRule_DoSelect(req, res, next) {
    var whereStr = opRule_makeWhere(req, next);
    if(whereStr == "ERROR")
        return;
    var sqlStr = 'SELECT * FROM oprule ' + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.any(sqlStr, req.body.params)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved from oprule'
            });
        })
        .catch(function (err) {
            return next(err);
    });
}

function opRule_DoInsert(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('insert params not found!'));
    }
    var parList = '';
    var parValues = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(opRule_HasColname(parstr)) {
            parList = makeList(parList);
            parList += parstr;
            parValues = makeList(parValues);
            parValues += "${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " not exists in oprule!"));
        }
    }
    if(parList.length == 0)
        return next(new Error('not found any fields for insert into oprule!'));
    var sqlStr = "INSERT INTO oprule(" + parList + ") VALUES (" + parValues + ") RETURNING crule";
    if (app.get('env') === 'development') {
       // console.log( sqlStr );
       console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.one(sqlStr, req.body.params)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Inserted into oprule'
                });
        })
        .catch(function (err) {
            return next(err);
    });
}

function opRule_DoUpdate(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('update params not found!'));
    }
    var setStr = '';
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(opRule_HasKeyname(parstr)) {
            whereStr = makeWhere(whereStr);
            whereStr += parstr + "=${" + parnext + "}";
        } else if(opRule_HasColname(parstr)) {
            setStr = makeSet(setStr);
            setStr += parstr + "=${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " not exists in oprule!"));
        }
    }
    if(setStr.length == 0)
        return next(new Error('not found any fields for update the oprule!'));
    if(whereStr.length == 0)
        return next(new Error('not found any keys for update the oprule!'));
    var sqlStr = "UPDATE oprule " + setStr + " " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.result(sqlStr, req.body.params)
        .then(function (result) {
            res.status(200)
                .json({
                    status: 'success',
                    message: `Updated ${result.rowCount} from oprule`
                });
        })
        .catch(function (err) {
            return next(err);
    });
}

function opRule_DoDelete(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('delete params not found!'));
    }
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(opRule_HasKeyname(parstr)) {
            whereStr = makeWhere(whereStr);
            whereStr += parstr + "=${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " is not key columns in oprule!"));
        }
    }
    if(whereStr.length == 0)
        return next(new Error('not found any keys for delete from the oprule!'));
    var sqlStr = "DELETE FROM oprule " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.result(sqlStr, req.body.params)
        .then(function (result) {
            /* jshint ignore:start */
            res.status(200)
                .json({
                    status: 'success',
                    message: `Removed ${result.rowCount} from oprule`
            });
            /* jshint ignore:end */
        })
        .catch(function (err) {
            return next(err);
    });
}

// ---------------------------------------------------------
//  The function makes SQL for the opRule from the body
//  URL : POST /opRule/
//  BODY: 
//  {
//     "cmd": "select" or "insert" or "update or "delete",
//     "row_count": ... ,
//     "params": {
//         "cRule":...,
//         "Rule":"...",
//         "Rule_en":"..."
//      }
//  }
// ---------------------------------------------------------
function opRule_makeQuery(req, res, next) {
    if( req.body.cmd === undefined )
        return next( new Error('keyword cmd not found in the body!'));
    switch(req.body.cmd.toString().toLowerCase()) {
    case 'select':
        opRule_DoSelect(req, res, next);
        break;
    case 'insert':
        opRule_DoInsert(req, res, next);
        break;
    case 'update':
        opRule_DoUpdate(req, res, next);
        break;
    case 'delete':
        opRule_DoDelete(req, res, next);
        break;
    default:
        return next( new Error('cmd ' + req.body.cmd + " is unknow!"));
    }
}


var Contact_collist_all = ['ccontact','cagent','pid','key','phrase','memo','stateid'];
function Contact_HasColname(colname) {
    return (Contact_collist_all.indexOf(colname.toString().toLowerCase()) > -1);
}

var Contact_collist_keys = ['ccontact'];
function Contact_HasKeyname(keyname) {
    return (Contact_collist_keys.indexOf(keyname.toString().toLowerCase()) > -1);
}

function Contact_makeWhere(req, next) {
    var whereStr = '';
    if(req.body.params === undefined)
        return whereStr;
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(Contact_HasColname(parstr)) {
            switch(parstr) {
            case 'ccontact':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " ccontact = ${" + parnext + "}";
                }
                break;
            case 'cagent':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " cagent = ${" + parnext + "}";
                }
                break;
            case 'pid':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " pid = ${" + parnext + "}";
                }
                break;
            case 'key':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " key LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            case 'phrase':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " phrase LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            case 'memo':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " memo = ${" + parnext + "}";
                }
                break;
            case 'stateid':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " stateid = ${" + parnext + "}";
                }
                break;
            }
        } else {
            next(new Error('column ' + parnext + " not exists in contact!"));
            return "ERROR";
        }
    }
    return whereStr;
}

function Contact_DoSelect(req, res, next) {
    var whereStr = Contact_makeWhere(req, next);
    if(whereStr == "ERROR")
        return;
    var sqlStr = 'SELECT * FROM contact ' + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.any(sqlStr, req.body.params)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved from contact'
            });
        })
        .catch(function (err) {
            return next(err);
    });
}

function Contact_DoInsert(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('insert params not found!'));
    }
    var parList = '';
    var parValues = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(Contact_HasColname(parstr)) {
            parList = makeList(parList);
            parList += parstr;
            parValues = makeList(parValues);
            parValues += "${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " not exists in contact!"));
        }
    }
    if(parList.length == 0)
        return next(new Error('not found any fields for insert into contact!'));
    var sqlStr = "INSERT INTO contact(" + parList + ") VALUES (" + parValues + ") RETURNING ccontact";
    if (app.get('env') === 'development') {
       // console.log( sqlStr );
       console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.one(sqlStr, req.body.params)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Inserted into contact'
                });
        })
        .catch(function (err) {
            return next(err);
    });
}

function Contact_DoUpdate(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('update params not found!'));
    }
    var setStr = '';
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(Contact_HasKeyname(parstr)) {
            whereStr = makeWhere(whereStr);
            whereStr += parstr + "=${" + parnext + "}";
        } else if(Contact_HasColname(parstr)) {
            setStr = makeSet(setStr);
            setStr += parstr + "=${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " not exists in contact!"));
        }
    }
    if(setStr.length == 0)
        return next(new Error('not found any fields for update the contact!'));
    if(whereStr.length == 0)
        return next(new Error('not found any keys for update the contact!'));
    var sqlStr = "UPDATE contact " + setStr + " " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.result(sqlStr, req.body.params)
        .then(function (result) {
            res.status(200)
                .json({
                    status: 'success',
                    message: `Updated ${result.rowCount} from contact`
                });
        })
        .catch(function (err) {
            return next(err);
    });
}

function Contact_DoDelete(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('delete params not found!'));
    }
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(Contact_HasKeyname(parstr)) {
            whereStr = makeWhere(whereStr);
            whereStr += parstr + "=${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " is not key columns in contact!"));
        }
    }
    if(whereStr.length == 0)
        return next(new Error('not found any keys for delete from the contact!'));
    var sqlStr = "DELETE FROM contact " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.result(sqlStr, req.body.params)
        .then(function (result) {
            /* jshint ignore:start */
            res.status(200)
                .json({
                    status: 'success',
                    message: `Removed ${result.rowCount} from contact`
            });
            /* jshint ignore:end */
        })
        .catch(function (err) {
            return next(err);
    });
}

// ---------------------------------------------------------
//  The function makes SQL for the Contact from the body
//  URL : POST /Contact/
//  BODY: 
//  {
//     "cmd": "select" or "insert" or "update or "delete",
//     "row_count": ... ,
//     "params": {
//         "cContact":...,
//         "cAgent":...,
//         "pId":"...",
//         "key":"...",
//         "phrase":"...",
//         "Memo":"...",
//         "stateId":"..."
//      }
//  }
// ---------------------------------------------------------
function Contact_makeQuery(req, res, next) {
    if( req.body.cmd === undefined )
        return next( new Error('keyword cmd not found in the body!'));
    switch(req.body.cmd.toString().toLowerCase()) {
    case 'select':
        Contact_DoSelect(req, res, next);
        break;
    case 'insert':
        Contact_DoInsert(req, res, next);
        break;
    case 'update':
        Contact_DoUpdate(req, res, next);
        break;
    case 'delete':
        Contact_DoDelete(req, res, next);
        break;
    default:
        return next( new Error('cmd ' + req.body.cmd + " is unknow!"));
    }
}


var Agent_collist_all = ['cagent','agent','memo'];
function Agent_HasColname(colname) {
    return (Agent_collist_all.indexOf(colname.toString().toLowerCase()) > -1);
}

var Agent_collist_keys = ['cagent'];
function Agent_HasKeyname(keyname) {
    return (Agent_collist_keys.indexOf(keyname.toString().toLowerCase()) > -1);
}

function Agent_makeWhere(req, next) {
    var whereStr = '';
    if(req.body.params === undefined)
        return whereStr;
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(Agent_HasColname(parstr)) {
            switch(parstr) {
            case 'cagent':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " cagent = ${" + parnext + "}";
                }
                break;
            case 'agent':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " agent LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            case 'memo':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " memo = ${" + parnext + "}";
                }
                break;
            }
        } else {
            next(new Error('column ' + parnext + " not exists in agent!"));
            return "ERROR";
        }
    }
    return whereStr;
}

function Agent_DoSelect(req, res, next) {
    var whereStr = Agent_makeWhere(req, next);
    if(whereStr == "ERROR")
        return;
    var sqlStr = 'SELECT * FROM agent ' + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.any(sqlStr, req.body.params)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved from agent'
            });
        })
        .catch(function (err) {
            return next(err);
    });
}

function Agent_DoInsert(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('insert params not found!'));
    }
    var parList = '';
    var parValues = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(Agent_HasColname(parstr)) {
            parList = makeList(parList);
            parList += parstr;
            parValues = makeList(parValues);
            parValues += "${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " not exists in agent!"));
        }
    }
    if(parList.length == 0)
        return next(new Error('not found any fields for insert into agent!'));
    var sqlStr = "INSERT INTO agent(" + parList + ") VALUES (" + parValues + ") RETURNING cagent";
    if (app.get('env') === 'development') {
       // console.log( sqlStr );
       console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.one(sqlStr, req.body.params)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Inserted into agent'
                });
        })
        .catch(function (err) {
            return next(err);
    });
}

function Agent_DoUpdate(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('update params not found!'));
    }
    var setStr = '';
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(Agent_HasKeyname(parstr)) {
            whereStr = makeWhere(whereStr);
            whereStr += parstr + "=${" + parnext + "}";
        } else if(Agent_HasColname(parstr)) {
            setStr = makeSet(setStr);
            setStr += parstr + "=${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " not exists in agent!"));
        }
    }
    if(setStr.length == 0)
        return next(new Error('not found any fields for update the agent!'));
    if(whereStr.length == 0)
        return next(new Error('not found any keys for update the agent!'));
    var sqlStr = "UPDATE agent " + setStr + " " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.result(sqlStr, req.body.params)
        .then(function (result) {
            res.status(200)
                .json({
                    status: 'success',
                    message: `Updated ${result.rowCount} from agent`
                });
        })
        .catch(function (err) {
            return next(err);
    });
}

function Agent_DoDelete(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('delete params not found!'));
    }
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(Agent_HasKeyname(parstr)) {
            whereStr = makeWhere(whereStr);
            whereStr += parstr + "=${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " is not key columns in agent!"));
        }
    }
    if(whereStr.length == 0)
        return next(new Error('not found any keys for delete from the agent!'));
    var sqlStr = "DELETE FROM agent " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.result(sqlStr, req.body.params)
        .then(function (result) {
            /* jshint ignore:start */
            res.status(200)
                .json({
                    status: 'success',
                    message: `Removed ${result.rowCount} from agent`
            });
            /* jshint ignore:end */
        })
        .catch(function (err) {
            return next(err);
    });
}

// ---------------------------------------------------------
//  The function makes SQL for the Agent from the body
//  URL : POST /Agent/
//  BODY: 
//  {
//     "cmd": "select" or "insert" or "update or "delete",
//     "row_count": ... ,
//     "params": {
//         "cAgent":...,
//         "Agent":"...",
//         "Memo":"..."
//      }
//  }
// ---------------------------------------------------------
function Agent_makeQuery(req, res, next) {
    if( req.body.cmd === undefined )
        return next( new Error('keyword cmd not found in the body!'));
    switch(req.body.cmd.toString().toLowerCase()) {
    case 'select':
        Agent_DoSelect(req, res, next);
        break;
    case 'insert':
        Agent_DoInsert(req, res, next);
        break;
    case 'update':
        Agent_DoUpdate(req, res, next);
        break;
    case 'delete':
        Agent_DoDelete(req, res, next);
        break;
    default:
        return next( new Error('cmd ' + req.body.cmd + " is unknow!"));
    }
}


var access_collist_all = ['coper','pid','stateid'];
function access_HasColname(colname) {
    return (access_collist_all.indexOf(colname.toString().toLowerCase()) > -1);
}

var access_collist_keys = ['coper','pid'];
function access_HasKeyname(keyname) {
    return (access_collist_keys.indexOf(keyname.toString().toLowerCase()) > -1);
}

function access_makeWhere(req, next) {
    var whereStr = '';
    if(req.body.params === undefined)
        return whereStr;
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(access_HasColname(parstr)) {
            switch(parstr) {
            case 'coper':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " coper = ${" + parnext + "}";
                }
                break;
            case 'pid':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " pid = ${" + parnext + "}";
                }
                break;
            case 'stateid':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " stateid = ${" + parnext + "}";
                }
                break;
            }
        } else {
            next(new Error('column ' + parnext + " not exists in access!"));
            return "ERROR";
        }
    }
    return whereStr;
}

function access_DoSelect(req, res, next) {
    var whereStr = access_makeWhere(req, next);
    if(whereStr == "ERROR")
        return;
    var sqlStr = 'SELECT * FROM access ' + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.any(sqlStr, req.body.params)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved from access'
            });
        })
        .catch(function (err) {
            return next(err);
    });
}

function access_DoInsert(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('insert params not found!'));
    }
    var parList = '';
    var parValues = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(access_HasColname(parstr)) {
            parList = makeList(parList);
            parList += parstr;
            parValues = makeList(parValues);
            parValues += "${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " not exists in access!"));
        }
    }
    if(parList.length == 0)
        return next(new Error('not found any fields for insert into access!'));
    var sqlStr = "INSERT INTO access(" + parList + ") VALUES (" + parValues + ")";
    if (app.get('env') === 'development') {
       // console.log( sqlStr );
       console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.none(sqlStr, req.body.params)
        .then(function () {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Inserted into access'
                });
        })
        .catch(function (err) {
            return next(err);
    });
}

function access_DoUpdate(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('update params not found!'));
    }
    var setStr = '';
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(access_HasKeyname(parstr)) {
            whereStr = makeWhere(whereStr);
            whereStr += parstr + "=${" + parnext + "}";
        } else if(access_HasColname(parstr)) {
            setStr = makeSet(setStr);
            setStr += parstr + "=${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " not exists in access!"));
        }
    }
    if(setStr.length == 0)
        return next(new Error('not found any fields for update the access!'));
    if(whereStr.length == 0)
        return next(new Error('not found any keys for update the access!'));
    var sqlStr = "UPDATE access " + setStr + " " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.result(sqlStr, req.body.params)
        .then(function (result) {
            res.status(200)
                .json({
                    status: 'success',
                    message: `Updated ${result.rowCount} from access`
                });
        })
        .catch(function (err) {
            return next(err);
    });
}

function access_DoDelete(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('delete params not found!'));
    }
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(access_HasKeyname(parstr)) {
            whereStr = makeWhere(whereStr);
            whereStr += parstr + "=${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " is not key columns in access!"));
        }
    }
    if(whereStr.length == 0)
        return next(new Error('not found any keys for delete from the access!'));
    var sqlStr = "DELETE FROM access " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.result(sqlStr, req.body.params)
        .then(function (result) {
            /* jshint ignore:start */
            res.status(200)
                .json({
                    status: 'success',
                    message: `Removed ${result.rowCount} from access`
            });
            /* jshint ignore:end */
        })
        .catch(function (err) {
            return next(err);
    });
}

// ---------------------------------------------------------
//  The function makes SQL for the access from the body
//  URL : POST /access/
//  BODY: 
//  {
//     "cmd": "select" or "insert" or "update or "delete",
//     "row_count": ... ,
//     "params": {
//         "cOper":...,
//         "pId":"...",
//         "stateId":"..."
//      }
//  }
// ---------------------------------------------------------
function access_makeQuery(req, res, next) {
    if( req.body.cmd === undefined )
        return next( new Error('keyword cmd not found in the body!'));
    switch(req.body.cmd.toString().toLowerCase()) {
    case 'select':
        access_DoSelect(req, res, next);
        break;
    case 'insert':
        access_DoInsert(req, res, next);
        break;
    case 'update':
        access_DoUpdate(req, res, next);
        break;
    case 'delete':
        access_DoDelete(req, res, next);
        break;
    default:
        return next( new Error('cmd ' + req.body.cmd + " is unknow!"));
    }
}


var docImage_collist_all = ['pagen','cdoc','image'];
function docImage_HasColname(colname) {
    return (docImage_collist_all.indexOf(colname.toString().toLowerCase()) > -1);
}

var docImage_collist_keys = ['pagen'];
function docImage_HasKeyname(keyname) {
    return (docImage_collist_keys.indexOf(keyname.toString().toLowerCase()) > -1);
}

function docImage_makeWhere(req, next) {
    var whereStr = '';
    if(req.body.params === undefined)
        return whereStr;
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(docImage_HasColname(parstr)) {
            switch(parstr) {
            case 'pagen':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " pagen = ${" + parnext + "}";
                }
                break;
            case 'cdoc':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " cdoc = ${" + parnext + "}";
                }
                break;
            case 'image':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " image LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            }
        } else {
            next(new Error('column ' + parnext + " not exists in docimage!"));
            return "ERROR";
        }
    }
    return whereStr;
}

function docImage_DoSelect(req, res, next) {
    var whereStr = docImage_makeWhere(req, next);
    if(whereStr == "ERROR")
        return;
    var sqlStr = 'SELECT * FROM docimage ' + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.any(sqlStr, req.body.params)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved from docimage'
            });
        })
        .catch(function (err) {
            return next(err);
    });
}

function docImage_DoInsert(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('insert params not found!'));
    }
    var parList = '';
    var parValues = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(docImage_HasColname(parstr)) {
            parList = makeList(parList);
            parList += parstr;
            parValues = makeList(parValues);
            parValues += "${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " not exists in docimage!"));
        }
    }
    if(parList.length == 0)
        return next(new Error('not found any fields for insert into docimage!'));
    var sqlStr = "INSERT INTO docimage(" + parList + ") VALUES (" + parValues + ")";
    if (app.get('env') === 'development') {
       // console.log( sqlStr );
       console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.none(sqlStr, req.body.params)
        .then(function () {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Inserted into docimage'
                });
        })
        .catch(function (err) {
            return next(err);
    });
}

function docImage_DoUpdate(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('update params not found!'));
    }
    var setStr = '';
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(docImage_HasKeyname(parstr)) {
            whereStr = makeWhere(whereStr);
            whereStr += parstr + "=${" + parnext + "}";
        } else if(docImage_HasColname(parstr)) {
            setStr = makeSet(setStr);
            setStr += parstr + "=${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " not exists in docimage!"));
        }
    }
    if(setStr.length == 0)
        return next(new Error('not found any fields for update the docimage!'));
    if(whereStr.length == 0)
        return next(new Error('not found any keys for update the docimage!'));
    var sqlStr = "UPDATE docimage " + setStr + " " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.result(sqlStr, req.body.params)
        .then(function (result) {
            res.status(200)
                .json({
                    status: 'success',
                    message: `Updated ${result.rowCount} from docimage`
                });
        })
        .catch(function (err) {
            return next(err);
    });
}

function docImage_DoDelete(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('delete params not found!'));
    }
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(docImage_HasKeyname(parstr)) {
            whereStr = makeWhere(whereStr);
            whereStr += parstr + "=${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " is not key columns in docimage!"));
        }
    }
    if(whereStr.length == 0)
        return next(new Error('not found any keys for delete from the docimage!'));
    var sqlStr = "DELETE FROM docimage " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.result(sqlStr, req.body.params)
        .then(function (result) {
            /* jshint ignore:start */
            res.status(200)
                .json({
                    status: 'success',
                    message: `Removed ${result.rowCount} from docimage`
            });
            /* jshint ignore:end */
        })
        .catch(function (err) {
            return next(err);
    });
}

// ---------------------------------------------------------
//  The function makes SQL for the docImage from the body
//  URL : POST /docImage/
//  BODY: 
//  {
//     "cmd": "select" or "insert" or "update or "delete",
//     "row_count": ... ,
//     "params": {
//         "pageN":...,
//         "cDoc":...,
//         "image":"..."
//      }
//  }
// ---------------------------------------------------------
function docImage_makeQuery(req, res, next) {
    if( req.body.cmd === undefined )
        return next( new Error('keyword cmd not found in the body!'));
    switch(req.body.cmd.toString().toLowerCase()) {
    case 'select':
        docImage_DoSelect(req, res, next);
        break;
    case 'insert':
        docImage_DoInsert(req, res, next);
        break;
    case 'update':
        docImage_DoUpdate(req, res, next);
        break;
    case 'delete':
        docImage_DoDelete(req, res, next);
        break;
    default:
        return next( new Error('cmd ' + req.body.cmd + " is unknow!"));
    }
}


var ref_collist_all = ['pid','per_pid','memo'];
function ref_HasColname(colname) {
    return (ref_collist_all.indexOf(colname.toString().toLowerCase()) > -1);
}

var ref_collist_keys = ['pid','per_pid'];
function ref_HasKeyname(keyname) {
    return (ref_collist_keys.indexOf(keyname.toString().toLowerCase()) > -1);
}

function ref_makeWhere(req, next) {
    var whereStr = '';
    if(req.body.params === undefined)
        return whereStr;
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(ref_HasColname(parstr)) {
            switch(parstr) {
            case 'pid':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " pid = ${" + parnext + "}";
                }
                break;
            case 'per_pid':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " per_pid = ${" + parnext + "}";
                }
                break;
            case 'memo':
                if(req.body.params[parnext])  {
                    whereStr = makeWhere(whereStr);
                    whereStr += " memo = ${" + parnext + "}";
                }
                break;
            }
        } else {
            next(new Error('column ' + parnext + " not exists in ref!"));
            return "ERROR";
        }
    }
    return whereStr;
}

function ref_DoSelect(req, res, next) {
    var whereStr = ref_makeWhere(req, next);
    if(whereStr == "ERROR")
        return;
    var sqlStr = 'SELECT * FROM ref ' + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.any(sqlStr, req.body.params)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved from ref'
            });
        })
        .catch(function (err) {
            return next(err);
    });
}

function ref_DoInsert(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('insert params not found!'));
    }
    var parList = '';
    var parValues = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(ref_HasColname(parstr)) {
            parList = makeList(parList);
            parList += parstr;
            parValues = makeList(parValues);
            parValues += "${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " not exists in ref!"));
        }
    }
    if(parList.length == 0)
        return next(new Error('not found any fields for insert into ref!'));
    var sqlStr = "INSERT INTO ref(" + parList + ") VALUES (" + parValues + ")";
    if (app.get('env') === 'development') {
       // console.log( sqlStr );
       console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.none(sqlStr, req.body.params)
        .then(function () {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Inserted into ref'
                });
        })
        .catch(function (err) {
            return next(err);
    });
}

function ref_DoUpdate(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('update params not found!'));
    }
    var setStr = '';
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(ref_HasKeyname(parstr)) {
            whereStr = makeWhere(whereStr);
            whereStr += parstr + "=${" + parnext + "}";
        } else if(ref_HasColname(parstr)) {
            setStr = makeSet(setStr);
            setStr += parstr + "=${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " not exists in ref!"));
        }
    }
    if(setStr.length == 0)
        return next(new Error('not found any fields for update the ref!'));
    if(whereStr.length == 0)
        return next(new Error('not found any keys for update the ref!'));
    var sqlStr = "UPDATE ref " + setStr + " " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.result(sqlStr, req.body.params)
        .then(function (result) {
            res.status(200)
                .json({
                    status: 'success',
                    message: `Updated ${result.rowCount} from ref`
                });
        })
        .catch(function (err) {
            return next(err);
    });
}

function ref_DoDelete(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('delete params not found!'));
    }
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(ref_HasKeyname(parstr)) {
            whereStr = makeWhere(whereStr);
            whereStr += parstr + "=${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " is not key columns in ref!"));
        }
    }
    if(whereStr.length == 0)
        return next(new Error('not found any keys for delete from the ref!'));
    var sqlStr = "DELETE FROM ref " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.result(sqlStr, req.body.params)
        .then(function (result) {
            /* jshint ignore:start */
            res.status(200)
                .json({
                    status: 'success',
                    message: `Removed ${result.rowCount} from ref`
            });
            /* jshint ignore:end */
        })
        .catch(function (err) {
            return next(err);
    });
}

// ---------------------------------------------------------
//  The function makes SQL for the ref from the body
//  URL : POST /ref/
//  BODY: 
//  {
//     "cmd": "select" or "insert" or "update or "delete",
//     "row_count": ... ,
//     "params": {
//         "pId":"...",
//         "per_pId":"...",
//         "Memo":"..."
//      }
//  }
// ---------------------------------------------------------
function ref_makeQuery(req, res, next) {
    if( req.body.cmd === undefined )
        return next( new Error('keyword cmd not found in the body!'));
    switch(req.body.cmd.toString().toLowerCase()) {
    case 'select':
        ref_DoSelect(req, res, next);
        break;
    case 'insert':
        ref_DoInsert(req, res, next);
        break;
    case 'update':
        ref_DoUpdate(req, res, next);
        break;
    case 'delete':
        ref_DoDelete(req, res, next);
        break;
    default:
        return next( new Error('cmd ' + req.body.cmd + " is unknow!"));
    }
}


module.exports = {
   docSpec_makeQuery: docSpec_makeQuery,
   doc_makeQuery: doc_makeQuery,
   State_makeQuery: State_makeQuery,
   person_makeQuery: person_makeQuery,
   photoData_makeQuery: photoData_makeQuery,
   photoSpec_makeQuery: photoSpec_makeQuery,
   audioDatа_makeQuery: audioDatа_makeQuery,
   operator_makeQuery: operator_makeQuery,
   regPoint_makeQuery: regPoint_makeQuery,
   opRule_makeQuery: opRule_makeQuery,
   Contact_makeQuery: Contact_makeQuery,
   Agent_makeQuery: Agent_makeQuery,
   access_makeQuery: access_makeQuery,
   docImage_makeQuery: docImage_makeQuery,
   ref_makeQuery: ref_makeQuery
};
