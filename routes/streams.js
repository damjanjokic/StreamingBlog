var express		= require("express"),
User            = require("../models/user"),
Stream 			= require("../models/stream"),
Comment			= require("../models/comment"),
Blog			= require("../models/blog"),
middleware		= require("../middleware/middleware.js"),
isUriImage		= require("../public/scripts/ifImage.js"),
request			= require("request"),
validUrl 		= require('valid-url'),
validator 		= require('validator');

var router = express.Router();

//LANDING
router.get("/", function(req, res){
	res.render("landing");
});

//INDEX
router.get("/streams", function(req,res){
	var found = null;
	if(req.query.searchStreams){
		const regex = new RegExp(escapeRegex(req.query.searchStreams), 'gi');
		Stream.find({name: regex}, function(err,streams){
			if(err){
				console.log(err);
			}	else{
				if(streams.length < 1){
					found="No streams under that name, please try again"
				}
				res.render("streams/index",{streams:streams, found:found});
			}
		});
	} else{
		Stream.find({}, function(err,streams){
			if(err){
				console.log(err);
			}	else{
				res.render("streams/index",{streams:streams, found:found});
			}
		});
	}
});

//NEW
router.get("/streams/new",middleware.blogged, function(req, res){
	res.render("streams/new");	
});

//CREATE
router.post("/streams",middleware.blogged, function(req, res){
	if(validUrl.isUri(req.body.image) && isUriImage(req.body.image) && !validator.isEmpty(req.body.name) && !validator.isEmpty(req.body.description)){
		var name = req.body.name;
		var image = req.body.image;
		var description = req.sanitize(req.body.description);
		var author ={
			id: req.user._id,
			username: req.user.username,
		}
		var newStream = {name:name, image:image, description:description, author:author}
		Stream.create( newStream, function(err,stream){
			if(err){
				console.log(err);
			}	else{
				res.redirect("/streams");
			}
		});	
	} else{
		req.flash("error","Please enter valid information");
		res.redirect("back");
	}

});

//SHOW
router.get("/streams/:id", function(req, res){
	Stream.findById(req.params.id).populate("blogs").exec(function(err, stream){
		if(err){
			console.log(err);
		}	else{
			var url = "https://api.twitch.tv/kraken/channels/"+stream.author.username+"?client_id=jmy0m56racvi8xvfnfaf02quqj8g3r";
			request(url, function(error, response, body){
				if(!error & response.statusCode == 200){
					var data = JSON.parse(body);
					res.render("streams/show", {data:data, stream:stream});
				}
			});
		}
	});
});

//EDIT
router.get("/streams/:id/edit", middleware.ifStreamOwner, function(req, res){
	Stream.findById(req.params.id, function(err, stream){
		if(err){
			console.log(err);
		} else{
			res.render("streams/edit",{stream:stream});
		}
	});
});

//UPDATE
router.put("/streams/:id", middleware.ifStreamOwner, function(req, res){
	if(validUrl.isUri(req.body.stream.image) && isUriImage(req.body.stream.image) && !validator.isEmpty(req.body.stream.name) && !validator.isEmpty(req.body.stream.description)){
		req.body.stream.description = req.sanitize(req.body.stream.description);
		Stream.findByIdAndUpdate(req.params.id, req.body.stream, function(err, stream){
			if(err){
				console.log(err);
			}	else{
				res.redirect("/streams/"+req.params.id);
			}
		});
	} else{
			req.flash("error","Please enter valid information");
			res.redirect("back");
	}
});

//DELETE
router.delete("/streams/:id", middleware.ifStreamOwner, function(req, res){
	Stream.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
		} else{
			res.redirect("/streams");
		}
	});
});

function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;