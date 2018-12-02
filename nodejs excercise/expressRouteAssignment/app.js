var express = require('express');
var app= express();

app.get("/",function(req,res){
	res.send("Hi there, welcome to my assignment!");
});

app.get("/speak/:animal",(req,res)=>{
	var animalName = req.params.animal;
	var sound;
	switch(animalName){
		case "pig": sound="Oink";break;
		case "cow": sound="Moo";break;
		case "dog": sound="Woof Woof!";break;
		case "cat": sound="Meow";break;
		case "duck": sound="Quack";break;
		default: sound= "Don't know!";break;
	}
	res.send("The "+animalName+" says "+sound);

});

app.get("/repeat/:word/:times",(req,res)=>{
	var word = req.params.word;
	var times= req.params.times;
	times =Number(times);
	var printing="";
	for(let i=1;i<=times;i++){
		printing += word+ " ";		
	}
	res.send(printing);
});

app.get("*",(req,res)=>{
	res.send("Sorry, page not found !!");
});

app.listen(3000,"localhost",function(){
	console.log("Server has started ...");
});
