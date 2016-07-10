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
            callback(err);
            return;
        }

        data.id = key.id;
        callback(null, data);
    });
}

function queryEvent(deviceId, startTime, endTime, callback) {
    var query = datastore.createQuery('Event')
        .filter('deviceId', '=', deviceId)
        .filter('date', '=', 'Wed Jul 06 20:01:05 UTC 2016');
    // .filter('date', '<=', new Date(endTime));
    // .order('date', {
    //   ascending: true
    // });

    datastore.runQuery(query, function(err, events) {
        if (!err) {
            // Task entities found.
            console.log(events);
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

    query: function(deviceId, startTime, endTime, callback) {
        queryEvent(deviceId, startTime, endTime, callback);
    }
};
