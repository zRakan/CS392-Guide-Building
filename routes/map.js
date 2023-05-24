import express from "express";
import fs from "fs/promises";

export const mapRoute = express.Router();


// Offices
let offices = [];

try {
    offices = JSON.parse(await fs.readFile("data.json"));
} catch(e) { // If data.json doesn't exist
    fs.writeFile("data.json", "[]");
}

// Filtering info
let officesList = [];
let infoList =  [];
for(let floor in offices){
    officesList.push({});
    infoList.push({});
    for(let office in offices[floor]) {
        officesList[floor][office] = (({info, ...a}) => a)(offices[floor][office])
        infoList[floor][office] = (({width, height, top, left, ...b}) => b)(offices[floor][office])
    }
}

mapRoute.get("/offices", function(req, res) {
    // TO-DO

    res.status(200).send(offices);
});


mapRoute.get("/office/:floor/:office_id", function(req, res) {
    // TO-DO
    let officeId = req.params.office_id;

    let floor = req.params.floor;

    if(floor < '0' || floor > '3') { // If floor is not in [0, 3]
        res.status(400).send({ error: "Floor is not found" });
        return;
    }

    floor = parseInt(floor, 10);

    if(!Object.keys(officesList[floor]).includes(officeId)) { // If office not in floor
        res.sendStatus(400);
        return;
    }

    
    if((infoList[floor][officeId].info).length == 2)
        res.status(200).send({ teacher: infoList[floor][officeId].info[0], maintenance: infoList[floor][officeId].info[1] });
    else
        res.status(200).send({ maintenance: infoList[floor][officeId].info[0] });
});