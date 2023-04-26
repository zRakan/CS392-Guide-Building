const express = require("express"),
    path = require("path");

const PORT = 3000;
const app = express();

const maintenance = true

app.engine('html', require('ejs').renderFile);


app.get('/', function(req, res) {
    res.render(maintenance ? "maintenance.html" : "test");
})

app.get("*", function(req, res) {
    res.redirect("/");
});


app.listen(PORT, function() {
    console.log("Started webserver [" + PORT + "]");
})