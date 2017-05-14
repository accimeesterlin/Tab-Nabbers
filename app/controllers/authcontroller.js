/**
 * Created by esterlingaccime on 5/10/17.
 */
var express = require("express"),
    passport = require("passport"),
    formidable = require('formidable'),
    path = require('path'),    //used for file path
    fs = require('fs-extra');


var db = require("../models");

var router = express.Router();

var user;

// Verified that the user needs to sign in
var isLoggedIn = function (req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/signin");
};


// Home page
router.get("/index", function (req, res) {
    res.render("index");
});

// About page
router.get("/about", function (req, res) {
    res.render("about");
});

// Sign in for Recruiters and Students
router.get("/signin/:name?", function (req, res) {
    if(req.params.name === 'recruiter'){
        res.render("recruiter_login");

    }
    else if(req.params.name === "student"){
        res.render("student_login");

    }

});



// Sigin up Routers for Recruiters and Students
router.get("/signup/:name?", function (req, res) {
    if(req.params.name === 'recruiter'){
        res.render("recruiter_signup");

    }

    else if(req.params.name === "student"){
        res.render("student_signup");

    }

});


// Dashboard included the map that recruiters see
// If user not logged in, they're not able to see it
router.get("/dashboard", isLoggedIn, function (req, res) {
    res.render("dashboard");
});


// Profile page for Students
// If user not logged in, they're not able to see it
router.get("/profile", isLoggedIn, function (req, res) {
    var currentUser = req.user;
    user = currentUser;
    db.bootcamp.findOne({
        where:{
            id: currentUser.id
        }
    }).then(function (data) {
        // console.log(data.get());
        currentUser.institution = data.get().institution;
        //console.log(currentUser);

        // console.log(req.user);
        res.render("student_profile", currentUser);
    });

});


// Log the user out
// If user not logged in, they're not able to see it
router.get("/logout", isLoggedIn, function (req, res) {
    req.session.destroy(function (err) {
        res.redirect("/index");
    });
});


router.get("*", function (req, res) {
    res.render("index");
});



////////////////////////////////////////////////////////////////////
///////////////////Post Request Go below////////////////////////////
////////////////////////////////////////////////////////////////////

// Sign Up for Recruiters
router.post('/signup/recruiter', passport.authenticate("recruiter-signup", {
    successRedirect: '/dashboard',
    failureRedirect: '/signup/recruiter'

}));


// Signin for Recruiters
router.post('/signin/recruiter', passport.authenticate("recruiter-signin", {
    successRedirect: '/dashboard',
    failureRedirect: '/signin/recruiter'

}));


// Sign Up for Students
router.post('/signup/student', passport.authenticate("student-signup", {
    successRedirect: '/profile',
    failureRedirect: '/signup/student'

}));


// Signin for Students
router.post('/signin/student', passport.authenticate("student-signin", {
    successRedirect: '/profile',
    failureRedirect: '/signin/student'

}));


router.post("/update/profile", function (req, res) {


    var student = req.body;
    var profileUpdate = {
        email:student.email,
        firstname: student.firstname,
        lastname: student.lastname,
        github: student.github,
        phoneNumber: student.phoneNumber
    };

    db.user.update(profileUpdate, {
        where:{
            id: user.id
        }
    }).then(function (data) {
        console.log("Data has successfully beeen updated!!", data);
        res.json("ok");
    }).catch(function (err) {
        console.log(err);
        res.json("err");
    });

});

router.route('/upload').post(function (req, res, next) {

  var form = new formidable.IncomingForm();
    //Formidable uploads to operating systems tmp dir by default
    form.uploadDir = "app/public/img/profile_images";       //set upload directory
    form.keepExtensions = true;     //keep file extension
    
    console.log(form.uploadDir);

    form.parse(req, function(err, fields, files) {
        // res.writeHead(200, {'content-type': 'text/plain'});
        // res.write('received upload:\n\n');
        console.log("form.bytesReceived");
        //TESTING
        console.log("file size: "+JSON.stringify(files.fileUploaded.size));
        console.log("file path: "+JSON.stringify(files.fileUploaded.path));
        console.log("file name: "+JSON.stringify(files.fileUploaded.name));
        console.log("file type: "+JSON.stringify(files.fileUploaded.type));
        console.log("astModifiedDate: "+JSON.stringify(files.fileUploaded.lastModifiedDate));

        //Formidable changes the name of the uploaded file
        //Rename the file to its original name
        fs.rename(files.fileUploaded.path, 'app/public/img/profile_images/'+files.fileUploaded.name, function(err) {
        if (err)
            throw err;
          console.log('renamed complete');  
        });
        //   res.end();

        var profileUpdate = {
            photo: files.fileUploaded.name
        };

        db.user.update(profileUpdate, {
            where:{
                id: user.id
            }
        }).then(function (data) {
            console.log("Data has successfully beeen updated!!", data);
            res.redirect("/profile");
        }).catch(function (err) {
            console.log(err);
            // res.json("err");
        });
    });
});

module.exports = router;
