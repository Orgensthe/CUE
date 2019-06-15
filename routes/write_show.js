var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');                                                                     
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended : true}));


var fb = require("./firebase");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('write_show.html');
});

router.post('/', function(req, res, next) {
    console.log( req.body);
    fb.writePhost(req.body.date,req.body.starttime,req.body.endtime,req.body.place,req.body.price,req.body.file,req.body.introduce)
    res.redirect('/mypage');
  });


module.exports = router;
