var express = require('express');
var router = express.Router();
var session = require('express-session')
var FileStore = require('session-file-store')(session)



router.use(session({
  secret: 'CUE_PROJECT',
  resave: false,
  saveUninitialized: true,
  
}))


/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.is_logined){
    res.render('mypage.html');
  }else{
    req.session.originalurl = "mypage"
    res.redirect('login')
  }
});

module.exports = router;
