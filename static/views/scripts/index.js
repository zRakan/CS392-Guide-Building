seamless.polyfill();

let floors, dropText, mapText, searchInput, mapElement, mapContainer;


// Shared office
    let urlParams = new URLSearchParams(window.location.search);

    let directOffice = [];


function loaded() {
    let elem = document.querySelector(".loading-screen");
    document.getElementById("loading-logo").style.opacity = 0;
    elem.style.height = "0%";
    // Destroy div after animation
        setTimeout(function() {
            elem.remove();

            // Display Shared Office
            if(directOffice.length > 0) {
                switchFloor(directOffice[2]);
                directOffice[3].scrollIntoView({ block: 'nearest', inline: 'center' });
                showInformation(urlParams.get("office"), directOffice[0], directOffice[1]);
            }
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

function showQR(containerDiv, office) {
    // Blur previouscontainer
        containerDiv.style.filter = "blur(0.2rem)";
        containerDiv.style["pointer-events"] = "none";


    let qrContainer = document.createElement("div");
        qrContainer.setAttribute("class", "qr-viewer");

    let exitBtn = document.createElement("button")
        exitBtn.setAttribute("id", "exit-btn");
        exitBtn.setAttribute("type", "button");
        exitBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/> <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/> </svg>';

    let qrImage = document.createElement("div");
        qrImage.setAttribute("id", "qr-office");
        // Generating a QRCode
            new QRCode(qrImage, {
                text: window.location.host + "/?office=" + encodeURIComponent(office),
                width: 150,
                height: 150,

                colorDark: "#fff",
                colorLight: "transparent"
            });



    exitBtn.addEventListener("click", function(e) {
        if(!qrContainer.classList.contains("active")){
            // Unblur previous container
                containerDiv.style.filter = "none";
                containerDiv.style["pointer-events"] = "auto";

            qrContainer.classList.toggle("active");

            setTimeout(function() {
                document.body.removeChild(qrContainer); // Removing this container
            }, 1000);
        }
    });

    // Apending elements to qr-container
        qrContainer.appendChild(exitBtn);
        qrContainer.appendChild(qrImage);

    // Appending container to body
        document.body.appendChild(qrContainer);
        showNotification("تم إنشاء المربّع بنجاح", "success")
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
        exitBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/> <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/> </svg>';

        // Exit button event
        exitBtn.addEventListener("click", function(e) {
            if(!containerDiv.classList.contains("active")) {
                mapContainer.style.filter = "none";
                mapContainer.style["pointer-events"]  = "auto";  
                
                containerDiv.classList.toggle("active");

                setTimeout(function() {
                    document.body.removeChild(containerDiv); // Removing this container
                }, 1000);
            }
        });

    let shareBtn = document.createElement("button")
        shareBtn.setAttribute("id", "share-btn");
        shareBtn.setAttribute("type", "button");
        shareBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-share-fill" viewBox="0 0 16 16"> <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z"/> </svg>';

    let shareMethods = document.createElement("div");
        shareMethods.setAttribute("id", "share-methods");

    let qrBtn = document.createElement("button");
        qrBtn.setAttribute("id", "share-qr");
        qrBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-qr-code" viewBox="0 0 16 16"> <path d="M2 2h2v2H2V2Z"></path> <path d="M6 0v6H0V0h6ZM5 1H1v4h4V1ZM4 12H2v2h2v-2Z"></path> <path d="M6 10v6H0v-6h6Zm-5 1v4h4v-4H1Zm11-9h2v2h-2V2Z"></path> <path d="M10 0v6h6V0h-6Zm5 1v4h-4V1h4ZM8 1V0h1v2H8v2H7V1h1Zm0 5V4h1v2H8ZM6 8V7h1V6h1v2h1V7h5v1h-4v1H7V8H6Zm0 0v1H2V8H1v1H0V7h3v1h3Zm10 1h-1V7h1v2Zm-1 0h-1v2h2v-1h-1V9Zm-4 0h2v1h-1v1h-1V9Zm2 3v-1h-1v1h-1v1H9v1h3v-2h1Zm0 0h3v1h-2v1h-1v-2Zm-4-1v1h1v-2H7v1h2Z"></path> <path d="M7 12h1v3h4v1H7v-4Zm9 2v2h-3v-1h2v-1h1Z"></path> </svg>';
        shareMethods.appendChild(qrBtn);

        qrBtn.addEventListener("click", function(e) {
            if(qrBtn.parentElement.classList.contains("active")) // Check if parent is active or not
                showQR(containerDiv, office);
        });

    let linkBtn = document.createElement("button");
        linkBtn.setAttribute("id", "share-link");
        linkBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-link" viewBox="0 0 16 16"> <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/> <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z"/> </svg>';
        shareMethods.appendChild(linkBtn);

        let firstTime = true;
        shareBtn.addEventListener("click", function(e) {
            if(!firstTime)
                shareMethods.classList.toggle("hide");
            
            shareMethods.classList.toggle("active");
            firstTime = false;
        });

        // Share office by link
            linkBtn.addEventListener("click", function(e) {
                navigator.clipboard.writeText(window.location.host + "/?office=" + encodeURIComponent(office));
                showNotification("تم نسخ رابط المكتب بنجاح", "success")
            });

        


    let officeText = document.createElement("div");
        officeText.setAttribute("id", "office-text");
        officeText.innerHTML = `<span id="office-title">${office}</span>${teacher? `<span>المكتب: <span id="small-text">${teacher}</span></span>` : ""}<span>رقم الصيانة: <span id="small-text">${maintenance}</span></span>`

        containerDiv.appendChild(exitBtn);      // Append Exit button
        containerDiv.appendChild(shareBtn);     // Share button
        containerDiv.appendChild(shareMethods); // Share methods container
        containerDiv.appendChild(officeText);   // Office text container

    document.body.appendChild(containerDiv); // Append container to body
}

let notificationContainer;
function showNotification(message, status) {
    let notificationElement = document.createElement("div");
        notificationElement.setAttribute("id", "notification-message");
        notificationElement.classList.add(status);

    if(status == "success")
        notificationElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/> <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/> </svg>
        <span>${message}</span>`
    else if(status == "failed")
        notificationElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-square-fill" viewBox="0 0 16 16"> <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z"/> </svg> 
        <span>${message}</span>`
    else {
        notificationElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-octagon"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg> 
        <span>${message}</span>`
    }
    

    notificationContainer.appendChild(notificationElement);
    setTimeout(function() {
        notificationElement.style.left = "5%";

        setTimeout(function() {
            notificationElement.style.left = "-100%";

            setTimeout(function() {
                notificationElement.remove();
            }, 500)
        }, 2000)
    }, 5);
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

window.addEventListener("load", async function(event) {
    // Elements
        // Navbar
            const navbarBtn = document.getElementById("navbar-click"),
                navbarMenu = document.querySelector(".navbar");
                mapContainer = document.querySelector(".map-container");


        // Dropdown menu
            const optionMenu = document.querySelector(".select-menu"),
                selectBtn = optionMenu.querySelector(".select-btn"),
                options = optionMenu.querySelectorAll(".option"),
                optionList = document.querySelector(".options");

                dropText = optionMenu.querySelector(".sBtn-text");
                mapText = document.getElementById("title");

        // Search offices
            searchInput = document.getElementById("office-search");

        // Offices Container
            mapElement = document.querySelector(".map-elements");

        // Offices creation
            floors = [
                document.getElementById("first_floor"),
                document.getElementById("second_floor"),
                document.getElementById("third_floor"),
                document.getElementById("fourth_floor"),
            ];

        // Notification
            notificationContainer = document.querySelector(".notification-container");

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
                        
                        div.style.width = officeList[office].width;
                        div.style.height = officeList[office].height;


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

                    div.addEventListener("click", async function() {
                        let officeResp = await fetch("/map/office/" + floor + "/"+ office);
                        officeResp = await officeResp.json();

                        if(officeResp.error) return;

                        showInformation(office, officeResp.teacher, officeResp.maintenance);
                    });
                    
                    floors[floor].appendChild(div);

                    if(urlParams.get("office") == office && directOffice.length == 0) {
                        let officeResp = await fetch("/map/office/" + floor + "/"+ office);
                        officeResp = await officeResp.json();

                        if(officeResp.error) return;

                        directOffice = [officeResp.teacher, officeResp.maintenance, parseInt(floor, 10), div]
                    }
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
        let navbarOpened = false;
        navbarBtn.addEventListener("click", function() {
            if(navbarOpened || ["", "auto"].includes(mapContainer.style["pointer-events"])) {
                navbarMenu.style.width = !navbarOpened ? "200px" : "0";

                mapContainer.style.filter = !navbarOpened ? "blur(0.2rem)" : "blur(0)";
                mapContainer.style["pointer-events"]  = !navbarOpened ? "none" : "auto";

                navbarOpened = !navbarOpened;
            }
        });

    
        // Dropdown Menu
        let dropdownMenu = false;
        selectBtn.addEventListener("click", function() {
            optionMenu.classList.toggle("active");
            dropdownMenu = !dropdownMenu;

            optionList.style["pointer-events"] = dropdownMenu ? "auto" : "none";
        });

        options.forEach((option) => {
            option.addEventListener("click", function() {
                let selectedOption = option.querySelector(".option-text").innerText;

                switchFloor(selectedOption, true);

                optionMenu.classList.remove("active");

                // Disable prevent clicking
                    optionList.style["pointer-events"] = "none";
                    dropdownMenu = false;
            });
        });

        // Search Offices
        let delay;
        searchInput.addEventListener("input", function(e) {
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
                    if(officeId || officeName || officeMaintenance)
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
                        divFloor[i].scrollIntoView({ block: 'nearest', inline: 'center' });
                    }
                }
            } else { // Unhide offices
                let divFloor = floors[currentFloor].getElementsByTagName("*");
                
                for(let i = 0; i < divFloor.length; i++)
                    divFloor[i].style.display = "";
            }
        });


    // Authentication System
        // Elements
            let buttonsNav = document.querySelectorAll("#button-navbar");
            let loginContainer = document.querySelector(".login-container");
            let submitBtn = document.getElementById("login-submit");
            let userField = document.querySelector("#username-field > input");
            let passField = document.querySelector("#password-field > input");

        // View mode switcher
            let viewContainer = document.createElement("div"); // View container
                viewContainer.setAttribute("class", "viewmode-container")

            let switchContainer = document.createElement("div");
                switchContainer.setAttribute("id", "container-switcher");

            let viewSwitcher = document.createElement("input")
                viewSwitcher.setAttribute("type", "checkbox");
                viewSwitcher.setAttribute("id", "viewmode-switcher");
                viewSwitcher.checked = true; // Switcher is enabled

            let viewText = document.createElement("span");
                viewText.innerHTML = "نمط الإداري"

                viewContainer.appendChild(viewSwitcher);
                viewContainer.appendChild(viewText);
        
        // Variables
            let loggedIn = false; // Check if user is logged in
            let loggingIn = false; // Check if user is logging in

        // Login/Logout button animation
            buttonsNav[2].addEventListener("click", async function(e) {
                if(!loggedIn) { // Open login container
                    buttonsNav[2].classList.toggle("active");

                    loginContainer.style.opacity = buttonsNav[2].classList.contains("active") ? 1 : 0;
                    loginContainer.style["pointer-events"] = buttonsNav[2].classList.contains("active") ? "auto" : "none";
                } else { // Logout

                    let data = await fetch("/logout", {
                        method: "POST",

                        headers: {
                            Accept: "application/json",
                        },
                    })
                    data = await data.json();

                    if(data.status == "success") { // Logged-out successfully
                        loggedIn = false;

                        buttonsNav[2].style.color = "white";
                        buttonsNav[2].innerHTML = `تسجيل الدخول<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16"> <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/> <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/> </svg><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M16.293 9.293L12 13.586L7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z"/></svg>`
                        
                        navbarMenu.removeChild(viewContainer);

                        showNotification("تم تسجيل خروجك بنجاح", "success");
                    } else {
                        showNotification("حدث خطأ", "failed");
                    }
                }
            });

        submitBtn.addEventListener("click", async function(e) {
            if(loggingIn)
                showNotification("يجب عليك الإنتظار قليلًا", "warning");
            else if(!userField.value)
                showNotification("يجب عليك كتابة اسم المستخدم", "warning");
            else if(!passField.value)
                showNotification("يجب عليك كتابة كلمة المرور", "warning");
            else {
                loggingIn = true;
                let data = await fetch("/login", {
                    method: "POST",

                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        username: userField.value,
                        password: passField.value
                    }),

                    credentials: "include"
                })
                data = await data.json();

                if(data.status == "success") {
                    loggedIn = true;
                    buttonsNav[2].classList.toggle("active");

                    loginContainer.style.opacity = buttonsNav[2].classList.contains("active") ? 1 : 0;
                    loginContainer.style["pointer-events"] = buttonsNav[2].classList.contains("active") ? "auto" : "none";

                    buttonsNav[2].style.color = "red";
                    buttonsNav[2].innerHTML = `تسجيل خروج<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16"> <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/> <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/> </svg>`;

                    navbarMenu.appendChild(viewContainer);

                    showNotification("تم تسجيل دخولك بنجاح", "success");
                } else {
                    showNotification("اسم المستخدم او كلمة المرور غير صحيحة", "failed");
                }

                setTimeout(function() {
                    loggingIn = false;
                }, 5000)
            }
        });

    // Check if user is logged in or not
        if(typeof isLogged != "undefined") {
            loggedIn = true;

            loginContainer.style.opacity = 0;
            loginContainer.style["pointer-events"] = "none";

            buttonsNav[2].style.color = "red";
            buttonsNav[2].innerHTML = `تسجيل خروج<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16"> <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/> <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/> </svg>`;

            navbarMenu.appendChild(viewContainer);
        }


     /*mapElement.addEventListener("click", function(e) {
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
    mapElement.addEventListener('mousedown', function(e) {
        grabbing = true;
        
        startPos[0] = e.pageX - mapElement.offsetLeft; // X
        startPos[1] = e.pageY - mapElement.offsetTop; // Y

        scrollPos[0] = mapElement.scrollLeft;
        scrollPos[1] = mapElement.scrollTop;

        mapElement.style.cursor = 'grabbing';
    });

    // If mouse up stop grabbing
        document.addEventListener('mouseup', function() {
            grabbing = false;
            mapElement.style.cursor = 'grab';
        })

    document.addEventListener('mousemove', function(e) {
        if (!grabbing) return;
        e.preventDefault();

        mapElement.scrollLeft = scrollPos[0] - ((e.pageX - mapElement.offsetLeft) - startPos[0]);
        mapElement.scrollTop = scrollPos[1] - ((e.pageY - mapElement.offsetTop) - startPos[1]);
    });


    // Page loaded [Hiding loading screen]
        loaded();
});