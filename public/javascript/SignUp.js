const http = require('http');
const firebase = require("firebase");


var firebaseConfig = {
    apiKey: "AIzaSyCSHdmNBd0BDhJ9RRGe6JmT0He1nBCO2T8",
    authDomain: "pushserver-b0722.firebaseapp.com",
    databaseURL: "https://pushserver-b0722.firebaseio.com",
    projectId: "pushserver-b0722",
    storageBucket: "pushserver-b0722.appspot.com",
    messagingSenderId: "919878588338",
    appId: "1:919878588338:web:a2948e81e2caf85a"
};


firebase.initializeApp(firebaseConfig);
const db = firebase.database();
var ref = db.ref("server/saving-data/fireblog");
// Initialize Firebase


