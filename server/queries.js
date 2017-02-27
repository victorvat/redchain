// var fs = require('fs');
var promise = require('bluebird');
var express = require('express');
var app = express();
var config = require('./config');
// var pathstat = require('./pathstat');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var db = pgp(config.database.connectionString);
var deflodir = (config.database.lodir || (__dirname + "../lo"));

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

function getLoDir(req, next) {
   var lodir = (req.body.lodir || deflodir);
   var lastsym = lodir.slice(-1);
   if(lastsym!=="/")
      lodir += "/";
   // if(!pathstat.isDirectoryWritable(lodir, next))
   //   return "ERROR";
    
    return lodir;
}

var docspec_collist_all = ['cspec','spec','spec_en'];
function docspec_HasColname(colname) {
    return (docspec_collist_all.indexOf(colname.toString().toLowerCase()) > -1);
}

var docspec_collist_keys = ['cspec'];
function docspec_HasKeyname(keyname) {
    return (docspec_collist_keys.indexOf(keyname.toString().toLowerCase()) > -1);
}

function docspec_makeWhere(req, next) {
    var whereStr = '';
    if(req.body.params === undefined)
        return whereStr;
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(docspec_HasColname(parstr)) {
            whereStr = makeWhere(whereStr);
            switch(parstr) {
            case 'cspec':
                if(req.body.params[parnext])  {
                    whereStr += " cspec = ${" + parnext + "}";
                }
                break;
            case 'spec':
                if(req.body.params[parnext])  {
                    whereStr += " spec LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            case 'spec_en':
                if(req.body.params[parnext])  {
                    whereStr += " spec_en LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            }
        } else {
            next(new Error('column ' + parnext + ' not exists in docspec!'));
            return "ERROR";
        }
    }
    return whereStr;
}

function docspec_DoSelect(req, res, next) {
    var whereStr = docspec_makeWhere(req, next);
    if(whereStr == "ERROR")
        return;
    var sqlStr = "SELECT cspec" 
                     + ",spec" 
                     + ",spec_en"
                     + " FROM docspec " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.any(sqlStr, req.body.params)
        .then(function (data) {
            req.dbAnswer = {
                    status: "success",
                    data: data,
                    message: "Retrieved from docspec"
            };
            return next();
        })
        .catch(function (err) {
            return next(err);
    });
}

function docspec_DoInsert(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('insert params not found!'));
    }
    var parList = '';
    var parValues = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(docspec_HasColname(parstr)) {
            if(req.body.params[parnext]) {
               parList = makeList(parList);
               parValues = makeList(parValues);
               parList += parstr;
               parValues += "${" + parnext + "}";
            } else {
               return next(new Error('column docspec.' + parnext + " has undefined value!"));
            }
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
            req.dbAnswer = {
                    status: 'success',
                    data: data,
                    message: 'Inserted into docspec'
                };
            return next();
        })
        .catch(function (err) {
            return next(err);
    });
}

function docspec_DoUpdate(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('update params not found!'));
    }
    var setStr = '';
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(docspec_HasKeyname(parstr)) {
            whereStr = makeWhere(whereStr);
            whereStr += parstr + "=${" + parnext + "}";
        } else if(docspec_HasColname(parstr)) {
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
            req.dbAnswer = {
                    status: 'success',
                    message: `Updated ${result.rowCount} from docspec`
                };
            return next();
        })
        .catch(function (err) {
            return next(err);
    });
}

function docspec_DoDelete(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('delete params not found!'));
    }
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(docspec_HasKeyname(parstr)) {
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
            req.dbAnswer = {
                    status: 'success',
                    message: `Removed ${result.rowCount} from docspec`
            };
            /* jshint ignore:end */
            return next();
        })
        .catch(function (err) {
            return next(err);
    });
}

// ---------------------------------------------------------
//  The function makes SQL for the docspec from the body
//  URL : POST /docspec/
//  BODY: 
//  {
//     "cmd": "select" or "insert" or "update or "delete",
//     "row_count": ... ,
//     "lodir": <catalogue for lo-* functions> ,
//     "params": {
//         "cspec":...,
//         "spec":"...",
//         "spec_en":"..."
//      }
//  }
// ---------------------------------------------------------
function docspec_makeQuery(req, res, next) {
    if( req.body.cmd === undefined )
        return next( new Error('keyword cmd not found in the body!'));
    switch(req.body.cmd.toString().toLowerCase()) {
    case 'select':
        docspec_DoSelect(req, res, next);
        break;
    case 'insert':
        docspec_DoInsert(req, res, next);
        break;
    case 'update':
        docspec_DoUpdate(req, res, next);
        break;
    case 'delete':
        docspec_DoDelete(req, res, next);
        break;
    default:
        return next( new Error('cmd ' + req.body.cmd + " is unknow!"));
    }
}


var doc_collist_all = ['cdoc','cspec','pid','cstate','docn','docdate','docend','docauth','memo','stateid'];
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
            whereStr = makeWhere(whereStr);
            switch(parstr) {
            case 'cdoc':
                if(req.body.params[parnext])  {
                    whereStr += " cdoc = ${" + parnext + "}";
                }
                break;
            case 'cspec':
                if(req.body.params[parnext])  {
                    whereStr += " cspec = ${" + parnext + "}";
                }
                break;
            case 'pid':
                if(req.body.params[parnext])  {
                    whereStr += " pid = ${" + parnext + "}";
                }
                break;
            case 'cstate':
                if(req.body.params[parnext])  {
                    whereStr += " cstate = ${" + parnext + "}";
                }
                break;
            case 'docn':
                if(req.body.params[parnext])  {
                    whereStr += " docn LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            case 'docdate':
                if(req.body.params[parnext])  {
                    whereStr += " docdate = ${" + parnext + "}";
                }
                break;
            case 'docend':
                if(req.body.params[parnext])  {
                    whereStr += " docend = ${" + parnext + "}";
                }
                break;
            case 'docauth':
                if(req.body.params[parnext])  {
                    whereStr += " docauth LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            case 'memo':
                if(req.body.params[parnext])  {
                    whereStr += " memo = ${" + parnext + "}";
                }
                break;
            case 'stateid':
                if(req.body.params[parnext])  {
                    whereStr += " stateid = ${" + parnext + "}";
                }
                break;
            }
        } else {
            next(new Error('column ' + parnext + ' not exists in doc!'));
            return "ERROR";
        }
    }
    return whereStr;
}

