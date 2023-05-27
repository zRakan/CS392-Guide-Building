import express from "express";
import fs from "fs/promises";


import bcrypt from "bcrypt";
import rateLimit from 'express-rate-limit'



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


/**
 * @summary This function will compare the encrypted password with user input
 * @param {String} password
 * @return {String} hashed password
*/
async function isValidPassword(password) {
    let hashedPass = await bcrypt.compare(password, userAccount.password);
    
    return hashedPass;
}

const loginLimit = rateLimit({
	windowMs: 1000 * 60 * 5,
	max: 3,
	standardHeaders: true,
	legacyHeaders: false,
});


/**
    * POST /login
    * @summary This route is for login of administrator account
    * @param {String} req.params.username Username of the account
    * @param {String} req.params.password Password of the account
    * @return {object} 200 - success response
    * @return {object} 401 - Bad request response
*/
authenticationRoute.post('/login', loginLimit, async function(req, res) {
    if(req.session.user) { // If the the user is already logged in
        res.status(401).send({
            status: 'error',
            message: 'You\'re already logged in'
        });
    } else {
        let username = req.body.username;
        let password = req.body.password;

        
        if(!username || !password) { // If the username or password is empty
            res.status(401).send({
                status: 'error',
                message: 'Username/Password is wrong'
            });
        } else if(username == userAccount.username) { // If username matches administrator's username
            if(await isValidPassword(password)) { // Validate password with encrypted password
                req.session.user = userAccount.username;

                res.status(200).send({
                    status: 'success',
                    message: 'You\'ve been successfully logged in'
                });
            } else { // If the password doesn't match encrypted password
                res.status(401).send({
                    status: 'error',
                    message: 'Username/Password is wrong'
                });
            }
        } else { // If the username doesn't match administrator's username
            res.status(401).send({
                status: 'error',
                message: 'Username/Password is wrong'
            });
        }
    }
});

/**
    * POST /logout
    * @summary This route is for logout of administrator account
    * @return {object} 200 - success response
    * @return {object} 401 - Bad request response
*/
authenticationRoute.post('/logout', function(req, res) {
    if(req.session.user) { // Check if user is authenticated
        req.session.destroy(function() { // Destroy the session
            res.status(200).send({
                status: 'success',
                message: 'You\'ve been logged out'
            })
        })
    } else { // If user is not authenticated
        res.status(401).send({
            status: 'error',
            message: 'You\'re not authenticated'
        })
    }
})