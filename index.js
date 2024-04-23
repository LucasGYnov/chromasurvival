// Initialize canvas and screen context
const CANVAS = document.querySelector('canvas');
const SCREEN = CANVAS.getContext('2d');
CANVAS.width = 1280;
CANVAS.height = 800;

// Define scaling factor for canvas
const scale = 3;
const scaledCanvas = {
    width: CANVAS.width / scale,
    height: CANVAS.height / scale,
};

// Define gravity
const GRAVITY = 0.5;

// Initialize checkpoint variables
let checkpointOffsetX = 0;
let checkpointOffsetY = 0;
let checkpointReached = false;
const uniqueBlockSize = 16; // Size of blocks

// Define key bindings
const keys = {
    gaucheInput: {
        pressed: false,
        key: 'q',
    },
    droiteInput: {
        pressed: false,
        key: 'd',
    },
    sauterInput: {
        pressed: false,
        key: ' ',
    },
    utiliserInput: {
        pressed: false,
        key: 'x',
    },
    utiliserSortInput: {
        pressed: false,
        key: 'n',
    },
};

// Event listener for when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Select DOM elements
    const sonCheckbox = document.querySelector('.son-checkbox');
    const mobileCheckbox = document.querySelector('.mobile-checkbox');
    const vibrationCheckbox = document.querySelector('.vibration-checkbox');
    const gaucheInput = document.getElementById('gauche');
    const droiteInput = document.getElementById('droite');
    const sauterInput = document.getElementById('sauter');
    const utiliserInput = document.getElementById('utiliser');
    const utiliserSortInput = document.getElementById('utiliser_sort');
    const saveButton = document.getElementById('save');
    const settingsPage = document.getElementById('settings_page');
    const settingsForm = document.getElementById('control_settings_form');

    // Function to update key bindings
    function updateKeyBindings() {
        keys.gaucheInput.key = gaucheInput.value;
        keys.droiteInput.key = droiteInput.value;
        keys.sauterInput.key = sauterInput.value;
        keys.utiliserInput.key = utiliserInput.value;
        keys.utiliserSortInput.key = utiliserSortInput.value;
    }

    // Function to save settings
    function saveSettings() {
        if (checkUniqueKeys()) {
            localStorage.setItem('son_enabled', sonCheckbox.checked);
            localStorage.setItem('mobile_enabled', mobileCheckbox.checked);
            localStorage.setItem('vibration_enabled', vibrationCheckbox.checked);
            localStorage.setItem('gauche_value', gaucheInput.value);
            localStorage.setItem('droite_value', droiteInput.value);
            localStorage.setItem('sauter_value', sauterInput.value);
            localStorage.setItem('utiliser_value', utiliserInput.value);
            localStorage.setItem('utiliser_sort_value', utiliserSortInput.value);
            settingsPage.style.zIndex = '-100';
            updateKeyBindings();
        } else {
            saveButton.value = "Impossible d'assigner différentes touches à une même";
            saveButton.style.color = 'red';
        }
    }

    // Function to load settings
    function loadSettings() {
        sonCheckbox.checked = JSON.parse(localStorage.getItem('son_enabled')) || false;
        mobileCheckbox.checked = JSON.parse(localStorage.getItem('mobile_enabled')) || false;
        vibrationCheckbox.checked = JSON.parse(localStorage.getItem('vibration_enabled')) || false;
        gaucheInput.value = localStorage.getItem('gauche_value') || 'q';
        droiteInput.value = localStorage.getItem('droite_value') || 'd';
        sauterInput.value = localStorage.getItem('sauter_value') || ' ';
        utiliserInput.value = localStorage.getItem('utiliser_value') || 'e';
        utiliserSortInput.value = localStorage.getItem('utiliser_sort_value') || 's';

        updateKeyBindings();
    }

    // Function to check if key bindings are unique
    function checkUniqueKeys() {
        const keysArray = [
            gaucheInput.value,
            droiteInput.value,
            sauterInput.value,
            utiliserInput.value,
            utiliserSortInput.value,
        ];
        const uniqueKeys = new Set(keysArray);
        return uniqueKeys.size === keysArray.length;
    }

    // Event listener for save button click
    saveButton.addEventListener('click', function (event) {
        event.preventDefault();
        saveSettings();
    });

    // Event listener for form submission
    settingsForm.addEventListener('submit', function (event) {
        event.preventDefault();
        saveSettings();
    });

    // Load settings on page load
    loadSettings();
});



// Get reference to the running sound element
const runningSound = document.getElementById('running-sound');
// Original volume level
const originalVolume = 1;
// Current volume level
let currentVolume = originalVolume;

// Function to gradually decrease volume
function decreaseVolume() {
    const decreaseRate = 0.3;

    // Interval to gradually decrease volume
    const interval = setInterval(() => {
        currentVolume -= decreaseRate;
        if (currentVolume <= 0) {
            clearInterval(interval);
            currentVolume = 0;
        }
        // Set the volume of the running sound
        runningSound.volume = currentVolume;
    }, 200);
}

// Function to reset volume to original level
function resetVolume() {
    currentVolume = 0.8; // Set volume to initial level
    runningSound.volume = currentVolume; // Set volume of running sound
    decreaseVolume(); // Decrease volume gradually
}

// Get reference to the jump sound element
const jumpSound = document.getElementById('jump-sound');

// Initialize touch button states
let leftButtonTouch = false;
let rightButtonTouch = false;
let jumpButtonTouch = false;
let powerButtonTouch = false;

// Function to move player left
function moveLeft() {
    player.velocity.x = -2.5; // Set player's horizontal velocity
    keys.gaucheInput.pressed = true; // Set left key pressed in input
    instructionCount++; // Increment instruction count
    updateInstructionText(instructionCount); // Update instruction text
    runningSound.play(); // Play running sound
}

// Function to move player right
function moveRight() {
    player.velocity.x = 2.5; // Set player's horizontal velocity
    keys.droiteInput.pressed = true; // Set right key pressed in input
    instructionCount++; // Increment instruction count
    updateInstructionText(instructionCount); // Update instruction text
    runningSound.play(); // Play running sound
}

// Function to make player jump
function jump() {
    // Check if player is on ground and not already jumping
    if (player.isOnGround && !player.velocity.y > 0) {
        player.velocity.y = -6.5; // Set player's vertical velocity for jump
        keys.sauterInput.pressed = true; // Set jump key pressed in input
        player.isOnGround = false; // Update player's on ground status
        instructionCount++; // Increment instruction count
        updateInstructionText(instructionCount); // Update instruction text
    }
}

