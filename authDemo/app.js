var express =               require("express"),
    mongoose =              require("mongoose"),
    passport =              require("passport"),
    bodyParser=             require("body-parser"),
    localStrategy =         require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");
    var User              = require("./models/user");

mongoose.connect("mongodb://localhost/auth_demo_app");

var app = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(require("express-session")({
    secret:"This is my secret passcode",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//+++++++++++++++++++++++++++++++++++++
//ROUTES
//+++++++++++++++++++++++++++++++++++++

app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/secret",isLoggedIn,(req,res)=>{
    res.render("secret");    
});

//Auth routes
//show signup form
app.get("/register",(req,res)=>{
    res.render("register");
});

//handle user signup
app.post("/register",(req,res)=>{
   User.register(new User({username: req.body.username}),req.body.password,(err,user)=>{
       if(err){
           console.log(err);
           return res.render('register');
       }else{
           passport.authenticate("local")(req,res,function(){
               res.redirect("/secret");
           })
       }
   })
});

//login
app.get("/login",(req,res)=>{
    res.render("login");
});

//login handler - middleware
app.post("/login",passport.authenticate("local",{
    successRedirect: "/secret",
    failureRedirect: "/login"
}),(req,res)=>{
    
});

app.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/");
});

//Middleware to check if authenticated
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){        
        return next();
    }else{        
        res.redirect('/login');
    }
}

app.listen(process.env.PORT || 3000, process.env.IP,function(){
    console.log("server started......");
});