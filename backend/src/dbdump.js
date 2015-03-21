/* @flow */

var fs = require('fs');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

// load some data synch
var obj = JSON.parse(fs.readFileSync('../raw_data/art.json', 'utf8'));

console.log(obj);