function doc_DoSelect(req, res, next) {
    var whereStr = doc_makeWhere(req, next);
    if(whereStr == "ERROR")
        return;
    var sqlStr = "SELECT cdoc" 
                     + ",cspec" 
                     + ",pid" 
                     + ",cstate" 
                     + ",docn" 
                     + ",docdate" 
                     + ",docend" 
                     + ",docauth" 
                     + ",memo" 
                     + ",stateid"
                     + " FROM doc " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.any(sqlStr, req.body.params)
        .then(function (data) {
            req.dbAnswer = {
                    status: "success",
                    data: data,
                    message: "Retrieved from doc"
            };
            return next();
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
            if(req.body.params[parnext]) {
               parList = makeList(parList);
               parValues = makeList(parValues);
               parList += parstr;
               parValues += "${" + parnext + "}";
            } else {
               return next(new Error('column doc.' + parnext + " has undefined value!"));
            }
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
            req.dbAnswer = {
                    status: 'success',
                    data: data,
                    message: 'Inserted into doc'
                };
            return next();
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
            req.dbAnswer = {
                    status: 'success',
                    message: `Updated ${result.rowCount} from doc`
                };
            return next();
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
            req.dbAnswer = {
                    status: 'success',
                    message: `Removed ${result.rowCount} from doc`
            };
            /* jshint ignore:end */
            return next();
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
//     "lodir": <catalogue for lo-* functions> ,
//     "params": {
//         "cdoc":...,
//         "cspec":...,
//         "pid":"...",
//         "cstate":...,
//         "docn":"...",
//         "docdate":"...",
//         "docend":"...",
//         "docauth":"...",
//         "memo":"...",
//         "stateid":"..."
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


var state_collist_all = ['cstate','state','state_en'];
function state_HasColname(colname) {
    return (state_collist_all.indexOf(colname.toString().toLowerCase()) > -1);
}

var state_collist_keys = ['cstate'];
function state_HasKeyname(keyname) {
    return (state_collist_keys.indexOf(keyname.toString().toLowerCase()) > -1);
}

function state_makeWhere(req, next) {
    var whereStr = '';
    if(req.body.params === undefined)
        return whereStr;
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(state_HasColname(parstr)) {
            whereStr = makeWhere(whereStr);
            switch(parstr) {
            case 'cstate':
                if(req.body.params[parnext])  {
                    whereStr += " cstate = ${" + parnext + "}";
                }
                break;
            case 'state':
                if(req.body.params[parnext])  {
                    whereStr += " state LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            case 'state_en':
                if(req.body.params[parnext])  {
                    whereStr += " state_en LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            }
        } else {
            next(new Error('column ' + parnext + ' not exists in state!'));
            return "ERROR";
        }
    }
    return whereStr;
}

function state_DoSelect(req, res, next) {
    var whereStr = state_makeWhere(req, next);
    if(whereStr == "ERROR")
        return;
    var sqlStr = "SELECT cstate" 
                     + ",state" 
                     + ",state_en"
                     + " FROM state " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.any(sqlStr, req.body.params)
        .then(function (data) {
            req.dbAnswer = {
                    status: "success",
                    data: data,
                    message: "Retrieved from state"
            };
            return next();
        })
        .catch(function (err) {
            return next(err);
    });
}

function state_DoInsert(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('insert params not found!'));
    }
    var parList = '';
    var parValues = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(state_HasColname(parstr)) {
            if(req.body.params[parnext]) {
               parList = makeList(parList);
               parValues = makeList(parValues);
               parList += parstr;
               parValues += "${" + parnext + "}";
            } else {
               return next(new Error('column state.' + parnext + " has undefined value!"));
            }
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
            req.dbAnswer = {
                    status: 'success',
                    data: data,
                    message: 'Inserted into state'
                };
            return next();
        })
        .catch(function (err) {
            return next(err);
    });
}

function state_DoUpdate(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('update params not found!'));
    }
    var setStr = '';
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(state_HasKeyname(parstr)) {
            whereStr = makeWhere(whereStr);
            whereStr += parstr + "=${" + parnext + "}";
        } else if(state_HasColname(parstr)) {
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
            req.dbAnswer = {
                    status: 'success',
                    message: `Updated ${result.rowCount} from state`
                };
            return next();
        })
        .catch(function (err) {
            return next(err);
    });
}

function state_DoDelete(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('delete params not found!'));
    }
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(state_HasKeyname(parstr)) {
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
            req.dbAnswer = {
                    status: 'success',
                    message: `Removed ${result.rowCount} from state`
            };
            /* jshint ignore:end */
            return next();
        })
        .catch(function (err) {
            return next(err);
    });
}

// ---------------------------------------------------------
//  The function makes SQL for the state from the body
//  URL : POST /state/
//  BODY: 
//  {
//     "cmd": "select" or "insert" or "update or "delete",
//     "row_count": ... ,
//     "lodir": <catalogue for lo-* functions> ,
//     "params": {
//         "cstate":...,
//         "state":"...",
//         "state_en":"..."
//      }
//  }
// ---------------------------------------------------------
function state_makeQuery(req, res, next) {
    if( req.body.cmd === undefined )
        return next( new Error('keyword cmd not found in the body!'));
    switch(req.body.cmd.toString().toLowerCase()) {
    case 'select':
        state_DoSelect(req, res, next);
        break;
    case 'insert':
        state_DoInsert(req, res, next);
        break;
    case 'update':
        state_DoUpdate(req, res, next);
        break;
    case 'delete':
        state_DoDelete(req, res, next);
        break;
    default:
        return next( new Error('cmd ' + req.body.cmd + " is unknow!"));
    }
}


var person_collist_all = ['pid','cstate','shortname','fullname','legalname','borndate','preview','sexid'];
function person_HasColname(colname) {
    return (person_collist_all.indexOf(colname.toString().toLowerCase()) > -1);
}

var person_collist_keys = ['pid'];
function person_HasKeyname(keyname) {
    return (person_collist_keys.indexOf(keyname.toString().toLowerCase()) > -1);
}

var person_collist_oids = ['preview'];
function person_HasOID(oidname) {
    return (person_collist_oids.indexOf(oidname.toString().toLowerCase()) > -1);
}

