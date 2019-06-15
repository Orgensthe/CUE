var express = require('express');
var router = express.Router();
var fb = require("./firebase");

/* GET home page. */
router.get('/', function(req, res, next) {
  async function readPhost(){
    var dataValue = await fb.readPhost();
    console.log("ssdjjddjdj"+Buffer.from(dataValue.introduce, 'base64').toString('utf-8'));
    console.log(Buffer.from(dataValue.fileURL, 'base64').toString('utf-8'))
    await res.render('info_show',{
      fileUrl:Buffer.from(dataValue.fileURL, 'base64').toString('utf-8'),
      date:Buffer.from(dataValue.date, 'base64').toString('utf-8'),
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
