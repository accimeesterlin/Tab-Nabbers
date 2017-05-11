/**
 * Created by esterlingaccime on 5/10/17.
 */
var express = require("express");
var passport = require("passport");
var path = require("path");

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

router.get("/signup", function (req, res) {
    res.sendFile(path.join(__dirname + "/../views/signup.html"));
});


router.get("/dashboard", isLoggedIn, function (req, res) {
    res.sendFile(path.join(__dirname + "/../views/dashboard.html"));
});


router.post('/signup', passport.authenticate("local-signup", {
    successRedirect: '/dashboard',
    failureRedicrect: '/signup'
}));


router.post('/signin', passport.authenticate("local-signin", {
    successRedirect: '/dashboard',
    failureRedicrect: '/signin'
}));


router.get("/logout", function (req, res) {
    req.session.destroy(function (err) {
        res.redirect("/index");
    });
});


router.get("/signin", function (req, res) {
    res.sendFile(path.join(__dirname + "/../views/signin.html"));
});

router.get("*", function (req, res) {
    res.sendFile(path.join(__dirname + "/../views/index.html"));
});

module.exports = router;