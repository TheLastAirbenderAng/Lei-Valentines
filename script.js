const heartsContainer = document.querySelector('.hearts-container');
const heartsContainerRejection = document.querySelector('.hearts-container-rejection');

// List of all heart images in the folder
const heartImages = [
    'yellow_hearts/heart1.png',
    'yellow_hearts/heart2.png',
    'yellow_hearts/heart3.png',
    'yellow_hearts/heart4.png'
];

function createHeart(container) {
    const heart = document.createElement('img');
    
    // Pick a random image from the list
    const randomImage = heartImages[Math.floor(Math.random() * heartImages.length)];
    heart.src = randomImage;
    
    heart.classList.add('heart');
    
    // Random position
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.top = Math.random() * 100 + 'vh';
    
    // Random size
    const size = Math.random() * 50 + 30 + 'px';
    heart.style.width = size;
    heart.style.height = 'auto';
    
    // Random rotation for variety
    heart.style.transform = `rotate(${Math.random() * 360}deg)`;
    
    // Random animation delay
    heart.style.animationDelay = Math.random() * 5 + 's';
    
    container.appendChild(heart);
}

// Create 40 random hearts for main page
for (let i = 0; i < 40; i++) {
    createHeart(heartsContainer);
}

// Create 40 random hearts for rejection page
for (let i = 0; i < 40; i++) {
    createHeart(heartsContainerRejection);
}

// Yes button -> open Google Form
document.getElementById('yesBtn').addEventListener('click', function() {
    window.open('https://forms.gle/YTETJWAaUNQWsvU2A', '_blank');
});

// No button -> show modal
document.getElementById('noBtn').addEventListener('click', function() {
    document.getElementById('modal').classList.add('visible');
});

// Modal "No, go back" -> hide modal
document.getElementById('modalNo').addEventListener('click', function() {
    document.getElementById('modal').classList.remove('visible');
});

// Modal "Yes, I'm sure" -> show rejection screen and send email notification
document.getElementById('modalYes').addEventListener('click', function() {
    document.getElementById('modal').classList.remove('visible');
    document.getElementById('rejection-screen').classList.add('visible');
    
    // Send email notification via EmailJS
    emailjs.init('4nvc3xqpANDBzlqjw');
    
    const message = `Hey Jack,

Lei clicked "Yes, I'm sure" on the rejection modal.

Time: ${new Date().toLocaleString()}

Double check:
- Did she answer the Google Form?
- Was she just messing with the website?
- Did she truly mean no?

Good luck! 💛`;
    
    emailjs.send('service_vex0zgu', 'template_4s5knkk', {
        message: message
    }).then(function() {
        console.log('Email notification sent!');
    }).catch(function(error) {
        console.log('Email failed to send:', error);
    });
});





// No button escape logic
const noBtn = document.getElementById('noBtn');
const detectionRadius = 50; // Detection radius in pixels
const escapeDistance = 80; // How far to teleport
const edgePadding = 10; // Keep away from screen edges
let escapeCount = 0;
const maxEscapes = 11; // Button can be clicked after 11 escapes
let isEscaping = false; // Cooldown flag

// Track total offset from original position
let offsetX = 0;
let offsetY = 0;
let originalRect = null;

document.addEventListener('mousemove', function(event) {
    // If already escaped 7 times, button is now clickable
    if (escapeCount >= maxEscapes) return;
    
    // If currently in cooldown, skip
    if (isEscaping) return;
    
    // Get current visual position using getBoundingClientRect (always accurate)
    const rect = noBtn.getBoundingClientRect();
    
    // Store original position on first run
    if (originalRect === null) {
        originalRect = {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height
        };
    }
    
    const buttonCenterX = rect.left + rect.width / 2;
    const buttonCenterY = rect.top + rect.height / 2;
    
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    
    // Calculate distance between mouse and button center
    const distance = Math.sqrt(
        Math.pow(mouseX - buttonCenterX, 2) + 
        Math.pow(mouseY - buttonCenterY, 2)
    );
    
    // If mouse enters detection radius
    if (distance < detectionRadius) {
        // Set cooldown
        isEscaping = true;
        
        // Calculate direction from mouse to button (this is the escape direction)
        let directionX = buttonCenterX - mouseX;
        let directionY = buttonCenterY - mouseY;
        
        // Handle edge case: mouse exactly on button center
        if (directionX === 0 && directionY === 0) {
            directionX = 1;
            directionY = 0;
        }
        
        // Normalize to get unit vector
        const length = Math.sqrt(directionX * directionX + directionY * directionY);
        const normalizedX = directionX / length;
        const normalizedY = directionY / length;
        
        // Calculate new offset
        offsetX += normalizedX * escapeDistance;
        offsetY += normalizedY * escapeDistance;
        
        // Calculate where button would be with this offset
        let newLeft = originalRect.left + offsetX;
        let newTop = originalRect.top + offsetY;
        
        // Screen bounds with padding
        const minX = edgePadding;
        const minY = edgePadding;
        const maxX = window.innerWidth - originalRect.width - edgePadding;
        const maxY = window.innerHeight - originalRect.height - edgePadding;
        
        // Clamp to screen bounds and adjust offset accordingly
        if (newLeft < minX) { offsetX = minX - originalRect.left; }
        if (newLeft > maxX) { offsetX = maxX - originalRect.left; }
        if (newTop < minY) { offsetY = minY - originalRect.top; }
        if (newTop > maxY) { offsetY = maxY - originalRect.top; }
        
        // Apply using transform (more reliable than left/top)
        noBtn.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        
        // Increment escape count
        escapeCount++;
        console.log('Escape count:', escapeCount, '/', maxEscapes);
        
        // Release cooldown after a short delay
        setTimeout(function() {
            isEscaping = false;
        }, 100);
    }
});