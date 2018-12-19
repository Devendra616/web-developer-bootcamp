var mongoose = require("mongoose");

//Post schema
var postSchema = new mongoose.Schema({
    title:String,
    content:String
});

module.exports= mongoose.model("Post",postSchema);
