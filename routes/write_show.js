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
    var filname = ""
    if(req.file !== undefined){
      filname = req.file.originalname
    }

    var id = Buffer.from(req.session.email).toString('base64');

    console.log("images/"+filname);
    console.log(id + "team make show card")
      //  나중에 write post에 넣을 이메일은 세션에서 유저 아이디 읽어서 넣는거로
    fb.writePhost(id,req.body.date,req.body.starttime,
      req.body.endtime,req.body.place,req.body.price, 
      "images/"+filname,req.body.introduce,req.body.limit)
    res.redirect('/mypage');
    
  });


module.exports = router;