function person_makeWhere(req, next) {
    var whereStr = '';
    if(req.body.params === undefined)
        return whereStr;
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(person_HasColname(parstr)) {
            whereStr = makeWhere(whereStr);
            switch(parstr) {
            case 'pid':
                if(req.body.params[parnext])  {
                    whereStr += " pid = ${" + parnext + "}";
                }
                break;
            case 'cstate':
                if(req.body.params[parnext])  {
                    whereStr += " cstate = ${" + parnext + "}";
                }
                break;
            case 'shortname':
                if(req.body.params[parnext])  {
                    whereStr += " shortname LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            case 'fullname':
                if(req.body.params[parnext])  {
                    whereStr += " fullname LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            case 'legalname':
                if(req.body.params[parnext])  {
                    whereStr += " legalname LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            case 'borndate':
                if(req.body.params[parnext])  {
                    whereStr += " borndate = ${" + parnext + "}";
                }
                break;
            case 'preview':
                if(req.body.params[parnext])  {
                    whereStr += " preview = ${" + parnext + "}";
                }
                break;
            case 'sexid':
                if(req.body.params[parnext])  {
                    whereStr += " sexid = ${" + parnext + "}";
                }
                break;
            }
        } else {
            next(new Error('column ' + parnext + ' not exists in person!'));
            return "ERROR";
        }
    }
    return whereStr;
}

function person_DoSelect(req, res, next) {
   var lodir = getLoDir(req, next);
   if (app.get('env') === 'development')
      console.log("lodir is " + lodir);
   if(lodir == "ERROR")
      return;
    var whereStr = person_makeWhere(req, next);
    if(whereStr == "ERROR")
        return;
    var sqlStr = "SELECT pid" 
                     + ",cstate" 
                     + ",shortname" 
                     + ",fullname" 
                     + ",legalname" 
                     + ",borndate" 
                     + ",lo_export(preview,'" + lodir + "' || preview)"
                     + ",'" + lodir + "' || preview as preview_loexport" 
                     + ",sexid"
                     + " FROM person " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.any(sqlStr, req.body.params)
        .then(function (data) {
            req.dbAnswer = {
                    status: "success",
                    data: data,
                    message: "Retrieved from person"
            };
            return next();
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
            if(req.body.params[parnext]) {
               parList = makeList(parList);
               parValues = makeList(parValues);
               parList += parstr;
               if(person_HasOID(parstr)) {
                  parValues += " lo_import('" + req.body.params[parnext] + "')";
               } else {
                  parValues += "${" + parnext + "}";
               }
            } else {
               return next(new Error('column person.' + parnext + " has undefined value!"));
            }
        } else {
            return next(new Error('column ' + parnext + " not exists in person!"));
        }
    }
    if(parList.length == 0)
        return next(new Error('not found any fields for insert into person!'));
    var sqlStr = "INSERT INTO person(" + parList + ") VALUES (" + parValues + ") RETURNING preview";
    if (app.get('env') === 'development') {
       // console.log( sqlStr );
       console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.one(sqlStr, req.body.params)
        .then(function (data) {
            req.dbAnswer = {
                    status: 'success',
                    data: data,
                    message: 'Inserted into person'
                };
            return next();
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
            req.dbAnswer = {
                    status: 'success',
                    message: `Updated ${result.rowCount} from person`
                };
            return next();
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
            req.dbAnswer = {
                    status: 'success',
                    message: `Removed ${result.rowCount} from person`
            };
            /* jshint ignore:end */
            return next();
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
//     "lodir": <catalogue for lo-* functions> ,
//     "params": {
//         "pid":"...",
//         "cstate":...,
//         "shortname":"...",
//         "fullname":"...",
//         "legalname":"...",
//         "borndate":"...",
//         "preview":"...",
//         "sexid":"..."
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


var photodata_collist_all = ['cphoto','pho_cphoto','pid','ckindphoto','phmoment','imgno','geoloc','photovec','imageid','preview'];
function photodata_HasColname(colname) {
    return (photodata_collist_all.indexOf(colname.toString().toLowerCase()) > -1);
}

var photodata_collist_keys = ['cphoto'];
function photodata_HasKeyname(keyname) {
    return (photodata_collist_keys.indexOf(keyname.toString().toLowerCase()) > -1);
}

var photodata_collist_oids = ['imageid','preview'];
function photodata_HasOID(oidname) {
    return (photodata_collist_oids.indexOf(oidname.toString().toLowerCase()) > -1);
}

function photodata_makeWhere(req, next) {
    var whereStr = '';
    if(req.body.params === undefined)
        return whereStr;
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(photodata_HasColname(parstr)) {
            whereStr = makeWhere(whereStr);
            switch(parstr) {
            case 'cphoto':
                if(req.body.params[parnext])  {
                    whereStr += " cphoto = ${" + parnext + "}";
                }
                break;
            case 'pho_cphoto':
                if(req.body.params[parnext])  {
                    whereStr += " pho_cphoto = ${" + parnext + "}";
                }
                break;
            case 'pid':
                if(req.body.params[parnext])  {
                    whereStr += " pid = ${" + parnext + "}";
                }
                break;
            case 'ckindphoto':
                if(req.body.params[parnext])  {
                    whereStr += " ckindphoto = ${" + parnext + "}";
                }
                break;
            case 'phmoment':
                if(req.body.params[parnext])  {
                    whereStr += " phmoment = ${" + parnext + "}";
                }
                break;
            case 'imgno':
                if(req.body.params[parnext])  {
                    whereStr += " imgno = ${" + parnext + "}";
                }
                break;
            case 'geoloc':
                if(req.body.params[parnext])  {
                    whereStr += " geoloc = ${" + parnext + "}";
                }
                break;
            case 'photovec':
                if(req.body.params[parnext])  {
                    whereStr += " photovec = ${" + parnext + "}";
                }
                break;
            case 'imageid':
                if(req.body.params[parnext])  {
                    whereStr += " imageid = ${" + parnext + "}";
                }
                break;
            case 'preview':
                if(req.body.params[parnext])  {
                    whereStr += " preview = ${" + parnext + "}";
                }
                break;
            }
        } else {
            next(new Error('column ' + parnext + ' not exists in photodata!'));
            return "ERROR";
        }
    }
    return whereStr;
}

function photodata_DoSelect(req, res, next) {
   var lodir = getLoDir(req, next);
   if (app.get('env') === 'development')
      console.log("lodir is " + lodir);
   if(lodir == "ERROR")
      return;
    var whereStr = photodata_makeWhere(req, next);
    if(whereStr == "ERROR")
        return;
    var sqlStr = "SELECT cphoto" 
                     + ",pho_cphoto" 
                     + ",pid" 
                     + ",ckindphoto" 
                     + ",phmoment" 
                     + ",imgno" 
                     + ",geoloc" 
                     + ",photovec" 
                     + ",lo_export(imageid,'" + lodir + "' || imageid)"
                     + ",'" + lodir + "' || imageid as imageid_loexport" 
                     + ",lo_export(preview,'" + lodir + "' || preview)"
                     + ",'" + lodir + "' || preview as preview_loexport"
                     + " FROM photodata " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.any(sqlStr, req.body.params)
        .then(function (data) {
            req.dbAnswer = {
                    status: "success",
                    data: data,
                    message: "Retrieved from photodata"
            };
            return next();
        })
        .catch(function (err) {
            return next(err);
    });
}

function photodata_DoInsert(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('insert params not found!'));
    }
    var parList = '';
    var parValues = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(photodata_HasColname(parstr)) {
            if(req.body.params[parnext]) {
               parList = makeList(parList);
               parValues = makeList(parValues);
               parList += parstr;
               if(photodata_HasOID(parstr)) {
                  parValues += " lo_import('" + req.body.params[parnext] + "')";
               } else {
                  parValues += "${" + parnext + "}";
               }
            } else {
               return next(new Error('column photodata.' + parnext + " has undefined value!"));
            }
        } else {
            return next(new Error('column ' + parnext + " not exists in photodata!"));
        }
    }
    if(parList.length == 0)
        return next(new Error('not found any fields for insert into photodata!'));
    var sqlStr = "INSERT INTO photodata(" + parList + ") VALUES (" + parValues + ") RETURNING cphoto, imageid, preview";
    if (app.get('env') === 'development') {
       // console.log( sqlStr );
       console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.one(sqlStr, req.body.params)
        .then(function (data) {
            req.dbAnswer = {
                    status: 'success',
                    data: data,
                    message: 'Inserted into photodata'
                };
            return next();
        })
        .catch(function (err) {
            return next(err);
    });
}

function photodata_DoUpdate(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('update params not found!'));
    }
    var setStr = '';
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(photodata_HasKeyname(parstr)) {
            whereStr = makeWhere(whereStr);
            whereStr += parstr + "=${" + parnext + "}";
        } else if(photodata_HasColname(parstr)) {
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
            req.dbAnswer = {
                    status: 'success',
                    message: `Updated ${result.rowCount} from photodata`
                };
            return next();
        })
        .catch(function (err) {
            return next(err);
    });
}

function photodata_DoDelete(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('delete params not found!'));
    }
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(photodata_HasKeyname(parstr)) {
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
            req.dbAnswer = {
                    status: 'success',
                    message: `Removed ${result.rowCount} from photodata`
            };
            /* jshint ignore:end */
            return next();
        })
        .catch(function (err) {
            return next(err);
    });
}

// ---------------------------------------------------------
//  The function makes SQL for the photodata from the body
//  URL : POST /photodata/
//  BODY: 
//  {
//     "cmd": "select" or "insert" or "update or "delete",
//     "row_count": ... ,
//     "lodir": <catalogue for lo-* functions> ,
//     "params": {
//         "cphoto":...,
//         "pho_cphoto":...,
//         "pid":"...",
//         "ckindphoto":...,
//         "phmoment":"...",
//         "imgno":...,
//         "geoloc":"...",
//         "photovec":"...",
//         "imageid":"...",
//         "preview":"..."
//      }
//  }
// ---------------------------------------------------------
function photodata_makeQuery(req, res, next) {
    if( req.body.cmd === undefined )
        return next( new Error('keyword cmd not found in the body!'));
    switch(req.body.cmd.toString().toLowerCase()) {
    case 'select':
        photodata_DoSelect(req, res, next);
        break;
    case 'insert':
        photodata_DoInsert(req, res, next);
        break;
    case 'update':
        photodata_DoUpdate(req, res, next);
        break;
    case 'delete':
        photodata_DoDelete(req, res, next);
        break;
    default:
        return next( new Error('cmd ' + req.body.cmd + " is unknow!"));
    }
}


var photospec_collist_all = ['ckindphoto','photospec'];
function photospec_HasColname(colname) {
    return (photospec_collist_all.indexOf(colname.toString().toLowerCase()) > -1);
}

var photospec_collist_keys = ['ckindphoto'];
function photospec_HasKeyname(keyname) {
    return (photospec_collist_keys.indexOf(keyname.toString().toLowerCase()) > -1);
}

