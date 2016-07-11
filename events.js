'use strict';

// var projectId = process.env.GCLOUD_PROJECT || process.env.DATASET_ID;
var projectId = 'fire-things';

if (!projectId) {
    var MISSING_ID = [
        'Cannot find your project ID. Please set an environment variable named ',
        '"DATASET_ID", holding the ID of your project.'
    ].join('');
    throw new Error(MISSING_ID);
}

var gcloud = require('gcloud')({
    projectId: projectId,
    credentials: require('./fire-things-156788df1e34.json')
});

var datastore = gcloud.datastore();

function saveEvent(key, data, callback) {
    // fix event id
    var eventId = data.id;
    delete data.id;
    data['eventId'] = eventId;

    // convert dates
    var date = data['date'];
    data['date'] = new Date(date);

    var isoDate = data['isoDate'];
    data['isoDate'] = new Date(isoDate);

    // fix booleans
    var isDigital = data['isDigital'];
    data['isDigital'] = Boolean(isDigital);

    var isPhysical = data['isPhysical'];
    data['isDigital'] = Boolean(isDigital);

    var isStateChange = data['isStateChange'];
    data['isStateChange'] = Boolean(isStateChange);

    datastore.save({
        key: key,
        data: data
    }, function(err) {
        if (err) {
            console.log(err);
            callback(err, null);
            return;
        }

        data.id = key.id;
        callback(null, data);
    });
}

function queryContactHistory(deviceId, startTime, callback) {
    var date = new Date('2016-07-9 (13:38:42.000) CDT');
    var query = datastore.createQuery('Event')
        .filter('deviceId', '=', deviceId)
        .filter('name', '=', "contact")
        .filter('date', '>=', date)
        .order('date', {
            ascending: true
        });

    datastore.runQuery(query, function(err, events) {
        if (!err) {
            callback(null, events);
        } else {
            console.log(err);
        }
    });
}

function queryDeviceTempHistory(deviceId, startTime, callback) {
    var date = new Date('2016-07-9 (13:38:42.000) CDT');
    var query = datastore.createQuery('Event')
        .filter('deviceId', '=', deviceId)
        .filter('name', '=', "temperature")
        .filter('date', '>=', date);

    datastore.runQuery(query, function(err, events) {
        if (!err) {
            var data = {};
            data['cols'] = [];
            data['cols'].push({
                "id": "",
                "label": "Date",
                "pattern": "",
                "type": "datetime"
            });
            data['cols'].push({
                "id": "",
                "label": "Temperature",
                "pattern": "",
                "type": "number"
            });

            data['rows'] = [];

            for (var i = 0; i < events.length; i++) {
                var date = new Date(events[i]['data'].date);
                var dateRow = {
                    "v": "Date(" + date.getTime() + ")",
                    "f": null
                };
                var tempRow = {
                    "v": events[i]['data'].value,
                    "f": null
                };
                var fullRow = {};
                fullRow.c = [];
                fullRow.c.push(dateRow);
                fullRow.c.push(tempRow);
                data['rows'].push(fullRow);
            }
            callback(null, data);
        } else {
            console.log(err);
        }
    });
}

module.exports = {

    insert: function(data, callback) {
        var key = datastore.key('Event');

        saveEvent(key, data, callback);
    },

    queryContactHistory: function(deviceId, startTime, callback) {
        queryContactHistory(deviceId, startTime, callback);
    },

    queryDeviceTempHistory: function(deviceId, startTime, callback) {
        queryDeviceTempHistory(deviceId, startTime, callback);
    }
};
