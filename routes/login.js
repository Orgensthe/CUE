var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');   
var fb = require("./firebase");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended : true}));
var session = require('express-session')
var FileStore = require('session-file-store')(session)
var back = require('express-back');

router.use(back());

router.use(session({
	secret: 'CUE_PROJECT',
	resave: false,
	saveUninitialized: true,
}))

/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.session.is_logined){
		res.redirect('index');
	} else {
		res.render('login.html');
	}
});


router.post('/', function(req, res, next) {
	console.log(req.body.id);
	console.log(req.body.password);
	var email = req.body.id;
	var id = Buffer.from(email).toString('base64');
	var pwd = req.body.password;

	async function actionLogin(request,response,id){
		var flag = await fb.loginActive(id,pwd);
		if(flag){
			request.session.is_logined = true;
			request.session.email = email;
			console.log(request.session.originalurl);
			console.log(request.session.originalurl);
			console.log(request.session.originalurl);
			if(request.session.originalurl === undefined){
				response.redirect('index');
			}else {
				response.redirect(request.session.originalurl);	
			}
			

		}else {
			response.send('<script> alert("아이디 비밀번호를 확인해 주세요.");history.go(-1)</script>');
		}  
	}
	actionLogin(req,res,id);
});




module.exports = router;
