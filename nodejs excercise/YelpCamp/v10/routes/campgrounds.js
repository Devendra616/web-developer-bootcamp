var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');

//index
router.get("/",(req,res)=>{    
    Campground.find({},function(err,allCamps){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index",{campgroundslist:allCamps, currentUser: req.user});
        }
    })
    //res.render("campgrounds",{campgroundslist:campgroundslist});
});

router.post("/",isLoggedIn,(req,res)=>{
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var imageUrl = req.body.imageUrl;
    var state  = req.body.state;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    
    var newCampground = {name:name,state:state,img:imageUrl,description:description,author:author};
    //campgroundslist.push(newCampground);
    Campground.create(newCampground,(err,camp)=>{
        if(err){
            console.log(err);
        }else{            
            res.redirect("/campgrounds");
        }
    });    
    //redirect to campground page
   // res.redirect("/campgrounds");
});

router.get("/new",isLoggedIn,(req,res)=>{
    res.render("campgrounds/new");
});

//Shows more information about a campground
router.get("/:id",(req,res)=>{
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCamp){
        if(err){
            console.log(err);
        }else{           
            res.render("campgrounds/show",{campground:foundCamp});
        }
    });   
});

//EDIT campground 
router.get('/:id/edit',checkCampgroundOwnership,(req,res)=>{
    //if user is logged in
    Campground.findById(req.params.id,(err,foundCamp)=>{
           res.render('campgrounds/edit',{campground:foundCamp});                
        });  
})

//UPDATE campground
router.put("/:id",checkCampgroundOwnership,(req,res)=>{
   
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCamp){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});

//REMOVE campground
router.delete("/:id",checkCampgroundOwnership,(req,res)=>{
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
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

function checkCampgroundOwnership(req,res,next){
    //if user is logged in
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,(err,foundCamp)=>{
            if(err){
                res.redirect("next");                
            }else{
                //if user owns the campground
                if(foundCamp.author.id.equals(req.user._id)){
                    next();
                } else{
                    res.redirect("back");
                }                
            }
        });
    }else{
        res.redirect("back");
    }
}

module.exports = router;