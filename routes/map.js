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

function saveToJson() {
    fs.writeFile("data.json", JSON.stringify(offices, null, 2));
}

// Filtering info
let officesList = [];
let infoList =  [];
let hiddenOffices =  [];
for(let floor in offices){
    officesList.push({});
    infoList.push({});
    hiddenOffices.push({});
    for(let office in offices[floor]) {
        if(offices[floor][office].hidden)
            hiddenOffices[floor][office] = offices[floor][office];
        else
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
    if(req.session.user) { // isAdmin
        res.status(200).send(offices);
    } else {
        res.status(200).send(officesList);
    }

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
        res.status(400).send({ status: "error", message: 'Floor is not found' });
        return;
    }

    floor = parseInt(floor, 10); // Parse to Integer

    const isHidden = Object.keys(hiddenOffices[floor]).includes(officeId)
    if(!Object.keys(officesList[floor]).includes(officeId) && !isHidden) { // If office not in floor
        res.status(400).send({ status: "error", message: 'Office is not found' });
        return;
    }

    // Check if room is hidden and the requester is admin
    if(isHidden && !req.session.user) {
        res.status(400).send({ status: "error", message: 'Office is not found' });
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

// Remove office
mapRoute.post("/office/remove", function(req, res) {
    if(req.session.user) {
        let floorNumber = req.body.floorNumber;

        console.log(req.body);

        if(floorNumber < '1' || floorNumber > '4') {
            res.status(401).send({ status: "error", message: "Floor is not found" });
            return;
        }
        floorNumber = parseInt(floorNumber, 10)-1; // Parsing to integer

        let officeNumber = req.body.officeNumber;
        if(!Object.keys(offices[floorNumber]).includes(officeNumber)){
            res.status(401).send({ status: "error", message: 'Office is not found' });
            return;
        }

        delete offices[floorNumber][officeNumber];
        delete officesList[floorNumber][officeNumber];
        delete infoList[floorNumber][officeNumber];

        saveToJson();
        
        res.status(200).send({ status: "success", message: "Office deleted" });
    } else
        res.status(401).send({ status: "error", message: "Unauthorized access" });
});

// Edit office
mapRoute.post("/office/edit", function(req, res) {
    if(req.session.user) {
        let floorNumber = req.body.floorNumber;
        if(floorNumber < '1' || floorNumber > '4') {
            res.status(401).send({ status: "error", message: "Floor is not found" });
            return;
        }
        floorNumber = parseInt(floorNumber, 10); // Parsing to integer
        
        let editedOffice = req.body.editedOffice;
        let officeNumber = req.body.officeNumber;
        let officeName = req.body.officeName;
        let officeMaintenance = req.body.officeMaintenance;

        if(!Object.keys(offices[floor]).includes(editedOffice)){
            res.status(401).send({ status: "error", message: 'Office is not found' });
            return;
        }

        if(editedOffice == officeNumber) { // Editing same office
            offices[floor][officeNumber] = {
                hidden: offices[floor][editedOffice].hidden,
                info: [ officeName, officeMaintenance ],

                width: offices[floor][editedOffice].width,
                height: offices[floor][editedOffice].height,
                
                top: offices[floor][editedOffice].top,
                left: offices[floor][editedOffice].left,
            }

            officesList[floor][officeNumber] = {
                hidden: offices[floor][editedOffice].hidden, 

                width: offices[floor][editedOffice].width,
                height: offices[floor][editedOffice].height,
                
                top: offices[floor][editedOffice].top,
                left: offices[floor][editedOffice].left,
            }

            infoList[floor][officeNumber]= {
                info: [officeName, officeMaintenance ],
            }
        } else { // Change office number
            offices[floor][officeNumber] = {
                hidden: offices[floor][editedOffice].hidden,
                info: [ officeName, officeMaintenance ],

                width: offices[floor][editedOffice].width,
                height: offices[floor][editedOffice].height,
                
                top: offices[floor][editedOffice].top,
                left: offices[floor][editedOffice].left,
            }

            officesList[floor][officeNumber] = {
                hidden: offices[floor][editedOffice].hidden, 

                width: offices[floor][editedOffice].width,
                height: offices[floor][editedOffice].height,
                
                top: offices[floor][editedOffice].top,
                left: offices[floor][editedOffice].left,
            }

            infoList[floor][officeNumber]= {
                info: [officeName, officeMaintenance ],
            }

            delete offices[floor][editedOffice];
            delete officesList[floor][editedOffice];
            delete infoList[floor][editedOffice];
        }
    } else
        res.status(401).send({ status: "error", message: "Unauthorized access" });
});

// Add new office
mapRoute.post("/office/add", function(req, res) {
    if(req.session.user) {
        let floorNumber = req.body.floorNumber;
        if(floorNumber < '1' || floorNumber > '4') {
            res.status(401).send({ status: "error", message: "Floor is not found" });
            return;
        }
        floorNumber = parseInt(floorNumber, 10); // Parsing to integer

        let officeName = req.body.officeName;
        let officeNumber = req.body.officeNumber;
        let maintenanceNumber = req.body.maintenanceNumber;

        let pos = req.body.position;
        let size = req.body.size;

        if(officeName && officeNumber && maintenanceNumber && pos && size) {            
            let posTop = parseInt(pos[0], 10);
            let posLeft = parseInt(pos[1], 10);

            if(isNaN(posTop) || isNaN(posLeft)) {
                res.status(401).send({ status: "error", message: "Position is invalid" });
                return;
            }

            let sizeHeight = parseInt(size[0], 10);
            let sizeWidth = parseInt(size[1], 10);

            if(isNaN(sizeHeight) || isNaN(sizeWidth)) {
                res.status(401).send({ status: "error", message: "Size is invalid" });
                return;
            }

            offices[floorNumber-1][officeNumber] = {
                info: [officeName, maintenanceNumber],
                
                width: sizeWidth + "px",
                height: sizeHeight + "px",
                
                top: posTop + "px",
                left: posLeft + "px"
            }

            // Save to JSON
            saveToJson();

            officesList[floorNumber-1][officeNumber] = {                
                width: sizeWidth + "px",
                height: sizeHeight + "px",
                
                top: posTop + "px",
                left: posLeft + "px"
            }

            infoList[floorNumber-1][officeNumber] = {
                info: [officeName, maintenanceNumber]
            }
        } else {
            res.status(401).send({ status: "error", message: "Invalid information" });
        }


        res.status(200).send({ status: "success", message: "Office added" });
    } else
        res.status(401).send({ status: "error", message: "Unauthorized access" });
});