var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine","ejs");

var friends = ["rahul","amit","anupam","Yashvir","vipin","Saurabh","alok","Nikhil"];

app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/friends",function(req,res){
    
    res.render("friends",{friends:friends});
});

app.post("/addFriend",function(req,res){
    var newFriend = req.body.friendName; //friendName is name prop of textbox
    friends.push(newFriend);    
    res.redirect("/friends");
});

app.listen(3000,"localhost",()=>{
    console.log("server started ....");
});