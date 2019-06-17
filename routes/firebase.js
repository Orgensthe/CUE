var firebase = require('firebase');
require('date-utils');

var dt = new Date();




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



function userSignIn(email,userName, password,phone,interest,isteam) {
  // Initialize Firebase
  firebase.database().ref('users/' + email).set({
    name: userName,
    password : password,
    phone:phone,
    interest: interest,
    isteam:isteam
  });
}

function getTop3(){
  return new Promise(function (resolve, reject) {
    function getInfo(){
      var snap;
      // Find the two heaviest dinosaurs.
      var ref = firebase.database().ref("phost");
      var top3 = ref.orderByChild('personNow').limitToLast(3);
      var val = top3.once('value').then(function(data){
        data.forEach(function(childSnapshot){
        console.log("====");
        console.log(childSnapshot.key);
        console.log("====");
        });
        // var top3_array = new Array();

      });
    }
    resolve(
      getInfo()
      ).then(value => value);
  });
}

function writeUserSearchLog(userId,searchValue) {
    // Initialize Firebase
    firebase.database().ref('searchLog/' + userId).set({

    });
  }

  function userInDB(userId) {
  // new Promise() 추가     
  var flag = false;
  return new Promise(function (resolve, reject) {
    firebase.database().ref('users/'+ userId).once('value').then(function(data) {
      if(data.val() == null){
        flag = true;
        resolve(flag);
      } else {
        resolve(flag);
      }
    })
  });
}

function getName(email){

    // new Promise() 추가     
    return new Promise(function (resolve, reject) {
      resolve(firebase.database().ref('users/'+email).once('value').then(function phostData(data) {
        return data.val().name
      })).then(value => value);
    });
  }
  

  function loginActive(id,pwd) {
  // new Promise() 추가     
  var flag = false;
  return new Promise(function (resolve, reject) {
    firebase.database().ref('users/'+ id).once('value').then(function(data) {
      if(data.val() != null && data.val().password == pwd){
        flag = true;
        resolve([flag,data.val().isteam]);
      } else {
        resolve([flag]);
      }
    })
  });
}

function makeReservation(email,show_id) {
  var writeDate = new Date().toTimeString()
  var writeDate64 = Buffer.from(writeDate).toString('base64')
  // Initialize Firebase
  firebase.database().ref('reservation/' + email + writeDate64).set({
    email : email,
    show_id : show_id
  });
}

function writePhost(email,date,starttime,endtime,place,price,fileURL,introduce,limit) {

  var date64 =Buffer.from(date).toString('base64')
  var email64 = Buffer.from(email).toString('base64')
  var starttime64 =Buffer.from(starttime).toString('base64')
  var endtime64 =Buffer.from(endtime).toString('base64')
  var fileURL64 =Buffer.from(fileURL).toString('base64')
  var introduce64 =Buffer.from(introduce).toString('base64')
  var place64 =Buffer.from(place).toString('base64')
  var pricee64 =Buffer.from(price).toString('base64')
  var writeDate = new Date().toTimeString()
  var writeDate64 = Buffer.from(writeDate).toString('base64')
    // Initialize Firebase

    console.log(email64+ writeDate64)
    firebase.database().ref('phost/'+email64+writeDate64).set({
      email:email64,
      date: date,
      starttime : starttime64,
      endtime:endtime64,
      place: place64,
      price:pricee64,
      fileURL:fileURL64,
      introduce:introduce64,
      personNow:0,
      personLimit:limit

    });
  }



  function readPhost(id) {
  // new Promise() 추가     
  return new Promise(function (resolve, reject) {
    resolve(firebase.database().ref('phost/'+id).once('value').then(function phostData(data) {
      return data.val()
    })).then(value => value);
  });
}


function plusNowCount(id,count) {
  // new Promise() 추가
  return new Promise(function (resolve, reject) {
    resolve(firebase.database().ref('phost/'+id).update({
      personNow : count
    }));
  })
}


function readPhostByDate() {
  // new Promise() 추가     
  return new Promise(function (resolve, reject) {
    function readPhost(){
      var snap;
      // Find the two heaviest dinosaurs.
      var ref = firebase.database().ref("phost");   
      return ref; 
    }
    resolve(
      readPhost()
      ).then(value => value);
  });
}




function readReserveByEmail() {
  // new Promise() 추가     
  return new Promise(function (resolve, reject) {
    function readReserv(){
      var snap;
      // Find the two heaviest dinosaurs.
      var ref = firebase.database().ref("reservation");   
      return ref; 
    }
    resolve(
      readReserv()
      ).then(value => value);
  });
}
function readReserv(id) {
  // new Promise() 추가     
  return new Promise(function (resolve, reject) {
      resolve(firebase.database().ref('reservation/'+id).once('value').then(function reserveData(data) {
        return data.val()
        })).then(value => value);
  });
}

module.exports ={
  getTop3:getTop3,
  writeUserSearchLog:writeUserSearchLog,
  userSignIn:userSignIn,
  userInDB:userInDB,
  loginActive:loginActive,
  getName:getName,
  writePhost:writePhost,
  readPhost:readPhost,
  readReserveByEmail:readReserveByEmail,
  readPhostByDate:readPhostByDate,
  makeReservation:makeReservation,
  plusNowCount:plusNowCount,
  readPhostByDate:readPhostByDate
  readReserv:readReserv
};

