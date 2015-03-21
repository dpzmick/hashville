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
}
