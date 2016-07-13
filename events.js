'use strict';
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

var rollbar = require("rollbar");
rollbar.init("e7c60f92667b4b6f8d2c4e918503f13c");

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
            rollbar.handleError(err);
            return;
        }
    });
}

function queryContactHistory(deviceId, startTime, callback) {
    var query = datastore.createQuery('Event')
        .filter('deviceId', '=', deviceId)
        .filter('name', '=', "contact")
        .filter('date', '>=', startTime)
        .order('date', {
            ascending: true
        });

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
                "label": "Status",
                "pattern": "",
                "type": "string"
            });

            // Build Rows of data
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
            callback(err, null);
        }
    });
}

function queryDeviceTempHistory(deviceId, startTime, callback) {
    var query = datastore.createQuery('Event')
        .filter('deviceId', '=', deviceId)
        .filter('name', '=', "temperature")
        .filter('date', '>=', startTime);

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

            // Build Rows of data
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
            callback(err, null);
        }
    });
}

module.exports = {

    insert: function(data) {
        var key = datastore.key('Event');

        saveEvent(key, data);
    },

    queryContactHistory: function(deviceId, startTime, callback) {
        queryContactHistory(deviceId, startTime, callback);
    },

    queryDeviceTempHistory: function(deviceId, startTime, callback) {
        queryDeviceTempHistory(deviceId, startTime, callback);
    }
};
