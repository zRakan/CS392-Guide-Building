import express from "express";
import path from "path";
import ejs from "ejs"

// Environment
    import dotenv from "dotenv";
    dotenv.config();

// HTTPS
    import https from "https";

// fs
    import fs from "fs"


const app = express();

const maintenance = process.env.MAINTENANCE == "true"

app.engine('html', ejs.renderFile);

app.get('/', function(req, res) {
    res.render(maintenance ? "maintenance.html" : "index.html");
})

app.get("*", function(req, res) {
    res.redirect("/");
});

if(process.env.SSL_KEY != "" && process.env.SSL_CERT != "") { // Check if environment has SSL cert or not
    

    // SSL
    const httpsConnection = https.createServer({
        key: fs.readFileSync(process.env.SSL_KEY),
        cert: fs.readFileSync(process.env.SSL_CERT),
    }, app)

    httpsConnection.listen(443, () => {
        console.log("Started webserver");
    });
} else {
    console.log("Environment doesn't have SSL cert, switching to http...")

    app.listen(80, function() {
        console.log("Started webserver");
    });
}