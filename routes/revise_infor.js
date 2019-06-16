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


/* GET home page. */
router.get('/', function(req, res) {
	res.render('revise_infor.html');
});

module.exports = router;