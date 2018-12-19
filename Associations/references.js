var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/blog_demo");

//Post schema
var postSchema = new mongoose.Schema({
    title:String,
    content:String
});
var Post = mongoose.model("Post",postSchema);

//User Schema
/* var userSchema = new mongoose.Schema({
    email:String,
    name:String,
    posts:[postSchema]
}); */

var userSchema = new mongoose.Schema({
    email:String,
    name:String,
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }]
});
var User = mongoose.model("User",userSchema);

/* User.create({
    email:"bob@gmail.com",
    name:"Bob Belcher"
},function(err,user){
    if(err){
        console.log(err);
    }else{
        console.log(user);
    }
}); */

/* Post.create({
    title:"How to prepare burger pt 2",
    content:"testing 2nd time for post saving"
},(err,post)=>{
   // console.log(post);
    User.findOne({email:"bob@gmail.com"},(err,foundUser)=>{
        if(err){
            console.log(err);
        }else{
            foundUser.posts.push(post);
            foundUser.save((err,data)=>{
                if(err){
                    console.log(err);
                }else{
                    console.log(data);
                }
            })
        }
    })
}) */

//find user and find its all posts
User.findOne({email:"bob@gmail.com"}).populate("posts").exec((err,foundUser)=>{
    if(err){
        console.log(err);
    }else{
        console.log(foundUser);
    }
});