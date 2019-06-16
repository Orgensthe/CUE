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

	async function doReserve(){
		var id = Buffer.from(req.session.email).toString('base64');
		var db = await fb.readReserveByEmail();
		await db.orderByChild("email").equalTo(id).on("value",function read(snapshot){
			snapshot.forEach(function(childSnapshot){
				var maximum = childSnapshot.val().personLimit;
				var now = childSnapshot.val().personNow;
				if((parseInt(maximum,10)- parseInt(now),10) > 0){
					makeReservation(id,show_id);
					req.session.reserve = true;
					res.redirect(req.session.originalurl);
				} else {
					req.session.reserve = false;
					res.redirect(req.session.originalurl);
				}
			});
		})
	}

	
	if(req.session.is_logined){
		doReserve();
	} else {
		res.redirect("login");
	}

});

module.exports = router;