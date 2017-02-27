var express = require('express');
var router = express.Router();

var db = require('../server/queries');

router.post('/docspec/', db.docspec_makeQuery);
router.post('/doc/', db.doc_makeQuery);
router.post('/state/', db.state_makeQuery);
router.post('/person/', db.person_makeQuery);
router.post('/photodata/', db.photodata_makeQuery);
router.post('/photospec/', db.photospec_makeQuery);
router.post('/audiodata/', db.audiodata_makeQuery);
router.post('/operator/', db.operator_makeQuery);
router.post('/regpoint/', db.regpoint_makeQuery);
router.post('/oprule/', db.oprule_makeQuery);
router.post('/contact/', db.contact_makeQuery);
router.post('/agent/', db.agent_makeQuery);
router.post('/access/', db.access_makeQuery);
router.post('/docimage/', db.docimage_makeQuery);
router.post('/ref/', db.ref_makeQuery);

module.exports = router;
