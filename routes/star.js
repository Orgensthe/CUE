var express = require('express');
var request = require('request');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('star.html');
});


/* GET home page. */
router.post('/', function(req, res, next) {
  console.log(req.body.star_input);
  request.get('http://localhost:3001/?method=train&name='+req.session.id+'&phost='+'assa'+'&point='+req.body.star_input,
  function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
  } )
  res.render('star.html');
});
module.exports = router;
