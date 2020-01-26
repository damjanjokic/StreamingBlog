var express			= require("express"),
User            = require("../models/user"),
Stream 			= require("../models/stream"),
Comment			= require("../models/comment"),
Blog			= require("../models/blog"),
middleware		= require("../middleware/middleware.js"),
request			= require("request"),
validUrl 		= require('valid-url'),
validator 		= require('validator'),
isUriImage		= require("../public/scripts/ifImage.js");

var router = express.Router();



//NEW
router.get("/streams/:id/blogs/new", middleware.ifStreamOwner, function(req, res){
	Stream.findById(req.params.id, function(err, stream){
		if(err){
			console.log(err);
		}	else{
			res.render("blogs/new", {stream:stream});
		}
	});
});

//CREATE
router.post("/streams/:id/blogs", middleware.ifStreamOwner, function(req, res){
	req.body.blog.content = req.sanitize(req.body.blog.content);
	Stream.findById(req.params.id, function(err,stream){
		if(err){
			console.log(err);
		}	else{
			if(validUrl.isUri(req.body.blog.image) && isUriImage(req.body.blog.image) && !validator.isEmpty(req.body.blog.title) && !validator.isEmpty(req.body.blog.content)){
				Blog.create(req.body.blog, function(err, blog){
					if(err){
						console.log(err);
					}	else{
						req.body.blog.content = req.sanitize(req.body.blog.content);
						blog.author.id = req.user._id;
						blog.author.username = req.user.username;
						blog.save();
						stream.blogs.push(blog);
						stream.save();
						res.redirect("/streams/"+stream._id);
					}
				});
			} else{
				req.flash("error","Please enter valid information");
				res.redirect("back");
			}	
		}
	});
});


//SHOW
router.get("/streams/:id/blogs/:blog_id", middleware.isLoggedIn, function(req, res){
	Stream.findById(req.params.id, function(err, stream){
		if(err){
			console.log(err);
		}	else{
			Blog.findById(req.params.blog_id).populate("comments").exec(function(err, blog){
				if(err){
					console.log(err);
				} else{
					var url = "https://api.twitch.tv/kraken/channels/"+stream.author.username+"?client_id=jmy0m56racvi8xvfnfaf02quqj8g3r";
					request(url, function(error, response, body){
						if(!error & response.statusCode == 200){
							var data = JSON.parse(body);
							res.render("blogs/show", {blog:blog, stream:stream, data:data});
						}
					});

				}
			});
		}
	});
});

//EDIT SHOW
router.get("/streams/:id/blogs/:blog_id/edit", middleware.ifStreamOwner, function(req, res){
	Blog.findById(req.params.blog_id, function(err, blog){
		if(err){
			res.redirect("back");
		}	else{
			res.render("blogs/edit", {blog: blog, stream_id:req.params.id});
		}
	});
});

//UPDATE
router.put("/streams/:id/blogs/:blog_id", middleware.ifStreamOwner, function(req, res){
	if(validUrl.isUri(req.body.blog.image) && isUriImage(req.body.blog.image) && !validator.isEmpty(req.body.blog.title) && !validator.isEmpty(req.body.blog.content)){
		req.body.blog.content = req.sanitize(req.body.blog.content);
		Blog.findByIdAndUpdate(req.params.blog_id, req.body.blog, function(err, blog){
			if(err){
				console.log(err);
			} else{
				res.redirect("/streams/"+req.params.id+"/blogs/"+blog._id);
			}
		});
	} else{
		req.flash("error","Please enter valid information");
		res.redirect("back");
	}

});

//DELETE
router.delete("/streams/:id/blogs/:blog_id/delete", middleware.ifStreamOwner, function(req, res){
	Blog.findByIdAndRemove(req.params.blog_id, function(err, blog){
		if(err){
			console.log(err);
		}	else{
			res.redirect("/streams/"+req.params.id);
		}
	});
});

module.exports = router;