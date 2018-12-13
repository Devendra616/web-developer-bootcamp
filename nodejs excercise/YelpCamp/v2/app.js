var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/yelpcampDb",{useNewUrlParser :true});
var campgroundSchema = new mongoose.Schema({
    name:String,
    img:String,
    state:String
});
var Campground = mongoose.model("Campground",campgroundSchema);
/* 
Campground.create( {
        name:"Rishikesh",
        state:"Uttarkhand",
        img:"http://www.365hops.com/blog/wp-content/uploads/2015/05/Camping.jpg"
    },
    function(err,camp){
        if(err){
            console.log("Some error in creating data...",err);
        }else{
            console.log("Successfully added an camp!");
            console.log(camp);
        }
});  */

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

app.get("/",(req,res)=>{
    res.render("landing");
});

/* var campgroundslist =[ {name:"Rishikesh",state:"Uttarkhand",img:"http://www.365hops.com/blog/wp-content/uploads/2015/05/Camping.jpg"},
    {name:"Jaisalmer",state:"Rajasthan",img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrYO1CoGHNSw5oFsKkVDtaJsouH7VXU3Ir_Y-mmTLYxzKS8LbK"},
    {name:"Chanderltal Lake",state:"Himachal Pradesh",img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1n8Ck3_7BqQS2Zs3E27mZsgQ7kzC4Vl4jTdKhmezfJn3oN-KOpg"},
    {name:"Mussoories",state:"Uttarkhand",img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBSbdDAWMp5g1s_XBmdHAzD3hwIvxmsL1g4hhlv7T1FLcPWkSYOw"},
    {name:"Pushkar",state:"Rajasthan",img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7dPpKG8Y8I9HAudp2PGy272ypi7tmb_TH1zbDiXJ2s5h5AQ5D"}
]; */

app.get("/campgrounds",(req,res)=>{    
    Campground.find({},function(err,allCamps){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds",{campgroundslist:allCamps});
        }
    })
    //res.render("campgrounds",{campgroundslist:campgroundslist});
});

app.post("/campgrounds",(req,res)=>{
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var imageUrl = req.body.imageUrl;
    var state  = req.body.state;
    var newCampground = {name:name,state:state,img:imageUrl};
    //campgroundslist.push(newCampground);
    Campground.create(newCampground,(err,camp)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }
    })
    
    //redirect to campground page
   // res.redirect("/campgrounds");
});

app.get("/campgrounds/new",(req,res)=>{
    res.render("new");
})

var port = process.env.PORT || 3000;
app.listen(port,"localhost",function(){
    console.log("Server has started ....");
});