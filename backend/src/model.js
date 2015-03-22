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

// options
// db: MongoClient.Db
// collection: string
// filterFunc: Function (lat, lon) -> bool // probably repetitive but w/e
// sortFunc: Function (e) -> sortable value
// mapFunc: Function (e) -> e to return
// callback: Function (lastData)
var genericFilterFunction = function(options: Object) {
    options.db.collection(options.collection, function (err, coll) {
        // get all of the data from the collection, do a filter manually
        // don't tell anyone
        coll.find().toArray(function(err, res) {
            if (err) {
                options.callback(null);
            } else {
                var kept = _.filter(res, function(e) {
                    return options.filterFunc(e['lat'], e['long']);
                });

                var unmapped = _.sortBy(kept, options.sortFunc);

                var data = _.map(unmapped, options.mapFunc);

                options.callback(data);
            }
        });
    });
}

class DataModel {
    db: MongoClient.Db;

    constructor(db: MongoClient.Db) {
        this.db = db;
    }

    // I think this might be more gross than I was hoping sorry!
    getArtNear(options: any, callback: Function) {
        var latitude  = options.latitude;
        var longitude = options.longitude;
        var radius    = options.radius;

        // do first arts
        var collection = this.db;

        // set up options for first round
        var filterFunc = within(latitude, longitude, radius);

        var sortFunc = function(e) {
            return Math.sqrt(
                Math.pow(latitude - e['lat'], 2),
                Math.pow(longitude - e['long'], 2));
        };

        var firstMapFunc = function (e) {
            return {
                'title': e['desc']['title'],
                'lat': e['lat'],
                'lon': e['long']
            }
        };

        var innerCallback = function (data) {
            if (data) {
                var innerInnerCallback = function (innerData) {
                    if (innerData) {
                        callback(innerData.concat(data));
                    } else {
                        callback(null);
                    }
                }

                var innerOptions = {
                    'db': this.db,
                    'collection': 'public_art',
                    filterFunc: filterFunc,
                    sortFunc: sortFunc,
                    mapFunc: firstMapFunc,
                    callback: innerInnerCallback
                }

                genericFilterFunction(innerOptions);
            } else {
                callback(null);
            }
        }

        var firstOptions = {
            db: this.db,
            collection: 'metro_public_art',
            filterFunc: filterFunc,
            sortFunc: sortFunc,
            mapFunc: firstMapFunc,
            callback: innerCallback
        }

        genericFilterFunction(firstOptions);
    }

    getHistoricalNear(options: any, callback: Function) {
        var latitude  = options.latitude;
        var longitude = options.longitude;
        var radius    = options.radius;

        // set up options for first round
        var filterFunc = within(latitude, longitude, radius);

        var sortFunc = function(e) {
            return Math.sqrt(
                Math.pow(latitude - e['lat'], 2),
                Math.pow(longitude - e['long'], 2));
        };

        var mapFunc = function (e) {
            return {
                'title': e['desc']['title'],
                'lat': e['lat'],
                'lon': e['long']
            }
        };

        var innerCallback = function (data) {
            if (data) {
                callback(data);
            } else {
                callback(null);
            }
        }

        var firstOptions = {
            db: this.db,
            collection: 'metro_public_art',
            filterFunc: filterFunc,
            sortFunc: sortFunc,
            mapFunc: mapFunc,
            callback: innerCallback
        }

        genericFilterFunction(firstOptions);
    }


    getOtherNear(options: any, callback: Function) {
        var latitude = options.latitude;
        var longitude = options.longitude;
        var radius = options.radius;
        var type = options.type;

        // NOAH CODE
        var request = require('request');

        request.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyDBSoBV6-9seLDqK62S5LRjIRMG5G1ZZYA&location='
                + latitude + ',' + longitude + '&radius=' + radius + '&types=' type)
            .on('response', function(response) {
                    console.log(response.statusCode) // 200 
                    console.log(response.headers['content-type']) // 'JSON?' 
                    console.log(response)
                  });
        // NOAH CODE
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
            this.getOtherNear(payload, callback);
            callback(null);
        }
    }
}