// Function to use player's power
function usePower() {
    keys.utiliserSortInput.pressed = true; // Set power key pressed in input
    player.isInvertedColor = !player.isInvertedColor; // Toggle player's color inversion
    updatePowerLeftCounter(); // Update power left counter
    player.powerLeft--; // Decrement power left counter
}


// Variable to store the index of the connected gamepad
let controllerIndex = null;
// Array to store the previous states of gamepad buttons
let previousButtonStates = [];

// Event listener for when a gamepad is connected
window.addEventListener("gamepadconnected", (event) => {
  const gamepad = event.gamepad;
  controllerIndex = gamepad.index;
  // Initialize previousButtonStates array with false values for each button
  previousButtonStates = new Array(gamepad.buttons.length).fill(false);
  console.log("Controller connected:", gamepad.id);
});

// Event listener for when a gamepad is disconnected
window.addEventListener("gamepaddisconnected", (event) => {
  controllerIndex = null;
  console.log("Controller disconnected");
});

// Function to update the state of the connected gamepad
function updateGamepadState() {
  if (controllerIndex !== null) {
    const gamepad = navigator.getGamepads()[controllerIndex];
    
    // Movement controls
    const stickThreshold = 0.4;
    const stickLeftRight = gamepad.axes[0];
    const stickUpDown = gamepad.axes[1];

    // Horizontal movement
    if (stickLeftRight < -stickThreshold) {
      moveLeft();
    } else if (stickLeftRight > stickThreshold) {
      moveRight();
    } else {
      stopMovingHorizontally();
    }

    // Jump
    handleButtonPress(gamepad.buttons[1], jump, 1);

    // Special action control (using a chroma switch power)
    handleButtonPress(gamepad.buttons[0], usePower, 0);
  }
}

// Function to handle button presses on the gamepad
function handleButtonPress(button, action, index) {
  if (button.pressed && !previousButtonStates[index]) {
    action();
  }
  // Update the previous state of the button
  previousButtonStates[index] = button.pressed;
}

