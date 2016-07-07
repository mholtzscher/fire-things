var express = require('express');
var bodyParser = require('body-parser');
var firebase = require("firebase");
var config = require('config');

firebase.initializeApp({
    serviceAccount: "fire-things-156788df1e34.json",
    databaseURL: "https://fire-things.firebaseio.com"
});

var db = firebase.database();
var eventsRef = db.ref("events");

var app = express();

// create application/json parser
var jsonParser = bodyParser.json()

app.get('/', function(req, res) {
    res.send('Hello World!');
});

app.post('/events', jsonParser, function(req, res) {
    // Push to General Event list
    eventsRef.push().set(req.body);

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
        }
    } else {
        console.log('No config found for device[' + deviceId + ']. Ignoring Device');
    }
}

function processDeviceEvent() {
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
        default:
            console.log('Invalid device event:v' + event.name + ' and event value: ' + event.value);
    }
}
