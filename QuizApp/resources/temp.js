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


// Example usage: Trigger when they click a button
document.getElementById('submitBtn').addEventListener('click', () => {
  // if (answerIsCorrect) {
  triggerConfetti();
  // }
});

function triggerConfetti() {
  const container = document.body; // or your quiz container element
  const totalPieces = 40; // Adjust how dense you want the shower to be

  for (let i = 0; i < totalPieces; i++) {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');

    // 1. Randomize color class (1 through 5)
    const randomColor = Math.floor(Math.random() * 5) + 1;
    confetti.classList.add(`color-${randomColor}`);

    // 2. Randomize starting horizontal position across the screen width (0% to 100%)
    confetti.style.left = Math.random() * 100 + 'vw';

    // 3. Randomize delay so they don't all drop at the exact same millisecond
    confetti.style.animationDelay = Math.random() * 2 + 's';

    // 4. Randomize speed slightly (between 2.5 and 4.5 seconds)
    confetti.style.animationDuration = (Math.random() * 2 + 2.5) + 's';

    // Add to page
    container.appendChild(confetti);

    // Clean up DOM after animation finishes so the page doesn't get slow
    setTimeout(() => {
      confetti.remove();
    }, 5000); 
  }
}


