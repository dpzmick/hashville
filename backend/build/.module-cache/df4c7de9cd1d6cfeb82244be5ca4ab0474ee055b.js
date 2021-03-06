/* @flow */
var express = require('express');
var app = express();
var modelMaker = require('./model.js')

// connect to database
modelMaker.fromDatabaseConnection('mongodb://localhost:27017/place_data', function (model) {
    if (model) {
        app.get('/all', function (req, res) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            model.allArtAndHistoryWithTypes(function (d) {
                res.send(d);
            });
        });

        // add the endpoints after we load the model, so we can use it
        app.get('/near', function (req, res) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
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
            var payload = {
                type:       req.query.type,
                latitude:   parseFloat(req.query.latitude),
                longitude:  parseFloat(req.query.longitude),
                radius:     parseFloat(req.query.radius)
            };

            // write something to the result
            model.placesNear(payload, function(d){
                res.send(d);
                return;
            });
        });

        // start the server
        var server = app.listen(3000, function () {
            var host = server.address().address;
            var port = server.address().port;
            console.log('Server listening at http://%s:%s', host, port);
        });

        // TODO catch ctrl-C and close database connection

    } else {
        console.log('failed to connect to database, server exiting');
    }
})
