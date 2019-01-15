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
                req.flash("error","Comment not found!");
                res.redirect("next");                
            }else{
                 // Added this block, to check if foundComment exists, and if it doesn't to throw an error via connect-flash and send us back to the homepage
                if (!foundComment) {
                    req.flash("error", "Comment not found.");
                    return res.redirect("back");
                }
        // If the upper condition is true this will break out of the middleware and prevent the code below to crash our application

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
                // Added this block, to check if foundCampground exists, and if it doesn't to throw an error via connect-flash and send us back to the homepage
                if (!foundCamp) {
                    req.flash("error", "Campground not found.");
                    return res.redirect("back");
                }
            // If the upper condition is true this will break out of the middleware and prevent the code below to crash our application

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

middlewareObj.checkUserCampground = function(req,res,next){
    Campground.findById(req.params.id, function(err,foundCamp){
        if(err || !foundCamp){
            console.log(err);
            req.flash("error","Sorry, that campground does not exist!");
            res.redirect("/campgrounds");
        }else if( foundCamp.author.id.equals(req.user._id)|| req.user.isAdmin){
            req.campground = foundCamp;
            next();
        } else{
            req.flash("error","You don't have the permssion to do that!");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
}

middlewareObj.checkUserComment = function(req,res,next){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err || !foundComment){
            console.log(err);
            req.flash('error',"Sorry, that comment doesn't exist!");
            res.redirect("/campgrounds");
        } else if(foundComment.author.id.equals(req.user._id)|| req.user.isAdmin){
            req.Comment = foundComment;
            next();
        }else{
            req.flash("error","You don't have the permission to do that!");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
}


//method2
/*var middlewareObj ={
    checkCampgroundOwnership: function(){

    },
    checkCommentOwnership:function(){

    }
}*/

module.exports = middlewareObj;