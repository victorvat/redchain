const express = require('express');
const extRouter = new express.Router();

const photo = require('../server/photo');

extRouter.post('/photo_push', photo.pushParser, photo.pushWorker);
extRouter.post('/photo_get', photo.getParser, photo.getWorker);
extRouter.post('/photo_state', photo.getParser, photo.stateBroker, photo.stateWorker);
extRouter.post('/photo_list', photo.getParser, photo.stateBroker, photo.listWorker, photo.stateWorker);

// extRouter.post('/login', 
//     (req, res, next) => {
//         console.log('login')
//     }
// );

module.exports = extRouter;
