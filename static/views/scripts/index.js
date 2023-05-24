let floors, dropText, mapText, searchInput, mapElement, mapContainer;

function loaded() {
    let elem = document.querySelector(".loading-screen");
    document.getElementById("loading-logo").style.opacity = 0;
    elem.style.height = "0%";
    // Destroy div after animation
        setTimeout(function() {
            elem.remove();
        }, 1000)
}

let floorTexts = ["الطابق الأول", "الطابق الثاني", "الطابق الثالث", "الطابق الرابع"]
function getFloorByText(floor) {
    if(floor == "الطابق الرابع")
        return 3;
    else if(floor == "الطابق الثالث")
        return 2;
    else if(floor == "الطابق الثاني")
        return 1;
    else return 0;
}

function showInformation(office, teacher, maintenance) {
    // Blur Background
        mapContainer.style.filter = "blur(0.2rem)";
        mapContainer.style["pointer-events"]  = "none";

    let containerDiv = document.createElement("div");
        containerDiv.setAttribute("class", "office-info")

    let exitBtn = document.createElement("button")
        exitBtn.setAttribute("id", "exit-btn");
        exitBtn.setAttribute("type", "button");
        exitBtn.innerHTML = '<svg transform="rotate(45)" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/> <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/> </svg>';

        exitBtn.addEventListener("click", (e) => {
            mapContainer.style.filter = "none";
            mapContainer.style["pointer-events"]  = "auto";  
            
            containerDiv.classList.toggle("active");

            setTimeout(function() {
                document.body.removeChild(containerDiv); // Removing child
            }, 1000);
        });

    let shareBtn = document.createElement("button")
        shareBtn.setAttribute("id", "share-btn");
        shareBtn.setAttribute("type", "button");
        shareBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-share-fill" viewBox="0 0 16 16"> <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z"/> </svg>';

    let officeText = document.createElement("div");
        officeText.setAttribute("id", "office-text");
        officeText.innerHTML = `<span id="office-title">${office}</span>
        ${teacher? `<span>المكتب: <span id="small-text">${teacher}</span></span>` : ""}
        <span>رقم الصيانة: <span id="small-text">${maintenance}</span></span>`

        containerDiv.appendChild(exitBtn);
        containerDiv.appendChild(shareBtn);
        containerDiv.appendChild(officeText);

    document.body.appendChild(containerDiv);
}

let currentFloor = 0;
function switchFloor(selectedFloor, isDrop) {
    if(isDrop) {
        searchInput.value = ""; // // Search input remove if switched from drop down
        mapElement.scrollTo(0, 0); // Reset scroll for map
    }
    floors[currentFloor].style.display = "none"; // Hide current floor

    // Unhide offices inside div [If user search then change floor from dropdown menu]
        let divFloor = floors[currentFloor].getElementsByTagName("*");
        for(let i = 0; i < divFloor.length; i++)
            divFloor[i].style.display = "";

    currentFloor = typeof(selectedFloor) == "string" ? getFloorByText(selectedFloor) : selectedFloor;

    floors[currentFloor].style.display = ""; // Show floor

    // Changing Text for dropdownMenu & map
        let floorText = floorTexts[currentFloor];
        dropText.innerText = floorText;
        mapText.innerHTML = floorText;
}

