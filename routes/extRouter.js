const express = require('express');
const extRouter = new express.Router();

//import person from './preson'; 

const _personDemo = [
    {shortName: 'short_1', fullName: 'full_1' },
    {shortName: 'short_2', fullName: 'full_2', legalName: 'legal_2' },
    {shortName: 'short_3', fullName: 'full_3' },
]

extRouter.use((req, res, next) => {
    console.log('API_ROUTER:', req.path);
    next();
});

extRouter.post('/person_find', (req, res, next) => {
    console.log('person_find', req.body);
    return res.status(200).json( _personDemo );
});

extRouter.get('/person_all', (req, res, next) => {
    console.log('person_all', req.body);
    return res.status(200).json( _personDemo );
});

extRouter.post('/login', (req, res, next) => {
    console.log('login')
});

module.exports = extRouter;