function photospec_makeWhere(req, next) {
    var whereStr = '';
    if(req.body.params === undefined)
        return whereStr;
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(photospec_HasColname(parstr)) {
            whereStr = makeWhere(whereStr);
            switch(parstr) {
            case 'ckindphoto':
                if(req.body.params[parnext])  {
                    whereStr += " ckindphoto = ${" + parnext + "}";
                }
                break;
            case 'photospec':
                if(req.body.params[parnext])  {
                    whereStr += " photospec LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            }
        } else {
            next(new Error('column ' + parnext + ' not exists in photospec!'));
            return "ERROR";
        }
    }
    return whereStr;
}

function photospec_DoSelect(req, res, next) {
    var whereStr = photospec_makeWhere(req, next);
    if(whereStr == "ERROR")
        return;
    var sqlStr = "SELECT ckindphoto" 
                     + ",photospec"
                     + " FROM photospec " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.any(sqlStr, req.body.params)
        .then(function (data) {
            req.dbAnswer = {
                    status: "success",
                    data: data,
                    message: "Retrieved from photospec"
            };
            return next();
        })
        .catch(function (err) {
            return next(err);
    });
}

function photospec_DoInsert(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('insert params not found!'));
    }
    var parList = '';
    var parValues = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(photospec_HasColname(parstr)) {
            if(req.body.params[parnext]) {
               parList = makeList(parList);
               parValues = makeList(parValues);
               parList += parstr;
               parValues += "${" + parnext + "}";
            } else {
               return next(new Error('column photospec.' + parnext + " has undefined value!"));
            }
        } else {
            return next(new Error('column ' + parnext + " not exists in photospec!"));
        }
    }
    if(parList.length == 0)
        return next(new Error('not found any fields for insert into photospec!'));
    var sqlStr = "INSERT INTO photospec(" + parList + ") VALUES (" + parValues + ") RETURNING ckindphoto";
    if (app.get('env') === 'development') {
       // console.log( sqlStr );
       console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.one(sqlStr, req.body.params)
        .then(function (data) {
            req.dbAnswer = {
                    status: 'success',
                    data: data,
                    message: 'Inserted into photospec'
                };
            return next();
        })
        .catch(function (err) {
            return next(err);
    });
}

function photospec_DoUpdate(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('update params not found!'));
    }
    var setStr = '';
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(photospec_HasKeyname(parstr)) {
            whereStr = makeWhere(whereStr);
            whereStr += parstr + "=${" + parnext + "}";
        } else if(photospec_HasColname(parstr)) {
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
            req.dbAnswer = {
                    status: 'success',
                    message: `Updated ${result.rowCount} from photospec`
                };
            return next();
        })
        .catch(function (err) {
            return next(err);
    });
}

function photospec_DoDelete(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('delete params not found!'));
    }
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(photospec_HasKeyname(parstr)) {
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
            req.dbAnswer = {
                    status: 'success',
                    message: `Removed ${result.rowCount} from photospec`
            };
            /* jshint ignore:end */
            return next();
        })
        .catch(function (err) {
            return next(err);
    });
}

// ---------------------------------------------------------
//  The function makes SQL for the photospec from the body
//  URL : POST /photospec/
//  BODY: 
//  {
//     "cmd": "select" or "insert" or "update or "delete",
//     "row_count": ... ,
//     "lodir": <catalogue for lo-* functions> ,
//     "params": {
//         "ckindphoto":...,
//         "photospec":"..."
//      }
//  }
// ---------------------------------------------------------
function photospec_makeQuery(req, res, next) {
    if( req.body.cmd === undefined )
        return next( new Error('keyword cmd not found in the body!'));
    switch(req.body.cmd.toString().toLowerCase()) {
    case 'select':
        photospec_DoSelect(req, res, next);
        break;
    case 'insert':
        photospec_DoInsert(req, res, next);
        break;
    case 'update':
        photospec_DoUpdate(req, res, next);
        break;
    case 'delete':
        photospec_DoDelete(req, res, next);
        break;
    default:
        return next( new Error('cmd ' + req.body.cmd + " is unknow!"));
    }
}


var audiodata_collist_all = ['pid','audiofull','audiomemo','memo'];
function audiodata_HasColname(colname) {
    return (audiodata_collist_all.indexOf(colname.toString().toLowerCase()) > -1);
}

var audiodata_collist_keys = [];
function audiodata_HasKeyname(keyname) {
    return (audiodata_collist_keys.indexOf(keyname.toString().toLowerCase()) > -1);
}

var audiodata_collist_oids = ['audiofull','audiomemo'];
function audiodata_HasOID(oidname) {
    return (audiodata_collist_oids.indexOf(oidname.toString().toLowerCase()) > -1);
}

function audiodata_makeWhere(req, next) {
    var whereStr = '';
    if(req.body.params === undefined)
        return whereStr;
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(audiodata_HasColname(parstr)) {
            whereStr = makeWhere(whereStr);
            switch(parstr) {
            case 'pid':
                if(req.body.params[parnext])  {
                    whereStr += " pid = ${" + parnext + "}";
                }
                break;
            case 'audiofull':
                if(req.body.params[parnext])  {
                    whereStr += " audiofull = ${" + parnext + "}";
                }
                break;
            case 'audiomemo':
                if(req.body.params[parnext])  {
                    whereStr += " audiomemo = ${" + parnext + "}";
                }
                break;
            case 'memo':
                if(req.body.params[parnext])  {
                    whereStr += " memo = ${" + parnext + "}";
                }
                break;
            }
        } else {
            next(new Error('column ' + parnext + ' not exists in audiodata!'));
            return "ERROR";
        }
    }
    return whereStr;
}

function audiodata_DoSelect(req, res, next) {
   var lodir = getLoDir(req, next);
   if (app.get('env') === 'development')
      console.log("lodir is " + lodir);
   if(lodir == "ERROR")
      return;
    var whereStr = audiodata_makeWhere(req, next);
    if(whereStr == "ERROR")
        return;
    var sqlStr = "SELECT pid" 
                     + ",lo_export(audiofull,'" + lodir + "' || audiofull)"
                     + ",'" + lodir + "' || audiofull as audiofull_loexport" 
                     + ",lo_export(audiomemo,'" + lodir + "' || audiomemo)"
                     + ",'" + lodir + "' || audiomemo as audiomemo_loexport" 
                     + ",memo"
                     + " FROM audiodata " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.any(sqlStr, req.body.params)
        .then(function (data) {
            req.dbAnswer = {
                    status: "success",
                    data: data,
                    message: "Retrieved from audiodata"
            };
            return next();
        })
        .catch(function (err) {
            return next(err);
    });
}

function audiodata_DoInsert(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('insert params not found!'));
    }
    var parList = '';
    var parValues = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(audiodata_HasColname(parstr)) {
            if(req.body.params[parnext]) {
               parList = makeList(parList);
               parValues = makeList(parValues);
               parList += parstr;
               if(audiodata_HasOID(parstr)) {
                  parValues += " lo_import('" + req.body.params[parnext] + "')";
               } else {
                  parValues += "${" + parnext + "}";
               }
            } else {
               return next(new Error('column audiodata.' + parnext + " has undefined value!"));
            }
        } else {
            return next(new Error('column ' + parnext + " not exists in audiodata!"));
        }
    }
    if(parList.length == 0)
        return next(new Error('not found any fields for insert into audiodata!'));
    var sqlStr = "INSERT INTO audiodata(" + parList + ") VALUES (" + parValues + ") RETURNING audiofull, audiomemo";
    if (app.get('env') === 'development') {
       // console.log( sqlStr );
       console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.one(sqlStr, req.body.params)
        .then(function (data) {
            req.dbAnswer = {
                    status: 'success',
                    data: data,
                    message: 'Inserted into audiodata'
                };
            return next();
        })
        .catch(function (err) {
            return next(err);
    });
}

function audiodata_DoUpdate(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('update params not found!'));
    }
    var setStr = '';
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(audiodata_HasKeyname(parstr)) {
            whereStr = makeWhere(whereStr);
            whereStr += parstr + "=${" + parnext + "}";
        } else if(audiodata_HasColname(parstr)) {
            setStr = makeSet(setStr);
            setStr += parstr + "=${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " not exists in audiodata!"));
        }
    }
    if(setStr.length == 0)
        return next(new Error('not found any fields for update the audiodata!'));
    if(whereStr.length == 0)
        return next(new Error('not found any keys for update the audiodata!'));
    var sqlStr = "UPDATE audiodata " + setStr + " " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.result(sqlStr, req.body.params)
        .then(function (result) {
            req.dbAnswer = {
                    status: 'success',
                    message: `Updated ${result.rowCount} from audiodata`
                };
            return next();
        })
        .catch(function (err) {
            return next(err);
    });
}

