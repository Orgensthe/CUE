var express = require('express');
var router = express.Router();
var fb = require("./firebase");


/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(req.query.id);
	console.log(req.query.password);
	var id = Buffer.from(req.query.id).toString('base64');
	var pwd = req.query.password;
	console.log(id);
	console.log(pwd);
	
	async function actionLogin(){
		var flag = await fb.login(id,pwd);
		console.log("complete loginAction");
		if(flag){
			res.send('<script> alert("아이디 비밀번호를 확인해 주세요.");history.go(-1)</script>');
		}else {
			res.render('./index.html');
		}
	}
	actionLogin();
});

module.exports = router;
