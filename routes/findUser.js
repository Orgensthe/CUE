var express = require('express');
var router = express.Router();
var fb = require("./firebase");


/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(req.query.id);
	console.log(req.query.password);

	 var id = Buffer.from(req.query.id).toString('base64');
	 var pwd = req.query.password;

	if(fb.logIn(id,pwd)){

	}else {

	}
	res.render('./index.html');

});

module.exports = router;
