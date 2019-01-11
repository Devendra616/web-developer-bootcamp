var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground") 
var Comment = require("./models/comment"),
    //User = require("./models/users"),
    SeedDb = require("./seeds");

var passport = require('passport'),
    localStrategy = require('passport-local'),
    User = require('./models/user');

SeedDb();
mongoose.connect("mongodb://localhost:27017/yelpcampDbv6",{useNewUrlParser :true});

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.set("view engine","ejs");

//PASSPORT CONFIGURATION
app.use(require('express-session')({
    secret: "I am a winner!",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//this middleware now get added to all route, addding the currentuser to all pages
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

app.get("/",(req,res)=>{
    res.render("landing");
});

/* var campgroundslist =[ {name:"Rishikesh",state:"Uttarkhand",img:"http://www.365hops.com/blog/wp-content/uploads/2015/05/Camping.jpg"},
    {name:"Jaisalmer",state:"Rajasthan",img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrYO1CoGHNSw5oFsKkVDtaJsouH7VXU3Ir_Y-mmTLYxzKS8LbK"},
    {name:"Chanderltal Lake",state:"Himachal Pradesh",img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1n8Ck3_7BqQS2Zs3E27mZsgQ7kzC4Vl4jTdKhmezfJn3oN-KOpg"},
    {name:"Mussoories",state:"Uttarkhand",img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBSbdDAWMp5g1s_XBmdHAzD3hwIvxmsL1g4hhlv7T1FLcPWkSYOw"},
    {name:"Pushkar",state:"Rajasthan",img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7dPpKG8Y8I9HAudp2PGy272ypi7tmb_TH1zbDiXJ2s5h5AQ5D"}
]; */


//index
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

app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
    Campground.findById(req.params.id,(err,foundCamp)=>{
        if(err){
            console.log(err);
        } else{
            res.render("comments/new",{campground:foundCamp});
        }
    });    
});

//isLoggedIn in post prevents from placing data from backend like postman directly
app.post("/campgrounds/:id/comments",isLoggedIn,(req,res)=>{
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
// ---------------------------------------
//AUTH ROUTES
//----------------------------------------
//show register form
app.get('/register',(req,res)=>{
    res.render('register');
});

//handle register
app.post('/register',(req,res)=>{
    var newUser = new User({username: req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds");
        });
    })
});

//login form
app.get('/login',(req,res)=>{
    res.render('login');
});

//handle login
app.post('/login',passport.authenticate('local',{
    successRedirect:"/campgrounds",
    failureRedirect:"login"
}),(req,res)=>{    
});

//logout route
app.get("/logout",(req,res)=>{
    req.logOut();
    res.redirect("/campgrounds");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

var port = process.env.PORT || 3000;
app.listen(port,"localhost",function(){
    console.log("Server has started ....");
});