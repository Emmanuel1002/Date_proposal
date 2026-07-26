
/*-------------------------------------
    APP STATE
--------------------------------------*/

const proposal = {
    date: "",
    time: "",
    food: "",
    activity: ""
};


/*-------------------------------------
    SCREENS
--------------------------------------*/

const screens = document.querySelectorAll(".screen");


function showScreen(screenId) {

    screens.forEach(screen => {
        screen.classList.remove("active");
    });

    document.getElementById(screenId).classList.add("active");
}


/*-------------------------------------
    BUTTONS
--------------------------------------*/

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const nextBtn = document.getElementById("nextBtn");
const dateNext = document.getElementById("dateNext");
const foodNext = document.getElementById("foodNext");
const activityNext = document.getElementById("activityNext");
const backBtns = document.querySelectorAll(".back-btn");
const dateInput = document.getElementById("date");
const tomorrow = new Date();
const copyBtn = document.getElementById("copyBtn");

tomorrow.setDate(tomorrow.getDate() + 1);

dateInput.min = tomorrow.toISOString().split("T")[0];
/*-------------------------------------
    NO BUTTON PLAYGROUND
--------------------------------------*/

const noZone = document.getElementById("noZone");

const dangerRadius = 170;
const panicRadius = 80;
const escapeCooldown = 60; // milliseconds
let lastEscapeTime = 0;

/*-------------------------------------
    EVASIVE NO BUTTON
--------------------------------------*/
const directions = [

    {x:  0, y: -1}, // Up
    {x:  1, y: -1}, // Up-right
    {x:  1, y:  0}, // Right
    {x:  1, y:  1}, // Down-right
    {x:  0, y:  1}, // Down
    {x: -1, y:  1}, // Down-left
    {x: -1, y:  0}, // Left
    {x: -1, y: -1}  // Up-left

];
function moveNoButton(mouseX, mouseY){

    const buttonRect = noBtn.getBoundingClientRect();

    const buttonCenterX = buttonRect.left + buttonRect.width / 2;
    const buttonCenterY = buttonRect.top + buttonRect.height / 2;
    let bestDirection = null;
let bestScore = -Infinity;

    // Direction from mouse to button
    let dx = buttonCenterX - mouseX;
    let dy = buttonCenterY - mouseY;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if(distance === 0) return;

    // Normalize the direction
    dx /= distance;
    dy /= distance;

    // Escape distance based on how close the mouse is

let jump;

// Panic!
if(distance <= 40){

    jump = 280;

}
// Very close
else if(distance <= 80){

    jump = 220;

}
// Close
else if(distance <= 120){

    jump = 160;

}
// Getting close
else{

    jump = 100;

}

    let newLeft = noBtn.offsetLeft + dx * jump;
    let newTop  = noBtn.offsetTop  + dy * jump;

    // Keep button inside the playground
    newLeft = Math.max(
        0,
        Math.min(newLeft, noZone.clientWidth - noBtn.offsetWidth)
    );

    newTop = Math.max(
        0,
        Math.min(newTop, noZone.clientHeight - noBtn.offsetHeight)
    );

    noBtn.style.left = newLeft + "px";
    noBtn.style.top  = newTop + "px";

}


/*-------------------------------------
    MOUSE DETECTION
--------------------------------------*/

noZone.addEventListener("mousemove", (event)=>{

    const buttonRect = noBtn.getBoundingClientRect();

    const centerX = buttonRect.left + buttonRect.width / 2;
    const centerY = buttonRect.top + buttonRect.height / 2;

    const dx = event.clientX - centerX;
    const dy = event.clientY - centerY;

    const distance = Math.sqrt(dx * dx + dy * dy);

    const now = Date.now();

if (
    distance < dangerRadius &&
    now - lastEscapeTime >= escapeCooldown
) {

    lastEscapeTime = now;
    moveNoButton(event.clientX, event.clientY);

}

});
/*-------------------------------------
    YES BUTTON
--------------------------------------*/

yesBtn.addEventListener("click", () => {

    launchConfetti();

    setTimeout(() => {

        showScreen("screen2");

    }, 1200);

});


/*-------------------------------------
    NEXT BUTTON
--------------------------------------*/

nextBtn.addEventListener("click", () => {

    showScreen("screen3");

});


/*-------------------------------------
    DATE & TIME
--------------------------------------*/

dateNext.addEventListener("click", () => {

    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    

    if (date === "") {

        alert("Please choose a date ❤️");
        return;

    }

    if (time === "") {

        alert("Please choose a time ❤️");
        return;

    }

    proposal.date = date;
    proposal.time = time;

    showScreen("screen4");

});


/*-------------------------------------
    FOOD SELECTION
--------------------------------------*/

const foodOptions = document.querySelectorAll(".food-options .option");

foodOptions.forEach(option => {

    option.addEventListener("click", () => {

        foodOptions.forEach(item => item.classList.remove("selected"));

        option.classList.add("selected");

        proposal.food = option.dataset.food;

        foodNext.disabled = false;
        foodNext.textContent = "Mmmm, sounds yummy!";

    });

});

foodNext.addEventListener("click", () => {

    if (proposal.food === "") {

        alert("Pick something yummy 😋");
        return;

    }

    showScreen("screen5");

});


/*-------------------------------------
    ACTIVITY SELECTION
--------------------------------------*/

const activityOptions = document.querySelectorAll(".activity-options .option");

activityOptions.forEach(option => {

    option.addEventListener("click", () => {

        activityOptions.forEach(item => item.classList.remove("selected"));

        option.classList.add("selected");

        proposal.activity = option.dataset.activity;

        activityNext.disabled = false;
        activityNext.textContent = "Sounds like a plan!";

    });

});

activityNext.addEventListener("click", () => {

    if (proposal.activity === "") {

        alert("Pick an activity ❤️");
        return;

    }
const selectedDate = new Date(proposal.date);

const formattedDate = selectedDate.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
});
const [hours, minutes] = proposal.time.split(":");

const selectedTime = new Date();

selectedTime.setHours(hours, minutes);

const formattedTime = selectedTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
});
   document.getElementById("summaryDate").textContent = formattedDate;
document.getElementById("summaryTime").textContent = formattedTime;
    document.getElementById("summaryFood").textContent = proposal.food;
    document.getElementById("summaryActivity").textContent = proposal.activity;
    document.getElementById("pickupMessage").innerHTML =
    `Be ready on <strong>${formattedDate}</strong> at <strong>${formattedTime}</strong>.<br>
     I'm coming to pick you up! 🚗❤️`;
    showScreen("screen6");

});
backBtns.forEach(button => {

    button.addEventListener("click", () => {

        const currentScreen = button.closest(".screen").id;

        switch(currentScreen){

            case "screen2":
                showScreen("screen1");
                break;

            case "screen3":
                showScreen("screen2");
                break;

            case "screen4":
                showScreen("screen3");
                break;

            case "screen5":
                showScreen("screen4");
                break;

            case "screen6":
                showScreen("screen5");
                break;

        }

    });

});
copyBtn.addEventListener("click", () => {

    const message =
`❤️ I accepted your date proposal! 🥰

📅 ${document.getElementById("summaryDate").textContent}
🕒 ${document.getElementById("summaryTime").textContent}

🍕 Food: ${document.getElementById("summaryFood").textContent}
🎉 Activity: ${document.getElementById("summaryActivity").textContent}

See you then! ❤️`;

    navigator.clipboard.writeText(message);

    alert("✅ Copied! Now send it to Emmanuel ❤️");

});