/* @flow */
var MongoClient = require('mongodb').MongoClient;

var model = exports;

model.fromDatabaseConnection = function(url: string, callback: Function) {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            callback(null); // run the callback with a null
        } else {
            callback(new DataModel(db));
        }
    });
}

class DataModel {
    db: MongoClient.Db;

    constructor(db: MongoClient.Db) {
        this.db = db;
    }

    getArtNear(options: any, callback: Function) {
        var latitude  = options.latitude;
        var longitude = options.longitude;
        var radius    = options.radius;


        // do first arts
        var collection = this.db;

        console.log(collection);

        var wtf = this.db.metro_public_art.find( {
            $where: function() {
                this.name === 'Aileron'
            }
        });

        console.dir(wtf);

        callback(null);

    }

    getHistoricalNear(options: any, callback: Function) {
        var latitude  = options.latitude;
        var longitude = options.longitude;
        var radius    = options.radius;
    }

    placesNear(options: any, callback: Function) {
        // we have all the data we need, lets extract it all again..
        var type      = options.type;
        var latitude  = options.latitude;
        var longitude = options.longitude;
        var radius    = options.radius;

        var payload = {
            latitude:   latitude,
            longitiude: longitude,
            radius:     radius
        }

        if (type === 'art') {
            this.getArtNear(payload, callback);
        } else if (type === 'historical') {
            this.getHistoricalNear(payload, callback);
        }

        callback(null);
    }
}
