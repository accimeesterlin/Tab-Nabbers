// Used to secure passwords
var bCrypt = require('bcrypt-nodejs');



module.exports = function(passport, user) {
    var LocalStrategy = require('passport-local').Strategy;
    var Recruiter = user.recruiter;

    var recruiterSerialize = function() {
        //serialize
        passport.serializeUser(function(user, done) {
            done(null, user.id);
        });

        // deserialize user
        passport.deserializeUser(function(id, done) {
            Recruiter.findById(id).then(function(user) {
                if (user) {
                    done(null, user.get());
                } else {
                    done(user.errors, null);
                }
            });
        });
    };


    ////////////////////////////////////////////////////////////////////
    ///////////////////Recruiter Access Below///////////////////////////
    ////////////////////////////////////////////////////////////////////
    // Sign Up Recruiter
    passport.use('recruiter-signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },

        function(req, email, password, done) {
            //serialize
            recruiterSerialize();

            // Creating long string password for users
            var generateHash = function(password) {
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            };

            Recruiter.findOne({
                where: {
                    email: email
                }
            }).then(function(user) {
                if (user) {
                    return done(null, false, {
                        message: 'That email is already taken'
                    });

                } else {
                    var userPassword = generateHash(password);

                    var recruiter = {
                        email: email,
                        password: userPassword,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname
                    };

                    console.log(recruiter);


                    Recruiter.create(recruiter).then(function(newUser, created) {
                        if (!newUser) {
                            return done(null, false);
                        }
                        if (newUser) {
                            return done(null, newUser);
                        }
                    });
                }
            }).catch(function(err) {
                console.log("Errors: " + err);
                return done(null, false, { message: 'Something went wrong with your Sign Up' });
            });
        }
    ));

    // Recruiter Sign in
    passport.use('recruiter-signin', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },

        function(req, email, password, done) {
            recruiterSerialize();
            // Generating long string password
            var isValidPassword = function(userpass, password) {
                return bCrypt.compareSync(password, userpass);
            };

            Recruiter.findOne({
                where: {
                    email: email
                }
            }).then(function(user) {

                if (!user) {
                    return done(null, false, { message: 'Email does not exist' });
                }

                if (!isValidPassword(user.password, password)) {

                    return done(null, false, { message: 'Incorrect password.' });

                }

                var userinfo = user.get();

                return done(null, userinfo);

            }).catch(function(err) {

                console.log("Error:", err);

                return done(null, false, { message: 'Something went wrong with your Signin' });
            });
        }
    )); // Sigin Recruiter









    ////////////////////////////////////////////////////////////////////
    ///////////////////Student Access Below/////////////////////////////
    ////////////////////////////////////////////////////////////////////


    var Student = user.user,
        BootCamp = user.bootcamp;

    var studentSerialize = function() {
        //serialize Student
        passport.serializeUser(function(user, done) {
            done(null, user.id);
        });

        // deserialize Student
        passport.deserializeUser(function(id, done) {
            Student.findById(id).then(function(user) {
                if (user) {
                    done(null, user.get());
                } else {
                    done(user.errors, null);
                }
            });
        });
    };

    // Sign Up Student
    passport.use('student-signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },

        function(req, email, password, done) {

            studentSerialize();


            // Creating long string password for users
            var generateHash = function(password) {
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            };

            var userPassword;

            Student.findOne({
                where: {
                    email: email
                }
            }).then(function(user) {
                if (user) {
                    return done(null, false, {
                        message: 'That email is already taken'
                    });

                } else {
                    userPassword = generateHash(password);

                    var student = {
                        email: email,
                        password: userPassword,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        bootcampId: req.body.bootcamp,
                        cohortId: req.body.cohort
                    };



                    Student.create(student).then(function(newUser, created) {
                        if (!newUser) {
                            return done(null, false);
                        }
                        if (newUser) {
                            return done(null, newUser);
                        }
                    });
                }
            }).catch(function(err) {
                console.log("Errors: ");
                return done(null, false, { message: 'Something went wrong with your Signup' });
            });

            // // Adding data to the BootCamp Tables
            // var data = {
            //     email: email,
            //     firstname: req.body.firstname,
            //     lastname: req.body.lastname,
            //     institution: req.body.bootcamp,
            //     cohort: req.body.cohort
            // };

            // BootCamp.create(data).then(function(newUser, created) {
            //     if (!newUser) {
            //         return done(null, false);
            //     }
            //     if (newUser) {
            //         // return done(null, newUser);
            //         console.log("New user added");
            //     }
            // });
        }
    ));

    //Student Signin
    passport.use('student-signin', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },

        function(req, email, password, done) {

            studentSerialize();

            // Generating long string password
            var isValidPassword = function(userpass, password) {
                return bCrypt.compareSync(password, userpass);
            };

            Student.findOne({
                where: {
                    email: email
                }
            }).then(function(user) {

                if (!user) {
                    return done(null, false, { message: 'Email does not exist' });
                }

                if (!isValidPassword(user.password, password)) {

                    return done(null, false, { message: 'Incorrect password.' });

                }

                var userinfo = user.get();

                return done(null, userinfo);

            }).catch(function(err) {
                console.log("Errors: " + err);
                return done(null, false, { message: 'Something went wrong with your Signin' });
            });
        }
    )); // Sigin Student

};
