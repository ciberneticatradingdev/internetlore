// Move copyCA function outside of DOMContentLoaded
function copyCA() {
    const ca = "CUZYhWEvuTYGofqXp7pHrmsvekhSLfV5cGo9P5d5pump";
    navigator.clipboard.writeText(ca).then(() => {
        const button = document.querySelector('.ca-button');
        button.classList.add('copied');
        setTimeout(() => {
            button.classList.remove('copied');
        }, 1000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = ca;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            const button = document.querySelector('.ca-button');
            button.classList.add('copied');
            setTimeout(() => {
                button.classList.remove('copied');
            }, 1000);
        } catch (err) {
            console.error('Fallback failed:', err);
        }
        document.body.removeChild(textarea);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const welcomeSection = document.querySelector('.section_welcome');
    const title = document.querySelector('.title');
    const continueButton = document.querySelector('.continue');
    const imagesContainer = document.querySelector('.images-container');
    const manifesto = document.querySelector('.manifesto');
    
    // Create background music instances and control variables
    let bgMusic = null;
    let bgMusic2 = null;
    let manifestoInitialized = false; // Flag to prevent multiple initializations
    let musicInitialized = false; // Flag to prevent multiple music initializations

    // Function to initialize both music tracks
    function initializeMusic() {
        if (musicInitialized) return; // Prevent multiple initializations
        musicInitialized = true;
        
        if (!bgMusic) {
            bgMusic = document.getElementById('bgMusic');
            bgMusic.volume = 0.5;
            bgMusic.loop = true;
            // Make sure bgMusic2 is paused initially
            document.getElementById('bgMusic2').pause();
        }
        if (!bgMusic2) {
            bgMusic2 = document.getElementById('bgMusic2');
            bgMusic2.volume = 0.5;
            bgMusic2.loop = true;
            // Make sure it's paused initially
            bgMusic2.pause();
        }
    }

    // Function to switch background music
    function switchBackgroundMusic(toSecondTrack) {
        if (!musicInitialized) return; // Don't switch if music isn't initialized
        
        if (toSecondTrack) {
            // Make sure to pause first before playing another track
            bgMusic.pause();
            // Reset the current time
            bgMusic2.currentTime = 0;
            // Small delay before playing to ensure the first track is fully paused
            setTimeout(() => {
                bgMusic2.play().catch(error => console.log("Audio switch failed:", error));
            }, 50);
            handleMarioAnimation(true); // Show Mario
        } else {
            // Make sure to pause first before playing another track
            bgMusic2.pause();
            // Reset the current time
            bgMusic.currentTime = 0;
            // Small delay before playing to ensure the second track is fully paused
            setTimeout(() => {
                bgMusic.play().catch(error => console.log("Audio switch failed:", error));
            }, 50);
            handleMarioAnimation(false); // Hide Mario
        }
    }

    // Function to handle manifesto timing
    function handleManifesto() {
        // Prevent multiple initializations
        if (manifestoInitialized) return;
        manifestoInitialized = true;
        
        // Remove the automatic timing loop and replace with toggle functionality
        const manifestButton = document.querySelector('.manifest-button');
        let manifestoVisible = false;

        if (manifestButton) {
            manifestButton.addEventListener('click', () => {
                if (!manifestoVisible) {
                    // Show manifesto
                    manifesto.classList.add('visible');
                    manifestButton.classList.add('active'); // Add active class to button
                    switchBackgroundMusic(true); // Switch to second track
                    manifestoVisible = true;
                    
                    // Disable pointer events for images when manifesto is visible
                    document.querySelectorAll('.random-image').forEach(img => {
                        img.style.pointerEvents = 'none';
                    });
                } else {
                    // Hide manifesto
                    manifesto.classList.remove('visible');
                    manifestButton.classList.remove('active'); // Remove active class from button
                    switchBackgroundMusic(false); // Switch back to first track
                    manifestoVisible = false;
                    
                    // Reset pointer events for images
                    document.querySelectorAll('.random-image').forEach(img => {
                        img.style.pointerEvents = 'all';
                    });
                }
            });
        }
    }

    // Show welcome section with fade in
    setTimeout(() => {
        title.style.opacity = 1;
        continueButton.style.opacity = 1;
    }, 1000);

    // Handle button hover and movement
    let moveCount = 0;
    let canClick = false;

    // Add array of random button texts
    const buttonTexts = ['Yep!', 'OK!', 'Yes!', 'Uuhkay!', 'Go!', 'Yip!', 'Bzzzz!', 'LFG!'];

    function moveButton(button) {
        if (moveCount < 5) {
            // Adjust for viewport size
            const buttonWidth = button.offsetWidth;
            const buttonHeight = button.offsetHeight;
            const maxX = window.innerWidth - buttonWidth;
            const maxY = window.innerHeight - buttonHeight;
            
            const randomX = Math.max(0, Math.min(maxX, Math.random() * maxX));
            const randomY = Math.max(0, Math.min(maxY, Math.random() * maxY));
            const randomText = buttonTexts[Math.floor(Math.random() * buttonTexts.length)];
            
            button.style.position = 'absolute';
            button.style.left = randomX + 'px';
            button.style.top = randomY + 'px';
            button.textContent = randomText;
            moveCount++;
        } else if (!canClick) {
            canClick = true;
            button.style.position = 'static';
            button.textContent = 'LFG!';
            // Add visual indicator for mobile users
            button.style.transform = 'scale(1.1)';
            button.style.backgroundColor = '#fff';
        }
    }

    // Add both mouse and touch events
    continueButton.addEventListener('mouseover', handleButtonInteraction);
    continueButton.addEventListener('touchstart', handleButtonInteraction);

    function handleButtonInteraction(e) {
        // Prevent default touch behavior
        e.preventDefault();
        
        if (moveCount < 5) {
            moveButton(this);
        }
    }

    // Update click/tap handler
    continueButton.addEventListener('click', handleButtonClick);
    continueButton.addEventListener('touchend', handleButtonClick);

    function handleButtonClick(e) {
        e.preventDefault();
        if (canClick || moveCount >= 5) {
            welcomeSection.style.display = 'none';
            imagesContainer.style.display = 'block';
            // Show both buttons
            document.querySelector('.ape-button-container').style.display = 'flex';
            document.querySelector('.ca-button-container').style.display = 'flex';
            
            // Initialize music only once
            if (!musicInitialized) {
                initializeMusic();
                bgMusic.play().catch(error => console.log("Initial audio failed:", error));
            }
            
            handleManifesto();
        }
    }

    // Add some mobile-specific styles
    if ('ontouchstart' in window) {
        continueButton.style.padding = '20px 50px'; // Larger touch target
        continueButton.style.fontSize = '1.8rem'; // Larger text
    }

    // Initialize random image positions and sounds
    const images = document.querySelectorAll('.random-image');
    const sounds = [
        'sounds/sound1.mp3',
        'sounds/sound2.mp3',
        'sounds/sound3.mp3',
        'sounds/sound4.mp3',
        'sounds/sound5.mp3',
        'sounds/sound6.mp3',
        'sounds/sound7.mp3',
        'sounds/sound8.mp3',
        'sounds/sound9.mp3',
        'sounds/sound10.mp3',
        'sounds/sound11.mp3',
        'sounds/sound12.mp3',
        'sounds/sound13.mp3',
        'sounds/sound14.mp3',
        'sounds/sound15.mp3',
        'sounds/sound16.mp3',
        'sounds/sound17.mp3',
        'sounds/sound18.mp3',
        'sounds/sound19.mp3',
        'sounds/sound20.mp3',
        'sounds/sound21.mp3',
        'sounds/sound22.mp3',
        'sounds/sound23.mp3',
        'sounds/sound24.mp3',
        'sounds/sound25.mp3',
        'sounds/sound26.mp3',
        'sounds/sound27.mp3',
    ];

    const weirdEffects = [
        {
            transform: 'rotate(1440deg) scale(2)',
            filter: 'invert(1) hue-rotate(270deg)',
            animation: 'spinAndGrow 1s infinite'
        },
        {
            transform: 'scale(0.5) skew(45deg)',
            filter: 'saturate(500%) contrast(200%)',
            animation: 'jellyShake 0.5s infinite'
        },
        {
            transform: 'translate(20px, -20px)',
            filter: 'blur(2px) brightness(200%)',
            animation: 'glitchEffect 0.3s infinite'
        },
        {
            transform: 'rotateZ(720deg) scale(1.5)',
            filter: 'sepia(100%) hue-rotate(90deg)',
            mixBlendMode: 'difference'
        },
        {
            animation: 'rainbowPulse 0.8s infinite',
            mixBlendMode: 'color-dodge'
        },
        {
            animation: 'crazyFlip 1s infinite',
            filter: 'brightness(200%) contrast(200%)'
        }
    ];

    // Add size variations
    const sizeVariations = [
        { min: 30, max: 80 },    // Small
        { min: 60, max: 120 },   // Medium
        { min: 100, max: 180 },  // Large
        { min: 150, max: 250 }   // Extra Large
    ];

    let canPlaySound = false;
    let lastPlayedTime = 0;
    const MIN_TIME_BETWEEN_SOUNDS = 300;

    // Initialize audio on first user interaction
    document.addEventListener('click', () => {
        canPlaySound = true;
    }, { once: true });

    images.forEach((image, index) => {
        // Random position
        image.style.top = Math.random() * window.innerHeight + 'px';
        image.style.left = Math.random() * window.innerWidth + 'px';

        // Random size
        const sizeRange = sizeVariations[Math.floor(Math.random() * sizeVariations.length)];
        const randomSize = Math.floor(Math.random() * (sizeRange.max - sizeRange.min) + sizeRange.min);
        image.style.width = `${randomSize}px`;
        image.style.height = 'auto'; // Maintain aspect ratio

        // Assign random weird effect
        const randomEffect = Math.floor(Math.random() * weirdEffects.length);
        
        // Create unique hover effect for each image
        image.addEventListener('mouseover', () => {
            if (canPlaySound) {
                const now = Date.now();
                if (now - lastPlayedTime > MIN_TIME_BETWEEN_SOUNDS) {
                    const audio = new Audio(sounds[index % sounds.length]);
                    audio.volume = 0.5;
                    audio.play().catch(error => console.log("Audio playback failed:", error));
                    lastPlayedTime = now;
                }
            }

            // Apply random weird effect
            Object.assign(image.style, weirdEffects[randomEffect]);
            
            if (Math.random() > 0.5) {
                image.style.mixBlendMode = ['multiply', 'screen', 'overlay', 'color-dodge'][Math.floor(Math.random() * 4)];
            }
        });

        // Update mouseout handler to only reset styles
        image.addEventListener('mouseout', () => {
            // Reset styles but keep the random size
            image.style.transform = '';
            image.style.filter = '';
            image.style.animation = '';
            image.style.mixBlendMode = 'normal';
            image.style.width = `${randomSize}px`;
        });

        // Random movement while maintaining size
        setInterval(() => {
            image.style.top = Math.random() * window.innerHeight + 'px';
            image.style.left = Math.random() * window.innerWidth + 'px';
            // Don't reset the width here to maintain the random size
        }, 2000);
    });

    function createShatterEffect() {
        const title = document.querySelector('.highlight');
        const text = title.textContent;
        title.textContent = ''; // Clear original text

        // Create spans for each letter
        [...text].forEach((letter, i) => {
            const span = document.createElement('span');
            span.textContent = letter;
            span.className = 'shatter-letter';
            span.style.setProperty('--delay', `${i * 0.1}s`);
            title.appendChild(span);
        });

        title.addEventListener('mouseover', () => {
            const letters = title.querySelectorAll('.shatter-letter');
            letters.forEach(letter => {
                const randomX = (Math.random() - 0.5) * 100;
                const randomY = (Math.random() - 0.5) * 100;
                const randomRotate = (Math.random() - 0.5) * 180;
                letter.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg)`;
                letter.style.opacity = 0.5 + Math.random() * 0.5; // Keep some visibility
                letter.style.color = Math.random() > 0.5 ? '#ffff00' : '#ffffff'; // Only yellow or white
                letter.style.textShadow = `0 0 ${Math.random() * 20}px rgba(255, 255, 0, 0.8)`;
            });
        });

        title.addEventListener('mouseout', () => {
            const letters = title.querySelectorAll('.shatter-letter');
            letters.forEach(letter => {
                letter.style.transform = 'translate(0, 0) rotate(0deg)';
                letter.style.opacity = 1;
                letter.style.color = '#ffff00';
                letter.style.textShadow = 'none';
            });
        });
    }

    // Call this function after your page loads
    createShatterEffect();

    // Add after your existing variables
    let marioInterval = null;

    // Function to handle Mario animation
    function handleMarioAnimation(show) {
        if (show) {
            const mario = document.createElement('img');
            mario.src = 'tumblr_28e5bb246cb572bc5f52bda217c17ca0_832c20a2_500.gif';
            mario.className = 'mario-animation';
            document.body.appendChild(mario);

            // Animate Mario randomly across the bottom
            marioInterval = setInterval(() => {
                const randomX = Math.random() * (window.innerWidth - 100);
                mario.style.left = `${randomX}px`;
            }, 3000);
        } else {
            const mario = document.querySelector('.mario-animation');
            if (mario) {
                mario.remove();
            }
            if (marioInterval) {
                clearInterval(marioInterval);
                marioInterval = null;
            }
        }
    }

    // Initialize sound loading when the page loads
    document.addEventListener('DOMContentLoaded', () => {
        // ... (existing DOMContentLoaded code)
        
        // Load sounds when user first interacts with the page
        document.addEventListener('click', () => {
            soundManager.loadSounds();
        }, { once: true });
    });
});