// Game loop to continuously update gamepad state
function gameLoop() {
  updateGamepadState();
  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();

// Function to stop horizontal movement
function stopMovingHorizontally() {
  player.velocity.x = 0;
  keys.gaucheInput.pressed = false;
  keys.droiteInput.pressed = false;
}

// Touch event listeners for left button
document.getElementById('left_button').addEventListener('touchstart', (event) => {
    event.preventDefault();
    leftButtonTouch = true;
    moveLeft();
    isRunning = true;
    runningSound.loop = true; 
    runningSound.play();
    resetVolume();
});

document.getElementById('left_button').addEventListener('touchend', () => {
    leftButtonTouch = false;
    keys.gaucheInput.pressed = false;
    runningSound.pause();
    runningSound.currentTime = 0;
});

// Touch event listeners for right button
document.getElementById('right_button').addEventListener('touchstart', (event) => {
    event.preventDefault();
    rightButtonTouch = true;
    moveRight();
    runningSound.loop = true; 
    runningSound.play();
    resetVolume();
});

document.getElementById('right_button').addEventListener('touchend', () => {
    rightButtonTouch = false;
    keys.droiteInput.pressed = false;
    runningSound.pause();
    runningSound.currentTime = 0;
});

// Touch event listeners for jump button
document.getElementById('jump_button').addEventListener('touchstart', (event) => {
    event.preventDefault();
    jumpButtonTouch = true;
    jump();
});

document.getElementById('jump_button').addEventListener('touchend', () => {
    jumpButtonTouch = false;
    keys.sauterInput.pressed = false;
});

// Touch event listeners for power button
document.getElementById('chroma_switch_button').addEventListener('touchstart', (event) => {
    event.preventDefault();
    if (player.powerLeft > 0) {
        powerButtonTouch = true;
        usePower();
    }
});

document.getElementById('chroma_switch_button').addEventListener('touchend', () => {
    powerButtonTouch = false;
    keys.utiliserSortInput.pressed = false;
});



// Variable to track whether the player is currently running
let isRunning = false;

// Event listener for keydown events
window.addEventListener('keydown', (event) => {
    // Check if the menu is open
    if (!isMenuOpen) {
        // Update power left counter
        updatePowerLeftCounter();
        // Check if the player is on the QG platform
        const isOnQG = player.checkQG();
        // Handle key presses
        switch (event.key) {
            // Left movement
            case keys.gaucheInput.key:
                player.velocity.x = -2.5;
                keys.gaucheInput.pressed = true;
                instructionCount++;
                updateInstructionText(instructionCount);
                // Start running sound if not already running
                if (!isRunning) {
                    isRunning = true;
                    runningSound.loop = true;
                    runningSound.play();
                    resetVolume()
                }
                break;
            // Right movement
            case keys.droiteInput.key:
                player.velocity.x = 2.5;
                keys.droiteInput.pressed = true;
                instructionCount++;
                updateInstructionText(instructionCount);
                // Start running sound if not already running
                if (!isRunning) {
                    isRunning = true;
                    runningSound.loop = true; 
                    runningSound.play();
                    resetVolume()
                }
                break;
            // Jump
            case keys.sauterInput.key:
                // Check if the player is on the ground and not currently jumping
                if (player.isOnGround && !(player.velocity.y > 0)) {
                    player.velocity.y = -6.5;
                    keys.sauterInput.pressed = true;
                    player.isOnGround = false;
                    instructionCount++;
                    updateInstructionText(instructionCount);
                    jumpSound.play();
                }
                break;
            // Use power
            case keys.utiliserSortInput.key:
                if (player.powerLeft > 0) {
                    keys.utiliserSortInput.pressed = true;
                    player.isInvertedColor = !player.isInvertedColor;
                    player.powerLeft--;
                    updatePowerLeftCounter();
                }
                break;
            default:
                break;
        }
    }
});

// Event listener for keyup events
window.addEventListener('keyup', (event) => {
    // Check if the menu is open
    if (!isMenuOpen) {
        hasMoved = true;
        // Handle key releases
        switch (event.key) {
            case keys.gaucheInput.key:
                keys.gaucheInput.pressed = false;
                break;
            case keys.droiteInput.key:
                keys.droiteInput.pressed = false;
                break;
            case keys.sauterInput.key:
                keys.sauterInput.pressed = false;
                break;
            case keys.utiliserInput.key:
                keys.utiliserInput.pressed = false;
                break;
            case keys.utiliserSortInput.key:
                keys.utiliserSortInput.pressed = false;
                break;
            default:
                break;
        }
        // Stop running sound if left or right key is released
        if (event.key === keys.gaucheInput.key || event.key === keys.droiteInput.key) {
            runningSound.pause();
            runningSound.currentTime = 0;
            isRunning = false;
        }
    }
});

// Event listener for when running sound ends
runningSound.addEventListener('ended', () => {
    runningSound.currentTime = 0;
    runningSound.play();
});

// Event listener for menu button click
var bouton = document.getElementById('menu_button');
var menu = document.getElementById('settings_page');

bouton.addEventListener('click', function () {
    menu.style.display = 'block';
    menu.style.zIndex = '-100';
});





// Create a new Image object for the background
const backgroundImage = new Image();
// Set the source of the background image
backgroundImage.src = 'img/bgMap.png';

// Get the QG (Quartier Général) element from the DOM
const qg = document.getElementById('qg');
// Variable to track if QG is displayed
let qgAffiche = false;

// Function to display the QG if the player is on it
function afficherQG() {
    const isOnQG = player.checkQG();
    // If player is on QG and QG is not displayed, show QG
    if (isOnQG && !qgAffiche) {
        qg.style.zIndex = '5';
        qgAffiche = true;
    } 
    // If player is not on QG and QG is displayed, hide QG
    else if ((!isOnQG) && qgAffiche) {
        qgAffiche = false;
    }
}

// Define a transparent color for the canvas
const TRANSPARENT_COLOR = 'rgba(0, 0, 0, 0)';

// Get the instruction element from the DOM
const instructionElement = document.querySelector('.instruction');
// Variables to track instruction states
let hasMoved = false;
let instructionCount = 0;
let initialInstructionCount = 0;
let instructionDisplayed = false;

// Function to update instruction text based on the count
function updateInstructionText(count) {
    // Display initial instructions after a delay
    if (!instructionDisplayed) {
        if (initialInstructionCount === 0) {
            setTimeout(() => {
                instructionElement.style.zIndex = '1';
                instructionElement.innerHTML = `
                <p class="intrcution-text">Welcome to the Deadly Contrast world, move in this world with the keys:</p>
                <div class="instruction-container">
                    <div class="instruction-key">
                        <div class="card-key">&nbsp&nbsp${keys.gaucheInput.key}</div> to move left.
                    </div>
                    <div class="instruction-key">
                        <div class="card-key">&nbsp&nbsp${keys.droiteInput.key}</div> to move right.
                    </div>
                    <div class="instruction-key">
                        <div class="card-key">${keys.sauterInput.key}</div> to jump.
                    </div>
                </div>
                `;
                initialInstructionCount = count;
                instructionDisplayed = true;
            }, 2500);
        }
    }
    
    // Hide initial instructions after player moves four times
    if (count >= initialInstructionCount + 4) {
        instructionElement.style.zIndex = '-1';
    }

    // Display Chroma Switch power instructions after a certain count
    if (count >= initialInstructionCount + 6) {
        instructionElement.style.zIndex = '1';
        instructionElement.innerHTML = `
        <p class="intrcution-text">You have a special power in this world:</p>
        <div class="instruction-container">
            <div class="instruction-key">
                <div class="card-key">&nbsp&nbsp${keys.utiliserSortInput.key}</div> to use the Chroma Switch power.
            </div>
            <p class="intrcution-text">You can move on blocks of a different color than you.</p>
        </div>
        `;
    }

    // Hide Chroma Switch power instructions after a certain count
    if (count >= initialInstructionCount + 10) {
        instructionElement.style.zIndex = '-1';
    }
}

// Initialize instruction text
updateInstructionText(0);


// Declaration of variables for different types of platforms and game elements
let platform; // General platform
let blackPlatform; // Platform with black color
let whitePlatform; // Platform with white color
let killPlatform; // Platform that kills the player
let qgPlatform; // Platform for the Quartier Général (QG)
let enemySpawn; // Spawn point for enemies
let bouncePlatform; // Platform that bounces the player
let checkpoint; // Checkpoint in the level

// Variables for map-related data
let mapImage = null; // Image of the map background
let playerSpawn = null; // Spawn point for the player
let bgImageHeight = null; // Height of the background image
let bgImageWidth = null; // Width of the background image
let camera = null; // Camera position
let positionMob = null; // Position of mobile elements (e.g., enemies)

// Variables for enemies and game settings
let enemieslevel1; // Enemies in level 1
let defaultPowerLeft; // Default power left for the player
let allPlatforms; // Array to store all platforms in the level



// Variable to store the current level
let level = 1;

// Object containing level configurations and initialization functions for each level
const levels = { // Same concept for all levels
    1: {
        // Initialization function for level 1
        init: () => {
            // Arrays to store different types of platforms and game elements
            platform = [];
            blackPlatform = [];
            whitePlatform = [];
            killPlatform = [];
            qgPlatform = [];
            enemieslevel1 = [];
            enemySpawn = [];
            bouncePlatform = [];
            checkpoint = [];

            // Load background map image for the level
            mapImage = new Sprite({
                position: {
                    x: 0,
                    y: 0,
                },
                imageSrc: './img/level0.png',
            });

            // Set dimensions of the background map image
            bgImageHeight = 1280 / 2;
            bgImageWidth = 800;

            // Set default power left for the player
            defaultPowerLeft = 6;

            // Set initial spawn point for the player
            playerSpawn = {
                x: 50,
                y: 200
            };

            // Set initial camera position
            camera = {
                position: {
                    x: 0,
                    y: -bgImageHeight + scaledCanvas.width + 60,
                },
            };

            // Set initial spawn point for enemies
            const enemySpawnPositions = [
                { x: 400, y: 284 },
                { x: 1136, y: 236 }
            ];

            // Create and configure the first enemy object
            enemySpawnPositions.forEach(spawnPosition => {
                const mob = new Enemy({
                    position: spawnPosition,
                    mobSpawn: spawnPosition,
                    collisionBlocks: platform,
                    blackPlatform,
                    whitePlatform,
                    imageSrc: "./img/Enemy.png",
                    frameRate: 6,
                    frameBuffer: 20
                });

                enemieslevel1.push(mob);
            });


            // Iterate over the platform symbols array for level 1 and create platforms accordingly
            for (let i = 0; i < platform_tuto.length; i += 80) {
                const row = platform_tuto.slice(i, i + 80);
                row.forEach((symbol, x) => {
                    const position = { x: x * 16, y: (i / 80) * 16 };
                    switch (symbol) {
                        case 12:
                            platform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                            break;
                        case 779:
                            blackPlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                            break;
                        case 776:
                            whitePlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                            break;
                        case 11:
                            qgPlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                            break;
                        case 241:
                            enemySpawn.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                            break;
                    }
                });
            }

            // Create black platforms based on the black platform symbols array for level 1
            blackPlatform_tuto.forEach((symbol, index) => {
                const position = { x: (index % 80) * 16, y: Math.floor(index / 80) * 16 };
                if (symbol === 779) {
                    blackPlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                }
            });

            // Create white platforms based on the white platform symbols array for level 1
            whitePlatform_tuto.forEach((symbol, index) => {
                const position = { x: (index % 80) * 16, y: Math.floor(index / 80) * 16 };
                if (symbol === 776) {
                    whitePlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                }
            });

            // Create kill platforms based on the kill block symbols array for level 1
            killBlock_tuto.forEach((symbol, index) => {
                const position = { x: (index % 80) * 16, y: Math.floor(index / 80) * 16 };
                if (symbol === 71) {
                    killPlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                }
            });

            // Create QG platforms based on the QG symbols array for level 1
            QG_tuto.forEach((symbol, index) => {
                const position = { x: (index % 80) * 16, y: Math.floor(index / 80) * 16 };
                if (symbol === 11) {
                    qgPlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                }
            });
        }
    },
    2: {
        init: () => {
            platform = [];
            blackPlatform = [];
            whitePlatform = [];
            killPlatform = [];
            qgPlatform = [];
            enemieslevel1 = [];
            enemySpawn = [];
            bouncePlatform = [];
            checkpoint = [];
            allPlatforms = [];
    
            allPlatforms = platform.concat(blackPlatform, whitePlatform);
    
            mapImage = new Sprite({
                position: {
                    x: 0,
                    y: 0,
                },
                imageSrc: './img/level1.png',
            });
    
            playerSpawn = {
                x: 50,
                y: 100
            };
    
            bgImageHeight = 3360 / 2.5;
            bgImageWidth = 1280;
    
            camera = {
                position: {
                    x: 0,
                    y: -bgImageHeight + 3360/2 - 300,
                },
            };
    
            defaultPowerLeft = 8 ;
    
            const enemySpawnPositions = [
                { x: 1936, y: 288 - 50},
                { x: 2032, y: 288 - 50},
                { x: 2144, y: 288- 50 },
                { x: 2240, y: 288 - 50},
                { x: 1024, y: 640- 50 },
                { x: 496, y: 656- 50 },
                { x: 576, y: 672- 50 },
                { x: 752, y: 736 - 50}
            ];
    
            enemySpawnPositions.forEach(spawnPosition => {
                const mob = new Enemy({
                    position: spawnPosition,
                    mobSpawn: spawnPosition,
                    collisionBlocks: allPlatforms,
                    blackPlatform,
                    whitePlatform,
                    imageSrc: "./img/Enemy.png",
                    frameRate: 6,
                    frameBuffer: 20
                });
    
                enemieslevel1.push(mob);
            });
    
            for (let i = 0; i < platform_level1.length; i += 210) {
                const row = platform_level1.slice(i, i + 210);
                row.forEach((symbol, x) => {
                    const position = { x: x * 16, y: (i / 210) * 16 };
                    switch (symbol) {
                        case 12:
                            platform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                            break;
                        case 779:
                            blackPlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                            break;
                        case 776:
                            whitePlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                            break;
                        case 11:
                            qgPlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                            break;
                        case 241:
                            enemySpawn.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                            break;
                        case 565:
                            bouncePlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                        default:
                            break;
                    }
                });
            }
    
            blackPlatform_level1.forEach((symbol, index) => {
                const position = { x: (index % 210) * 16, y: Math.floor(index / 210) * 16 };
                if (symbol === 779) {
                    blackPlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                }
            });
    
            whitePlatform_level1.forEach((symbol, index) => {
                const position = { x: (index % 210) * 16, y: Math.floor(index / 210) * 16 };
                if (symbol === 776) {
                    whitePlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                }
            });
    
            killBlock_level1.forEach((symbol, index) => {
                const position = { x: (index % 210) * 16, y: Math.floor(index / 210) * 16 };
                if (symbol === 71) {
                    killPlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                }
            });
    
            QG_level1.forEach((symbol, index) => {
                const position = { x: (index % 210) * 16, y: Math.floor(index / 210) * 16 };
                if (symbol === 11) {
                    qgPlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                }
            });
    
            enemy_level1.forEach((symbol, index) => {
                const position = { x: (index % 210) * 16, y: Math.floor(index / 210) * 16 };
                if (symbol === 241) {
                    enemySpawn.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                    console.log(`Bloc de spawn d'ennemi ajouté à la position : x = ${position.x}, y = ${position.y}`);
                }
            });
    
            bounce_level1.forEach((symbol, index) => {
                const position = { x: (index % 210) * 16, y: Math.floor(index / 210) * 16 };
                if (symbol === 565) {
                    bouncePlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                }
            });
        }
    },

    3: {
        init: () => {
            platform = [];
            blackPlatform = [];
            whitePlatform = [];
            killPlatform = [];
            qgPlatform = [];
            enemieslevel1 = [];
            enemySpawn = [];
            bouncePlatform = [];
            checkpoint = [];
            allPlatforms = [];
    
            allPlatforms = platform.concat(blackPlatform, whitePlatform);
    
            mapImage = new Sprite({
                position: {
                    x: 0,
                    y: 0,
                },
                imageSrc: './img/level2.png',
            });
    
            playerSpawn = {
                x: 30,
                y: 50
            };
            
            bgImageHeight = 3360 / 2.5;
            bgImageWidth = 1280;

            camera = {
                position: {
                    x: 0,
                    y: -bgImageHeight + 3360/2 - 750,
                },
            };

            defaultPowerLeft = 15;

            const enemySpawnPositions = [
                { x: 1936, y: 288 - 50},
                { x: 2032, y: 288 - 50},
                { x: 2144, y: 288- 50 },
                { x: 2240, y: 288 - 50},
                { x: 1024, y: 640- 50 },
                { x: 496, y: 656- 50 },
                { x: 576, y: 672- 50 },
                { x: 752, y: 736 - 50},
                { x: 2736, y: 384 },
                { x: 2496, y: 400 },
                { x: 1712, y: 432 },
                { x: 2448, y: 448 },
                { x: 1888, y: 464 },
                { x: 2112, y: 464 },
                { x: 2832, y: 480 },
                { x: 3024, y: 576 },
                { x: 1504, y: 656 },
                { x: 400, y: 736 },
                { x: 608, y: 736 },
                { x: 816, y: 864 },
                { x: 1008, y: 864 },
                { x: 1216, y: 864 }
            ];
    
            enemySpawnPositions.forEach(spawnPosition => {
                const mob = new Enemy({
                    position: spawnPosition,
                    mobSpawn: spawnPosition,
                    collisionBlocks: allPlatforms,
                    blackPlatform,
                    whitePlatform,
                    imageSrc: "./img/Enemy.png",
                    frameRate: 6,
                    frameBuffer: 20
                });
    
                enemieslevel1.push(mob);
            });
    
            
    
            for (let i = 0; i < platform_level2.length; i += 210) {
                const row = platform_level2.slice(i, i + 210);
                row.forEach((symbol, x) => {
                    const position = { x: x * 16, y: (i / 210) * 16 };
                    switch (symbol) {
                        case 12:
                            platform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                            break;
                        case 779:
                            blackPlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                            break;
                        case 776:
                            whitePlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                            break;
                        case 11:
                            qgPlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                            break;
                        case 241:
                            enemySpawn.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                            break;
                        case 565:
                            bouncePlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                        default:
                            break;
                    }
                });
            }
    
            blackPlatform_level2.forEach((symbol, index) => {
                const position = { x: (index % 210) * 16, y: Math.floor(index / 210) * 16 };
                if (symbol === 779) {
                    blackPlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                }
            });
    
            whitePlatform_level2.forEach((symbol, index) => {
                const position = { x: (index % 210) * 16, y: Math.floor(index / 210) * 16 };
                if (symbol === 776) {
                    whitePlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                }
            });
    
            killBlock_level2.forEach((symbol, index) => {
                const position = { x: (index % 210) * 16, y: Math.floor(index / 210) * 16 };
                if (symbol === 71) {
                    killPlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                }
            });
    
            QG_level2.forEach((symbol, index) => {
                const position = { x: (index % 210) * 16, y: Math.floor(index / 210) * 16 };
                if (symbol === 11) {
                    qgPlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                }
            });
    
            enemy_level2.forEach((symbol, index) => {
                const position = { x: (index % 210) * 16, y: Math.floor(index / 210) * 16 };
                if (symbol === 241) {
                    enemySpawn.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                    console.log(`Bloc de spawn d'ennemi ajouté à la position : x = ${position.x}, y = ${position.y}`);
                }
            });

            bounce_level2.forEach((symbol, index) => {
                const position = { x: (index % 210) * 16, y: Math.floor(index / 210) * 16 };
                if (symbol === 565) {
                    bouncePlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                }
            });
        }
    },

    4: {
        init: () => {
            platform = [];
            blackPlatform = [];
            whitePlatform = [];
            killPlatform = [];
            qgPlatform = [];
            enemieslevel1 = [];
            enemySpawn = [];
            bouncePlatform = [];
            checkpoint = [];
            allPlatforms = [];
    
            allPlatforms = platform.concat(blackPlatform, whitePlatform);
    
            mapImage = new Sprite({
                position: {
                    x: 0,
                    y: 0,
                },
                imageSrc: './img/level3.png',
            });
    
            playerSpawn = {
                x: 50,
                y: 50
            };
    
            bgImageHeight = 3360 / 2.5;
            bgImageWidth = 1280;
    
            camera = {
                position: {
                    x: 0,
                    y: -bgImageHeight + 3360/2 - 300,
                },
            };
    
            defaultPowerLeft = 15;

            const enemySpawnPositions = [
                { x: 1968, y: 128 },
                { x: 2336, y: 176 },
                { x: 2656, y: 368 },
                { x: 1680, y: 384 },
                { x: 1824, y: 384 },
                { x: 1984, y: 384 },
                { x: 2144, y: 384 },
                { x: 2288, y: 384 },
                { x: 2448, y: 384 },
                { x: 2608, y: 384 },
                { x: 2576, y: 400 },
                { x: 2656, y: 432 },
                { x: 2720, y: 528 },
                { x: 1056, y: 544 },
                { x: 1344, y: 576 },
                { x: 2368, y: 832 },
                { x: 2464, y: 832 },
                { x: 2544, y: 848 },
                { x: 2416, y: 864 },
                { x: 2688, y: 864 }
            ];
    
            enemySpawnPositions.forEach(spawnPosition => {
                const mob = new Enemy({
                    position: spawnPosition,
                    mobSpawn: spawnPosition,
                    collisionBlocks: allPlatforms,
                    blackPlatform,
                    whitePlatform,
                    imageSrc: "./img/Enemy.png",
                    frameRate: 6,
                    frameBuffer: 20
                });
    
                enemieslevel1.push(mob);
            });
    
            for (let i = 0; i < platform_level3.length; i += 210) {
                const row = platform_level3.slice(i, i + 210);
                row.forEach((symbol, x) => {
                    const position = { x: x * 16, y: (i / 210) * 16 };
                    switch (symbol) {
                        case 12:
                            platform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                            break;
                        case 779:
                            blackPlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                            break;
                        case 776:
                            whitePlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                            break;
                        case 11:
                            qgPlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                            break;
                        case 241:
                            enemySpawn.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                            break;
                        case 565:
                            bouncePlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                        case 813:
                            checkpoint.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                            break;
                        default:
                            break;
                    }
                });
            }
    
            blackPlatform_level3.forEach((symbol, index) => {
                const position = { x: (index % 210) * 16, y: Math.floor(index / 210) * 16 };
                if (symbol === 779) {
                    blackPlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                }
            });
    
            whitePlatform_level3.forEach((symbol, index) => {
                const position = { x: (index % 210) * 16, y: Math.floor(index / 210) * 16 };
                if (symbol === 776) {
                    whitePlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                }
            });
    
            killBlock_level3.forEach((symbol, index) => {
                const position = { x: (index % 210) * 16, y: Math.floor(index / 210) * 16 };
                if (symbol === 71) {
                    killPlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                }
            });
    
            QG_level3.forEach((symbol, index) => {
                const position = { x: (index % 210) * 16, y: Math.floor(index / 210) * 16 };
                if (symbol === 11) {
                    qgPlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                }
            });
    
            enemy_level3.forEach((symbol, index) => {
                const position = { x: (index % 210) * 16, y: Math.floor(index / 210) * 16 };
                if (symbol === 241) {
                    enemySpawn.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                    console.log(`Level 2 - Bloc de spawn d'ennemi ajouté à la position : x = ${position.x}, y = ${position.y}`);
                }
            });
    
            bounce_level3.forEach((symbol, index) => {
                const position = { x: (index % 210) * 16, y: Math.floor(index / 210) * 16 };
                if (symbol === 565) {
                    bouncePlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                }
            });
            checkpoint_level3.forEach((symbol, index) => {
                const position = { x: (index % 210) * 16, y: Math.floor(index / 210) * 16 };
                if (symbol === 813) {
                    checkpoint.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                    console.log(`Checkpoint ajouté à la position : x = ${position.x}, y = ${position.y}`);
                }
            });
        }
    },

    5: {
        init: () => {
            platform = [];
            blackPlatform = [];
            whitePlatform = [];
            killPlatform = [];
            qgPlatform = [];
            enemieslevel1 = [];
            enemySpawn = [];
            bouncePlatform = [];
            checkpoint = [];
            allPlatforms = [];

            allPlatforms = platform.concat(blackPlatform, whitePlatform);


            mapImage = new Sprite({
                position: {
                    x: 0,
                    y: 0,
                },
                imageSrc: './img/level4.png',
            });

            playerSpawn = {
                x: 50,
                y: 500
            };

            bgImageHeight = 3360 / 2.5;
            bgImageWidth = 1280;

            camera = {
                position: {
                    x: 0,
                    y: -bgImageHeight + 3360/2 - 800,
                },
            };

            defaultPowerLeft = 10;

            const enemySpawnPositions = [
                { x: 336 - 15, y: 272 - 200 },
                { x: 688 - 15, y: 272 - 200 },
                { x: 1056 - 15, y: 544 - 200 },
                { x: 1680 - 15, y: 544 - 200 },
                { x: 1344 - 15, y: 576 - 200 },
                { x: 608 - 15, y: 608 - 200 },
                { x: 672 - 15, y: 608 - 200 },
                { x: 736 - 15, y: 608 - 200 },
                { x: 816 - 15, y: 608 - 200 },
                { x: 2272 - 15, y: 608 - 200 },
                { x: 2448 - 15, y: 608 - 200 },
                { x: 2736 - 15, y: 928 - 200 },
                { x: 2912 - 15, y: 928 - 200 },
                { x: 3008 - 15, y: 928 - 200 },
                { x: 3136 - 15, y: 928 - 200 }
            ];
            
            
            
            enemySpawnPositions.forEach(spawnPosition => {
                const mob = new Enemy({
                    position: spawnPosition,
                    mobSpawn: spawnPosition,
                    collisionBlocks: allPlatforms,
                    blackPlatform,
                    whitePlatform,
                    imageSrc: "./img/Enemy.png",
                    frameRate: 6,
                    frameBuffer: 20
                });
            
                enemieslevel1.push(mob);
            });
            
            

            for (let i = 0; i < platform_level4.length; i += 210) {
                const row = platform_level4.slice(i, i + 210);
                row.forEach((symbol, x) => {
                    const position = { x: x * 16, y: (i / 210) * 16 };
                    switch (symbol) {
                        case 12:
                            platform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                            break;
                        case 779:
                            blackPlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                            break;
                        case 776:
                            whitePlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                            break;
                        case 11:
                            qgPlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                            break;
                        case 241:
                            enemySpawn.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                            break;
                        case 565:
                            bouncePlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                        default:
                            break;
                    }
                });
            }

    
            blackPlatform_level4.forEach((symbol, index) => {
                const position = { x: (index % 210) * 16, y: Math.floor(index / 210) * 16 };
                if (symbol === 779) {
                    blackPlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                }
            });
    
            whitePlatform_level4.forEach((symbol, index) => {
                const position = { x: (index % 210) * 16, y: Math.floor(index / 210) * 16 };
                if (symbol === 776) {
                    whitePlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                }
            });
    
            killBlock_level4.forEach((symbol, index) => {
                const position = { x: (index % 210) * 16, y: Math.floor(index / 210) * 16 };
                if (symbol === 71) {
                    killPlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                }
            });
    
            QG_level4.forEach((symbol, index) => {
                const position = { x: (index % 210) * 16, y: Math.floor(index / 210) * 16 };
                if (symbol === 11) {
                    qgPlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                }
            });

            bounce_level4.forEach((symbol, index) => {
                const position = { x: (index % 210) * 16, y: Math.floor(index / 210) * 16 };
                if (symbol === 565) {
                    bouncePlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                }
            });

            enemy_level4.forEach((symbol, index) => {
                const position = { x: (index % 210) * 16, y: Math.floor(index / 210) * 16 };
                if (symbol === 241) {
                enemySpawn.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                console.log(`Level 2 - Bloc de spawn d'ennemi ajouté à la position : x = ${position.x}, y = ${position.y}`);
            }
            });
        }
    },

    6: {
        init: () => {
            platform = [];
            blackPlatform = [];
            whitePlatform = [];
            killPlatform = [];
            qgPlatform = [];
            enemieslevel1 = [];
            enemySpawn = [];
            bouncePlatform = [];
            checkpoint = [];
            allPlatforms = [];
    
            allPlatforms = platform.concat(blackPlatform, whitePlatform);
    
            mapImage = new Sprite({
                position: {
                    x: 0,
                    y: 0,
                },
                imageSrc: './img/level5.png',
            });
    
            playerSpawn = {
                x: 50,
                y: 100
            };
    
            bgImageHeight = 3360 / 2.5;
            bgImageWidth = 1280;
    
            camera = {
                position: {
                    x: 0,
                    y: -bgImageHeight + 3360/2 - 300,
                },
            };
    
            defaultPowerLeft = 8;
    
            const enemySpawnPositions = [
                { x: 1936, y: 288 - 50},
                { x: 2032, y: 288 - 50},
                { x: 2144, y: 288- 50 },
                { x: 2240, y: 288 - 50},
                { x: 1024, y: 640- 50 },
                { x: 496, y: 656- 50 },
                { x: 576, y: 672- 50 },
                { x: 752, y: 736 - 50}
            ];
    
            enemySpawnPositions.forEach(spawnPosition => {
                const mob = new Enemy({
                    position: spawnPosition,
                    mobSpawn: spawnPosition,
                    collisionBlocks: allPlatforms,
                    blackPlatform,
                    whitePlatform,
                    imageSrc: "./img/Enemy.png",
                    frameRate: 6,
                    frameBuffer: 20
                });
    
                enemieslevel1.push(mob);
            });

    
            for (let i = 0; i < platform_level5.length; i += 210) {
                const row = platform_level5.slice(i, i + 210);
                row.forEach((symbol, x) => {
                    const position = { x: x * 16, y: (i / 210) * 16 };
                    switch (symbol) {
                        case 12:
                            platform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                            break;
                        case 779:
                            blackPlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                            break;
                        case 776:
                            whitePlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                            break;
                        case 11:
                            qgPlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                            break;
                        case 241:
                            enemySpawn.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                            break;
                        case 565:
                            bouncePlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                            break;
                        default:
                            break;
                    }
                });
            }
    
            // Génération des plateformes noires
            blackPlatform_level5.forEach((symbol, index) => {
                const position = { x: (index % 210) * 16, y: Math.floor(index / 210) * 16 };
                if (symbol === 779) {
                    blackPlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                }
            });
    
            // Génération des plateformes blanches
            whitePlatform_level5.forEach((symbol, index) => {
                const position = { x: (index % 210) * 16, y: Math.floor(index / 210) * 16 };
                if (symbol === 776) {
                    whitePlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                }
            });
    
            // Génération des plateformes de mort
            killBlock_level5.forEach((symbol, index) => {
                const position = { x: (index % 210) * 16, y: Math.floor(index / 210) * 16 };
                if (symbol === 71) {
                    killPlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                }
            });
    
            // Génération des plateformes de point de départ
            QG_level5.forEach((symbol, index) => {
                const position = { x: (index % 210) * 16, y: Math.floor(index / 210) * 16 };
                if (symbol === 11) {
                    qgPlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                }
            });
    
            // Génération des plateformes rebondissantes
            bounce_level5.forEach((symbol, index) => {
                const position = { x: (index % 210) * 16, y: Math.floor(index / 210) * 16 };
                if (symbol === 565) {
                    bouncePlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                }
            });

            enemy_level5.forEach((symbol, index) => {
                const position = { x: (index % 210) * 16, y: Math.floor(index / 210) * 16 };
                if (symbol === 241) {
                    enemySpawn.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                    console.log(`Bloc de spawn d'ennemi ajouté à la position : x = ${position.x}, y = ${position.y}`);
                }
            });
        }
    },
}

// Initialize the current level
levels[level].init();

// Event listeners for level selection buttons
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('click', () => {
        // Extract map name and lock status from button dataset
        const mapName = button.dataset.map;
        const isLocked = button.dataset.lock === 'true';

        // Check if the level is locked
        if (isLocked) {
            // Display overlay with transition effect
            const overlay = document.getElementById('overlay');
            overlay.style.display = 'block';
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 1s';
            overlay.offsetHeight;
            overlay.style.opacity = '1';

            // Load the selected map after a delay
            setTimeout(() => {
                loadMap(mapName);
            }, 1000);
        }
    });
});

