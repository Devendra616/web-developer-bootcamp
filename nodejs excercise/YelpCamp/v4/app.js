var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground") 
var Comment = require("./models/comment"),
    //User = require("./models/users"),
    SeedDb = require("./seeds");

SeedDb();
mongoose.connect("mongodb://localhost:27017/yelpcampDb",{useNewUrlParser :true});

/* Campground.create( {
        name:"Rishikesh",
        state:"Uttarkhand",
        img:"http://www.365hops.com/blog/wp-content/uploads/2015/05/Camping.jpg",
        description:"The tents here are styled in a hermit fashion and are designed to give you a total aloof time. This camp is your go-to place if you are looking for a chance to introspect your inner self. The food served here is completely organic."
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
            res.render("campgrounds/index",{campgroundslist:allCamps});
        }
    })
    //res.render("campgrounds",{campgroundslist:campgroundslist});
});

app.post("/campgrounds",(req,res)=>{
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var imageUrl = req.body.imageUrl;
    var state  = req.body.state;
    var description = req.body.description;
    var newCampground = {name:name,state:state,img:imageUrl,description:description};
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
    res.render("campgrounds/new");
});

//Shows more information about a campground
app.get("/campgrounds/:id",(req,res)=>{
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCamp){
        if(err){
            console.log(err);
        }else{
           
            res.render("campgrounds/show",{campground:foundCamp});
        }
    })
   
});

/* -----------------------------------
*   COMMENTS ROUTES 
* ------------------------------------
*/

app.get("/campgrounds/:id/comments/new",function(req,res){
    Campground.findById(req.params.id,(err,foundCamp)=>{
        if(err){
            console.log(err);
        } else{
            res.render("comments/new",{campground:foundCamp});
        }
    });    
});

app.post("/campgrounds/:id/comments",(req,res)=>{
    Campground.findById(req.params.id,(err,foundCamp)=>{
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else{
            Comment.create(req.body.comment,(err,comment)=>{
                if(err){
                    console.log(err);
                }else{
                    foundCamp.comments.push(comment);
                    foundCamp.save();
                    res.redirect("/campgrounds/"+foundCamp.id);
                }
            })
        }
    })
});

var port = process.env.PORT || 3000;
app.listen(port,"localhost",function(){
    console.log("Server has started ....");
});