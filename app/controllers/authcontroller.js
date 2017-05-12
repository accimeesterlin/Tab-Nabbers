/**
 * Created by esterlingaccime on 5/10/17.
 */
var express = require("express"),
    passport = require("passport"),
    path = require("path");

var router = express.Router();

// Verified that the user needs to sign in
var isLoggedIn = function (req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/signin");
};

router.get("/index", function (req, res) {
    res.sendFile(path.join(__dirname + "/../views/index.html"));
});


router.get("/signin/:name?", function (req, res) {
    if(req.params.name === 'recruiter'){
        res.sendFile(path.join(__dirname + "/../views/recruiter_login.html"));

    }

    else if(req.params.name === "student"){
        res.sendFile(path.join(__dirname + "/../views/student_login.html"));

    }

});


router.get("/signup/:name?", function (req, res) {
    if(req.params.name === 'recruiter'){
        res.sendFile(path.join(__dirname + "/../views/recruiter_signup.html"));

    }

    else if(req.params.name === "student"){
        res.sendFile(path.join(__dirname + "/../views/student_signup.html"));

    }

});

router.get("/dashboard", isLoggedIn, function (req, res) {
    res.sendFile(path.join(__dirname + "/../views/dashboard.html"));
});

router.get("/profile", isLoggedIn, function (req, res) {
    res.sendFile(path.join(__dirname + "/../views/recruiter_login.html"));
});



router.get("/logout", function (req, res) {
    req.session.destroy(function (err) {
        res.redirect("/index");
    });
});

// All the POSTS Request below

router.post('/signup', passport.authenticate("local-signup", {
    successRedirect: '/dashboard',
    failureRedicrect: '/signup'
}));


router.post('/signin', passport.authenticate("local-signin", {
    successRedirect: '/dashboard',
    failureRedicrect: '/signin'
}));





router.get("/signin", function (req, res) {
    res.sendFile(path.join(__dirname + "/../views/signin.html"));
});

router.get("*", function (req, res) {
    res.sendFile(path.join(__dirname + "/../views/index.html"));
});

module.exports = router;