// Event listener for selecting a map to save
const overlay = document.getElementById('overlay');
const saveMapButton = document.getElementById('save-map');
const levelButtons = document.querySelectorAll('.btn[data-map]');
let selectedMap = null;

levelButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Set the selected map and enable save button
        selectedMap = button.dataset.map;
        saveMapButton.disabled = false;
    });
});

// Event listener for saving the selected map
saveMapButton.addEventListener('click', () => {
    if (selectedMap !== null) {
        // Hide overlay and update player score after saving
        qg.style.zIndex = '-1';
        overlay.style.transition = 'opacity 1s';
        overlay.style.opacity = '0';
        saveMapButton.blur();
        updatePowerLeftCounter();
        playerScore += 500;
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 1000);
        selectedMap = null;
        saveMapButton.disabled = true;
    }
});

// Prevent saving if no map is selected
document.addEventListener('click', (event) => {
    if (event.target.id === 'save-map' && selectedMap === null) {
        event.preventDefault();
    }
});

// Disable save map button initially
saveMapButton.disabled = true;

// Event listener for resetting the current level
const resetLevelButton = document.getElementById('reset-level-button');
resetLevelButton.addEventListener('click', () => {
    // Deduct points and reset the level
    playerScore -= (250 + (player.powerLeft * 300));
    updateScoreDisplay();
    resetLevel();
    resetLevelButton.blur();
});