function audiodata_DoDelete(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('delete params not found!'));
    }
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(audiodata_HasKeyname(parstr)) {
            whereStr = makeWhere(whereStr);
            whereStr += parstr + "=${" + parnext + "}";
        } else {
            return next(new Error('column ' + parnext + " is not key columns in audiodata!"));
        }
    }
    if(whereStr.length == 0)
        return next(new Error('not found any keys for delete from the audiodata!'));
    var sqlStr = "DELETE FROM audiodata " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.result(sqlStr, req.body.params)
        .then(function (result) {
            /* jshint ignore:start */
            req.dbAnswer = {
                    status: 'success',
                    message: `Removed ${result.rowCount} from audiodata`
            };
            /* jshint ignore:end */
            return next();
        })
        .catch(function (err) {
            return next(err);
    });
}

// ---------------------------------------------------------
//  The function makes SQL for the audiodata from the body
//  URL : POST /audiodata/
//  BODY: 
//  {
//     "cmd": "select" or "insert" or "update or "delete",
//     "row_count": ... ,
//     "lodir": <catalogue for lo-* functions> ,
//     "params": {
//         "pid":"...",
//         "audiofull":"...",
//         "audiomemo":"...",
//         "memo":"..."
//      }
//  }
// ---------------------------------------------------------
function audiodata_makeQuery(req, res, next) {
    if( req.body.cmd === undefined )
        return next( new Error('keyword cmd not found in the body!'));
    switch(req.body.cmd.toString().toLowerCase()) {
    case 'select':
        audiodata_DoSelect(req, res, next);
        break;
    case 'insert':
        audiodata_DoInsert(req, res, next);
        break;
    case 'update':
        audiodata_DoUpdate(req, res, next);
        break;
    case 'delete':
        audiodata_DoDelete(req, res, next);
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
            whereStr = makeWhere(whereStr);
            switch(parstr) {
            case 'coper':
                if(req.body.params[parnext])  {
                    whereStr += " coper = ${" + parnext + "}";
                }
                break;
            case 'crule':
                if(req.body.params[parnext])  {
                    whereStr += " crule = ${" + parnext + "}";
                }
                break;
            case 'cpoint':
                if(req.body.params[parnext])  {
                    whereStr += " cpoint = ${" + parnext + "}";
                }
                break;
            case 'stuff':
                if(req.body.params[parnext])  {
                    whereStr += " stuff LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            case 'stuff_en':
                if(req.body.params[parnext])  {
                    whereStr += " stuff_en LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            case 'key':
                if(req.body.params[parnext])  {
                    whereStr += " key LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            case 'phrase':
                if(req.body.params[parnext])  {
                    whereStr += " phrase LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            case 'stateid':
                if(req.body.params[parnext])  {
                    whereStr += " stateid = ${" + parnext + "}";
                }
                break;
            }
        } else {
            next(new Error('column ' + parnext + ' not exists in operator!'));
            return "ERROR";
        }
    }
    return whereStr;
}

function operator_DoSelect(req, res, next) {
    var whereStr = operator_makeWhere(req, next);
    if(whereStr == "ERROR")
        return;
    var sqlStr = "SELECT coper" 
                     + ",crule" 
                     + ",cpoint" 
                     + ",stuff" 
                     + ",stuff_en" 
                     + ",key" 
                     + ",phrase" 
                     + ",stateid"
                     + " FROM operator " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.any(sqlStr, req.body.params)
        .then(function (data) {
            req.dbAnswer = {
                    status: "success",
                    data: data,
                    message: "Retrieved from operator"
            };
            return next();
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
            if(req.body.params[parnext]) {
               parList = makeList(parList);
               parValues = makeList(parValues);
               parList += parstr;
               parValues += "${" + parnext + "}";
            } else {
               return next(new Error('column operator.' + parnext + " has undefined value!"));
            }
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
            req.dbAnswer = {
                    status: 'success',
                    data: data,
                    message: 'Inserted into operator'
                };
            return next();
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
            req.dbAnswer = {
                    status: 'success',
                    message: `Updated ${result.rowCount} from operator`
                };
            return next();
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
            req.dbAnswer = {
                    status: 'success',
                    message: `Removed ${result.rowCount} from operator`
            };
            /* jshint ignore:end */
            return next();
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
//     "lodir": <catalogue for lo-* functions> ,
//     "params": {
//         "coper":...,
//         "crule":...,
//         "cpoint":...,
//         "stuff":"...",
//         "stuff_en":"...",
//         "key":"...",
//         "phrase":"...",
//         "stateid":"..."
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


var regpoint_collist_all = ['cpoint','cstate','point','point_en','location','location_en','geoloc'];
function regpoint_HasColname(colname) {
    return (regpoint_collist_all.indexOf(colname.toString().toLowerCase()) > -1);
}

var regpoint_collist_keys = ['cpoint'];
function regpoint_HasKeyname(keyname) {
    return (regpoint_collist_keys.indexOf(keyname.toString().toLowerCase()) > -1);
}

function regpoint_makeWhere(req, next) {
    var whereStr = '';
    if(req.body.params === undefined)
        return whereStr;
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(regpoint_HasColname(parstr)) {
            whereStr = makeWhere(whereStr);
            switch(parstr) {
            case 'cpoint':
                if(req.body.params[parnext])  {
                    whereStr += " cpoint = ${" + parnext + "}";
                }
                break;
            case 'cstate':
                if(req.body.params[parnext])  {
                    whereStr += " cstate = ${" + parnext + "}";
                }
                break;
            case 'point':
                if(req.body.params[parnext])  {
                    whereStr += " point LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            case 'point_en':
                if(req.body.params[parnext])  {
                    whereStr += " point_en LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            case 'location':
                if(req.body.params[parnext])  {
                    whereStr += " location LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            case 'location_en':
                if(req.body.params[parnext])  {
                    whereStr += " location_en LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            case 'geoloc':
                if(req.body.params[parnext])  {
                    whereStr += " geoloc = ${" + parnext + "}";
                }
                break;
            }
        } else {
            next(new Error('column ' + parnext + ' not exists in regpoint!'));
            return "ERROR";
        }
    }
    return whereStr;
}

function regpoint_DoSelect(req, res, next) {
    var whereStr = regpoint_makeWhere(req, next);
    if(whereStr == "ERROR")
        return;
    var sqlStr = "SELECT cpoint" 
                     + ",cstate" 
                     + ",point" 
                     + ",point_en" 
                     + ",location" 
                     + ",location_en" 
                     + ",geoloc"
                     + " FROM regpoint " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.any(sqlStr, req.body.params)
        .then(function (data) {
            req.dbAnswer = {
                    status: "success",
                    data: data,
                    message: "Retrieved from regpoint"
            };
            return next();
        })
        .catch(function (err) {
            return next(err);
    });
}

function regpoint_DoInsert(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('insert params not found!'));
    }
    var parList = '';
    var parValues = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(regpoint_HasColname(parstr)) {
            if(req.body.params[parnext]) {
               parList = makeList(parList);
               parValues = makeList(parValues);
               parList += parstr;
               parValues += "${" + parnext + "}";
            } else {
               return next(new Error('column regpoint.' + parnext + " has undefined value!"));
            }
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
            req.dbAnswer = {
                    status: 'success',
                    data: data,
                    message: 'Inserted into regpoint'
                };
            return next();
        })
        .catch(function (err) {
            return next(err);
    });
}

function regpoint_DoUpdate(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('update params not found!'));
    }
    var setStr = '';
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(regpoint_HasKeyname(parstr)) {
            whereStr = makeWhere(whereStr);
            whereStr += parstr + "=${" + parnext + "}";
        } else if(regpoint_HasColname(parstr)) {
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
            req.dbAnswer = {
                    status: 'success',
                    message: `Updated ${result.rowCount} from regpoint`
                };
            return next();
        })
        .catch(function (err) {
            return next(err);
    });
}

function regpoint_DoDelete(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('delete params not found!'));
    }
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(regpoint_HasKeyname(parstr)) {
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
            req.dbAnswer = {
                    status: 'success',
                    message: `Removed ${result.rowCount} from regpoint`
            };
            /* jshint ignore:end */
            return next();
        })
        .catch(function (err) {
            return next(err);
    });
}

