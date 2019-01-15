var Campground = require('../models/campground');
var Comment = require('../models/comment');

//all middleware goes here

//method1
var middlewareObj = {};

middlewareObj.checkCommentOwnership = function(req,res,next){
    //if user is logged in
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,(err,foundComment)=>{
            if(err){
                res.redirect("next");                
            }else{
                //if user owns the comment
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else{
                    req.flash("error","You don't have the required permission");
                    res.redirect("back");
                }                
            }
        });
    }else{
        req.flash("error","You need to be logged in");
        res.redirect("back");
    }    
}

middlewareObj.checkCampgroundOwnership = function(req,res,next){
    //if user is logged in
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,(err,foundCamp)=>{
            if(err){
                req.flash("error","Campground not found!");
                res.redirect("next");                
            }else{
                //if user owns the campground
                if(foundCamp.author.id.equals(req.user._id)){
                    next();
                } else{
                    req.flash("error","You don't have the required permission");
                    res.redirect("back");
                }                
            }
        });
    }else{
        req.flash("error","You need to be logged in");
        res.redirect("back");
    }    
}

middlewareObj.isLoggedIn= function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in")
    req.session.redirectTo = req.originalUrl;    
    res.redirect("/login");
}


//method2
/*var middlewareObj ={
    checkCampgroundOwnership: function(){

    },
    checkCommentOwnership:function(){

    }
}*/

module.exports = middlewareObj;