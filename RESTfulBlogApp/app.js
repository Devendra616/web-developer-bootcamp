var express = require("express"),
    bodyparser = require("body-parser"),
    mongoose = require("mongoose"),
    ejs = require("ejs"),
    app = express();
    

//app configuration
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine","ejs");
app.use(express.static("public"));
//app.use(express.static(__dirname));
app.use(bodyparser.urlencoded({extended:true}));

//define Schema
var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
});

//define Model
var Blog = mongoose.model("Blog",blogSchema);

/* Blog.create({
    title:"Test Blog",
    image:"https://images.unsplash.com/photo-1544796471-ffebcecec32d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    body:"Hi! This is a blog post for testing"
}) */

//restful 

app.get("/",(req,res)=>{
    res.redirect("/blogs");
});
//index route
app.get("/blogs",(req,res)=>{
    Blog.find({},(err,blogs)=>{
        if(err){
            console.log(err);
        }else{
            res.render("index.ejs",{blogs:blogs});
        }
        
    });    
});

//new route
app.get("/blogs/new",(req,res)=>{
    res.render("new");
});

//create blog route
app.post("/blogs",(req,res)=>{
    //create blog
    Blog.create(req.body.blog,(err,newBlog)=>{
        if(err){
            console.log(err);
            res.render("new");
        }else{
            //redirect to index
            res.redirect("/blogs");
        }
    })
});

app.listen(process.env.PORT||3000,process.env.IP||"localhost",function(){
    console.log("server is running...");
});