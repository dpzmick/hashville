/* @flow */
var MongoClient = require('mongodb').MongoClient;
var _ = require('lodash');
var request = require('request');

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
        var latitude  = options.latitude;
        var longitude = options.longitude;
        var radius    = options.radius;
        var type      = options.type;

        var baseUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyDBSoBV6-9seLDqK62S5LRjIRMG5G1ZZYA&location=';
        var locationStr = latitude + ',' + longitude + '&radius=' + radius;
        var typeStr = '&types=' + type;
        var blah = '&rankBy=distance';

        var url = baseUrl + locationStr + typeStr + blah;

        request(url, function(error, response, data){
            if(!error && response.statusCode === 200) {
                // check that we actually got data
                var jsonDat = JSON.parse(data);
                if (jsonDat.status !== 'ZERO_RESULTS') {
                    var dat = _.map(jsonDat['results'], function (e) {
                        return {
                            'title': e['name'],
                            'lat': e['geometry']['location']['lat'],
                            'lon': e['geometry']['location']['lng']
                        }
                    });

                    callback(dat);
                } else {
                    callback(null);
                }
            }
        })
    }

    allArtAndHistoryWithTypes(options: Object, callback: Function) {
        var latitude  = options.latitude;
        var longitude = options.longitude;
        var radius    = options.radius;
        var outerThis = this;

        // set up options for first round
        var filter = within(latitude, longitude, radius);

        var sort = function(e) {
            return Math.sqrt(
                Math.pow(latitude - e['lat'], 2),
                Math.pow(longitude - e['long'], 2));
        };

        var artMapper = function (e) {
            return {
                'title': e['desc']['title'],
                'lat': e['lat'],
                'lon': e['long'],
                'type': 'art'
            }
        }

        var historyMapper = function (e) {
            return {
                'title': e['desc']['title'],
                'lat': e['lat'],
                'lon': e['long'],
                'type': 'historical'
            }
        }

        var art1Callback = function (data) {
            var art2Callback = function (innerData) {
                var histCallback = function (innerInnerData) {
                    outerThis.getOtherNear({
                        latitude: latitude,
                        longitude: longitude,
                        radius: radius,
                        type: 'restaurant'
                    }, function (foodData) {
                        console.log('got food data');
                        var food = _.map(foodData, function (e) {
                            return {
                                'title': e['title'],
                                'lat': e['lat'],
                                'lon': e['lon'],
                                'type': 'restaurant'
                            }
                        });

                        outerThis.getOtherNear({
                            latitude: latitude,
                            longitude: longitude,
                            radius: radius,
                            type: 'museum'
                        }, function (museumData) {
                            console.log('got museum data');
                            var mus = _.map(museumData, function (e) {
                                return {
                                    'title': e['title'],
                                    'lat': e['lat'],
                                    'lon': e['lon'],
                                    'type': 'museum'
                                }
                            });

                            var all = data
                                     .concat(innerData)
                                     .concat(innerInnerData)
                                     .concat(food)
                                     .concat(mus);

                            callback(_.sortBy(all, sort));
                        })
                    })
                }

                genericFilterFunction({
                    db: this.db,
                    collection: 'historical_markers',
                    filterFunc: filter,
                    mapFunc: historyMapper,
                    sortFunc: sort,
                    callback: histCallback
                });
            }

            genericFilterFunction({
                db: this.db,
                collection: 'metro_public_art',
                filterFunc: filter,
                mapFunc: artMapper,
                sortFunc: sort,
                callback: art2Callback
            });
        }

        genericFilterFunction({
            db: this.db,
            collection: 'public_art',
            filterFunc: filter,
            mapFunc: artMapper,
            sortFunc: sort,
            callback: art1Callback
        });
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
        } else if (type !== null) {
            this.getOtherNear(options, callback); // use the passed options, we need to keep type!
        } else {
            callback(null);
        }
    }
}
