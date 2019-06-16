var express = require('express');
var router = express.Router();
var fb = require("./firebase");
var session = require('express-session')
var FileStore = require('session-file-store')(session)



router.use(session({
  secret: 'CUE_PROJECT',
  resave: false,
  saveUninitialized: true,
  
}))


var startchildDiv = ' <div class="col-md-4 col-xs-6">' 
var preFixphostId ='<img src = "'
var lastchildDiv= '</div>'
var fileurl = ''



/* GET home page. */
router.get('/', function(req, res, next) {

  
  async function rend(){
    var resultDiv =''
    
    if(req.session.is_logined){
      var db = await   fb.readPhostByDate();
      var id = Buffer.from(req.session.email).toString('base64');
      console.log(id + "kjasdhlfkjshdlfka");
    await db.orderByChild("email").equalTo(id).on("value", function read(snapshot) {
      // This callback will be triggered exactly two times, unless there are
      // fewer than two dinosaurs stored in the Database. It will also get fired
      // for every new, heavier dinosaur that gets added to the data set.
      snapshot.forEach(function(childSnapshot) {

        // key will be "ada" the first time and "alan" the second time
        var key = childSnapshot.key;
       
        console.log(key);
        // childData will be the actual contents of the child
        var childData = childSnapshot.val().date
        fileurl=Buffer.from(childSnapshot.val().fileURL,'base64').toString('ascii'),
        resultDiv += (startchildDiv+ 
            '<a href="info_show?id='+key+'">'+
              preFixphostId+fileurl+'" id="'+key+'">'+
            '</a>'
          +lastchildDiv)

      
        console.log(resultDiv+"\n")
      }); 
  
    
      res.render('show_manage',{di:resultDiv});
      

     

    })
  }else{
    req.session.originalurl = "show_manage"
    res.redirect('login')
  }


  

  }

  rend(); 












});

module.exports = router;
