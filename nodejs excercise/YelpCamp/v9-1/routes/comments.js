var express = require('express');
var router = express.Router({mergeParams:true}); //merge params in campground and comments so that can get the id defined in use
var Campground = require('../models/campground');
var Comment = require('../models/comment');
/* -----------------------------------
*   COMMENTS ROUTES 
* ------------------------------------
*/


//comments new
router.get("/new",isLoggedIn,function(req,res){
      Campground.findById(req.params.id,(err,foundCamp)=>{
        if(err){
            console.log(err);
        } else{
            res.render("comments/new",{campground:foundCamp});
        }
    });    
});


//comments save
//isLoggedIn in post prevents from placing data from backend like postman directly
router.post("/",isLoggedIn,(req,res)=>{
       Campground.findById(req.params.id,(err,foundCamp)=>{
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else{
            Comment.create(req.body.comment,(err,comment)=>{
                if(err){
                    console.log(err);
                }else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    foundCamp.comments.push(comment);
                    foundCamp.save();
                    res.redirect("/campgrounds/"+foundCamp.id);
                }
            })
        }
    })
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