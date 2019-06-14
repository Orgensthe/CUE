var firebase = require('firebase');

var firebaseConfig = {
    apiKey: "AIzaSyBHRZXwkFb180rpMnJeplhNC3p81vODvnQ",
    authDomain: "cuebd-a4ad1.firebaseapp.com",
    databaseURL: "https://cuebd-a4ad1.firebaseio.com",
    projectId: "cuebd-a4ad1",
    storageBucket: "cuebd-a4ad1.appspot.com",
    messagingSenderId: "470740616150",
    appId: "1:470740616150:web:83752f8719b891fa"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);


function writeUserData(userId, name, email, imageUrl) {
    firebase.database().ref('users/' + userId).set({
      username: name,
      email: email,
      profile_picture : imageUrl
    });
}


function writeUserSearchLog(userId,searchValue) {
    firebase.database().ref('searchLog/' + userId).set({
      username: name,
      email: email,
      profile_picture : imageUrl
    });
}
