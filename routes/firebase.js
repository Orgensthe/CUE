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
firebase.initializeApp(firebaseConfig);



function userSignIn(email,userName, password,phone,interest) {

  // Initialize Firebase
  firebase.database().ref('users/' + email).set({
    name: userName,
    password : password,
    phone:phone,
    interest: interest
  });
}



function writeUserSearchLog(userId,searchValue) {
    // Initialize Firebase
    firebase.database().ref('searchLog/' + userId).set({

    });
  }

var flag;

function userInDB(userId){
  firebase.database().ref('users/'+userId).once('value').then(function(data) {
    if(data.val() == null){
      flag = false;
    } else {
      flag = true;
    }
  })
  return flag
}

function loginActive(userId,pwd){
  firebase.initializeApp(firebaseConfig);
  firebase.database().ref('users/'+userId).once('value').then(function(data) {
    if(data.val() == null){
      if(data.val().password == pwd){
        flag = true;
      } else {
        flag = false;
      }
    } else {
      flag = false;
    }
  })
  return flag;   
}

function userCheck(email) {
  // new Promise() 추가     
  return new Promise(function (resolve, reject) {
      resolve(userInDB(email)).then(value => value);
  });
}

function login(id,pwd) {
  // new Promise() 추가     
  return new Promise(function (resolve, reject) {
      resolve(loginActive(id,pwd)).then(value => value);
  });
}
 module.exports ={
  writeUserSearchLog:writeUserSearchLog,
  userSignIn:userSignIn,
  userInDB:userInDB,
  logIn:logIn,
  userCheck:userCheck
};