// Function to reset the current level
function resetLevel() {
    // Initialize the current level and load the map
    const mapNames = Object.keys(levels);
    const mapName = mapNames[level - 1];
    levels[level].init();
    loadMap(mapName);
    updatePowerLeftCounter();
    checkpointReached = false;
    player.playerSpawn.x = 50;
    player.playerSpawn.y = 500;
    checkpointOffsetX = 0;
    checkpointOffsetY = 0;
}


// Function to load a map based on the provided mapName
function loadMap(mapName) {
    // Award points based on remaining power
    if (player.powerLeft > 0) {
        playerScore += player.powerLeft * 300;
        updateScoreDisplay();
    }
    
    // Determine the map to load and initialize it
    switch (mapName) {
        case 'Guided Light':
            level = 1;
            levels[1].init();
            break;
        case 'Monochrome Meadows':
            level = 2;
            levels[2].init();
            CANVAS.width = 3360 / 2;
            CANVAS.height = 1280;
            document.getElementById('level2').dataset.lock = 'true';
            break;
        case 'Shadowy Swamps':
            level = 3;
            levels[3].init();
            CANVAS.width = 3360 / 2;
            CANVAS.height = 1280;
            document.getElementById('level3').dataset.lock = 'true';
            break;
        case 'Eclipsed Forest':
            level = 4;
            levels[4].init();
            CANVAS.width = 3360 / 2;
            CANVAS.height = 1280;
            document.getElementById('level4').dataset.lock = 'true';
            break;
        case 'Gloom Haven':
            level = 5;
            levels[5].init();
            CANVAS.width = 3360 / 2;
            CANVAS.height = 1280;
            document.getElementById('level5').dataset.lock = 'true';
            break;
        case 'Spectral Caverns':
            level = 6;
            levels[6].init();
            CANVAS.width = 3360 / 2;
            CANVAS.height = 1280;
            break;
        default:
            break;
    }
    
    // Reset player properties and spawn position
    player.isInvertedColor = false;
    player.collisionBlocks = platform.slice();
    player.whitePlatform = whitePlatform.slice();
    player.blackPlatform = blackPlatform.slice();
    player.killPlatform = killPlatform.slice();
    player.qgPlatform = qgPlatform.slice();
    player.bouncePlatform = bouncePlatform.slice();
    player.checkpoint = checkpoint.slice();
    player.powerLeft = defaultPowerLeft; 
    player.position = playerSpawn;
    player.velocity = { x: 0, y: 0 };
    checkpointReached = false;
    player.playerSpawn.x = 50;
    player.playerSpawn.y = 500;
    checkpointOffsetX = 0;
    checkpointOffsetY = 0;
}




