var express = require('express');
var router = express.Router();
var fb = require("./firebase");


/* GET home page. */
router.get('/', function(req, res, next) {


	console.log(req.query.id);
	console.log(req.query.password);



	fb.userSignIn("sibaasdqwerqwerqwerqwerqweSfasdfl","sibal","sibal","sibal","sibal")
	res.render('./index.html');

});

module.exports = router;
