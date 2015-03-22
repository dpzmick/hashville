/* @flow */
var MongoClient = require('mongodb').MongoClient;
var _ = require('lodash');

var model = exports;

var toRadians = function (degree: number) {
    return degree * 0.0174532925; // close enough
}

// http://www.movable-type.co.uk/scripts/latlong.html
var haversine = function (lat1: number, lon1: number, lat2: number, lon2: number) : number {
    var R = 6371000; // metres
    var a1 = toRadians(lat1);
    var a2 = toRadians(lat2);
    var d1 = toRadians(lat2-lat1);
    var d2 = toRadians(lon2-lon1);

    var a = Math.sin(d1/2) * Math.sin(d1/2) +
            Math.cos(a1) * Math.cos(a2) *
            Math.sin(d2/2) * Math.sin(d2/2);

    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
}

// radius in meters
var within = function (lat1: number, lon1: number, radius: number) {
    return function(lat2: number, lon2: number) : boolean {
        var tmp = haversine(lat1, lon1, lat2, lon2);
        return  tmp < radius;
    }
}

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

        var filterFunc = within(latitude, longitude, radius);

        // do first arts
        var collection = this.db.collection('metro_public_art', function (err, coll) {

            // get all of the data from the collection, do a filter manually
            // don't tell anyone
            coll.find().toArray(function(err, res) {
                if (err) {
                    callback(null);
                } else {
                    var kept = _.filter(res, function(e) {
                        var tmp = filterFunc(e['lat'], e['long']);
                        return tmp;
                    });

                    callback(_.sortBy(res, function(e) {
                        return Math.sqrt(
                            Math.pow(latitude - e['lat'], 2),
                            Math.pow(collection - e['long'], 2));
                    }));

                    // TODO second arts..
                }
            })
        });
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
            longitude:  longitude,
            radius:     radius
        }

        if (type === 'art') {
            this.getArtNear(payload, callback);
        } else if (type === 'historical') {
            this.getHistoricalNear(payload, callback);
        } else {
            callback(null);
        }
    }
}
