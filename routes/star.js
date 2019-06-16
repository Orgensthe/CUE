var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('star.html');
});


/* GET home page. */
router.post('/', function(req, res, next) {
  res.render('star.html');
});
module.exports = router;
