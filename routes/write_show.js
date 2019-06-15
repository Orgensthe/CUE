var express = require('express');
var multer = require('multer'); // express에 multer모듈 적용 (for 파일업로드)
var router = express.Router();
var bodyParser = require('body-parser');     
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended : true}));


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage })



var fb = require("./firebase");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('write_show.html');
});

router.post('/', upload.single('avatar'),  function(req, res, next) {
    console.log(req.file.originalname)
    fb.writePhost(req.body.date,req.body.starttime,req.body.endtime,req.body.place,req.body.price, "images/"+req.file.originalname,req.body.introduce)
    res.redirect('/mypage');
  });


module.exports = router;
