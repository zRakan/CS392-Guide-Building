import express from "express";


export const authenticationRoute = express.Router();


authenticationRoute.post("/login", function(req, res) {
    // TO-DO
    res.sendStatus(200);
});