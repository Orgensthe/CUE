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
router.get('/', function(req, res) {
	var show_id = req.session.show_id;
	req.session.originalurl = "/info_show?id="+show_id
	req.session.reserve = false;
	console.log(req.session.reserve);
	console.log(req.session.originalurl);


	async function doReserve(){
		console.log(req.session.email);
		var id = Buffer.from(req.session.email).toString('base64');
		console.log("1");
		var db = await fb.readPhost(req.session.show_id);
		if(parseInt(db.personLimit)-parseInt(db.personNow) <=0){
			
		}else{
			fb.makeReservation(id,req.session.show_id)
		}
	}

	if(req.session.is_logined){
		doReserve();
	} else {
		res.redirect("login");
	}

});

module.exports = router;