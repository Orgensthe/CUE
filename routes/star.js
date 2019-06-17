var express = require('express');
var request = require('request');
var session = require('express-session')
var FileStore = require('session-file-store')(session)
var fb = require("./firebase");
var router = express.Router();
var firebase = require('firebase');
require('date-utils');







router.use(session({
  secret: 'CUE_PROJECT',
  resave: false,
  saveUninitialized: true
}))

async function readMyReserve(request,response){
  var result = '';
  var id = Buffer.from(request.session.email).toString('base64');
  console.log(request.session.email)
  console.log(id);

  var result = []

  var reserveRef = await fb.readReserveByEmail();
  await reserveRef.orderByChild("email").equalTo(id).on("value", function read(snapshot) {
    var reserId = [];
    // This callback will be triggered exactly two times, unless there are
    // fewer than two dinosaurs stored in the Database. It will also get fired
    // for every new, heavier dinosaur that gets added to the data set.
    snapshot.forEach(function(childSnapshot) {
      
      // key will be "ada" the first time and "alan" the second time
      var key = childSnapshot.key;
      var childData = childSnapshot.val().show_id
      var isRated = childSnapshot.val().isRate

      // childData will be the actual contents of the child
      reserId.push([key,childData,isRated])
      
    
    });     

    var resultList = []
    reserId.forEach(async function(element){
      var reserveRef =   await fb.readPhost(element[1])
      reserveRef.fileURL = Buffer.from(reserveRef.fileURL,'base64').toString('ascii')
      resultList.push([element[0],element[1],reserveRef.fileURL,element[2]])

      if(reserId[reserId.length-1][0] == element[0]){
        response.render('star',{result:resultList});
      }
    })
})




}


/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.is_logined == true){

  

    readMyReserve(req,res)

}
else{

    req.session.originalurl = 'star'
    res.redirect('login');
  }
});


/* GET home page. */
router.post('/', function(req, res, next) {

  if(req.session.is_logined == true){
    
    console.log(req.body);
    console.log(req.body.phostName+"asdklfhlaksdjhfl")
    request.get('http://localhost:3001/?method=train&name='+req.session.id+'&phost='+req.body.phostName+'&point='+req.body.star_input,
    function (error, response, body) {
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log('body:', body); // Print the HTML for the Google homepage.
    } )

    var id = Buffer.from(req.session.email).toString('base64');
  
    firebase.database().ref('reservation/'+req.body.reservationName+"/isRate").set(req.body.star_input)

    readMyReserve(req,res)
  
    
  }else{

    req.session.originalurl = 'star'
    res.redirect('login');
  }

});
module.exports = router;
