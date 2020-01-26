var express			= require("express"),
    passport        = require("passport"),
	User            = require("../models/user"),
	Stream 			= require("../models/stream"),
	Comment			= require("../models/comment"),
	Blog			= require("../models/blog"),
	middleware		= require("../middleware/middleware.js");
	
var router = express.Router();

// 	//REGISTER NEW
// router.get("/register", function(req, res){
// 	res.render("register");	
// });

// //REGISTER CREATE
// router.post("/register", function(req, res){
// 	User.register(new User({username:req.body.username}), req.body.password, function(err, user){
// 		if(err){
// 			console.log(err);
// 			res.render("register");
// 		} else{
// 		passport.authenticate("local")(req, res, function(){
// 			user.channelName = req.body.channelName;
// 			user.save();
// 			res.redirect("/streams");
		
// 			});
// 		}
// 	})
// });

// //LOGIN SHOW
// router.get("/login", function(req, res){
// 	res.render("login");	
// });

// // //LOGIN 
// router.post("/login", passport.authenticate("local", {
// 		successRedirect:"/streams",
// 		failureRedirect:"/login"
// 	}), function(req, res){
// });

router.get("/auth/twitch", passport.authenticate("twitch"));
router.get("/auth/twitch/callback", passport.authenticate("twitch", { failureRedirect: "/" }), function(req, res) {
    req.flash("success","Welcome, "+req.user.username);
    res.redirect("/streams");
});


//LOGOUT
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out!")
	res.redirect("/streams");
});

module.exports = router;
