window.addEventListener("load", (event) => {
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

    // Create offices in each floor
        for(let office in offices) {
            let obj = offices[office];

            let div = document.createElement("div");
            div.innerHTML = office;
            
            floors[obj.floor].appendChild(div);
        }


    const mapElement = document.querySelector(".map-elements");

    // Dropdown menu
    const optionMenu = document.querySelector(".select-menu"),
        selectBtn = optionMenu.querySelector(".select-btn"),
        options = optionMenu.querySelectorAll(".option"),
        sBtn_text = optionMenu.querySelector(".sBtn-text"),
        floorText = document.getElementById("title");

    // Navbar
    const navbarBtn = document.getElementById("navbar-click"),
        navbarMenu = document.querySelector(".navbar"),
        mapContainer = document.querySelector(".map-container");

    let navbarOpened = false;
    navbarBtn.addEventListener("click", () => {
        console.log("Test");
        navbarMenu.style.width = !navbarOpened ? "200px" : "0";

        mapContainer.style.filter = !navbarOpened ? "blur(0.2rem)" : "blur(0)";
        mapContainer.style["pointer-events"]  = !navbarOpened ? "none" : "auto";

        navbarOpened = !navbarOpened;
    });

    selectBtn.addEventListener("click", () =>
        optionMenu.classList.toggle("active")
    );

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
        });
    });

    // Loading screen
        setTimeout(function() {
            let elem = document.querySelector(".loading-screen");
            
            document.getElementById("loading-logo").style.opacity = 0;
            elem.style.height = "0%";
            

            // Destroy div after animation
                setTimeout(function() {
                    elem.remove();
                }, 1000)
        }, 2000)

    /* mapElement.addEventListener("click", (e) => {
        console.log(e)

        let rect = e.target.getBoundingClientRect();
        let x = e.clientX - rect.left - 10; //x position within the element.
        let y = (e.clientY - rect.top) + 120;  //y position within the element.
        console.log("Left? : " + x + " ; Top? : " + y + ".");

        let element = document.getElementById("test");

        element.style.position = "absolute";
        element.style.top = y + "px";
        element.style.left = x + "px";
    });*/
});