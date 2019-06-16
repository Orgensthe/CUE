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
router.post('/', function(req, res) {
	req.session.destroy(function(err){
		res.redirect('index');
	});
});

module.exports = router;