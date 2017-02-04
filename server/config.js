
var path = require('path');
var fs = require('fs');
var ini = require('ini');

//const content = fs.readFileSync(path.join(__dirname, 'config.ini'), 'utf-8');
const content = fs.readFileSync('config.ini', 'utf-8');
const config = ini.parse(content)

module.exports = config;