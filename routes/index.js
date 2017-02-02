var express = require('express');
var router = express.Router();

var db = require('../queries');

router.get(   '/redchain/api/docSpec/all',   db.getAll_docSpec); // GET    /redchain/api/docSpec/all without BODY
router.get(   '/redchain/api/docSpec/',  db.getSingle_docSpec);  // GET    /redchain/api/docSpec/?cSpec=... without BODY
router.post(  '/redchain/api/docSpec',   db.create_docSpec);     // POST   /redchain/api/docSpec with BODY: spec=...&spec_en=...
router.put(   '/redchain/api/docSpec/',  db.update_docSpec);     // PUT    /redchain/api/docSpec with BODY: cSpec=...&spec=...&spec_en=...
router.delete('/redchain/api/docSpec/',  db.remove_docSpec);     // DELETE /redchain/api/docSpec with BODY: cSpec=...

router.get(   '/redchain/api/doc/all',   db.getAll_doc); // GET    /redchain/api/doc/all without BODY
router.get(   '/redchain/api/doc/',  db.getSingle_doc);  // GET    /redchain/api/doc/?cDoc=... without BODY
router.post(  '/redchain/api/doc',   db.create_doc);     // POST   /redchain/api/doc with BODY: cSpec=...&pId=...&cState=...&docN=...&docDate=...&docEnd=...&docAuth=...&Memo=...
router.put(   '/redchain/api/doc/',  db.update_doc);     // PUT    /redchain/api/doc with BODY: cDoc=...&cSpec=...&pId=...&cState=...&docN=...&docDate=...&docEnd=...&docAuth=...&Memo=...
router.delete('/redchain/api/doc/',  db.remove_doc);     // DELETE /redchain/api/doc with BODY: cDoc=...

router.get(   '/redchain/api/State/all',   db.getAll_State); // GET    /redchain/api/State/all without BODY
router.get(   '/redchain/api/State/',  db.getSingle_State);  // GET    /redchain/api/State/?cState=... without BODY
router.post(  '/redchain/api/State',   db.create_State);     // POST   /redchain/api/State with BODY: State=...&State_en=...
router.put(   '/redchain/api/State/',  db.update_State);     // PUT    /redchain/api/State with BODY: cState=...&State=...&State_en=...
router.delete('/redchain/api/State/',  db.remove_State);     // DELETE /redchain/api/State with BODY: cState=...

router.get(   '/redchain/api/person/all',   db.getAll_person); // GET    /redchain/api/person/all without BODY
router.get(   '/redchain/api/person/',  db.getSingle_person);  // GET    /redchain/api/person/?pId=... without BODY
router.post(  '/redchain/api/person',   db.create_person);     // POST   /redchain/api/person with BODY: pId=...&cState=...&shortName=...&fullName=...&legalName=...&bornDate=...&sexId=...
router.put(   '/redchain/api/person/',  db.update_person);     // PUT    /redchain/api/person with BODY: pId=...&cState=...&shortName=...&fullName=...&legalName=...&bornDate=...&sexId=...
router.delete('/redchain/api/person/',  db.remove_person);     // DELETE /redchain/api/person with BODY: pId=...

router.get(   '/redchain/api/photoData/all',   db.getAll_photoData); // GET    /redchain/api/photoData/all without BODY
router.get(   '/redchain/api/photoData/',  db.getSingle_photoData);  // GET    /redchain/api/photoData/?pId=... without BODY
router.post(  '/redchain/api/photoData',   db.create_photoData);     // POST   /redchain/api/photoData with BODY: pId=...&cPhoto=...&photo=...
router.put(   '/redchain/api/photoData/',  db.update_photoData);     // PUT    /redchain/api/photoData with BODY: pId=...&cPhoto=...&photo=...
router.delete('/redchain/api/photoData/',  db.remove_photoData);     // DELETE /redchain/api/photoData with BODY: pId=...

