var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');                                                                     
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended : true}));

var fb = require("./firebase");


/* GET home page. */
router.post('/', function(req, res, next) {
	var email =Buffer.from(req.body.email).toString('base64')
    // console.log(Buffer.from(email, 'base64').toString('ascii'));  나중에 이메일 불러올때 디코딩하는 방법

    var name = req.body.name.toString()
    var pw = req.body.password.toString()
    var phone =  req.body.phone.toString()

    if(fb.userInDB(email)){
    	console.log("fail");
    }else {
    	fb.userSignIn(email,name,pw,phone,1)
    }
    res.render('./index.html')
});

module.exports = router;
