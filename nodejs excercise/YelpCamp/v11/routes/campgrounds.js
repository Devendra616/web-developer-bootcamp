var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware'); //or require('../middleware/index.js');

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

router.post("/",middleware.isLoggedIn,(req,res)=>{
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var imageUrl = req.body.imageUrl;
    var state  = req.body.state;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var price = req.body.price;
    
    var newCampground = {name:name,price:price,state:state,img:imageUrl,description:description,author:author};
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

router.get("/new",middleware.isLoggedIn,(req,res)=>{
    res.render("campgrounds/new");
});

//Shows more information about a campground
router.get("/:id",(req,res)=>{
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCamp){
        if(err){
            console.log(err);
        }else{   
            if(!foundCamp) {
                req.flash("error", "Campground not found");
                return res.redirect("/campgrounds");
            }
            res.render("campgrounds/show",{campground:foundCamp});
        }
    });   
});

//EDIT campground 
/* router.get('/:id/edit',middleware.checkCampgroundOwnership,(req,res)=>{
    //if user is logged in
    Campground.findById(req.params.id,(err,foundCamp)=>{
           res.render('campgrounds/edit',{campground:foundCamp});                
        });  
}) */

router.get("/:id/edit",middleware.isLoggedIn, middleware.checkUserCampground,(req,res)=>{
    res.render('campgrounds/edit',{campground:req.campground});                
})

//UPDATE campground
router.put("/:id",middleware.checkCampgroundOwnership,(req,res)=>{
   
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCamp){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});

//REMOVE campground
router.delete("/:id",middleware.checkCampgroundOwnership,(req,res)=>{
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    })
});

module.exports = router;