// ---------------------------------------------------------
//  The function makes SQL for the regpoint from the body
//  URL : POST /regpoint/
//  BODY: 
//  {
//     "cmd": "select" or "insert" or "update or "delete",
//     "row_count": ... ,
//     "lodir": <catalogue for lo-* functions> ,
//     "params": {
//         "cpoint":...,
//         "cstate":...,
//         "point":"...",
//         "point_en":"...",
//         "location":"...",
//         "location_en":"...",
//         "geoloc":"..."
//      }
//  }
// ---------------------------------------------------------
function regpoint_makeQuery(req, res, next) {
    if( req.body.cmd === undefined )
        return next( new Error('keyword cmd not found in the body!'));
    switch(req.body.cmd.toString().toLowerCase()) {
    case 'select':
        regpoint_DoSelect(req, res, next);
        break;
    case 'insert':
        regpoint_DoInsert(req, res, next);
        break;
    case 'update':
        regpoint_DoUpdate(req, res, next);
        break;
    case 'delete':
        regpoint_DoDelete(req, res, next);
        break;
    default:
        return next( new Error('cmd ' + req.body.cmd + " is unknow!"));
    }
}


var oprule_collist_all = ['crule','rule','rule_en'];
function oprule_HasColname(colname) {
    return (oprule_collist_all.indexOf(colname.toString().toLowerCase()) > -1);
}

var oprule_collist_keys = ['crule'];
function oprule_HasKeyname(keyname) {
    return (oprule_collist_keys.indexOf(keyname.toString().toLowerCase()) > -1);
}

function oprule_makeWhere(req, next) {
    var whereStr = '';
    if(req.body.params === undefined)
        return whereStr;
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(oprule_HasColname(parstr)) {
            whereStr = makeWhere(whereStr);
            switch(parstr) {
            case 'crule':
                if(req.body.params[parnext])  {
                    whereStr += " crule = ${" + parnext + "}";
                }
                break;
            case 'rule':
                if(req.body.params[parnext])  {
                    whereStr += " rule LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            case 'rule_en':
                if(req.body.params[parnext])  {
                    whereStr += " rule_en LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            }
        } else {
            next(new Error('column ' + parnext + ' not exists in oprule!'));
            return "ERROR";
        }
    }
    return whereStr;
}

function oprule_DoSelect(req, res, next) {
    var whereStr = oprule_makeWhere(req, next);
    if(whereStr == "ERROR")
        return;
    var sqlStr = "SELECT crule" 
                     + ",rule" 
                     + ",rule_en"
                     + " FROM oprule " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.any(sqlStr, req.body.params)
        .then(function (data) {
            req.dbAnswer = {
                    status: "success",
                    data: data,
                    message: "Retrieved from oprule"
            };
            return next();
        })
        .catch(function (err) {
            return next(err);
    });
}

function oprule_DoInsert(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('insert params not found!'));
    }
    var parList = '';
    var parValues = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(oprule_HasColname(parstr)) {
            if(req.body.params[parnext]) {
               parList = makeList(parList);
               parValues = makeList(parValues);
               parList += parstr;
               parValues += "${" + parnext + "}";
            } else {
               return next(new Error('column oprule.' + parnext + " has undefined value!"));
            }
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
            req.dbAnswer = {
                    status: 'success',
                    data: data,
                    message: 'Inserted into oprule'
                };
            return next();
        })
        .catch(function (err) {
            return next(err);
    });
}

function oprule_DoUpdate(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('update params not found!'));
    }
    var setStr = '';
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(oprule_HasKeyname(parstr)) {
            whereStr = makeWhere(whereStr);
            whereStr += parstr + "=${" + parnext + "}";
        } else if(oprule_HasColname(parstr)) {
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
            req.dbAnswer = {
                    status: 'success',
                    message: `Updated ${result.rowCount} from oprule`
                };
            return next();
        })
        .catch(function (err) {
            return next(err);
    });
}

function oprule_DoDelete(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('delete params not found!'));
    }
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(oprule_HasKeyname(parstr)) {
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
            req.dbAnswer = {
                    status: 'success',
                    message: `Removed ${result.rowCount} from oprule`
            };
            /* jshint ignore:end */
            return next();
        })
        .catch(function (err) {
            return next(err);
    });
}

// ---------------------------------------------------------
//  The function makes SQL for the oprule from the body
//  URL : POST /oprule/
//  BODY: 
//  {
//     "cmd": "select" or "insert" or "update or "delete",
//     "row_count": ... ,
//     "lodir": <catalogue for lo-* functions> ,
//     "params": {
//         "crule":...,
//         "rule":"...",
//         "rule_en":"..."
//      }
//  }
// ---------------------------------------------------------
function oprule_makeQuery(req, res, next) {
    if( req.body.cmd === undefined )
        return next( new Error('keyword cmd not found in the body!'));
    switch(req.body.cmd.toString().toLowerCase()) {
    case 'select':
        oprule_DoSelect(req, res, next);
        break;
    case 'insert':
        oprule_DoInsert(req, res, next);
        break;
    case 'update':
        oprule_DoUpdate(req, res, next);
        break;
    case 'delete':
        oprule_DoDelete(req, res, next);
        break;
    default:
        return next( new Error('cmd ' + req.body.cmd + " is unknow!"));
    }
}


var contact_collist_all = ['ccontact','cagent','pid','key','phrase','memo','stateid'];
function contact_HasColname(colname) {
    return (contact_collist_all.indexOf(colname.toString().toLowerCase()) > -1);
}

var contact_collist_keys = ['ccontact'];
function contact_HasKeyname(keyname) {
    return (contact_collist_keys.indexOf(keyname.toString().toLowerCase()) > -1);
}

function contact_makeWhere(req, next) {
    var whereStr = '';
    if(req.body.params === undefined)
        return whereStr;
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(contact_HasColname(parstr)) {
            whereStr = makeWhere(whereStr);
            switch(parstr) {
            case 'ccontact':
                if(req.body.params[parnext])  {
                    whereStr += " ccontact = ${" + parnext + "}";
                }
                break;
            case 'cagent':
                if(req.body.params[parnext])  {
                    whereStr += " cagent = ${" + parnext + "}";
                }
                break;
            case 'pid':
                if(req.body.params[parnext])  {
                    whereStr += " pid = ${" + parnext + "}";
                }
                break;
            case 'key':
                if(req.body.params[parnext])  {
                    whereStr += " key LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            case 'phrase':
                if(req.body.params[parnext])  {
                    whereStr += " phrase LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            case 'memo':
                if(req.body.params[parnext])  {
                    whereStr += " memo = ${" + parnext + "}";
                }
                break;
            case 'stateid':
                if(req.body.params[parnext])  {
                    whereStr += " stateid = ${" + parnext + "}";
                }
                break;
            }
        } else {
            next(new Error('column ' + parnext + ' not exists in contact!'));
            return "ERROR";
        }
    }
    return whereStr;
}

function contact_DoSelect(req, res, next) {
    var whereStr = contact_makeWhere(req, next);
    if(whereStr == "ERROR")
        return;
    var sqlStr = "SELECT ccontact" 
                     + ",cagent" 
                     + ",pid" 
                     + ",key" 
                     + ",phrase" 
                     + ",memo" 
                     + ",stateid"
                     + " FROM contact " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.any(sqlStr, req.body.params)
        .then(function (data) {
            req.dbAnswer = {
                    status: "success",
                    data: data,
                    message: "Retrieved from contact"
            };
            return next();
        })
        .catch(function (err) {
            return next(err);
    });
}

function contact_DoInsert(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('insert params not found!'));
    }
    var parList = '';
    var parValues = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(contact_HasColname(parstr)) {
            if(req.body.params[parnext]) {
               parList = makeList(parList);
               parValues = makeList(parValues);
               parList += parstr;
               parValues += "${" + parnext + "}";
            } else {
               return next(new Error('column contact.' + parnext + " has undefined value!"));
            }
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
            req.dbAnswer = {
                    status: 'success',
                    data: data,
                    message: 'Inserted into contact'
                };
            return next();
        })
        .catch(function (err) {
            return next(err);
    });
}

function contact_DoUpdate(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('update params not found!'));
    }
    var setStr = '';
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(contact_HasKeyname(parstr)) {
            whereStr = makeWhere(whereStr);
            whereStr += parstr + "=${" + parnext + "}";
        } else if(contact_HasColname(parstr)) {
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
            req.dbAnswer = {
                    status: 'success',
                    message: `Updated ${result.rowCount} from contact`
                };
            return next();
        })
        .catch(function (err) {
            return next(err);
    });
}

