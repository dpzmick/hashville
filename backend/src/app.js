/* @flow */

var express = require('express');
var app = express();

app.get('/near', function (req, res) {

    if(typeof(req.query.type) === 'undefined') {
        res.send({'error': 0, 'desc': 'query needs a type'});
        return;
    }

    if (typeof(req.query.latitude) === 'undefined') {
        res.send({'error': 1, 'desc': 'query needs a latitude'});
        return;
    }

    if (typeof(req.query.longitude) === 'undefined') {
        res.send({'error': 2, 'desc': 'query needs a longitude'});
        return;
    }

    if (typeof(req.query.radius) === 'undefined') {
        res.send({'error': 3, 'desc': 'query needs a radius'});
        return;
    }

    // we have all the data we need, lets extract it all again..
    var type       = res.query.type;
    var latitude   = res.query.latitude;
    var longitiude = res.query.longitude;
    var radius     = res.query.radius;

});

var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log('Example app listening at http://%s:%s', host, port)
});