// Element to display the player's score
const scoreDisplay = document.getElementById('scoreDisplay');
// Initial player score
let playerScore = 0;

// Function to update the displayed player score
function updateScoreDisplay() {
    scoreDisplay.textContent = `Score: ${playerScore}`;
}

// Create a new Player object with specified properties
const player = new Player({
    position: playerSpawn, // Initial position of the player
    playerSpawn: playerSpawn, // Player's spawn point
    collisionBlocks: platform, // Platforms the player can collide with
    whitePlatform, // White platforms
    blackPlatform, // Black platforms
    killPlatform, // Platforms that kill the player
    qgPlatform, // Platforms for the Quartier Général (QG)
    bouncePlatform: bouncePlatform, // Platforms that bounce the player
    imageSrc: "./img/Character/Idle.png", // Default image source for the player
    frameRate: 12, // Default frame rate for player animations
    powerLeft: defaultPowerLeft, // Default power left for the player
    animations: { // Animation configurations for the player
        Idle: { // Idle animation
            imageSrc: "./img/Character/Idle.png",
            frameRate: 12,
            frameBuffer: 5
        },
        IdleLeft: { // Idle animation for left direction
            imageSrc: "./img/Character/IdleLeft.png",
            frameRate: 12,
            frameBuffer: 5
        },
        Run: { // Running animation
            imageSrc: "./img/Character/Run.png",
            frameRate: 8,
            frameBuffer: 8
        },
        RunLeft: { // Running animation for left direction
            imageSrc: "./img/Character/RunLeft.png",
            frameRate: 8,
            frameBuffer: 5
        },
        Jump: { // Jumping animation
            imageSrc: "./img/Character/Jump.png",
            frameRate: 4,
            frameBuffer: 3
        },
        JumpLeft: { // Jumping animation for left direction
            imageSrc: "./img/Character/JumpLeft.png",
            frameRate: 4,
            frameBuffer: 3
        },
        Fall: { // Falling animation
            imageSrc: "./img/Character/Fall.png",
            frameRate: 3,
            frameBuffer: 15
        },
        FallLeft: { // Falling animation for left direction
            imageSrc: "./img/Character/FallLeft.png",
            frameRate: 3,
            frameBuffer: 15
        },
    },
    checkpoint: checkpoint, // Player's checkpoints
});





