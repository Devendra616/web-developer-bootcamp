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
            req.flash("error",err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Welcome to Yelpcamp! "+user.username);
            res.redirect("/campgrounds");
        });
    })
});

//login form
router.get('/login',(req,res)=>{
    res.render('login');
});
/* 
//handle login
router.post('/login',passport.authenticate('local',{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}),(req,res)=>{    
});
 */
router.post('/login',function(req,res,next){
    passport.authenticate('local',function(err,user,info){
        if(err){ return next(err);}
        if(!user){ 
            req.flash("error", "Login failure");
            return res.redirect('/login');
        }

        req.logIn(user,function(err){
            if(err){ return next(err);}
            var redirectTo = req.session.redirectTo ? req.session.redirectTo: '/campgrounds';
            delete req.session.redirectTo;
          
            res.redirect(redirectTo);
        });
    })(req,res,next);
})

//logout route
router.get("/logout",(req,res)=>{
    req.logOut();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

module.exports = router;