var express = require('express'),
    passport = require('passport'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    env = require('dotenv').load();

var app = express(),
    port = process.env.PORT || 8080;


//For BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// For Passport
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions



// Static directory
app.use(express.static("./app/public"));

//Models
var db = require("./app/models");

var routes = require("./app/controllers/authcontroller.js");
app.use("/", routes);


//load passport strategies
require('./app/config/passport/passport.js')(passport, db.user);

//Sync Database
db.sequelize.sync({}).then(function() {
    console.log('Nice! Database looks fine');

    app.listen(port, function(err) {

        if (!err)
            console.log("Site is live");
        else console.log(err)

    });

}).catch(function(err) {
    console.log(err, "Something went wrong with the Database Update!");
});