// Function to animate the game elements
function animate() {
    // Request animation frame to continue the animation loop
    window.requestAnimationFrame(animate);
    
    // Set background color
    SCREEN.fillStyle = 'grey';
    // Draw the background image
    SCREEN.drawImage(backgroundImage, 0, 0, CANVAS.width, CANVAS.height);

    // Save the current state of the canvas
    SCREEN.save();
    // Scale and translate the canvas based on camera position
    SCREEN.scale(scale, scale);
    SCREEN.translate(camera.position.x, camera.position.y);

    // Update the map image
    mapImage.update();

    // Update each platform in the platform array
    platform.forEach((platform) => {
        platform.update();
    });

    // Update each black platform
    blackPlatform.forEach((blackBlock) => {
        blackBlock.update();
    });

    // Update each white platform
    whitePlatform.forEach((whiteBlock) => {
        whiteBlock.update();
    });

    // Check for horizontal collision with canvas and update the player
    player.checkForHorizontalCollisionCanvas();
    player.update();

    // Reset horizontal velocity of the player
    player.velocity.x = 0; 

    // Move the player horizontally based on input keys
    if (keys.droiteInput.pressed) {
        player.switchSprite('Run');
        player.velocity.x = 2.5;
        player.lastDirection = 'right';
        player.cameraToTheLeft({ CANVAS, camera });
    } else if (keys.gaucheInput.pressed) {
        player.switchSprite('RunLeft');
        player.velocity.x = -2.5;
        player.lastDirection = 'left';
        player.cameraToTheRight({ CANVAS, camera });
    } else if (player.velocity.y === 0) {
        // If the player is not moving horizontally or vertically, switch to idle animation
        if (player.lastDirection === 'right') player.switchSprite('Idle');
        else player.switchSprite('IdleLeft');
    }

    // Handle player animation when jumping or falling
    if (player.velocity.y < 0) {
        // Player is jumping
        player.cameraToDown({ CANVAS, camera });
        if (player.lastDirection === 'right') player.switchSprite('Jump');
        else player.switchSprite('JumpLeft');
    } else if (player.velocity.y > 0) {
        // Player is falling
        player.cameraToUp({ CANVAS, camera });
        if (player.lastDirection === 'right') player.switchSprite('Fall');
        else player.switchSprite('FallLeft');
    }

    // Update enemies in level 1
    enemieslevel1.forEach((enemy) => {
        enemy.checkForHorizontalCollisionCanvas();
        enemy.update();
    });

    // Update the displayed score
    updateScoreDisplay();

    // Restore the canvas to its previous state
    SCREEN.restore(); 
}

// Start the animation loop
animate();







