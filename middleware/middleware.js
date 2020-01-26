var Stream      = require("../models/stream");
var Comment         = require("../models/comment");

var mid = {
    
}

mid.ifStreamOwner = function(req, res, next){
  if(req.isAuthenticated()){
      Stream.findById(req.params.id, function(err, stream){
          if(err){
            req.flash("error","Can't find that Stream")
              console.log(err);
          } else{
              if(stream.author.id.equals(req.user._id)){
                  next();
              } else{
                  req.flash("error","You don't have permission to do that");
                  res.redirect("back");
              }
          }
      });
  } else{
      req.flash("error", "You need to be logged in")
      res.redirect("back");
  }  
};

mid.ifCommentOwner = function(req, res, next){
  if(req.isAuthenticated()){
      Comment.findById(req.params.comment_id, function(err, comment){
          if(err){
              console.log(err);
          } else{
              if(comment.author.id.equals(req.user._id)){
                  next();
              } else{
                  req.flash("error","You don't have permission to do that");
                  res.redirect("/streams");
              }
          }
      });
  } else{
      req.flash("error", "You need to be logged in")
      res.redirect("/streams");
  }  
};

mid.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in");
    res.redirect("back");
}


mid.blogged = function(req, res, next){
  if(req.isAuthenticated()){
    Stream.findOne({"author.id":req.user._id}, function(err, stream){
      if(err){
        console.log(err);
      } else{
        if(!stream){
          next();
        } else{
          req.flash("error","You already have a blog");
          res.redirect("/streams");
        }
      }
    });
  } else{
    req.flash("error", "You need to be logged in");
    res.redirect("/streams");
  }
}


module.exports = mid;
