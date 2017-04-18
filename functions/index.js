var functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

var api_key_http_header = 'API_KEY';
var api_key = functions.config().fire_things.api_key;

exports.addEvent = functions.https.onRequest((request, response) => {
    if (!request.get(api_key_http_header) || request.get(api_key_http_header) !== api_key) {
        response.sendStatus(403);
        return;
    }

    // process event here
    var deviceId = request.body.deviceId;
    var displayName = request.body.displayName;
    var updateTime = request.body.isoDate;
    var value = request.body.value;
    var name = request.body.name

    // push device info
    admin.database().ref('devices/' + deviceId).update({
        device: displayName,
        updateTime: updateTime
    });

    // add event update
    var data = {};
    data[deviceId] = value;
    admin.database().ref(name).set(data);
});