seamless.polyfill();

let floors, dropText, mapText, searchInput, mapElement, mapContainer, searchContainer, addOfficeBtn;

// Shared office
    let urlParams = new URLSearchParams(window.location.search);

    let directOffice = [];

function copyToClipboard(str) {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}


// Switch Mode
let _switchMode = false;
function switchMode(isAdmin) {
    _switchMode = isAdmin || !_switchMode;

    let hiddenRooms = document.querySelectorAll(".map-elements .office[data-hidden]");
    for(let room in hiddenRooms) {
        if(typeof(hiddenRooms[room]) == "object") {
            let hiddenDiv = hiddenRooms[room];

            hiddenDiv.style.opacity = _switchMode ? 1 : 0;
            hiddenDiv.style["pointer-events"] = _switchMode ? "auto" : "none";
        }
    }

    if(_switchMode) { // is administrator mode
        searchContainer.insertBefore(addOfficeBtn, searchContainer.firstChild);
    } else { // is visitor mode
        searchContainer.removeChild(addOfficeBtn);
    }
}

/**
    * @summary This function will remove the splash screen
*/
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
                showInformation(urlParams.get("office"), directOffice[0], directOffice[1], directOffice[3].getAttribute("data-hidden"), directOffice[2]);
            }
        }, 1000)
}

let floorTexts = ["الطابق الأول", "الطابق الثاني", "الطابق الثالث", "الطابق الرابع"]

/**
    * @summary This function will return floor number
    * @param {String} floor - Floor name
    * @return {Integer} - Floor number
*/
function getFloorByText(floor) {
    if(floor == "الطابق الرابع")
        return 3;
    else if(floor == "الطابق الثالث")
        return 2;
    else if(floor == "الطابق الثاني")
        return 1;
    else return 0;
}

/**
    * @summary This function will create a QRCode for the target office
    * @param {HTMLDivElement} containerDiv - The container of the div
    * @param {HTMLDivElement} office - Office Div element 
*/
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
                text: window.location.origin + "/?office=" + encodeURIComponent(office),
                width: 150,
                height: 150,

                colorDark: "#fff",
                colorLight: "transparent"
            });



    /**
        * @summary This will listen click event from exit button
        * @type {HTMLElement} - The target of the listener
        * @listens document#click - The mouse click event 
    */
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

