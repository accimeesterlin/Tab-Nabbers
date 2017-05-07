var express = require("express"),
    handlebars = require("express-handlebars"),
    methodOverride = require("method-override"),
    bodyParser = require("body-parser");

var app = express(),
    port = process.env.PORT || 8080;


app.use(express.static(process.cwd() + "/public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(methodOverride("_method"));

app.engine("handlebars", handlebars({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

var routers = require("./controllers/appControllers"),
    db = require("./models");

app.use("/", routers);

db.sequelize.sync({}).then(function () {
    app.listen(port, function () {
        console.log("App's listening at PORT" + port);
    })
});



