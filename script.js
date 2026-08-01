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
    BUTTONS & INPUTS
--------------------------------------*/

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const nextBtn = document.getElementById("nextBtn");
const dateNext = document.getElementById("dateNext");
const foodNext = document.getElementById("foodNext");
const activityNext = document.getElementById("activityNext");
const backBtns = document.querySelectorAll(".back-btn");
const dateInput = document.getElementById("date");
const copyBtn = document.getElementById("copyBtn");

// Set minimum date to tomorrow
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
dateInput.min = tomorrow.toISOString().split("T")[0];

/*-------------------------------------
    EVASIVE NO BUTTON LOGIC (FULL-SCREEN)
--------------------------------------*/

const dangerRadius = 170;
const escapeCooldown = 60; // milliseconds
let lastEscapeTime = 0;

function ensureFixedPosition() {
    if (noBtn.style.position !== "fixed") {
        const rect = noBtn.getBoundingClientRect();
        noBtn.style.position = "fixed";
        noBtn.style.left = `${rect.left}px`;
        noBtn.style.top = `${rect.top}px`;
        noBtn.style.margin = "0";
    }
}

function moveNoButton(mouseX, mouseY) {
    ensureFixedPosition();

    const buttonRect = noBtn.getBoundingClientRect();
    const buttonCenterX = buttonRect.left + buttonRect.width / 2;
    const buttonCenterY = buttonRect.top + buttonRect.height / 2;

    let dx = buttonCenterX - mouseX;
    let dy = buttonCenterY - mouseY;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance === 0) return;

    // Normalize direction
    dx /= distance;
    dy /= distance;

    let jump;
    if (distance <= 40) jump = 280;
    else if (distance <= 80) jump = 220;
    else if (distance <= 120) jump = 160;
    else jump = 100;

    let newLeft = buttonRect.left + dx * jump;
    let newTop = buttonRect.top + dy * jump;

    // Keep button safely inside full browser viewport padding (20px margin)
    const padding = 20;
    const maxLeft = window.innerWidth - buttonRect.width - padding;
    const maxTop = window.innerHeight - buttonRect.height - padding;

    newLeft = Math.max(padding, Math.min(newLeft, maxLeft));
    newTop = Math.max(padding, Math.min(newTop, maxTop));

    noBtn.style.left = `${newLeft}px`;
    noBtn.style.top = `${newTop}px`;
}

// Random jump helper across full screen (ideal for mobile touch)
function jumpRandomly() {
    ensureFixedPosition();

    const buttonRect = noBtn.getBoundingClientRect();
    const padding = 20;

    const maxX = window.innerWidth - buttonRect.width - padding;
    const maxY = window.innerHeight - buttonRect.height - padding;

    const randomLeft = Math.floor(Math.random() * (maxX - padding)) + padding;
    const randomTop = Math.floor(Math.random() * (maxY - padding)) + padding;

    noBtn.style.left = `${randomLeft}px`;
    noBtn.style.top = `${randomTop}px`;
}

/*-------------------------------------
    MOUSE & TOUCH DETECTION
--------------------------------------*/

// Global mouse tracking so it dodges anywhere on screen
document.addEventListener("mousemove", (event) => {
    // Only dodge if Screen 1 is active
    const screen1 = document.getElementById("screen1");
    if (!screen1 || !screen1.classList.contains("active")) return;

    const buttonRect = noBtn.getBoundingClientRect();
    const centerX = buttonRect.left + buttonRect.width / 2;
    const centerY = buttonRect.top + buttonRect.height / 2;

    const dx = event.clientX - centerX;
    const dy = event.clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const now = Date.now();

    if (distance < dangerRadius && now - lastEscapeTime >= escapeCooldown) {
        lastEscapeTime = now;
        moveNoButton(event.clientX, event.clientY);
    }
});

// Mobile touch evasion
noBtn.addEventListener("touchstart", (e) => {
    e.preventDefault(); // Prevents touch from turning into a click event
    jumpRandomly();
});

/*-------------------------------------
    YES BUTTON
--------------------------------------*/

yesBtn.addEventListener("click", () => {
    if (typeof launchConfetti === "function") {
        launchConfetti();
    }

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

    if (!date) {
        alert("Please choose a date ❤️");
        return;
    }

    if (!time) {
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
    if (!proposal.food) {
        alert("Pick something yummy 😋");
        return;
    }

    showScreen("screen5");
});

/*-------------------------------------
    ACTIVITY SELECTION & SUMMARY
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
    if (!proposal.activity) {
        alert("Pick an activity ❤️");
        return;
    }

    // Format Date accurately in local timezone
    const [year, month, day] = proposal.date.split("-");
    const selectedDate = new Date(year, month - 1, day);

    const formattedDate = selectedDate.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    // Format Time
    const [hours, minutes] = proposal.time.split(":");
    const selectedTime = new Date();
    selectedTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));

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

/*-------------------------------------
    BACK BUTTONS
--------------------------------------*/

backBtns.forEach(button => {
    button.addEventListener("click", () => {
        const currentScreen = button.closest(".screen").id;

        // Reset No button position when returning to screen 1
        if (currentScreen === "screen2") {
            noBtn.style.position = "relative";
            noBtn.style.left = "auto";
            noBtn.style.top = "auto";
        }

        switch (currentScreen) {
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

/*-------------------------------------
    COPY SUMMARY BUTTON
--------------------------------------*/

copyBtn.addEventListener("click", () => {
    const message =
`❤️ I accepted your date proposal! 🥰

📅 ${document.getElementById("summaryDate").textContent}
🕒 ${document.getElementById("summaryTime").textContent}

🍕 Food: ${document.getElementById("summaryFood").textContent}
🎉 Activity: ${document.getElementById("summaryActivity").textContent}

See you then! ❤️`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(message).then(() => {
            alert("✅ Copied! Now send it over! ❤️");
        }).catch(() => {
            alert("✅ Summary ready to copy!");
        });
    } else {
        alert("✅ Copied! Now send it over! ❤️");
    }
});
