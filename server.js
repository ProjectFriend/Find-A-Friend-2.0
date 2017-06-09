var express = require("express");
var bodyParser = require("body-parser");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Requiring our models for syncing
var db = require("./models");

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Static directory
app.use(express.static("./public"));

// Routes =============================================================
require("./routes/htmlRoutes.js")(app);
require("./routes/apiRoutes")(app);

// Syncing our sequelize models and then starting our express app
db.sequelize.sync({ force: true }).then(function() {
    app.listen(PORT, function() {
        console.log("App listening on PORT " + PORT);
    });
});

// Routes
app.get("/users/aboutme", function(req, res) {
    connection.query("SELECT * FROM ", function(err, result) {
        var html = "<h1> About Me </h1>";

        html += "<ul>";

        for (var i = 0; i < result.length; i++) {
            html += "<li><p> ID: " + result[i].id + "</p>";
            html += "<p> Name: " + result[i].name + " </li>";
            html += "<p>Attitude: " + result[i].compositepoint + " </p></li>";
        }

        html += "</ul>";

        res.send(html);
    });
});