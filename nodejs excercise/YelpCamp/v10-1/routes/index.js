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
        if(!user){ return res.redirect('/login');}

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
    res.redirect("/campgrounds");
});


//middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.session.redirectTo = req.originalUrl;
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}
module.exports = router;