import express from "express";


export const mapRoute = express.Router();


// Offices [To-do: Save it in JSON]
let offices = [
    { // Floor #1
        ["G117"]: {width: "60px", height: "40px", top: "5px", left: "20px"},
        ["G118-G119"]: {width: "120px", height: "40px", top: "5px", left: "100px"},
        ["G120"]: {width: "60px", height: "40px", top: "5px", left: "235px"},
        ["G116"]: {width: "80px", height: "40px", top: "70px", left: "0px"},
        ["G121"]: {width: "80px", height: "40px", top: "70px", left: "245px"},
        ["G106"]: {width: "80px", height: "40px", top: "240px", left: "245px"},
        ["G111"]: {width: "50px", height: "40px", top: "300px", left: "0px"},
        ["G110"]: {width: "50px", height: "40px", top: "300px", left: "55px"},
        ["G109-G108"]: {width: "120px", height: "40px", top: "300px", left: "110px"},
        ["G107"]: {width: "60px", height: "40px", top: "300px", left: "240px"}
    },
    

    { // Floor #2
        ["F100"]: {floor: 1},
    },


    { // Floor #3
        ["F089"]: {floor: 2},
    },


    { // Floor #4  
        ["T102"]: {floor: 3},
    }
]

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