window.addEventListener("load", async (event) => {
    // Offices creation
        floors = [
            document.getElementById("first_floor"),
            document.getElementById("second_floor"),
            document.getElementById("third_floor"),
            document.getElementById("fourth_floor"),
        ];

    // Create offices in each floor
        let offices = await fetch("/map/offices");
            offices = await(offices.json());

            for(let floor in offices) {
                let officeList = offices[floor];

                let leftMax = 0;
                let leftWidth;
                for(let office in officeList) {
                    let div = document.createElement("div");
                        div.setAttribute("id", "office");

                    // Positioning
                        div.style.position = "absolute";
                        div.style.left = officeList[office].left ? officeList[office].left : "0px";
                        div.style.top = officeList[office].top ? officeList[office].top : "0px";

                        let leftP = officeList[office].left ? parseInt((officeList[office].left).slice(0, -2), 10) : 0;
                        let leftW = parseInt((officeList[office].width).slice(0, -2), 10);

                        if(officeList[office].width != null){
                            div.style.width = officeList[office].width;
                            div.style.height = officeList[office].height;
                        }

                        if(!leftMax){
                            leftMax = leftP;
                            leftWidth = leftW;
                        } else if(leftP > leftMax) {
                            // Don't change even if left bigger than old
                            // This will calculate total width&left to make sure it's bigger than old one
                            if(leftP + leftW > leftMax + leftWidth) {
                                leftMax = leftP;
                                leftWidth = leftW;
                            }
                        } else if(leftP == leftMax) {
                            if(leftWidth < officeList[office].width)
                                leftWidth = officeList[office].width;
                        }

                    div.innerHTML = office;

                    div.addEventListener("click", async () => {
                        let officeResp = await fetch("/map/office/" + floor + "/"+ office);
                        officeResp = await officeResp.json();

                        showInformation(office, officeResp.teacher, officeResp.maintenance);
                    })
                    
                    floors[floor].appendChild(div);
                }

                if(floors[floor].scrollHeight-50 > floors[floor].clientWidth) {
                    let paddingRight = document.createElement("div");

                    //console.log(leftWidth, floor);

                    paddingRight.style.position = "absolute";
                    paddingRight.style.left = leftMax + "px";

                    paddingRight.style.height = "1px";

                    // Offset: width + 5 padding
                        paddingRight.style["padding-right"] = (leftWidth + 10) + "px";

                    floors[floor].appendChild(paddingRight);
                }
            }

            for(let i = 1; i < floors.length; i++) { // Hide other floors
                floors[i].style.display = "none"
            }

    // Navbar
        const navbarBtn = document.getElementById("navbar-click"),
            navbarMenu = document.querySelector(".navbar");
            mapContainer = document.querySelector(".map-container");

        let navbarOpened = false;
        navbarBtn.addEventListener("click", () => {
            navbarMenu.style.width = !navbarOpened ? "200px" : "0";

            mapContainer.style.filter = !navbarOpened ? "blur(0.2rem)" : "blur(0)";
            mapContainer.style["pointer-events"]  = !navbarOpened ? "none" : "auto";

            navbarOpened = !navbarOpened;
        });

    // Dropdown menu
        const optionMenu = document.querySelector(".select-menu"),
            selectBtn = optionMenu.querySelector(".select-btn"),
            options = optionMenu.querySelectorAll(".option"),
            optionList = document.querySelector(".options");

            dropText = optionMenu.querySelector(".sBtn-text");
            mapText = document.getElementById("title");
        
        let dropdownMenu = false;
        selectBtn.addEventListener("click", () => {
            optionMenu.classList.toggle("active");
            dropdownMenu = !dropdownMenu;

            optionList.style["pointer-events"] = dropdownMenu ? "auto" : "none";
        });

        options.forEach((option) => {
            option.addEventListener("click", () => {
                let selectedOption = option.querySelector(".option-text").innerText;

                switchFloor(selectedOption, true);

                optionMenu.classList.remove("active");

                // Disable prevent clicking
                    optionList.style["pointer-events"] = "none";
                    dropdownMenu = false;
            });
        });

        // Search offices
        searchInput = document.getElementById("office-search");
        let delay;
        searchInput.addEventListener("input", (e) => {
            let input = searchInput.value.toLowerCase();
            
            let results = [];
            for(let floor in offices) {
                let officeList = offices[floor];

                for(let office in officeList) {
                    let officeId = office.toLowerCase().indexOf(input) >= 0;
                    let officeName, officeMaintenance;

                    let officeInfo = officeList[office].info;
                    if(officeInfo) {
                        if(officeInfo.length > 1){
                            officeName = officeInfo[0].toLowerCase().indexOf(input) >= 0;
                            officeMaintenance = officeInfo[1].toLowerCase().indexOf(input) >= 0;
                        } else
                            officeMaintenance = officeInfo[0].toLowerCase().indexOf(input) >= 0;
                    }

                    // Search by office (ID & Name & Maintenance number)
                    if(officeId | officeName || officeMaintenance)
                        results.push({floor, office, info: officeList[office].info});
                }
            }
            
            if(results.length == 1) {
                let floorResult = results[0].floor;
                switchFloor(parseInt(floorResult, 10));

                // Hide all other offices from the floor
                let divFloor = floors[floorResult].getElementsByTagName("*");
                //console.log(floors[floorResult].getElementsByTagName("*"));
                for(let i = 0; i < divFloor.length; i++) {
                    if(divFloor[i].innerHTML != results[0].office){
                        divFloor[i].style.display = "none";
                    } else if(divFloor[i].innerHTML == results[0].office) {
                        divFloor[i].scrollIntoView({ behavior: "smooth", block: 'nearest', inline: 'center' });
                    }
                }
            } else { // Unhide offices
                let divFloor = floors[currentFloor].getElementsByTagName("*");
                
                for(let i = 0; i < divFloor.length; i++)
                    divFloor[i].style.display = "";
            }
        });


    mapElement = document.querySelector(".map-elements");

     /*mapElement.addEventListener("click", (e) => {
        console.log(e)

        let rect = e.target.getBoundingClientRect();
        let x = e.clientX - rect.left ; //x position within the element.
        let y = (e.clientY - rect.top);  //y position within the element.
        console.log("Left? : " + x + " ; Top? : " + y + ".");

        let element = document.getElementById("test");

        element.style.position = "relative";
        element.style.top = y + "px";
        element.style.left = x + "px";
    });*/

    let grabbing = false;
        
    let startPos = [];
    let scrollPos = [];
    mapElement.addEventListener('mousedown', (e) => {
        grabbing = true;
        
        startPos[0] = e.pageX - mapElement.offsetLeft; // X
        startPos[1] = e.pageY - mapElement.offsetTop; // Y

        scrollPos[0] = mapElement.scrollLeft;
        scrollPos[1] = mapElement.scrollTop;

        mapElement.style.cursor = 'grabbing';
    });

    // If mouse up stop grabbing
        document.addEventListener('mouseup', () => {
            grabbing = false;
            mapElement.style.cursor = 'grab';
        })

    document.addEventListener('mousemove', (e) => {
        if (!grabbing) return;
        e.preventDefault();

        mapElement.scrollLeft = scrollPos[0] - ((e.pageX - mapElement.offsetLeft) - startPos[0]);
        mapElement.scrollTop = scrollPos[1] - ((e.pageY - mapElement.offsetTop) - startPos[1]);
    });


    //switchFloor(3);


    // Page loaded [Hiding loading screen]
        loaded();
});