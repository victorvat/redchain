const express = require('express');
const extRouter = new express.Router();

const photo = require('../server/photo');

extRouter.post('/photo_push', photo.pushParser, photo.pushWorker);
extRouter.post('/photo_get', photo.getParser, photo.getWorker);

// extRouter.post('/login', 
//     (req, res, next) => {
//         console.log('login')
//     }
// );

module.exports = extRouter;
