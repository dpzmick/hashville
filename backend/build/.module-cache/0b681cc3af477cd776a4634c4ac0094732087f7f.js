/* @flow */
var express = require('express');
var app = express();
var modelMaker = require('./model.js');
var url = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/place_data';
app.set('port', process.env.PORT || 3000);

// mongoose 3.8.x
var mongoose = require('mongoose');
// mongodb-uri 0.9.x
// var uriUtil = require('mongodb-uri');
 
/* 
 * Mongoose by default sets the auto_reconnect option to true.
 * We recommend setting socket options at both the server and replica set level.
 * We recommend a 30 second connection timeout because it allows for 
 * plenty of time in most operating environments.
 */
// var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
//                 replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };       
 
/*
 * Mongoose uses a different connection string format than MongoDB's standard.
 * Use the mongodb-uri library to help you convert from the standard format to
 * Mongoose's format.
 */
// var mongodbUri = 'mongodb://user:pass@host:port/db';
// var mongooseUri = uriUtil.formatMongoose(mongodbUri);
 
mongoose.connect(url);
// mongoose.connect(mongooseUri, options);
var conn = mongoose.connection;             
 
conn.on('error', console.error.bind(console, 'connection error:'));  
 
conn.once('open', function() {
    // Wait for the database connection to establish, then start the app.
    modelMaker.fromDatabaseConnection(url, function (model) {
        if (model) {
            app.get('/all', function (req, res) {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "X-Requested-With");

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
                    latitude:   parseFloat(req.query.latitude),
                    longitude:  parseFloat(req.query.longitude),
                    radius:     parseFloat(req.query.radius)
                };

                model.allArtAndHistoryWithTypes(payload, function (d) {
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
            var server = app.listen(app.get('port'), function () {
                var host = server.address().address;
                console.log('Server listening at http://%s:%s', host, app.get('port'));
            });

            // TODO catch ctrl-C and close database connection

        } else {
            console.log('failed to connect to database, server exiting');
        }
    })
});