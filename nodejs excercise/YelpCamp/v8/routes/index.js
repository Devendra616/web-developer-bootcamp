var express = require('express');
var router = express.Router();
var passport = require('passport');
var User= require('../models/user');

router.get("/",(req,res)=>{
    res.render("landing");
});
// ---------------------------------------
//AUTH ROUTES
//----------------------------------------
//show register form
router.get('/register',(req,res)=>{
    res.render('register');
});

//handle register
router.post('/register',(req,res)=>{
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
router.get('/login',(req,res)=>{
    res.render('login');
});

//handle login
router.post('/login',passport.authenticate('local',{
    successRedirect:"/campgrounds",
    failureRedirect:"login"
}),(req,res)=>{    
});

//logout route
router.get("/logout",(req,res)=>{
    req.logOut();
    res.redirect("/campgrounds");
});


//middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
module.exports = router;