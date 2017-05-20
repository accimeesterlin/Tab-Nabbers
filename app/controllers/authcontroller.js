/**
 * Created by esterlingaccime on 5/10/17.
 */
var express = require("express"),
    passport = require("passport"),
    formidable = require('formidable'),
    path = require('path'), //used for file path
    fs = require('fs-extra'),
    atlanta = require('../public/atlanta.json');

var gtBootcamp = atlanta.children[0].children,
    gtCohort1 = gtBootcamp[0].children,
    gtCohort2 = gtBootcamp[1].children,
    gtCohort3 = gtBootcamp[2].children;

var gaBootcamp = atlanta.children[1].children,
    gaCohort1 = gaBootcamp[0].children,
    gaCohort2 = gaBootcamp[1].children,
    gaCohort3 = gaBootcamp[2].children;

var iyBootcamp = atlanta.children[2].children,
    iyCohort1 = iyBootcamp[0].children,
    iyCohort2 = iyBootcamp[1].children,
    iyCohort3 = iyBootcamp[2].children;

var db = require("../models");

var router = express.Router();

var user;

// Verified that the user needs to sign in
var isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    console.log(req.isAuthenticated());
    res.redirect("/signin");
};


// Home page
router.get("/index", function(req, res) {
    res.render("index");
});

// About page
router.get("/about", function(req, res) {
    res.render("about");
});

// Sign in for Recruiters and Students
router.get("/signin/:name?", function(req, res) {
    if (req.params.name === 'recruiter') {
        res.render("recruiter_login");

    } else if (req.params.name === "student") {
        res.render("student_login");

    }

});

//API endpoint for getting Bootcamp info to populate signup form, STUDENT ID, NAME, PHOTO return for mapping function
router.get("/api/bootcamps/:bootcampID?", function(req, res) {
    if (req.params.bootcampID) {
        console.log(req.params.bootcampID);
        db.cohort.findAll({
            where: {
                bootcampid: req.params.bootcampID
            }
        }).then(function(data) {
            res.json(data);
        })
    } else {
        db.bootcamp.findAll().then(function(data) {
            res.json(data);
        });
    }
});


// Sigin up Routers for Recruiters and Students
router.get("/signup/:name?", function(req, res) {
    if (req.params.name === 'recruiter') {
        res.render("recruiter_signup");

    } else if (req.params.name === "student") {
        res.render("student_signup");
    }
});


// Dashboard included the map that recruiters see
// If user not logged in, they're not able to see it
router.get("/dashboard", isLoggedIn, function(req, res) {
        // Reset Georgia Tech Coding BootCamp
        // gtBootcamp[0].children = [];
        gtBootcamp[1].children = [];
        gtBootcamp[2].children = [];

        // Reset Iron Yard Coding BootCamp
        iyBootcamp[0].children = [];
        iyBootcamp[1].children = [];
        iyBootcamp[2].children = [];

        // Reset General Assembly Coding Bootcamp
        gaBootcamp[0].children = [];
        gaBootcamp[1].children = [];
        gaBootcamp[2].children = [];


    db.user.findAll({raw : true }).then(function (data) {

            data.map(function (el) {
                console.log(el.photo);

                var obj = {
                    name: el.firstname,
                    id: "'" + el.id + "'",
                    img: "./img/profile_images/" + el.photo,
                    size: 40000,
                    email: el.email,
                    phone: el.phone,
                    github: el.github,
                    lastname: el.lastname
                };

                if(el.photo === null){
                    obj.img = "./img/avatar-default.png";
                } if(el.phone === undefined){
                    obj.phone = "";

                } if(el.github === null){
                    obj.github = "";

                }

                var gaTech = function () {
                    if(el.cohortId === 1){
                        var currentIds = [];
                        for (var i = 0; i < gtCohort1.length; i++) {
                            currentIds.push(gtCohort1[i].id);
                            console.log(currentIds);
                        }

                        console.log(obj.id);
                        gtBootcamp[0].children.push(obj);
                    }
                    if(el.cohortId === 2){
                        gtBootcamp[1].children.push(obj);
                    }
                    if(el.cohortId === 3){
                        gtBootcamp[2].children.push(obj);
                    }
                };

                var ironYard = function () {
                    if(el.cohortId === 4){
                        iyBootcamp[0].children.push(obj);
                    }

                    if(el.cohortId === 5){
                        iyBootcamp[1].children.push(obj);
                    }

                    if(el.cohortId === 6){
                        iyBootcamp[2].children.push(obj);

                    }
                };

                var gAssembly = function () {
                    if(el.cohortId === 7){
                        gaBootcamp[0].children.push(obj);
                    }

                    if(el.cohortId === 8){
                        gaBootcamp[1].children.push(obj);
                    }

                    if(el.cohortId === 9){
                        gaBootcamp[2].children.push(obj);

                    }
                };

                switch(el.bootcampId){
                    case 1:
                        gaTech();
                        break;
                    case 2:
                        ironYard();
                        break;
                    case 3:
                        gAssembly();
                        break;
                    default:
                        console.log("User not found");
                }
            });

        fs.readFile('./app/public/atlanta.json', 'utf8', function readFileCallback(err, data) {
            if (err) {
                console.log(err);
            } else {
                json = JSON.stringify(atlanta); //convert it back to json
                fs.writeFile('./app/public/atlanta.json', json, 'utf8'); // write it back
                res.render("dashboard");
            }
        });
    });
});



