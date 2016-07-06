var express = require('express');
var bodyParser = require('body-parser');
var firebase = require("firebase");

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

    // grab raw data and clean it up
    var rawData = req.body;
    var deviceId = rawData.deviceId;
    var data = cleanData(rawData);
    
    // Update individual Device Status
    var deviceRef = db.ref("devices");
    deviceRef.child(deviceId).set(data);
    res.send('OK');
});

app.listen(process.env.PORT || 3000, function() {
    console.log('Example app listening on port 3000!');
});

function cleanData(mData) {
    delete mData['isVirtualHub'];
    delete mData['data'];
    delete mData['archivable'];
    delete mData['translatable'];
    delete mData['viewed'];
    delete mData['isStateChange'];
    delete mData['rawDescription'];
    delete mData['displayed'];
    delete mData['eventSource'];
    delete mData['hubId'];
    delete mData['groupId'];
    delete mData['deviceTypeId'];
    delete mData['locationId'];
    delete mData['name'];
    delete mData['deviceId'];
    delete mData['date'];
    return mData;
}
