// 1. Grab your existing leftdiv using its class name
const quizBox = document.querySelector('.leftdiv');

// 2. Create a new blank <div> element for the confetti piece
const piece = document.createElement('div');
piece.classList.add('confetti-piece');

// 3. Inject the piece directly inside your leftdiv
quizBox.appendChild(piece);

// 4. Place it horizontally right in the middle of your div
piece.style.left = '50%';
piece.style.transform = 'translateX(-50%)'; // Perfectly centers it at the 50% mark

// 5. Setup the starting vertical height (just above the top boundary)
let currentY = -15;

// 6. Start the falling loop engine
const animationTimer = setInterval(function() {
    currentY += 4; // Move down 4 pixels every 15 milliseconds
    piece.style.top = currentY + 'px';

    // 7. Check if it hit the bottom boundary of your leftdiv
    if (currentY >= quizBox.clientHeight) {
        clearInterval(animationTimer); // Stop the animation timer
        piece.remove();                 // Delete the piece from the page to clean up memory
    }
}, 15);
