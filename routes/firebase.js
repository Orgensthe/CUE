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

var flag2;
function loginActive(id,pwd){
  firebase.database().ref('users/'+ id).once('value').then(function(data) {
    if(data.val() != null){
      console.log(1);
      if(data.val().password == pwd){
        flag2 = true;
        console.log(2);
      } else {
        console.log(3);
        flag2 = false;
      }
    } else {
      console.log(4);
      flag2 = false;
    }
  })
  console.log(flag2);
  return flag2
}

function userCheck(email) {
  // new Promise() 추가     
  return new Promise(function (resolve, reject) {
      resolve(userInDB(email)).then(value => value);
  });
}



function writePhost(date,starttime,endtime,place,price,fileURL,introduce) {

    var date64 =Buffer.from(date).toString('base64')
    var starttime64 =Buffer.from(starttime).toString('base64')
    var endtime64 =Buffer.from(endtime).toString('base64')
    var fileURL64 =Buffer.from(fileURL).toString('base64')
    var introduce64 =Buffer.from(introduce).toString('base64')
    var place64 =Buffer.from(place).toString('base64')
    var pricee64 =Buffer.from(price).toString('base64')


    // Initialize Firebase
    firebase.database().ref('phost/' + "email").set({
      date: date64,
      starttime : starttime64,
      endtime:endtime64,
      place: place64,
      price:pricee64,
      fileURL:fileURL64,
      introduce:introduce64
    });
 
}

function logIn(userId,pwd){
  var flag = true;
  firebase.initializeApp(firebaseConfig);
  firebase.database().ref('users/'+userId).once('value').then(function(data) {
    if(data.val() == null){
      if(data.val().password == pwd){
        flag = true;
      }
    } else {
      flag = false;
    }
  })
  return flag;   
}





function readPhost() {
  // new Promise() 추가     
  return new Promise(function (resolve, reject) {
      resolve(firebase.database().ref('phost/'+"email").once('value').then(function phostData(data) {
        return data.val()
        })).then(value => value);
  });
}


 module.exports ={
  writeUserSearchLog:writeUserSearchLog,
  userSignIn:userSignIn,
  userInDB:userInDB,
  loginActive:loginActive,
  login:login,
  userCheck:userCheck,
  writePhost:writePhost,
  readPhost:readPhost
};

