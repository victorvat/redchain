const express = require('express');
const extRouter = new express.Router();

//var dbGate = require('../queries');

// extRouter.use((req, res, next) => {
//     console.log('API_ROUTER:', req.path);
//     next();
// });

// extRouter.post('/person_find', 
//     (req, res, next) => {
//         console.log('person_find', req.body);
//         next();
//     },
//     dbGate.getAll_person
// );

// extRouter.get('/person_all',
//     (req, res, next) => {
//         console.log('person_all', req.body);
//         return res.status(503).send('Сервис недоступен. use: /api/person/all');;
//     }
// );

// extRouter.post('/login', 
//     (req, res, next) => {
//         console.log('login')
//     }
// );

module.exports = extRouter;
