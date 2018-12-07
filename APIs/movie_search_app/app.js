var express = require('express');
var ejs = require('ejs');
var request = require('request');

var app = express();
app.set("view engine","ejs");

app.get("/",(req,res)=>{
    res.render("search.ejs");
});

app.get("/results",(req,res)=>{
    var query = req.query.searchMovie;
    var searchUrl="http://www.omdbapi.com/?s=gold&apikey=thewdb";
    if(query != undefined && query != ""){
        searchUrl = "http://www.omdbapi.com/?s="+query+"&apikey=thewdb";
    }
    request(searchUrl,function(error,response,body){
        if(!error && response.statusCode == 200){
            var data = JSON.parse(body);
            //res.send(data["Search"][0].Title);
            res.render("results",{data:data});
        }
    });
});

app.listen(3000,"localhost",function(){
    console.log("server is running.......");
});