var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground") 
var Comment = require("./models/comment"),
    //User = require("./models/users"),
    SeedDb = require("./seeds");

    //requiring routes
var commentRoutes = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes = require('./routes/index');

var passport = require('passport'),
    localStrategy = require('passport-local'),
    User = require('./models/user');

// SeedDb(); //seed the database
mongoose.connect("mongodb://localhost:27017/yelpcampDbv9",{useNewUrlParser :true});

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


app.use("/",indexRoutes);
// adds first parameter as prepends to the routes defined in commentRoutes
// so /new becomes /campgrounds/new
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

var port = process.env.PORT || 3000;
app.listen(port,"localhost",function(){
    console.log("Server has started ....");
});