function contact_DoDelete(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('delete params not found!'));
    }
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(contact_HasKeyname(parstr)) {
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
            req.dbAnswer = {
                    status: 'success',
                    message: `Removed ${result.rowCount} from contact`
            };
            /* jshint ignore:end */
            return next();
        })
        .catch(function (err) {
            return next(err);
    });
}

// ---------------------------------------------------------
//  The function makes SQL for the contact from the body
//  URL : POST /contact/
//  BODY: 
//  {
//     "cmd": "select" or "insert" or "update or "delete",
//     "row_count": ... ,
//     "lodir": <catalogue for lo-* functions> ,
//     "params": {
//         "ccontact":...,
//         "cagent":...,
//         "pid":"...",
//         "key":"...",
//         "phrase":"...",
//         "memo":"...",
//         "stateid":"..."
//      }
//  }
// ---------------------------------------------------------
function contact_makeQuery(req, res, next) {
    if( req.body.cmd === undefined )
        return next( new Error('keyword cmd not found in the body!'));
    switch(req.body.cmd.toString().toLowerCase()) {
    case 'select':
        contact_DoSelect(req, res, next);
        break;
    case 'insert':
        contact_DoInsert(req, res, next);
        break;
    case 'update':
        contact_DoUpdate(req, res, next);
        break;
    case 'delete':
        contact_DoDelete(req, res, next);
        break;
    default:
        return next( new Error('cmd ' + req.body.cmd + " is unknow!"));
    }
}


var agent_collist_all = ['cagent','agent','memo'];
function agent_HasColname(colname) {
    return (agent_collist_all.indexOf(colname.toString().toLowerCase()) > -1);
}

var agent_collist_keys = ['cagent'];
function agent_HasKeyname(keyname) {
    return (agent_collist_keys.indexOf(keyname.toString().toLowerCase()) > -1);
}

function agent_makeWhere(req, next) {
    var whereStr = '';
    if(req.body.params === undefined)
        return whereStr;
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(agent_HasColname(parstr)) {
            whereStr = makeWhere(whereStr);
            switch(parstr) {
            case 'cagent':
                if(req.body.params[parnext])  {
                    whereStr += " cagent = ${" + parnext + "}";
                }
                break;
            case 'agent':
                if(req.body.params[parnext])  {
                    whereStr += " agent LIKE '%" + req.body.params[parnext].toString().trim() + "%'";
                }
                break;
            case 'memo':
                if(req.body.params[parnext])  {
                    whereStr += " memo = ${" + parnext + "}";
                }
                break;
            }
        } else {
            next(new Error('column ' + parnext + ' not exists in agent!'));
            return "ERROR";
        }
    }
    return whereStr;
}

function agent_DoSelect(req, res, next) {
    var whereStr = agent_makeWhere(req, next);
    if(whereStr == "ERROR")
        return;
    var sqlStr = "SELECT cagent" 
                     + ",agent" 
                     + ",memo"
                     + " FROM agent " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.any(sqlStr, req.body.params)
        .then(function (data) {
            req.dbAnswer = {
                    status: "success",
                    data: data,
                    message: "Retrieved from agent"
            };
            return next();
        })
        .catch(function (err) {
            return next(err);
    });
}

function agent_DoInsert(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('insert params not found!'));
    }
    var parList = '';
    var parValues = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(agent_HasColname(parstr)) {
            if(req.body.params[parnext]) {
               parList = makeList(parList);
               parValues = makeList(parValues);
               parList += parstr;
               parValues += "${" + parnext + "}";
            } else {
               return next(new Error('column agent.' + parnext + " has undefined value!"));
            }
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
            req.dbAnswer = {
                    status: 'success',
                    data: data,
                    message: 'Inserted into agent'
                };
            return next();
        })
        .catch(function (err) {
            return next(err);
    });
}

function agent_DoUpdate(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('update params not found!'));
    }
    var setStr = '';
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(agent_HasKeyname(parstr)) {
            whereStr = makeWhere(whereStr);
            whereStr += parstr + "=${" + parnext + "}";
        } else if(agent_HasColname(parstr)) {
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
            req.dbAnswer = {
                    status: 'success',
                    message: `Updated ${result.rowCount} from agent`
                };
            return next();
        })
        .catch(function (err) {
            return next(err);
    });
}

function agent_DoDelete(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('delete params not found!'));
    }
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(agent_HasKeyname(parstr)) {
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
            req.dbAnswer = {
                    status: 'success',
                    message: `Removed ${result.rowCount} from agent`
            };
            /* jshint ignore:end */
            return next();
        })
        .catch(function (err) {
            return next(err);
    });
}

// ---------------------------------------------------------
//  The function makes SQL for the agent from the body
//  URL : POST /agent/
//  BODY: 
//  {
//     "cmd": "select" or "insert" or "update or "delete",
//     "row_count": ... ,
//     "lodir": <catalogue for lo-* functions> ,
//     "params": {
//         "cagent":...,
//         "agent":"...",
//         "memo":"..."
//      }
//  }
// ---------------------------------------------------------
function agent_makeQuery(req, res, next) {
    if( req.body.cmd === undefined )
        return next( new Error('keyword cmd not found in the body!'));
    switch(req.body.cmd.toString().toLowerCase()) {
    case 'select':
        agent_DoSelect(req, res, next);
        break;
    case 'insert':
        agent_DoInsert(req, res, next);
        break;
    case 'update':
        agent_DoUpdate(req, res, next);
        break;
    case 'delete':
        agent_DoDelete(req, res, next);
        break;
    default:
        return next( new Error('cmd ' + req.body.cmd + " is unknow!"));
    }
}


var access_collist_all = ['coper','pid','stateid'];
function access_HasColname(colname) {
    return (access_collist_all.indexOf(colname.toString().toLowerCase()) > -1);
}

var access_collist_keys = [];
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
            whereStr = makeWhere(whereStr);
            switch(parstr) {
            case 'coper':
                if(req.body.params[parnext])  {
                    whereStr += " coper = ${" + parnext + "}";
                }
                break;
            case 'pid':
                if(req.body.params[parnext])  {
                    whereStr += " pid = ${" + parnext + "}";
                }
                break;
            case 'stateid':
                if(req.body.params[parnext])  {
                    whereStr += " stateid = ${" + parnext + "}";
                }
                break;
            }
        } else {
            next(new Error('column ' + parnext + ' not exists in access!'));
            return "ERROR";
        }
    }
    return whereStr;
}

