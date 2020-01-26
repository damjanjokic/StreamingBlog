var express			= require("express"),
User            = require("../models/user"),
Stream 			= require("../models/stream"),
Comment			= require("../models/comment"),
Blog			= require("../models/blog"),
middleware		= require("../middleware/middleware.js"),
validUrl 		= require('valid-url'),
validator 		= require('validator');

var router = express.Router();

router.get("/streams/:id/blogs/:blog_id/comments", function(req, res){
	Stream.findById(req.params.id, function(err, stream){
		if(err){
			console.log(err);
		} else{
			Blog.findById(req.params.blog_id, function(err, blog){
				if(err){
					console.log(err);
				}	 else{
					res.render("comments/new",{stream:stream, blog:blog});
				}
			});
		}
	});
});

//CREATE
router.post("/streams/:id/blogs/:blog_id/comments", middleware.isLoggedIn, function(req, res){
	if(!validator.isEmpty(req.body.comment.text)){
		Stream.findById(req.params.id, function(err, stream){
			if(err){
				console.log(err);
			}	else{
				Blog.findById(req.params.blog_id, function(err, blog){
					if(err){
						console.log(err);
					}	else{
						Comment.create(req.body.comment, function(err, comment){
							if(err){
								console.log(err);
							} else{
								comment.author.id = req.user._id;
								comment.author.username = req.user.username;
								comment.save();
								blog.comments.push(comment);
								blog.save();
								res.redirect("/streams/"+stream._id+"/blogs/"+blog._id);
							}
						});
					}
				});
			}
		});
	} else{
		req.flash("error","You can't submit empty comment");
		res.redirect("back");
	}
});

//DELETE
router.delete("/streams/:id/blogs/:blog_id/comments/:comment_id/delete", middleware.ifCommentOwner, function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err, comment){
		if(err){
			console.log(err);
		} else{
			res.redirect("/streams/"+req.params.id+"/blogs/"+req.params.blog_id);
		}
	});
});

module.exports = router;