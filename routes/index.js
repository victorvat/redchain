var express = require('express');
var router = express.Router();

var db = require('../server/queries');

router.post('/docSpec/', db.docSpec_makeQuery);
router.post('/doc/', db.doc_makeQuery);
router.post('/State/', db.State_makeQuery);
router.post('/person/', db.person_makeQuery);
router.post('/photoData/', db.photoData_makeQuery);
router.post('/photoSpec/', db.photoSpec_makeQuery);
router.post('/audioDatа/', db.audioDatа_makeQuery);
router.post('/operator/', db.operator_makeQuery);
router.post('/regPoint/', db.regPoint_makeQuery);
router.post('/opRule/', db.opRule_makeQuery);
router.post('/Contact/', db.Contact_makeQuery);
router.post('/Agent/', db.Agent_makeQuery);
router.post('/access/', db.access_makeQuery);
router.post('/docImage/', db.docImage_makeQuery);
router.post('/ref/', db.ref_makeQuery);

module.exports = router;
