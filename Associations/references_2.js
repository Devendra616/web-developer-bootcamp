var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/blog_demo");

var Post = require("./models/post");
var User = require("./models/user");


/* Post.create({
    title:"How to prepare burger pt 3",
    content:"testing 3nd time for post saving"
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
}) ; */

//find user and find its all posts
User.findOne({email:"bob@gmail.com"}).populate("posts").exec((err,foundUser)=>{
    if(err){
        console.log(err);
    }else{
        console.log(foundUser);
    }
});