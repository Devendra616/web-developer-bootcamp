var express = require('express');
var router = express.Router({mergeParams:true}); //merge params in campground and comments so that can get the id defined in use
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');
/* -----------------------------------
*   COMMENTS ROUTES 
* ------------------------------------
*/


//comments new
router.get("/new",middleware.isLoggedIn,function(req,res){
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
router.post("/",middleware.isLoggedIn,(req,res)=>{
       Campground.findById(req.params.id,(err,foundCamp)=>{
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else{
            Comment.create(req.body.comment,(err,comment)=>{
                if(err){
                    req.flash("error","Something went wrong!");
                    console.log(err);
                }else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    foundCamp.comments.push(comment);
                    foundCamp.save();
                    req.flash("success","Successfully added comment");
                    res.redirect("/campgrounds/"+foundCamp.id);
                }
            })
        }
    })
});

//edit comment
/* router.get("/:comment_id/edit",middleware.checkCommentOwnership,(req,res)=>{
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            req.flash("error","Something went wrong!");
            res.redirect("back");
        } else{
            res.render("comments/edit",{campground_id:req.params.id, comment:foundComment});
        }
    });   
}) */

router.get("/:comment_id/edit",middleware.isLoggedIn,middleware.checkUserComment, (req,res)=>{
    res.render("comments/edit",{campground_id:req.params.id, comment:req.comment});
})

//update comment
router.put("/:comment_id/",middleware.checkCommentOwnership,(req,res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err){
            req.flash("error","Something went wrong!");
            res.redirect("back");
        }else{
            req.flash("success","Comment edited");
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});

//remove comments
router.delete("/:comment_id",middleware.checkCommentOwnership,(req,res)=>{
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        }else {
            req.flash("success","Comment deleted");
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});

module.exports = router;