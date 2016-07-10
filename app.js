var express = require('express');
var bodyParser = require('body-parser');
var firebase = require("firebase");
var config = require('config');
var events = require('./events.js');

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
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

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

app.get('/', function(req, res) {
    res.send('Hello World!');
});

app.get('/test', function(req, res) {
    events.query('d0c2a576-73c4-42af-a7f1-00ec9569c797','Mon Jul 04 01:24:59 UTC 2016','Sun Jul 10 00:02:53 UTC 2016', _handleApiResponse(res));
    res.send('OK');
});

app.post('/events', jsonParser, function(req, res) {
    events.insert(req.body, _handleApiResponse(res));

    processEvent(req.body);
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
            console.error(err);
            // res.status(err.code).send(err.message);
            return;
        }
        if (successStatus) {
            // res.status(successStatus);
        }
        // res.json(payload);
    };
}
