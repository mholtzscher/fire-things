var express = require('express');
var bodyParser = require('body-parser');
var firebase = require("firebase");
var config = require('config');
var events = require('./events.js');
var rollbar = require("rollbar");
var Keen = require('keen-js');
var responseTime = require("response-time");

rollbar.init("e7c60f92667b4b6f8d2c4e918503f13c");

var keenClient = new Keen({
    projectId: "5784155733e4061ee9f46b16",
    writeKey: "e10301fd9979c8d736d57e426e63101efd7d57a9caee5877f8a3cadb13fac5291d9bb643439dfa6e77cca3dff187211d88da686a8eb5febebf78b851cf6bf70033d9d717215dc04e17807abd328be149c54d10753fa6bec59bb0839292429150"
});

firebase.initializeApp({
    serviceAccount: "fire-things-156788df1e34.json",
    databaseURL: "https://fire-things.firebaseio.com"
});

var db = firebase.database();
var eventsRef = db.ref("events");

var app = express();

// create application/json parser
var jsonParser = bodyParser.json()

// Add headers
app.use(function(req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://fire-things.firebaseapp.com');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(responseTime(function (req, res, time) {
  var stat = (req.url).toLowerCase()
    .replace(/[:\.]/g, '')
    .replace(/\//g, '_');
    var apiEvent = {
      url: stat,
      time: time,
      keen: {
        timestamp: new Date().toISOString()
      }
    };
    keenClient.addEvent("api_transaction", apiEvent);
}))

// Use the rollbar error handler to send exceptions to your rollbar account
app.use(rollbar.errorHandler('e7c60f92667b4b6f8d2c4e918503f13c'));

app.get('/', function(req, res) {
    res.send('Hello World!');
});

app.post('/contactHistory', jsonParser, function(req, res) {
    events.queryContactHistory(req.body.deviceId, req.body.startTime, _handleApiResponse(res));
});

app.post('/deviceTempHistory', jsonParser, function(req, res) {
    events.queryDeviceTempHistory(req.body.deviceId, req.body.startTime, _handleApiResponse(res));
});

app.get('/getFreezerTempHistory', function(req, res) {
    var today = new Date();
    var startTime = new Date(today.getTime() - 604800000);
    events.queryDeviceTempHistory("1c491669-bd36-4709-9d03-c91f697bde83", startTime, _handleApiResponse(res));
});

app.get('/getFrontDoorTempHistory', function(req, res) {
    var today = new Date();
    var startTime = new Date(today.getTime() - 604800000);
    events.queryDeviceTempHistory("d0c2a576-73c4-42af-a7f1-00ec9569c797", startTime, _handleApiResponse(res));
});

app.get('/getKitchenDoorTempHistory', function(req, res) {
    var today = new Date();
    var startTime = new Date(today.getTime() - 604800000);
    events.queryDeviceTempHistory("24d0d732-a275-479c-b622-b36640154f4d", startTime, _handleApiResponse(res));
});

app.get('/getGarageEntryDoorTempHistory', function(req, res) {
    var today = new Date();
    var startTime = new Date(today.getTime() - 604800000);
    events.queryDeviceTempHistory("711d7aeb-00fa-49b4-842a-0c428ae8f07b", startTime, _handleApiResponse(res));
});

app.get('/getBasementDryTempHistory', function(req, res) {
    var today = new Date();
    var startTime = new Date(today.getTime() - 604800000);
    events.queryDeviceTempHistory("e078dedc-9fd8-4a68-9748-f368da3083db", startTime, _handleApiResponse(res));
});

app.get('/getFrontDoorContactHistory', function(req, res) {
    var today = new Date();
    var startTime = new Date(today.getTime() - 604800000);
    events.queryContactHistory("d0c2a576-73c4-42af-a7f1-00ec9569c797", startTime, _handleApiResponse(res));
});

app.post('/events', jsonParser, function(req, res) {
    events.insert(req.body);

    // processEvent(req.body);
    res.send('OK');
});

app.listen(process.env.PORT || 3000, function() {
    console.log('Fire-Things processing service is awake!');
});

function processEvent(event) {
    var deviceId = event.deviceId;

    if (config.has('Devices.' + deviceId)) {
        var deviceConfig = config.get('Devices.' + deviceId);

        if (deviceConfig.has('contact')) {
            processDeviceEvent(event);
        } else if (deviceConfig.has('temp')) {
            processDeviceEvent(event);
        } else if (deviceConfig.has('water')) {
            processDeviceEvent(event);
        }
    } else {
        console.log('No config found for device[' + deviceId + ']. Ignoring Device');
    }
}

function processDeviceEvent(event) {
    var deviceRef = db.ref("devices");

    // Reprocess device name in case it got changed
    deviceRef.child(event.deviceId).update({
        'device': event.device
    });

    // update the update time so that dashboard knows when last piece of data was received
    deviceRef.child(event.deviceId).update({
        'updateTime': event.isoDate
    });

    switch (event.name) {
        case 'temperature':
            deviceRef.child(event.deviceId).update({
                'temperature': event.value
            });
            break;
        case ('contact'):
            deviceRef.child(event.deviceId).update({
                'contact': event.value
            });
            break;
        case ('battery'):
            deviceRef.child(event.deviceId).update({
                'battery': event.value
            });
            break;
        case ('humidity'):
            deviceRef.child(event.deviceId).update({
                'humidity': event.value
            });
            break;
        case ('water'):
            deviceRef.child(event.deviceId).update({
                'water': event.value
            });
            break;
        default:
            console.log('Invalid device event:v' + event.name + ' and event value: ' + event.value);
    }
}

function updateDeviceStatusInFirebase(deviceId, key, value) {
    var deviceRef = db.ref("devices");

    deviceRef.child(deviceId).update({
        key: value
    }, function(error) {
        if (error) {
            console.log("Data could not be saved." + error);
        }
    });

}

function _handleApiResponse(res, successStatus) {
    return function(err, payload) {
        if (err) {
            rollbar.handleError(err);
            return;
        }
        res.json(payload);
    };
}
