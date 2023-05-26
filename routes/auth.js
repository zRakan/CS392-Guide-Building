import express from "express";
import fs from "fs/promises";
import bcrypt from "bcrypt";

import prompt from "prompts"

export const authenticationRoute = express.Router();


let userAccount;

const questions = [
    {
        type: 'text',
        name: 'username',
        message: 'Username?'
    },

    {
        type: 'text',
        name: 'password',
        message: 'Password?',
    }
];

try {
    let authInfo = await fs.readFile("account.json"); // Retrieving account from json
    userAccount = JSON.parse(authInfo);
} catch(e) { // If file not found
    console.log("Setup administrator account");

    const userInput = await prompt(questions);

    let hashedPass = await bcrypt.hash(userInput.password, 10);

    await fs.writeFile("account.json", JSON.stringify({username: userInput.username, password: hashedPass}, null, 2));
}



async function isValidPassword(password) {
    return await bcrypt.compare(password, userAccount.password)
}

authenticationRoute.post("/login", async function(req, res) {
    if(req.session.user)
        res.status(401).send({ status: "error", message: "You're already logged in"});
    else {
        let username = req.body.username;
        let password = req.body.password;

        if(!username || !password)
            res.status(401).send({ status: "error", message: "Username/Password is wrong"})

        if(username == userAccount.username) {
            if(await isValidPassword(password)) {
                req.session.user = userAccount.username;

                res.status(200).send({ status: "success", message: "You've been successfully logged in" })
            } else 
                res.status(401).send({ status: "error", message: "Username/Password is wrong"})
        } else {
            res.status(401).send({ status: "error", message: "Username/Password is wrong"})
        }
    }
});

authenticationRoute.post("/logout", function(req, res) {
    if(req.session.user) { // Check if user is authenticated
        req.session.destroy(function() {
            res.status(200).send({ status: "success", message: "You've been logged out"})
        })
    } else
        res.status(401).send({ status: "error", message: "You're not authenticated"})
})