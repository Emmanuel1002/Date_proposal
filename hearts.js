const heartsContainer = document.getElementById("hearts-container");

function createHeart(){

    const heart = document.createElement("div");

    heart.className = "heart";

    heart.textContent = "♥️";

    // Random horizontal position
    heart.style.left = Math.random() * window.innerWidth + "px";

    // Random size
    heart.style.fontSize = (30 + Math.random() * 22) + "px";

    // Random animation speed
    heart.style.animationDuration = (18 + Math.random() * 3) + "s";

    heartsContainer.appendChild(heart);

    heart.addEventListener("animationend", () => {
        heart.remove();
    });

}

// Create a new heart every n milliseconds
setInterval(createHeart,400);