var express = require('express');
var router = express.Router();
var session = require('express-session')
var FileStore = require('session-file-store')(session)
var fb = require("./firebase");



router.use(session({
  secret: 'CUE_PROJECT',
  resave: false,
  saveUninitialized: true,
  
}))


/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.is_logined){
   
    async function getname(isteam){

      var id = Buffer.from(req.session.email).toString('base64');
      var username = await fb.getName(id) + "skjdhflakjsdhfl";
      if(isteam == 1){
        await res.render('mypage_creator',{name:username});

      }else{
       
        await res.render('mypage',{name:username});
      }
 
    }

    getname(req.session.isteam)
 
  }else{
    req.session.originalurl = "mypage"
    res.redirect('login')
  }
});

module.exports = router;
