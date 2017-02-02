var express = require('express');
var router = express.Router();

var db = require('../queries');

router.get(   '/redchain/docSpec/',  db.getSingle_docSpec);  // GET    /redchain/docSpec/?cSpec=... without BODY
router.post(  '/redchain/docSpec',   db.create_docSpec);     // POST   /redchain/docSpec with BODY: spec=...&spec_en=...
router.put(   '/redchain/docSpec/',  db.update_docSpec);     // PUT    /redchain/docSpec with BODY: cSpec=...&spec=...&spec_en=...
router.delete('/redchain/docSpec/',  db.remove_docSpec);     // DELETE /redchain/docSpec with BODY: cSpec=...

router.get(   '/redchain/doc/',  db.getSingle_doc);  // GET    /redchain/doc/?cDoc=... without BODY
router.post(  '/redchain/doc',   db.create_doc);     // POST   /redchain/doc with BODY: cSpec=...&pId=...&cState=...&docN=...&docDate=...&docEnd=...&docAuth=...&Memo=...
router.put(   '/redchain/doc/',  db.update_doc);     // PUT    /redchain/doc with BODY: cDoc=...&cSpec=...&pId=...&cState=...&docN=...&docDate=...&docEnd=...&docAuth=...&Memo=...
router.delete('/redchain/doc/',  db.remove_doc);     // DELETE /redchain/doc with BODY: cDoc=...

router.get(   '/redchain/State/',  db.getSingle_State);  // GET    /redchain/State/?cState=... without BODY
router.post(  '/redchain/State',   db.create_State);     // POST   /redchain/State with BODY: State=...&State_en=...
router.put(   '/redchain/State/',  db.update_State);     // PUT    /redchain/State with BODY: cState=...&State=...&State_en=...
router.delete('/redchain/State/',  db.remove_State);     // DELETE /redchain/State with BODY: cState=...

router.get(   '/redchain/person/',  db.getSingle_person);  // GET    /redchain/person/?pId=... without BODY
router.post(  '/redchain/person',   db.create_person);     // POST   /redchain/person with BODY: pId=...&cState=...&shortName=...&fullName=...&legalName=...&bornDate=...&sexId=...
router.put(   '/redchain/person/',  db.update_person);     // PUT    /redchain/person with BODY: pId=...&cState=...&shortName=...&fullName=...&legalName=...&bornDate=...&sexId=...
router.delete('/redchain/person/',  db.remove_person);     // DELETE /redchain/person with BODY: pId=...

router.get(   '/redchain/photoData/',  db.getSingle_photoData);  // GET    /redchain/photoData/?pId=... without BODY
router.post(  '/redchain/photoData',   db.create_photoData);     // POST   /redchain/photoData with BODY: pId=...&cPhoto=...&photo=...
router.put(   '/redchain/photoData/',  db.update_photoData);     // PUT    /redchain/photoData with BODY: pId=...&cPhoto=...&photo=...
router.delete('/redchain/photoData/',  db.remove_photoData);     // DELETE /redchain/photoData with BODY: pId=...

router.get(   '/redchain/photoSpec/',  db.getSingle_photoSpec);  // GET    /redchain/photoSpec/?cPhoto=... without BODY
router.post(  '/redchain/photoSpec',   db.create_photoSpec);     // POST   /redchain/photoSpec with BODY: photoSpec=...
router.put(   '/redchain/photoSpec/',  db.update_photoSpec);     // PUT    /redchain/photoSpec with BODY: cPhoto=...&photoSpec=...
router.delete('/redchain/photoSpec/',  db.remove_photoSpec);     // DELETE /redchain/photoSpec with BODY: cPhoto=...

router.get(   '/redchain/audioDatа/',  db.getSingle_audioDatа);  // GET    /redchain/audioDatа/?pId=... without BODY
router.post(  '/redchain/audioDatа',   db.create_audioDatа);     // POST   /redchain/audioDatа with BODY: pId=...&audioFull=...&audioMemo=...&Memo=...
router.put(   '/redchain/audioDatа/',  db.update_audioDatа);     // PUT    /redchain/audioDatа with BODY: pId=...&audioFull=...&audioMemo=...&Memo=...
router.delete('/redchain/audioDatа/',  db.remove_audioDatа);     // DELETE /redchain/audioDatа with BODY: pId=...