/**
    * @summary This function will create a div with information of the office
    * @param {HTMLDivElement} office The container of the div
    * @param {String} teacher Teacher name
    * @param {String} maintenance Maintenance number 
*/
function showInformation(office, teacher, maintenance, hidden, floor) {
    // Blur Background
    mapContainer.style.filter = 'blur(0.2rem)';
    mapContainer.style['pointer-events']  = 'none'; // Prevent clicking map container

    // Create container for information
    let containerDiv = document.createElement('div');
        containerDiv.setAttribute('class', 'office-info')

    // Create exit button
    let exitBtn = document.createElement('button')
        exitBtn.setAttribute('id', 'exit-btn');
        exitBtn.setAttribute('type', 'button');
        exitBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/> <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/> </svg>';

        /**
            * @summary This will listen click event from exit button
            * @type {HTMLElement} - The target of the listener
            * @listens document#click - The mouse click event 
        */
        exitBtn.addEventListener('click', function(e) {
            if(!containerDiv.classList.contains('active')) {
                mapContainer.style.filter = 'none';
                mapContainer.style['pointer-events']  = 'auto';  
                
                containerDiv.classList.toggle('active');

                setTimeout(function() {
                    document.body.removeChild(containerDiv); // Removing this container
                }, 1000);
            }
        });

    if(_switchMode) { // If in administrator mode
        if(!hidden) {
            let visibilityText = document.createElement("div");
                visibilityText.setAttribute("id", "visiblity-info");
                visibilityText.innerHTML = "الغرفة ظاهرة للجميع";

            containerDiv.appendChild(visibilityText);
        }

        let editBtn = document.createElement('button')
            editBtn.setAttribute('id', 'edit-btn');
            editBtn.setAttribute('type', 'button');
            editBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16"> <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/> </svg>';

        let removeBtn = document.createElement('button')
            removeBtn.setAttribute('id', 'remove-btn');
            removeBtn.setAttribute('type', 'button');
            removeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16"> <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/> </svg>';

            let confirm = false;
            let deleted = false;
            removeBtn.addEventListener("click", async function(e) {
                if(!confirm) {
                    confirm = true;
                    showNotification("اضغط على زر الحذف مرة أخرى للتأكيد", "warning");

                    setTimeout(function() {
                        confirm = false;
                    }, 1500)
                } else {
                    if(!deleted) {
                        deleted = true;
                        let data = await fetch("/map/office/remove", {
                            method: "POST",

                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                            },
        
                            body: JSON.stringify({
                                officeNumber: office,
                                floorNumber: (parseInt(floor,10) + 1) + ""
                            }),
                        });
                        
                        if(data.status == 200) {
                            showNotification("تم حذف المكتب بنجاح", "success");
                            mapContainer.style.filter = 'none';
                            mapContainer.style['pointer-events']  = 'auto';  
                            
                            containerDiv.classList.toggle('active');
            
                            setTimeout(function() {
                                let childOffices = floors[currentFloor].children;

                                for(let child in childOffices) {
                                    let div = childOffices[child];
                                    if(typeof(div) == "object") {
                                        if(div.innerHTML == office)
                                            floors[currentFloor].removeChild(div);
                                    }
                                }
                                document.body.removeChild(containerDiv); // Removing this container
                            }, 1000);
                        }
                    }
                    
                    
                }
            })

        containerDiv.appendChild(editBtn);
        containerDiv.appendChild(removeBtn);
    }

    // Create Share Button
    let shareBtn = document.createElement('button')
        shareBtn.setAttribute('id', 'share-btn');
        shareBtn.setAttribute('type', 'button');
        shareBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-share-fill" viewBox="0 0 16 16"> <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z"/> </svg>';

    let shareMethods = document.createElement('div');
        shareMethods.setAttribute('id', 'share-methods');

    let qrBtn = document.createElement('button');
        qrBtn.setAttribute('id', 'share-qr');
        qrBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-qr-code" viewBox="0 0 16 16"> <path d="M2 2h2v2H2V2Z"></path> <path d="M6 0v6H0V0h6ZM5 1H1v4h4V1ZM4 12H2v2h2v-2Z"></path> <path d="M6 10v6H0v-6h6Zm-5 1v4h4v-4H1Zm11-9h2v2h-2V2Z"></path> <path d="M10 0v6h6V0h-6Zm5 1v4h-4V1h4ZM8 1V0h1v2H8v2H7V1h1Zm0 5V4h1v2H8ZM6 8V7h1V6h1v2h1V7h5v1h-4v1H7V8H6Zm0 0v1H2V8H1v1H0V7h3v1h3Zm10 1h-1V7h1v2Zm-1 0h-1v2h2v-1h-1V9Zm-4 0h2v1h-1v1h-1V9Zm2 3v-1h-1v1h-1v1H9v1h3v-2h1Zm0 0h3v1h-2v1h-1v-2Zm-4-1v1h1v-2H7v1h2Z"></path> <path d="M7 12h1v3h4v1H7v-4Zm9 2v2h-3v-1h2v-1h1Z"></path> </svg>';
        shareMethods.appendChild(qrBtn);


        /**
            * @summary This will listen click event from QR button
            * @type {HTMLElement} - The target of the listener
            * @listens document#click - The mouse click event 
        */
        qrBtn.addEventListener('click', function(e) {
            if(qrBtn.parentElement.classList.contains('active')) // Check if parent is active or not
                showQR(containerDiv, office);
        });

    let linkBtn = document.createElement('button');
        linkBtn.setAttribute('id', 'share-link');
        linkBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-link" viewBox="0 0 16 16"> <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/> <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z"/> </svg>';
        shareMethods.appendChild(linkBtn);

        let firstTime = true;
        
        shareBtn.addEventListener('click', function(e) {
            if(!firstTime)
                shareMethods.classList.toggle('hide');
            
            shareMethods.classList.toggle('active');
            firstTime = false;
        });

        // Share office by link
            linkBtn.addEventListener('click', function(e) {
                const sharedURL = window.location.origin + '/?office=' + encodeURIComponent(office);

                if(navigator.clipboard)
                    navigator.clipboard.writeText(sharedURL);
                else
                    copyToClipboard(sharedURL);

                showNotification('تم نسخ رابط المكتب بنجاح', 'success')
            });

        

    // Create office text
    let officeText = document.createElement('div');
        officeText.setAttribute('id', 'office-text');
        officeText.innerHTML = `<span id="office-title">${office}</span>${teacher? `<span>المكتب: <span id="small-text">${teacher}</span></span>` : ""}<span>رقم الصيانة: <span id="small-text">${maintenance}</span></span>`

    // Appending to information container
    containerDiv.appendChild(exitBtn);      // Append Exit button
    containerDiv.appendChild(shareBtn);     // Share button
    containerDiv.appendChild(shareMethods); // Share methods container
    containerDiv.appendChild(officeText);   // Office text container

    document.body.appendChild(containerDiv); // Append information container to body
}

