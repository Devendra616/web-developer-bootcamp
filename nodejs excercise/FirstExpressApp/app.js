var express = require('express');
var app = express();


app.get("/",function(req,res){
	res.send("Hi there!");
});

app.get("/bye",function(req,res){
	console.log("Someone is exiting....");
	res.send("Goodbye!!");
});

app.get("/dog",function(req,res){
	console.log("Made a request to /dog");
	res.send("MEOW!!");
});

app.get("/r/:subpage/comment/:id",function(req,res){
	console.log("Subpage comment called");
	var subpage = req.params.subpage;
	var id = req.params.id;
	res.send("Welcome to subpage! - "+subpage+" with id - "+id);
});

//triggered when anyother route is given apart from above ones
app.get("*",function(req,res){
	res.send("You have come here by mistake!!");
});

app.listen(3000,'localhost',function(){
	console.log("Server has started!!!");
});