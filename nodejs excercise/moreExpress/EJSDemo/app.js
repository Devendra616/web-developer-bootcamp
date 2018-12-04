var express = require("express");
var app = express();

//var app = require("express")();

app.use(express.static("public"));
app.set("view engine","ejs"); //no need of providing .ejs extenstion in render

app.get("/",(req,res)=>{
    res.render("home");
    //res.send("<h1>Welcome to the home page!</h1>");
});

app.get("/fallinlovewith/:thing",(req,res)=>{
    var thing = req.params.thing;
    res.render("love",{thingVar:thing});
});

app.get("/posts",(req,res)=>{
    var posts = [{title:"Title1",author:"Author1"},
        {title:"Title2",author:"Author3"},    
        {title:"Title3",author:"Author3"},
        {title:"Title4",author:"Author4"}        
    ];
    //res.render("posts.ejs",{posts:posts});
    res.render("posts",{posts:posts});
});

app.listen(3000,"localhost",()=>{
    console.log("Server is running ........");
});