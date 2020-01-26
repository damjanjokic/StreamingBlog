var express			= require("express"),
	bodyParser		= require("body-parser"),
	mongoose		= require("mongoose"),
	passport		= require("passport"),
	LocalStrategy	= require("passport-local"),
	methodOverride	= require("method-override"),
  flash           = require("connect-flash"),
  expressSanitizer = require("express-sanitizer"),
	User            = require("./models/user"),
	Stream 			= require("./models/stream"),
	Comment			= require("./models/comment"),
	Blog			= require("./models/blog"),
	middleware		= require("./middleware/middleware.js"),
	streamRoutes	= require("./routes/streams.js"),
	blogRoutes		= require("./routes/blogs.js"),
	commentRoutes	= require("./routes/comments.js"),
	indexRoutes		= require("./routes/index.js"),
	passport         = require("passport"),
	twitchStrategy   = require("passport-twitch").Strategy,
  validUrl         = require('valid-url'),
  validator       = require('validator');

  var findOrCreate = require('mongoose-findorcreate');

var app = express();


mongoose.connect("mongodb://localhost/streaming_blog");

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.use(flash());

//==========PASSPORT CONFIG==========

app.use(require("express-session")({
    secret:"Help me protect this app",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

passport.use(new twitchStrategy({
   	clientID: "jmy0m56racvi8xvfnfaf02quqj8g3r",
    clientSecret: "129a6z95x0927gne9o9bclebmauxn3",
    callbackURL: "http://localhost:3000/auth/twitch/callback",
    scope: "user_read"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ twitchId: profile.id, username: profile.username }, function (err, user) {
      return done(err, user);
    });
  }
));
 
passport.serializeUser(function(user, done) {
    done(null, user);
});
 
passport.deserializeUser(function(user, done) {
    done(null, user);
});
 
 


app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error       = req.flash("error"); 
   res.locals.success     = req.flash("success");
   next();
});

app.use (indexRoutes);
app.use (streamRoutes);
app.use (blogRoutes);
app.use (commentRoutes);


app.listen(3000, function(){
   console.log("The Server has started"); 
});

