var express = require('express');
var router = express.Router();

var db = require('../queries');
router.get('/api/docSpec', db.getAll_docSpec);
router.get('/api/docSpec/:id', db.getSingle_docSpec);
router.post('/api/docSpec', db.create_docSpec);
router.put('/api/docSpec/:id', db.update_docSpec);
router.delete('/api/docSpec/:id', db.remove_docSpec);

router.get('/api/doc', db.getAll_doc);
router.get('/api/doc/:id', db.getSingle_doc);
router.post('/api/doc', db.create_doc);
router.put('/api/doc/:id', db.update_doc);
router.delete('/api/doc/:id', db.remove_doc);

router.get('/api/State', db.getAll_State);
router.get('/api/State/:id', db.getSingle_State);
router.post('/api/State', db.create_State);
router.put('/api/State/:id', db.update_State);
router.delete('/api/State/:id', db.remove_State);

router.get('/api/person', db.getAll_person);
router.get('/api/person/:id', db.getSingle_person);
router.post('/api/person', db.create_person);
router.put('/api/person/:id', db.update_person);
router.delete('/api/person/:id', db.remove_person);

router.get('/api/photoData', db.getAll_photoData);
router.get('/api/photoData/:id', db.getSingle_photoData);
router.post('/api/photoData', db.create_photoData);
router.put('/api/photoData/:id', db.update_photoData);
router.delete('/api/photoData/:id', db.remove_photoData);

router.get('/api/photoSpec', db.getAll_photoSpec);
router.get('/api/photoSpec/:id', db.getSingle_photoSpec);
router.post('/api/photoSpec', db.create_photoSpec);
router.put('/api/photoSpec/:id', db.update_photoSpec);
router.delete('/api/photoSpec/:id', db.remove_photoSpec);

router.get('/api/audioDatа', db.getAll_audioDatа);
router.get('/api/audioDatа/:id', db.getSingle_audioDatа);
router.post('/api/audioDatа', db.create_audioDatа);
router.put('/api/audioDatа/:id', db.update_audioDatа);
router.delete('/api/audioDatа/:id', db.remove_audioDatа);

router.get('/api/operator', db.getAll_operator);
router.get('/api/operator/:id', db.getSingle_operator);
router.post('/api/operator', db.create_operator);
router.put('/api/operator/:id', db.update_operator);
router.delete('/api/operator/:id', db.remove_operator);

router.get('/api/regPoint', db.getAll_regPoint);
router.get('/api/regPoint/:id', db.getSingle_regPoint);
router.post('/api/regPoint', db.create_regPoint);
router.put('/api/regPoint/:id', db.update_regPoint);
router.delete('/api/regPoint/:id', db.remove_regPoint);

router.get('/api/opRule', db.getAll_opRule);
router.get('/api/opRule/:id', db.getSingle_opRule);
router.post('/api/opRule', db.create_opRule);
router.put('/api/opRule/:id', db.update_opRule);
router.delete('/api/opRule/:id', db.remove_opRule);

router.get('/api/Contact', db.getAll_Contact);
router.get('/api/Contact/:id', db.getSingle_Contact);
router.post('/api/Contact', db.create_Contact);
router.put('/api/Contact/:id', db.update_Contact);
router.delete('/api/Contact/:id', db.remove_Contact);

router.get('/api/Agent', db.getAll_Agent);
router.get('/api/Agent/:id', db.getSingle_Agent);
router.post('/api/Agent', db.create_Agent);
router.put('/api/Agent/:id', db.update_Agent);
router.delete('/api/Agent/:id', db.remove_Agent);

router.get('/api/access', db.getAll_access);
router.get('/api/access/:id', db.getSingle_access);
router.post('/api/access', db.create_access);
router.put('/api/access/:id', db.update_access);
router.delete('/api/access/:id', db.remove_access);

router.get('/api/docImage', db.getAll_docImage);
router.get('/api/docImage/:id', db.getSingle_docImage);
router.post('/api/docImage', db.create_docImage);
router.put('/api/docImage/:id', db.update_docImage);
router.delete('/api/docImage/:id', db.remove_docImage);

router.get('/api/ref', db.getAll_ref);
router.get('/api/ref/:id', db.getSingle_ref);
router.post('/api/ref', db.create_ref);
router.put('/api/ref/:id', db.update_ref);
router.delete('/api/ref/:id', db.remove_ref);

module.exports = router;
