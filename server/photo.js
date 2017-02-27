var fs = require('fs')
var path = require('path')
var uuid = require('uuid')
var multer = require('multer')
var bodyParser = require('body-parser');

// from config
store_base = '/temp/uploads';
store_deep = 2;
//

function walkStore(filename, cb)
{
    let destination = store_base;
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
        res.status(500).json({err:'task not found'});
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
///////////////////

module.exports = { pushParser, pushWorker, getParser, getWorker }