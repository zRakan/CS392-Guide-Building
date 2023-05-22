import express from "express";


export const mapRoute = express.Router();


// Offices [To-do: Save it in JSON]
let offices = {
    // Floor #1
        ["G118-G119"]: {floor: 0},
    
    // Floor #2
        ["F100"]: {floor: 1},
    
    // Floor #3
        ["F089"]: {floor: 2},
    
    // Floor #4
        ["T102"]: {floor: 3},
}

mapRoute.get("/offices", function(req, res) {
    // TO-DO

    res.status(200).send(offices);
});


mapRoute.get("/office/:office_id", function(req, res) {
    // TO-DO
    let officeId = req.params.office_id;
    if(!offices[officeId]){
        res.sendStatus(400);
        return;
    }

    console.log(officeId);
    res.sendStatus(401);
});