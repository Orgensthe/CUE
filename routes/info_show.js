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
router.get('/', function(req, res, next) {
  var id = req.query.id
  var alt;
  req.session.originalurl = "info_show"
  req.session.show_id = id
  if(req.session.reserve == 1){
    alt ='alert("예약 되었습니다.")'
  } else if(req.session.reserve = 2){
    alt ='alert("정원 초과 되었습니다.")'
  } else if(req.session.reserve = 3){
    alt ='alert("로그인 후 진행해 주세요.")'
  }
  async function readPhost(){
    var dataValue = await fb.readPhost(id);
    await res.render('info_show',{
      fileUrl:Buffer.from(dataValue.fileURL, 'base64').toString('utf-8'),
      date:dataValue.date,
      price:Buffer.from(dataValue.price, 'base64').toString('utf-8'),
      place:Buffer.from(dataValue.place, 'base64').toString('utf-8'),
      starttime:Buffer.from(dataValue.starttime, 'base64').toString('utf-8'),
      endtime:Buffer.from(dataValue.endtime, 'base64').toString('utf-8') ,
      introduce:Buffer.from(dataValue.introduce, 'base64').toString('utf-8')})
  }
  readPhost();
});

module.exports = router;
