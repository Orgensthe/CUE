var express = require('express');
var router = express.Router();
var fb = require("./firebase");


var startchildDiv = ' <div class="col-md-4 col-xs-6">' 
var preFixphostId ='<img src = "'
var postFixphostId ='"'
var hrefstring = 'href = "'
var lastchildDiv= '</div>'
var fileurl = ''

var destinationurl = ''


/* GET home page. */
router.get('/', function(req, res, next) {
  
  
  async function rend(){
    var resultDiv =''
    var db = await   fb.readPhostByDate();
    await db.orderByChild("date").equalTo("2019-06-27").on("value", function read(snapshot) {
      // This callback will be triggered exactly two times, unless there are
      // fewer than two dinosaurs stored in the Database. It will also get fired
      // for every new, heavier dinosaur that gets added to the data set.
      snapshot.forEach(function(childSnapshot) {


        // key will be "ada" the first time and "alan" the second time
        var key = childSnapshot.key;
       

        // childData will be the actual contents of the child
        var childData = childSnapshot.val().date
        fileurl=Buffer.from(childSnapshot.val().fileURL, 'base64').toString('utf-8'),
        resultDiv += (startchildDiv+ 
            '<a href="info_show?id='+key+'">'+
              preFixphostId+fileurl+'" id="'+key+'">'+
            '</a>'
          +lastchildDiv)

      
        console.log(resultDiv+"\n")
      }); 

      res.render('index',{di:resultDiv});

    })


  

  }

  rend(); 


  
});

module.exports = router;
