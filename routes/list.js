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
	req.session.originalurl = "list";
  	res.render('list.html');
});

module.exports = router;
