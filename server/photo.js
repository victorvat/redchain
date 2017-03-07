var fs = require('fs')
var path = require('path')
var uuid = require('uuid')
var multer = require('multer')
var bodyParser = require('body-parser');

const config = require('./config');

// from config
//store_base = '/temp/uploads';
const store_deep = 2;
//

function walkStore(filename, cb)
{
    let destination = config.database.lodir;
    for (let i = 0; i < store_deep; i++) {
        const name = filename.slice(0, i+i+2); // 12,1234,123456
        destination = path.join(destination, name);
        try {
            console.log('=== mkdirSync', destination) 
            fs.mkdirSync(destination); 
        } catch(e) {
            if ( e.code != 'EEXIST' ) throw e;
        }
    }
    cb(destination, filename);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      walkStore(uuid(), (store_destination, store_filename) => {
        console.log('### store.destination', file.fieldname, store_destination) 
        file.store_id = store_filename; 
        cb(null, store_destination)
      })
  },
  filename: function (req, file, cb) {
    console.log('### store.filename', file.fieldname, file.store_id);  
    cb(null, file.store_id)
  }
})

const pushBodyParser = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        console.log('### fileFilter', file.fieldname);          
        cb(null, true);
    }
}).any();

function pushParser(req, res, next) {
    pushBodyParser(req, res, function (err) {
        console.log('>>> prepare');
        if (err) {
            console.log('ERR: uploadProto', err);
            res.status(500).json({err});
            return;
        } 
        console.log('<<< prepare');
        next();
    })
}  

function pushWorker(req, res, next) {
    console.log('>>> work');
    console.log('=== files', req.files);  
    console.log('===  body', req.body);  
    const tickets = req.files.map((file) => file.store_id);
    console.log('<<< work', tickets);
    return res.status(200).json( tickets );
}  

///////////////////

const getParser = bodyParser.json();

function getWorker(req, res, next) {
    console.log('>>> getImage', req.body);
    const photoid = req.body.photoid;
    if (photoid === undefined) {
        console.log('ERR: getWorker key not found');
        res.status(500).json({
            err:'task not found'
        });
        return;
    }
    walkStore(photoid, (store_destination, store_filename) => {
        fileName = path.resolve(store_destination, store_filename);
        console.log('### fileName', fileName); 
        fs.readFile(fileName,(err, data) => {
            if (err) {
                colsole.log('ERR: read', fileName, err);
                res.status(500).json( err );
                return;
            }
            res.send('data:image/jpeg;base64,'+data.toString('base64'));    
        })
    })   
};

///////////////////

function stateBroker(req, res, next) {
    var state = 'wait';
    const ticket = req.body.ticket;

    /// TODO: check ticket state
    req.body.state = 'ready';
    /// 
    next();
}

function stateWorker(req, res, next) {
    res.status(200).json({
        ticket: req.body.ticket,
        state: req.body.state
    });
}

function listWorker(req, res, next) {
    if (req.body.state !== 'ready') {
        return next();
    }
    var pool = [];
    const ticket = req.body.ticket;
    var offset = req.body.offset;
    if (offset === undefined) {
        offset = {
            cnt: 0,
            last: undefined,
            eof: false
        } 
    }

     // +++ DEBUG: stub only
    const tasks = [
        {s:'c963a1fe-4e88-48ff-9b9b-bda9cf3c7537', l:'7f21f496-d039-487a-8143-d0122ee7f479', pid:1 },
        {s:'a4ddeef9-1410-4180-8bd7-1688abf02a7d', l:'a4ddeef9-1410-4180-8bd7-1688abf02a7d'},
        {s:'687b6658-a92e-455d-b0d3-a571022f3756', l:'687b6658-a92e-455d-b0d3-a571022f3756', pid:2 },
        {s:'3840f2c7-5f99-4d04-b8a4-57d6d6ab3a8a', l:'3840f2c7-5f99-4d04-b8a4-57d6d6ab3a8a'}
    ];
    for (let i=0; i < tasks.length; i++) {
        if (offset.cnt > 50) {
            offset.eof = true;
            break;
        }
        walkStore(tasks[i].s, (store_destination, store_filename) => {
            fileName = path.resolve(store_destination, store_filename);
            console.log('=== fileName', fileName);
            try {
                const fileData = fs.readFileSync(fileName);
                pool.push({
                    id: tasks[i].s,
                    info: 'empty',
                    photoid: tasks[i].l,
                    thumbnail: 'data:image/jpeg;base64,' + fileData.toString('base64'),
                    personid: tasks[i].pid    
                });
                offset.cnt = offset.cnt +1;
                offset.last = tasks[i];
            } catch (err) {
                console.log('ERR:', err);
            }
        });   
    }
    // --- DEBUG
    res.status(200).json({
        ticket,
        state: req.body.state,
        offset,
        pool
    });
}

///////////////////

module.exports = { 
    pushParser, pushWorker,
    getParser, getWorker,
    stateBroker, stateWorker, listWorker
 }