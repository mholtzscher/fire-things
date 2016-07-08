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
  delete data.id;

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

module.exports = {

  insert: function(data, callback) {
    var key = datastore.key('Event');

    saveEvent(key, data, callback);
  }
};
