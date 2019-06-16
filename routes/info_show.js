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
  req.session.originalurl = "info_show"
  async function readPhost(){
    var dataValue = await fb.readPhost(id);
    console.log("ssdjjddjdj"+Buffer.from(dataValue.introduce, 'base64').toString('utf-8'));
    console.log(Buffer.from(dataValue.fileURL, 'base64').toString('utf-8'))
    await res.render('info_show',{
      fileUrl:Buffer.from(dataValue.fileURL, 'base64').toString('utf-8'),
      date:dataValue.date,
      price:Buffer.from(dataValue.price, 'base64').toString('utf-8'),
      place:Buffer.from(dataValue.place, 'base64').toString('utf-8'),
      starttime:Buffer.from(dataValue.starttime, 'base64').toString('utf-8'),
      endtime:Buffer.from(dataValue.endtime, 'base64').toString('utf-8') ,
      introduce:Buffer.from(dataValue.introduce, 'base64').toString('utf-8')})
    console.log(dataValue);
  }

  readPhost();
});

module.exports = router;
