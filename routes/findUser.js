var express = require('express');
var router = express.Router();
var fb = require("./firebase");
var session = require('express-session')
var FileStore = require('session-file-store')(session)


router.use(session({
  secret: 'CUE_PROJECT',
  resave: false,
  saveUninitialized: true,
  store:new FileStore()
}))


/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(req.query.id);
	console.log(req.query.password);
	var email = req.query.id;
	var id = Buffer.from(email).toString('base64');
	var pwd = req.query.password;
	
	async function actionLogin(req,res,id){
		var flag = await fb.loginActive(id,pwd);
		if(flag){
			req.session.is_logined = true;
			req.session.email = email;
			console.log(req.session);
			res.render('index.html');
		}else {
			res.send('<script> alert("아이디 비밀번호를 확인해 주세요.");history.go(-1)</script>');
		}
	}
	actionLogin(req,res,id);
});

module.exports = router;
