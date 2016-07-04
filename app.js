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
    eventsRef.push().set(req.body);
    res.send('OK');
});

app.listen(process.env.PORT || 3000, function() {
    console.log('Example app listening on port 3000!');
});
