var express    = require('express'),
    passport   = require('passport'),
    session    = require('express-session'),
    bodyParser = require('body-parser'),
    env        = require('dotenv').load(),
    exphbs     = require('express-handlebars');
var app = express(),
    port = process.env.PORT || 8080;
//For BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// For Passport
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized:true })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//For Handlebars
app.set('views', './app/views');
app.engine('hbs', exphbs({
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

// Static directory
app.use(express.static("./app/public"));

//Models
var models = require("./app/models");

//Routes
var authRoute = require('./app/routes/auth.js')(app, passport);

//load passport strategies
require('./app/config/passport/passport.js')(passport, models.user);

//Sync Database
models.sequelize.sync().then(function() {
    console.log('Nice! Database looks fine');
}).catch(function(err) {
    console.log(err, "Something went wrong with the Database Update!");
});

app.listen(port, function(err) {

    if (!err)
        console.log("Site is live");
    else console.log(err);

});
