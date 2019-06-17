var express = require('express');
var router = express.Router();
var fb = require("./firebase");
var firebase = require('firebase');
var session = require('express-session')
var FileStore = require('session-file-store')(session)



router.use(session({
  secret: 'CUE_PROJECT',
  resave: false,
  saveUninitialized: true,
  
}))


var startchildDiv = ' <div class="col-md-4 col-xs-6">' 
var startchildDiv2 = ' <div id="side' 
var preFixphostId ='<img src = "'
var postFixphostId ='"'
var hrefstring = 'href = "'
var lastchildDiv= '</div>'
var fileurl = ''
var destinationurl = ''


/* GET home page. */
router.get('/', function(req, res, next) {

  if(req.session.is_logined == true){
    request.get('http://localhost:3001/?method=train&name='+req.session.id+'&phost='+req.body.phostName+'&point='+req.body.star_input,
    function (error, response, body) {
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log('body:', body); // Print the HTML for the Google homepage.
    } )

  }

  async function rend(){
    var resultDiv =''
    var result_top3 =''
    var db = await fb.readPhostByDate();
    await db.orderByChild("date").equalTo("2019-06-27").on("value", function read(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var key = childSnapshot.key;
        var childData = childSnapshot.val().date
        fileurl=Buffer.from(childSnapshot.val().fileURL,'base64').toString('ascii'),
        resultDiv += (startchildDiv+ 
          '<a href="info_show?id='+key+'">'+
          preFixphostId+fileurl+'" id="'+key+'">'+
          '</a>'
          +lastchildDiv)
      });       
    })
    var i = 1;
    var ref = firebase.database().ref("phost");
    var top3 = ref.orderByChild('personNow').limitToLast(3);
    var val = top3.once('value').then(function(data){
    data.forEach(function(childSnapshot){
        result_top3 += (startchildDiv2+i+'">'+'<a href="info_show?id='+childSnapshot.key+'">'+
          preFixphostId+fileurl+'" id="'+childSnapshot.key +'">'+
          '</a>'
          +lastchildDiv)
        i++;
        });
    res.render('index',{
      di:resultDiv,
      top3:result_top3
    });
    });
  }
  rend();
});

module.exports = router;