router.get(   '/redchain/api/photoSpec/all',   db.getAll_photoSpec); // GET    /redchain/api/photoSpec/all without BODY
router.get(   '/redchain/api/photoSpec/',  db.getSingle_photoSpec);  // GET    /redchain/api/photoSpec/?cPhoto=... without BODY
router.post(  '/redchain/api/photoSpec',   db.create_photoSpec);     // POST   /redchain/api/photoSpec with BODY: photoSpec=...
router.put(   '/redchain/api/photoSpec/',  db.update_photoSpec);     // PUT    /redchain/api/photoSpec with BODY: cPhoto=...&photoSpec=...
router.delete('/redchain/api/photoSpec/',  db.remove_photoSpec);     // DELETE /redchain/api/photoSpec with BODY: cPhoto=...

router.get(   '/redchain/api/audioDatа/all',   db.getAll_audioDatа); // GET    /redchain/api/audioDatа/all without BODY
router.get(   '/redchain/api/audioDatа/',  db.getSingle_audioDatа);  // GET    /redchain/api/audioDatа/?pId=... without BODY
router.post(  '/redchain/api/audioDatа',   db.create_audioDatа);     // POST   /redchain/api/audioDatа with BODY: pId=...&audioFull=...&audioMemo=...&Memo=...
router.put(   '/redchain/api/audioDatа/',  db.update_audioDatа);     // PUT    /redchain/api/audioDatа with BODY: pId=...&audioFull=...&audioMemo=...&Memo=...
router.delete('/redchain/api/audioDatа/',  db.remove_audioDatа);     // DELETE /redchain/api/audioDatа with BODY: pId=...

router.get(   '/redchain/api/operator/all',   db.getAll_operator); // GET    /redchain/api/operator/all without BODY
router.get(   '/redchain/api/operator/',  db.getSingle_operator);  // GET    /redchain/api/operator/?cOper=... without BODY
router.post(  '/redchain/api/operator',   db.create_operator);     // POST   /redchain/api/operator with BODY: cRule=...&cPoint=...&Stuff=...&Stuff_en=...&key=...&phrase=...&stateId=...
router.put(   '/redchain/api/operator/',  db.update_operator);     // PUT    /redchain/api/operator with BODY: cOper=...&cRule=...&cPoint=...&Stuff=...&Stuff_en=...&key=...&phrase=...&stateId=...
router.delete('/redchain/api/operator/',  db.remove_operator);     // DELETE /redchain/api/operator with BODY: cOper=...

router.get(   '/redchain/api/regPoint/all',   db.getAll_regPoint); // GET    /redchain/api/regPoint/all without BODY
router.get(   '/redchain/api/regPoint/',  db.getSingle_regPoint);  // GET    /redchain/api/regPoint/?cPoint=... without BODY
router.post(  '/redchain/api/regPoint',   db.create_regPoint);     // POST   /redchain/api/regPoint with BODY: cState=...&point=...&point_en=...&location=...&location_en=...
router.put(   '/redchain/api/regPoint/',  db.update_regPoint);     // PUT    /redchain/api/regPoint with BODY: cPoint=...&cState=...&point=...&point_en=...&location=...&location_en=...
router.delete('/redchain/api/regPoint/',  db.remove_regPoint);     // DELETE /redchain/api/regPoint with BODY: cPoint=...

router.get(   '/redchain/api/opRule/all',   db.getAll_opRule); // GET    /redchain/api/opRule/all without BODY
router.get(   '/redchain/api/opRule/',  db.getSingle_opRule);  // GET    /redchain/api/opRule/?cRule=... without BODY
router.post(  '/redchain/api/opRule',   db.create_opRule);     // POST   /redchain/api/opRule with BODY: Rule=...&Rule_en=...
router.put(   '/redchain/api/opRule/',  db.update_opRule);     // PUT    /redchain/api/opRule with BODY: cRule=...&Rule=...&Rule_en=...
router.delete('/redchain/api/opRule/',  db.remove_opRule);     // DELETE /redchain/api/opRule with BODY: cRule=...

