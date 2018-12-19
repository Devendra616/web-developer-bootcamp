var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/blog_demo");

//Post schema
var postSchema = new mongoose.Schema({
    title:String,
    content:String
});
var Post = mongoose.model("Post",postSchema);

//User Schema
var userSchema = new mongoose.Schema({
    email:String,
    name:String,
    posts:[postSchema]
});
var User = mongoose.model("User",userSchema);
/*
var newUser = new User({
    email:"mkpurbey@nmdc.co.in",
    name:"Manish Purbey"
});
newUser.posts.push({
    title:"A new book",
    content:"Read a new book every week."
})
newUser.save(function(err,user){
    if(err){
        console.log(err);
    }else{
        console.log(user);
    }
}); */

/* var newPost = new Post({
    title:"Reflections on apples",
    content:"Apples are delicious"
}); */

/* newPost.save(function(err,post){
    if(err){
        console.log(err);
    }else{
        console.log(post);
    }
}); */

//get user
User.findOne({name:"Manish Purbey"},(err,user)=>{
    if(err){
        console.log(err);
    }else{
        user.posts.push({
            title:"3 Books I love",
            content:"Book1 , Book2 and Book3 !"
        });
        user.save(function(err,user){
            if(err){
                console.log(err);
            }else{
                console.log(user);
            }
        })
    }
})