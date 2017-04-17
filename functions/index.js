var functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

var api_key_http_header = 'API_KEY';
var api_key = functions.config().fire_things.api_key;

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});

exports.addEvent = functions.https.onRequest((request, response) => {
     if (!request.get(api_key_http_header) || request.get(api_key_http_header) !== api_key) {
        response.sendStatus(403);
        return;
    }

    // process event here

    response.send('OK');
});