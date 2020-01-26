var mongoose = require("mongoose");
var passportLocalMOngoose = require("passport-local-mongoose");
var findOrCreate = require('mongoose-findorcreate');

var UserSchema = new mongoose.Schema({
	username: String,
	twitchId: String,
	// password: String,
	// channelName: String,
});

// UserSchema.plugin(passportLocalMOngoose);
UserSchema.plugin(findOrCreate);

module.exports = mongoose.model("User", UserSchema);