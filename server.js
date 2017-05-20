var express = require('express'),
    passport = require('passport'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    env = require('dotenv').load(),
    exphbs = require("express-handlebars");

var app = express(),
    PORT = process.env.PORT || 8080;

// Static directory
app.use(express.static("./app/public"));



//For BodyParser
app.use(bodyParser({ defer: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//For Handlebars
app.set('views', './app/views');
app.engine('hbs', exphbs({
    extname: '.hbs'
}));

app.set('view engine', '.hbs');


// For Passport
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions





//Models
var db = require("./app/models");

var routes = require("./app/controllers/authcontroller.js");
app.use("/", routes);


//load passport strategies

require('./app/config/passport/passport.js')(passport, db);


var server;

//Sync Database

db.sequelize.sync({ }).then(function() {

    console.log('Nice! Database looks fine');

    server = app.listen(PORT, function(err) {

        if (!err)
            console.log("Site is live");
        else console.log(err)

    });

}).catch(function(err) {
    console.log(err, "Something went wrong with the Database Update!");
});

module.exports = server;
