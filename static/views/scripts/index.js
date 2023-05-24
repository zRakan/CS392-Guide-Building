function loaded() {
    let elem = document.querySelector(".loading-screen");
    document.getElementById("loading-logo").style.opacity = 0;
    elem.style.height = "0%";
    // Destroy div after animation
        setTimeout(function() {
            elem.remove();
        }, 1000)
}

let floorTexts = ["الطابق الأول", "الطابق الثاني", "الطابث الثالث", "الطابق الرابع"]
function getFloorByText(floor) {
    if(floor == "الطابق الرابع")
        return 3;
    else if(floor == "الطابق الثالث")
        return 2;
    else if(floor == "الطابق الثاني")
        return 1;
    else return 0;
}

let currentFloor = 0;
let floors, dropText, mapText, searchInput;
function switchFloor(selectedFloor, isDrop) {
    if(isDrop) // Search input remove if switched from drop down
        searchInput.value = "";

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

        for(let i = 1; i < floors.length; i++) { // Hide other floors
            floors[i].style.display = "none"
        }

    // Create offices in each floor
        let offices = await fetch("/map/offices");
            offices = await(offices.json());

            for(let floor in offices) {
                let officeList = offices[floor];

                for(let office in officeList) {
                    let div = document.createElement("div");
                        div.setAttribute("id", "office");

                    // Positioning
                        div.style.position = "absolute";
                        div.style.left = officeList[office].left ? officeList[office].left : "0px";
                        div.style.top = officeList[office].top ? officeList[office].top : "0px";

                        if(officeList[office].width != null){
                            div.style.width = officeList[office].width;
                            div.style.height = officeList[office].height;
                        }

                    div.innerHTML = office;

                    div.addEventListener("click", async () => {
                        await fetch("/map/office/"+office);
                    })
                    
                    floors[floor].appendChild(div);
                }
            }

    // Navbar
        const navbarBtn = document.getElementById("navbar-click"),
            navbarMenu = document.querySelector(".navbar"),
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
                    if(office.toLowerCase().indexOf(input) >= 0)
                        results.push({floor: floor, office});
                }
            }
            
            if(results.length == 1) {
                let floorResult = results[0].floor;
                switchFloor(parseInt(floorResult, 10));

                // Hide all other offices from the floor
                let divFloor = floors[floorResult].getElementsByTagName("*");
                console.log(floors[floorResult].getElementsByTagName("*"));
                for(let i = 0; i < divFloor.length; i++) {
                    if(divFloor[i].innerHTML != results[0].office)
                        divFloor[i].style.display = "none";
                }
            } else { // Unhide offices
                let divFloor = floors[currentFloor].getElementsByTagName("*");
                
                for(let i = 0; i < divFloor.length; i++)
                    divFloor[i].style.display = "";
            }
        });


    const mapElement = document.querySelector(".map-elements");

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




    // Page loaded [Hiding loading screen]
        loaded();
});