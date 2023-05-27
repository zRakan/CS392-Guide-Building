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


/**
    * GET /map/offices/
    * @summary This route is for getting all offices information
    * @return {object} 200 - success response
*/
mapRoute.get('/offices', function(req, res) {
    res.status(200).send(offices);
});


/**
    * GET /map/office/{floor}/{office_id}
    * @summary This route is for getting the information of the office
    * @param {String} req.params.office_id Target office id
    * @param {String} req.params.floor The floor of the office
    * @return {object} 200 - success response
    * @return {object} 400 - Bad request response
*/
mapRoute.get('/office/:floor/:office_id', function(req, res) {
    let officeId = req.params.office_id;
    let floor = req.params.floor;


    if(floor < '0' || floor > '3') { // If floor is not in [0, 3]
        res.status(400).send({ error: 'Floor is not found' });
        return;
    }

    floor = parseInt(floor, 10); // Parse to Integer

    if(!Object.keys(officesList[floor]).includes(officeId)) { // If office not in floor
        res.status(400).send({ error: 'Office is not found' });
        return;
    }


    // Check if the office has teacher name or not
    if((infoList[floor][officeId].info).length == 2) {
        res.status(200).send({
            teacher: infoList[floor][officeId].info[0],
            maintenance: infoList[floor][officeId].info[1]
        });
    } else { 
        res.status(200).send({ maintenance: infoList[floor][officeId].info[0] });
    }
});