router.get(   '/redchain/operator/',  db.getSingle_operator);  // GET    /redchain/operator/?cOper=... without BODY
router.post(  '/redchain/operator',   db.create_operator);     // POST   /redchain/operator with BODY: cRule=...&cPoint=...&Stuff=...&Stuff_en=...&key=...&phrase=...&stateId=...
router.put(   '/redchain/operator/',  db.update_operator);     // PUT    /redchain/operator with BODY: cOper=...&cRule=...&cPoint=...&Stuff=...&Stuff_en=...&key=...&phrase=...&stateId=...
router.delete('/redchain/operator/',  db.remove_operator);     // DELETE /redchain/operator with BODY: cOper=...

router.get(   '/redchain/regPoint/',  db.getSingle_regPoint);  // GET    /redchain/regPoint/?cPoint=... without BODY
router.post(  '/redchain/regPoint',   db.create_regPoint);     // POST   /redchain/regPoint with BODY: cState=...&point=...&point_en=...&location=...&location_en=...
router.put(   '/redchain/regPoint/',  db.update_regPoint);     // PUT    /redchain/regPoint with BODY: cPoint=...&cState=...&point=...&point_en=...&location=...&location_en=...
router.delete('/redchain/regPoint/',  db.remove_regPoint);     // DELETE /redchain/regPoint with BODY: cPoint=...

router.get(   '/redchain/opRule/',  db.getSingle_opRule);  // GET    /redchain/opRule/?cRule=... without BODY
router.post(  '/redchain/opRule',   db.create_opRule);     // POST   /redchain/opRule with BODY: Rule=...&Rule_en=...
router.put(   '/redchain/opRule/',  db.update_opRule);     // PUT    /redchain/opRule with BODY: cRule=...&Rule=...&Rule_en=...
router.delete('/redchain/opRule/',  db.remove_opRule);     // DELETE /redchain/opRule with BODY: cRule=...

router.get(   '/redchain/Contact/',  db.getSingle_Contact);  // GET    /redchain/Contact/?cContact=... without BODY
router.post(  '/redchain/Contact',   db.create_Contact);     // POST   /redchain/Contact with BODY: cAgent=...&pId=...&key=...&phrase=...&Memo=...&stateId=...
router.put(   '/redchain/Contact/',  db.update_Contact);     // PUT    /redchain/Contact with BODY: cContact=...&cAgent=...&pId=...&key=...&phrase=...&Memo=...&stateId=...
router.delete('/redchain/Contact/',  db.remove_Contact);     // DELETE /redchain/Contact with BODY: cContact=...

router.get(   '/redchain/Agent/',  db.getSingle_Agent);  // GET    /redchain/Agent/?cAgent=... without BODY
router.post(  '/redchain/Agent',   db.create_Agent);     // POST   /redchain/Agent with BODY: Agent=...&Memo=...
router.put(   '/redchain/Agent/',  db.update_Agent);     // PUT    /redchain/Agent with BODY: cAgent=...&Agent=...&Memo=...
router.delete('/redchain/Agent/',  db.remove_Agent);     // DELETE /redchain/Agent with BODY: cAgent=...

router.get(   '/redchain/access/',  db.getSingle_access);  // GET    /redchain/access/?cOper=...&pId=... without BODY
router.post(  '/redchain/access',   db.create_access);     // POST   /redchain/access with BODY: cOper=...&pId=...&stateId=...
router.put(   '/redchain/access/',  db.update_access);     // PUT    /redchain/access with BODY: cOper=...&pId=...&stateId=...
router.delete('/redchain/access/',  db.remove_access);     // DELETE /redchain/access with BODY: cOper=...&pId=...

router.get(   '/redchain/docImage/',  db.getSingle_docImage);  // GET    /redchain/docImage/?pageN=... without BODY
router.post(  '/redchain/docImage',   db.create_docImage);     // POST   /redchain/docImage with BODY: pageN=...&cDoc=...&image=...
router.put(   '/redchain/docImage/',  db.update_docImage);     // PUT    /redchain/docImage with BODY: pageN=...&cDoc=...&image=...
router.delete('/redchain/docImage/',  db.remove_docImage);     // DELETE /redchain/docImage with BODY: pageN=...

router.get(   '/redchain/ref/',  db.getSingle_ref);  // GET    /redchain/ref/?pId=...&per_pId=... without BODY
router.post(  '/redchain/ref',   db.create_ref);     // POST   /redchain/ref with BODY: pId=...&per_pId=...&Memo=...
router.put(   '/redchain/ref/',  db.update_ref);     // PUT    /redchain/ref with BODY: pId=...&per_pId=...&Memo=...
router.delete('/redchain/ref/',  db.remove_ref);     // DELETE /redchain/ref with BODY: pId=...&per_pId=...

module.exports = router;
