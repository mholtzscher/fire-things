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
            processContactSensorEvent(event);
        }
    } else {
        console.log('No config found for device[' + deviceId + ']. Ignoring Device');
    }
}

function processContactSensorEvent(event) {
    switch (event.name) {
        case 'temperature':
            // Update individual Device Status
            var deviceRef = db.ref("devices");
            deviceRef.child(event.deviceId).update({
                'temperature': event.value
            });
            break;
        case ('contact'):
            var deviceRef = db.ref("devices");
            deviceRef.child(event.deviceId).update({
                'contact': event.value
            });
            break;
        case ('battery'):
            var deviceRef = db.ref("devices");
            deviceRef.child(event.deviceId).update({
                'battery': event.value
            });
            break;

        default:

    }
}
