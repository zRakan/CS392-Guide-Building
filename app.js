import express from "express";

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import ejs from "ejs"

// Environment
    import dotenv from "dotenv";
    dotenv.config();

// HTTPS & Logging
    import https from "https";
    import { logger } from "./logger.js";

// fs
    import fs from "fs";

// Minify
    import compression from "compression"
    import minify from "express-minify";

// Authentication
    import session from "express-session";
    import cookieParser from "cookie-parser";
    import bodyParser from "body-parser"


// Routes
    import { routes } from "./routes/routes.js";

const app = express();

// App init
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true })); 
    app.use(cookieParser());
    app.use(logger); // Logging middleware
    
    let sessionConfig = {
        name: "cookie",
        secret: process.env.SECRET_KEY,
        saveUninitialized: true,
        resave: true,

        cookie: {
            sameSite: true,
            maxAge: 60 * 1000 * 60
        }
    }

    // Environment is Production
        if(process.env.ENVIRONMENT == "prodcuction"){
            app.set('trust proxy', 1) // trust first proxy
            sessionConfig.cookie.secure = true;
        }
    
    app.use(session(sessionConfig));

    // Compression & Minification
        app.use(compression());
        app.use(minify());

// Routes 
    app.use(routes.authentication); // Authentication route
    app.use("/map", routes.map);

const maintenance = process.env.MAINTENANCE == "true"

if(!maintenance) // Don't use static if it's in maintenanct
    app.use(express.static("static"));

app.engine('ejs', ejs.renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "static/views"))

app.get('/', function(req, res) {
    if(maintenance)
        res.send("This website under maintenance");
    else
        res.render("index", { logged: req.session.user ? true : false });
});


// Redirect invalid routes
app.all("*", function(res, req) {
    req.redirect('/');
})

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