// Profile page for Students
// If user not logged in, they're not able to see it
router.get("/profile", isLoggedIn, function(req, res) {
    var currentUser = req.user;
    user = currentUser;
    console.log(user);

    db.bootcamp.findOne({
        where: {
            id: currentUser.id
        }
    }).then(function(data) {
        console.log(data);
        // console.log(data.get());
        // currentUser.institution = data.get().institution;
        //console.log(currentUser);
        console.log(currentUser);
        // console.log(req.user);
        res.render("student_profile", currentUser);
    });

});


// Log the user out
// If user not logged in, they're not able to see it
router.get("/logout", isLoggedIn, function(req, res) {
    req.session.destroy(function(err) {
        res.redirect("/index");
    });
});


router.get("*", function(req, res) {
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


router.post("/update/profile", function(req, res) {


    var student = req.body;
    console.log(student);

    // var profileUpdate = {
    //     email:student.email,
    //     firstname: student.firstname,
    //     lastname: student.lastname,
    //     github: student.github,
    //     phoneNumber: student.phoneNumber
    //     HTML: student.HTML
    // };

    db.user.update(student, {
        where: {
            id: user.id
        }
    }).then(function(data) {
        console.log("Data has successfully beeen updated!!", data);
        res.json("ok");
    }).catch(function(err) {
        console.log(err);
        res.json("err");
    });

});

router.post('/upload', function(req, res, next) {

    var form = new formidable.IncomingForm();
    //Formidable uploads to operating systems tmp dir by default
    form.uploadDir = "app/public/img/profile_images"; //set upload directory
    form.keepExtensions = true; //keep file extension

    console.log(form.uploadDir);
    form.parse(req, function(err, fields, files) {
        // res.writeHead(200, {'content-type': 'text/plain'});
        // res.write('received upload:\n\n');
        console.log("form.bytesReceived");
        //TESTING
        console.log("file size: " + JSON.stringify(files.fileUploaded.size));
        console.log("file path: " + JSON.stringify(files.fileUploaded.path));
        console.log("file name: " + JSON.stringify(files.fileUploaded.name));
        console.log("file type: " + JSON.stringify(files.fileUploaded.type));
        console.log("astModifiedDate: " + JSON.stringify(files.fileUploaded.lastModifiedDate));
        //Formidable changes the name of the uploaded file
        //Rename the file to its original name
        fs.rename(files.fileUploaded.path, 'app/public/img/profile_images/' + files.fileUploaded.name, function(err) {
            if (err)
                throw err;
            console.log('renamed complete');
        });
        //   res.end();
        var profileUpdate = {
            photo: files.fileUploaded.name
        };
        db.user.update(profileUpdate, {
            where: {
                id: req.user.id
            }
        }).then(function(data) {
            console.log("Data has successfully beeen updated!!", data);
            res.redirect("/profile");
        }).catch(function(err) {
            console.log(err);
            // res.json("err");
        });
    });
});

////////////////////////////////////////////////////////////////////
///////////////////Delete Request Go below////////////////////////////
////////////////////////////////////////////////////////////////////

router.delete("/delete", function(req, res) {
    req.session.destroy(function(err) {
        db.user.destroy({
            where: {
                id: user.id
            }
        }).then(function(data) {
            res.send('/index');
        }).catch(function(err) {
            console.log(err);
            res.json("err");
        });
    });
});


module.exports = router;