function access_DoSelect(req, res, next) {
    var whereStr = access_makeWhere(req, next);
    if(whereStr == "ERROR")
        return;
    var sqlStr = "SELECT coper" 
                     + ",pid" 
                     + ",stateid"
                     + " FROM access " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.any(sqlStr, req.body.params)
        .then(function (data) {
            req.dbAnswer = {
                    status: "success",
                    data: data,
                    message: "Retrieved from access"
            };
            return next();
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
            if(req.body.params[parnext]) {
               parList = makeList(parList);
               parValues = makeList(parValues);
               parList += parstr;
               parValues += "${" + parnext + "}";
            } else {
               return next(new Error('column access.' + parnext + " has undefined value!"));
            }
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
            req.dbAnswer = {
                    status: 'success',
                    message: 'Inserted into access'
                };
            return next();
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
            req.dbAnswer = {
                    status: 'success',
                    message: `Updated ${result.rowCount} from access`
                };
            return next();
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
            req.dbAnswer = {
                    status: 'success',
                    message: `Removed ${result.rowCount} from access`
            };
            /* jshint ignore:end */
            return next();
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
//     "lodir": <catalogue for lo-* functions> ,
//     "params": {
//         "coper":...,
//         "pid":"...",
//         "stateid":"..."
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


var docimage_collist_all = ['pagen','cdoc','imageid'];
function docimage_HasColname(colname) {
    return (docimage_collist_all.indexOf(colname.toString().toLowerCase()) > -1);
}

var docimage_collist_keys = ['pagen'];
function docimage_HasKeyname(keyname) {
    return (docimage_collist_keys.indexOf(keyname.toString().toLowerCase()) > -1);
}

var docimage_collist_oids = ['imageid'];
function docimage_HasOID(oidname) {
    return (docimage_collist_oids.indexOf(oidname.toString().toLowerCase()) > -1);
}

function docimage_makeWhere(req, next) {
    var whereStr = '';
    if(req.body.params === undefined)
        return whereStr;
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(docimage_HasColname(parstr)) {
            whereStr = makeWhere(whereStr);
            switch(parstr) {
            case 'pagen':
                if(req.body.params[parnext])  {
                    whereStr += " pagen = ${" + parnext + "}";
                }
                break;
            case 'cdoc':
                if(req.body.params[parnext])  {
                    whereStr += " cdoc = ${" + parnext + "}";
                }
                break;
            case 'imageid':
                if(req.body.params[parnext])  {
                    whereStr += " imageid = ${" + parnext + "}";
                }
                break;
            }
        } else {
            next(new Error('column ' + parnext + ' not exists in docimage!'));
            return "ERROR";
        }
    }
    return whereStr;
}

function docimage_DoSelect(req, res, next) {
   var lodir = getLoDir(req, next);
   if (app.get('env') === 'development')
      console.log("lodir is " + lodir);
   if(lodir == "ERROR")
      return;
    var whereStr = docimage_makeWhere(req, next);
    if(whereStr == "ERROR")
        return;
    var sqlStr = "SELECT pagen" 
                     + ",cdoc" 
                     + ",lo_export(imageid,'" + lodir + "' || imageid)"
                     + ",'" + lodir + "' || imageid as imageid_loexport"
                     + " FROM docimage " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.any(sqlStr, req.body.params)
        .then(function (data) {
            req.dbAnswer = {
                    status: "success",
                    data: data,
                    message: "Retrieved from docimage"
            };
            return next();
        })
        .catch(function (err) {
            return next(err);
    });
}

function docimage_DoInsert(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('insert params not found!'));
    }
    var parList = '';
    var parValues = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(docimage_HasColname(parstr)) {
            if(req.body.params[parnext]) {
               parList = makeList(parList);
               parValues = makeList(parValues);
               parList += parstr;
               if(docimage_HasOID(parstr)) {
                  parValues += " lo_import('" + req.body.params[parnext] + "')";
               } else {
                  parValues += "${" + parnext + "}";
               }
            } else {
               return next(new Error('column docimage.' + parnext + " has undefined value!"));
            }
        } else {
            return next(new Error('column ' + parnext + " not exists in docimage!"));
        }
    }
    if(parList.length == 0)
        return next(new Error('not found any fields for insert into docimage!'));
    var sqlStr = "INSERT INTO docimage(" + parList + ") VALUES (" + parValues + ") RETURNING imageid";
    if (app.get('env') === 'development') {
       // console.log( sqlStr );
       console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.one(sqlStr, req.body.params)
        .then(function (data) {
            req.dbAnswer = {
                    status: 'success',
                    data: data,
                    message: 'Inserted into docimage'
                };
            return next();
        })
        .catch(function (err) {
            return next(err);
    });
}

function docimage_DoUpdate(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('update params not found!'));
    }
    var setStr = '';
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(docimage_HasKeyname(parstr)) {
            whereStr = makeWhere(whereStr);
            whereStr += parstr + "=${" + parnext + "}";
        } else if(docimage_HasColname(parstr)) {
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
            req.dbAnswer = {
                    status: 'success',
                    message: `Updated ${result.rowCount} from docimage`
                };
            return next();
        })
        .catch(function (err) {
            return next(err);
    });
}

function docimage_DoDelete(req, res, next) {
    if(req.body.params === undefined) {
        return next( new Error('delete params not found!'));
    }
    var whereStr = '';
    for(var parnext in req.body.params) {
        var parstr = parnext.toString().toLowerCase();
        if(docimage_HasKeyname(parstr)) {
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
            req.dbAnswer = {
                    status: 'success',
                    message: `Removed ${result.rowCount} from docimage`
            };
            /* jshint ignore:end */
            return next();
        })
        .catch(function (err) {
            return next(err);
    });
}

// ---------------------------------------------------------
//  The function makes SQL for the docimage from the body
//  URL : POST /docimage/
//  BODY: 
//  {
//     "cmd": "select" or "insert" or "update or "delete",
//     "row_count": ... ,
//     "lodir": <catalogue for lo-* functions> ,
//     "params": {
//         "pagen":...,
//         "cdoc":...,
//         "imageid":"..."
//      }
//  }
// ---------------------------------------------------------
function docimage_makeQuery(req, res, next) {
    if( req.body.cmd === undefined )
        return next( new Error('keyword cmd not found in the body!'));
    switch(req.body.cmd.toString().toLowerCase()) {
    case 'select':
        docimage_DoSelect(req, res, next);
        break;
    case 'insert':
        docimage_DoInsert(req, res, next);
        break;
    case 'update':
        docimage_DoUpdate(req, res, next);
        break;
    case 'delete':
        docimage_DoDelete(req, res, next);
        break;
    default:
        return next( new Error('cmd ' + req.body.cmd + " is unknow!"));
    }
}


var ref_collist_all = ['pid','per_pid','memo'];
function ref_HasColname(colname) {
    return (ref_collist_all.indexOf(colname.toString().toLowerCase()) > -1);
}

var ref_collist_keys = [];
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
            whereStr = makeWhere(whereStr);
            switch(parstr) {
            case 'pid':
                if(req.body.params[parnext])  {
                    whereStr += " pid = ${" + parnext + "}";
                }
                break;
            case 'per_pid':
                if(req.body.params[parnext])  {
                    whereStr += " per_pid = ${" + parnext + "}";
                }
                break;
            case 'memo':
                if(req.body.params[parnext])  {
                    whereStr += " memo = ${" + parnext + "}";
                }
                break;
            }
        } else {
            next(new Error('column ' + parnext + ' not exists in ref!'));
            return "ERROR";
        }
    }
    return whereStr;
}

function ref_DoSelect(req, res, next) {
    var whereStr = ref_makeWhere(req, next);
    if(whereStr == "ERROR")
        return;
    var sqlStr = "SELECT pid" 
                     + ",per_pid" 
                     + ",memo"
                     + " FROM ref " + whereStr;
    if (app.get('env') === 'development') {
        // console.log( sqlStr );
        console.log(pgp.as.format(sqlStr, req.body.params));
    }
    db.any(sqlStr, req.body.params)
        .then(function (data) {
            req.dbAnswer = {
                    status: "success",
                    data: data,
                    message: "Retrieved from ref"
            };
            return next();
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
            if(req.body.params[parnext]) {
               parList = makeList(parList);
               parValues = makeList(parValues);
               parList += parstr;
               parValues += "${" + parnext + "}";
            } else {
               return next(new Error('column ref.' + parnext + " has undefined value!"));
            }
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
            req.dbAnswer = {
                    status: 'success',
                    message: 'Inserted into ref'
                };
            return next();
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
            req.dbAnswer = {
                    status: 'success',
                    message: `Updated ${result.rowCount} from ref`
                };
            return next();
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
            req.dbAnswer = {
                    status: 'success',
                    message: `Removed ${result.rowCount} from ref`
            };
            /* jshint ignore:end */
            return next();
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
//     "lodir": <catalogue for lo-* functions> ,
//     "params": {
//         "pid":"...",
//         "per_pid":"...",
//         "memo":"..."
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
   docspec_makeQuery: docspec_makeQuery,
   doc_makeQuery: doc_makeQuery,
   state_makeQuery: state_makeQuery,
   person_makeQuery: person_makeQuery,
   photodata_makeQuery: photodata_makeQuery,
   photospec_makeQuery: photospec_makeQuery,
   audiodata_makeQuery: audiodata_makeQuery,
   operator_makeQuery: operator_makeQuery,
   regpoint_makeQuery: regpoint_makeQuery,
   oprule_makeQuery: oprule_makeQuery,
   contact_makeQuery: contact_makeQuery,
   agent_makeQuery: agent_makeQuery,
   access_makeQuery: access_makeQuery,
   docimage_makeQuery: docimage_makeQuery,
   ref_makeQuery: ref_makeQuery
};
