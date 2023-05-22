function loaded() {
    let elem = document.querySelector(".loading-screen");
    document.getElementById("loading-logo").style.opacity = 0;
    elem.style.height = "0%";
    // Destroy div after animation
        setTimeout(function() {
            elem.remove();
        }, 1000)
}

window.addEventListener("load", async (event) => {
    // Offices creation
        let currentFloor = 0;
        let floors = [
            document.getElementById("first_floor"),
            document.getElementById("second_floor"),
            document.getElementById("third_floor"),
            document.getElementById("fourth_floor"),
        ];

        for(let i = 1; i < floors.length; i++) { // Hide other floors
            floors[i].style.display = "none"
        }

        function getFloor(floor) {
            if(floor == "الطابق الرابع")
                return 3;
            else if(floor == "الطابق الثالث")
                return 2;
            else if(floor == "الطابق الثاني")
                return 1;
            else return 0;
        }

    // Create offices in each floor
        let offices = await fetch("/map/offices");
            offices = await(offices.json());

            for(let office in offices) {
                let obj = offices[office];

                let div = document.createElement("div");
                    div.setAttribute("id", "test");
                div.innerHTML = office;

                div.addEventListener("click", async () => {
                    await fetch("/map/office/"+office);
                })
                
                floors[obj.floor].appendChild(div);
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
            sBtn_text = optionMenu.querySelector(".sBtn-text"),
            floorText = document.getElementById("title"),
            optionList = document.querySelector(".options");

        let dropdownMenu = false;
        selectBtn.addEventListener("click", () => {
            optionMenu.classList.toggle("active");
            dropdownMenu = !dropdownMenu;

            optionList.style["pointer-events"] = dropdownMenu ? "auto" : "none";
        });

        options.forEach((option) => {
            option.addEventListener("click", () => {
                let selectedOption = option.querySelector(".option-text").innerText;

                // Floor switcher
                    floors[currentFloor].style.display = "none"; // Hide current floor
                    floors[getFloor(selectedOption)].style.display = ""; // Show floor

                currentFloor = getFloor(selectedOption);

                sBtn_text.innerText = selectedOption;
                floorText.innerHTML = selectedOption;

                optionMenu.classList.remove("active");

                // Disable prevent clicking
                    optionList.style["pointer-events"] = "none";
                    dropdownMenu = false;
            });
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