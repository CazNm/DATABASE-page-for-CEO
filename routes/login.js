var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.get("/", function(req, res) {
    console.log("open index.html");
    res.render("login.ejs", { alert: false }); //using absolute path for sendFile
});

module.exports = app;