router.get(   '/redchain/api/Contact/all',   db.getAll_Contact); // GET    /redchain/api/Contact/all without BODY
router.get(   '/redchain/api/Contact/',  db.getSingle_Contact);  // GET    /redchain/api/Contact/?cContact=... without BODY
router.post(  '/redchain/api/Contact',   db.create_Contact);     // POST   /redchain/api/Contact with BODY: cAgent=...&pId=...&key=...&phrase=...&Memo=...&stateId=...
router.put(   '/redchain/api/Contact/',  db.update_Contact);     // PUT    /redchain/api/Contact with BODY: cContact=...&cAgent=...&pId=...&key=...&phrase=...&Memo=...&stateId=...
router.delete('/redchain/api/Contact/',  db.remove_Contact);     // DELETE /redchain/api/Contact with BODY: cContact=...

router.get(   '/redchain/api/Agent/all',   db.getAll_Agent); // GET    /redchain/api/Agent/all without BODY
router.get(   '/redchain/api/Agent/',  db.getSingle_Agent);  // GET    /redchain/api/Agent/?cAgent=... without BODY
router.post(  '/redchain/api/Agent',   db.create_Agent);     // POST   /redchain/api/Agent with BODY: Agent=...&Memo=...
router.put(   '/redchain/api/Agent/',  db.update_Agent);     // PUT    /redchain/api/Agent with BODY: cAgent=...&Agent=...&Memo=...
router.delete('/redchain/api/Agent/',  db.remove_Agent);     // DELETE /redchain/api/Agent with BODY: cAgent=...

router.get(   '/redchain/api/access/all',   db.getAll_access); // GET    /redchain/api/access/all without BODY
router.get(   '/redchain/api/access/',  db.getSingle_access);  // GET    /redchain/api/access/?cOper=...&pId=... without BODY
router.post(  '/redchain/api/access',   db.create_access);     // POST   /redchain/api/access with BODY: cOper=...&pId=...&stateId=...
router.put(   '/redchain/api/access/',  db.update_access);     // PUT    /redchain/api/access with BODY: cOper=...&pId=...&stateId=...
router.delete('/redchain/api/access/',  db.remove_access);     // DELETE /redchain/api/access with BODY: cOper=...&pId=...

router.get(   '/redchain/api/docImage/all',   db.getAll_docImage); // GET    /redchain/api/docImage/all without BODY
router.get(   '/redchain/api/docImage/',  db.getSingle_docImage);  // GET    /redchain/api/docImage/?pageN=... without BODY
router.post(  '/redchain/api/docImage',   db.create_docImage);     // POST   /redchain/api/docImage with BODY: pageN=...&cDoc=...&image=...
router.put(   '/redchain/api/docImage/',  db.update_docImage);     // PUT    /redchain/api/docImage with BODY: pageN=...&cDoc=...&image=...
router.delete('/redchain/api/docImage/',  db.remove_docImage);     // DELETE /redchain/api/docImage with BODY: pageN=...

router.get(   '/redchain/api/ref/all',   db.getAll_ref); // GET    /redchain/api/ref/all without BODY
router.get(   '/redchain/api/ref/',  db.getSingle_ref);  // GET    /redchain/api/ref/?pId=...&per_pId=... without BODY
router.post(  '/redchain/api/ref',   db.create_ref);     // POST   /redchain/api/ref with BODY: pId=...&per_pId=...&Memo=...
router.put(   '/redchain/api/ref/',  db.update_ref);     // PUT    /redchain/api/ref with BODY: pId=...&per_pId=...&Memo=...
router.delete('/redchain/api/ref/',  db.remove_ref);     // DELETE /redchain/api/ref with BODY: pId=...&per_pId=...

module.exports = router;
