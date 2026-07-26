function launchConfetti() {

    confetti({
        particleCount: 500,   // Number of confetti pieces
        spread: 90,           // Width of the explosion
        origin: {
            y: 0.6            // Where it starts vertically
        }
    });

}