let notificationContainer;

/**
    * @summary This function will create notification (toast notification)
    * @param {String} message The message of notification (toast)
    * @param {String} status The status of notification ["success", "failed", "warning"] 
*/
function showNotification(message, status) {
    let notificationElement = document.createElement('div');
        notificationElement.setAttribute('id', 'notification-message');
        notificationElement.classList.add(status);

    if(status == 'success')
        notificationElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/> <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/> </svg>
        <span>${message}</span>`
    else if(status == 'failed')
        notificationElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-square-fill" viewBox="0 0 16 16"> <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z"/> </svg> 
        <span>${message}</span>`
    else {
        notificationElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-octagon"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg> 
        <span>${message}</span>`
    }
    

    notificationContainer.appendChild(notificationElement);
    setTimeout(function() {
        notificationElement.style.left = '5%';

        setTimeout(function() {
            notificationElement.style.left = '-100%';

            setTimeout(function() {
                notificationElement.remove();
            }, 500)
        }, 2000)
    }, 5);
}



/**
    * @summary This function will switch the floor
    * @param {String || Integer} selectedFloor the target floor
    * @param {boolean} isDrop Is the switch come from dropdown menu or not 
*/
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

let offices;
async function addOffices(onlyHidden) {
        offices = await fetch("/map/offices");
        offices = await(offices.json());

        for(let floor in offices) {
            let officeList = offices[floor];

            let leftMax = 0;
            let leftWidth;
            for(let office in officeList) {
                if(onlyHidden && !officeList[office].hidden) continue; // Ignore non-hidden offices

                let div = document.createElement("div");
                    div.setAttribute("class", "office");

                    if(officeList[office].hidden)
                        div.setAttribute("data-hidden", "true");

                // Positioning
                    div.style.position = "absolute";
                    div.style.left = officeList[office].left ? officeList[office].left : "0px";
                    div.style.top = officeList[office].top ? officeList[office].top : "0px";

                    let leftP = officeList[office].left ? parseInt((officeList[office].left).slice(0, -2), 10) : 0;
                    let leftW = parseInt((officeList[office].width).slice(0, -2), 10);
                    
                    div.style.width = officeList[office].width;
                    div.style.height = officeList[office].height;
                    
                    if(officeList[office].hidden) {
                        div.style["background-color"] = "#00C8F8";
                        div.style["border-color"] = "#0092B8";
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

                div.addEventListener("click", async function() {
                    let officeResp = await fetch("/map/office/" + floor + "/"+ office);
                    officeResp = await officeResp.json();

                    if(officeResp.error) return;

                    showInformation(office, officeResp.teacher, officeResp.maintenance, officeList[office].hidden, floor);
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
}

window.addEventListener("load", async function(event) {
    // Elements
        // Navbar
            const navbarBtn = document.getElementById("navbar-click"),
                navbarItems = document.querySelector('.navbar-items');
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
            searchContainer = document.querySelector(".search-container");

        // Add Office
            // Creating Add Office btn
            addOfficeBtn = document.createElement("button");
            addOfficeBtn.setAttribute("type", "button");
            addOfficeBtn.setAttribute("id", "addOffice_btn");
            addOfficeBtn.setAttribute("title", "إضافة مكتب جديد");
            
            // Event for add office
            const addContainer = document.createElement("div");
                    addContainer.setAttribute("class", "addoffice-container");

                    addContainer.innerHTML = `<div class="addoffice-flex">

                    <div class="addoffice-element">
                        <label for="office-name">اسم المكتب & صاحب المكتب</label>
                        <input type="text" name="office-name">
                    </div>
    
                    <div class="addoffice-element">
                        <label for="office-number">رقم المكتب</label>
                        <input type="text" name="office-number">
                    </div>
    
                    <div class="addoffice-element">
                        <label for="maintenance-number">رقم الصيانة</label>
                        <input type="text" name="maintenance-number">
                    </div>
    
                    <div class="addoffice-element">
                        <label for="floor-number">رقم الطابق</label>
                        <input type="text" name="floor-number" placeholder="رقم الطابق (1-4)">
                    </div>
    
                    <div class="addoffice-element">
                        <label for="office-position">مكان المكتب</label>
    
                        <input type="text" name="office-position" placeholder="الطول">
                        <input type="text" name="office-position" placeholder="العرض">
                    </div>
    
                    <div class="addoffice-element">
                        <label for="office-size">حجم المكتب</label>
                        
                        <input type="text" name="office-size" placeholder="الطول">
                        <input type="text" name="office-size" placeholder="العرض">
                    </div>
                </div>`



            let addOfficeSubmit = document.createElement("button");
                addOfficeSubmit.innerHTML = "تأكيد";
                addOfficeSubmit.setAttribute("id", "addoffice-submit");

                // Event listener
                let officeViewer = document.createElement("div");
                officeViewer.setAttribute("class", "office");
                officeViewer.style.position = "absolute";

                officeViewer.style.left = "50px";
                officeViewer.style.top = "50px";
                officeViewer.style.width = "50px";
                officeViewer.style.height = "50px";

                officeViewer.style["background-color"] = "red";


                addOfficeSubmit.addEventListener("click", async function(e) {
                    let officeName = document.querySelector('.addoffice-element > input[name="office-name"]').value;
                    let officeNumber = document.querySelector('.addoffice-element > input[name="office-number"]').value;
                    let maintenanceNumber = document.querySelector('.addoffice-element > input[name="maintenance-number"]').value;
                    let floorNumber = document.querySelector('.addoffice-element > input[name="floor-number"]').value;
                    let position = document.querySelectorAll('.addoffice-element input[name="office-position"]');
                        const positionTop = position[0].value;
                        const positionLeft = position[1].value;

                    let size = document.querySelectorAll('.addoffice-element input[name="office-size"]');
                        const sizeWidth = size[0].value;
                        const sizeHeight = size[1].value;

                    if(!officeName) {
                        showNotification("يجب عليك كتابة اسم المكتب", "failed");
                        return;
                    }

                    if(!officeNumber) {
                        showNotification("يجب عليك كتابة رقم المكتب", "failed");
                        return;
                    }

                    if(!maintenanceNumber) {
                        showNotification("يجب عليك كتابة رقم الصيانة", "failed");
                        return;
                    }

                    if(!floorNumber) {
                        showNotification("يجب عليك كتابة رقم الطابق", "failed");
                        return;
                    } else if(floorNumber < '1' || floorNumber > '4') {
                        showNotification("الطوابق المتاحة من 1 إلى 4", "failed");
                        return;
                    }

                    if(!positionTop || !positionLeft) {
                        showNotification("يجب عليك كتابة مكان المكتب", "failed");
                        return;
                    }
                    
                    if(!sizeWidth || !sizeHeight) {
                        showNotification("يجب عليك كتابة حجم المكتب", "failed");
                        return;
                    }


                    let resp = await fetch("/map/office/add", {
                        method: "POST",

                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
    
                        body: JSON.stringify({
                            officeName,
                            officeNumber,
                            maintenanceNumber,
                            floorNumber,
                            position: [positionTop, positionLeft],
                            size: [sizeWidth, sizeHeight],
                        }),
                    });
                    resp = await resp.json();

                    if(resp.status == "success") {
                        let tempOffice = officeViewer.cloneNode(true);
                        
                        floorNumber = (parseInt(floorNumber, 10) - 1) + "";
                        tempOffice.addEventListener("click", async function(e) {
                            let officeResp = await fetch("/map/office/" + floorNumber + "/"+ officeNumber);
                            officeResp = await officeResp.json();
        
                            if(officeResp.error) return;
        
                            showInformation(officeNumber, officeResp.teacher, officeResp.maintenance, false, floorNumber);
                        });

                        tempOffice.style["background-color"] = "#ebebeb";
                        floors[currentFloor].appendChild(tempOffice);
                        showNotification("تم إضافة المكتب بنجاح", "success");
                    } else {
                        showNotification(resp.message, "failed");
                    }
                });

                addContainer.appendChild(addOfficeSubmit);
                let floorNumber = addContainer.querySelector('.addoffice-element > input[name="floor-number"]');

                
                floorNumber.addEventListener("input", function(e) {
                    if(e.data) {
                        if(e.data < '1' || e.data > '4')
                            showNotification("الطوابق المتاحة من 1 إلى 4", "failed");
                    }
                });
                floorNumber.addEventListener("keypress", function(e) {
                    let floor = e.key;
                    if(floor < 1 || floor > 4 || floorNumber.value) {
                        e.preventDefault();
                        showNotification("الطوابق المتاحة من 1 إلى 4", "failed");
                        return;
                    }

                    floors[currentFloor].removeChild(officeViewer);
                    switchFloor(parseInt(floor, 10) - 1);
                    floors[currentFloor].appendChild(officeViewer);
                });

                let officeNumber = addContainer.querySelector('.addoffice-element > input[name="office-number"]')
                let position = addContainer.querySelectorAll('.addoffice-element input[name="office-position"]');
                let size = addContainer.querySelectorAll('.addoffice-element input[name="office-size"]');

                position.forEach(function(pos) {
                    pos.addEventListener("keypress", function(e) {
                        if(e.key < '0' || e.key > '9'){
                            e.preventDefault();
                            showNotification("يجب عليك كتابة ارقام فقط", "failed");
                        }
                    });

                    pos.addEventListener("input", function(e) {
                        if(e.data) {
                            if(e.key < '0' || e.key > '9')
                                showNotification("يجب عليك كتابة ارقام فقط", "failed");
                        }
                    });
                });
                size.forEach(function(siz) {
                    siz.addEventListener("keypress", function(e) {
                        if(e.key < '0' || e.key > '9'){
                            e.preventDefault();
                            showNotification("يجب عليك كتابة ارقام فقط", "failed");
                        }
                    });

                    siz.addEventListener("input", function(e) {
                        if(e.data) {
                            if(e.key < '0' || e.key > '9')
                                showNotification("يجب عليك كتابة ارقام فقط", "failed");
                        }
                    });
                });

                // Office generator
                // position[0] => height
                // position[1] => width
                position[0].addEventListener("input", function(e) {
                    officeViewer.style.top = (position[0].value ? position[0].value : "50") + "px";
                });

                position[1].addEventListener("input", function(e) {
                    officeViewer.style.left = (position[1].value ? position[1].value : "50") + "px";
                });

                size[0].addEventListener("input", function(e) {
                    officeViewer.style.height = (size[0].value ? size[0].value : "50") + "px";
                });

                size[1].addEventListener("input", function(e) {
                    officeViewer.style.width = (size[1].value ? size[1].value : "50") + "px";
                });


                officeNumber.addEventListener("input", function(e) {
                    officeViewer.innerHTML = officeNumber.value ? officeNumber.value : "";
                });

            
            let addMenu = false;
            addOfficeBtn.addEventListener("click", function(e) {
                addMenu = !addMenu;
                
                // Addoffice Container
                if(addMenu)
                    (addContainer.querySelector('.addoffice-element > input[name="floor-number"]')).setAttribute("value", currentFloor+1);

                addMenu ? document.body.appendChild(addContainer) : document.body.removeChild(addContainer);


                addMenu ? floors[currentFloor].appendChild(officeViewer) : floors[currentFloor].removeChild(officeViewer);
            });

            addOfficeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-plus-circle-fill" viewBox="0 0 16 16"> <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/> </svg>';

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
        addOffices();

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
            let buttonsNav = document.querySelectorAll(".button-navbar");
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

                viewSwitcher.addEventListener("change", function() {
                    switchMode();
                })

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
                        
                        switchMode();
                        navbarItems.removeChild(viewContainer);

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
                setTimeout(function() {
                    loggingIn = false;
                }, 5000)

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

                if([200, 401].includes(data.status)) {
                    data = await data.json();


                    if(data.status == "success") {
                        loggedIn = true;
                        buttonsNav[2].classList.toggle("active");

                        loginContainer.style.opacity = 0;
                        loginContainer.style["pointer-events"] = "none";

                        buttonsNav[2].style.color = "red";
                        buttonsNav[2].innerHTML = `تسجيل خروج<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16"> <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/> <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/> </svg>`;

                        switchMode(true);

                        addOffices(true);
                        
                        navbarItems.appendChild(viewContainer);

                        showNotification("تم تسجيل دخولك بنجاح", "success");
                    } else {
                        showNotification("اسم المستخدم او كلمة المرور غير صحيحة", "failed");
                    }
                } else
                    showNotification("يجب عليك الإنتظار قليلًا", "warning");
            }
        });

    // Check if user is logged in or not
        if(typeof isLogged != "undefined") {
            loggedIn = true;

            loginContainer.style.opacity = 0;
            loginContainer.style["pointer-events"] = "none";

            buttonsNav[2].style.color = "red";
            buttonsNav[2].innerHTML = `تسجيل خروج<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16"> <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/> <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/> </svg>`;

            switchMode(true);
            navbarItems.appendChild(viewContainer);
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