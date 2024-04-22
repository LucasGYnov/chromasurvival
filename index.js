/******************/
/* GENERALE GAME */
/******************/
const CANVAS = document.querySelector('canvas');
const SCREEN = CANVAS.getContext('2d');
CANVAS.width = 1280;
CANVAS.height = 800;

const scale = 3;
const scaledCanvas = {
    width: CANVAS.width / scale,
    height: CANVAS.height / scale,
};

const uniqueBlockSize = 16;

const GRAVITY = 0.5;

let checkpointOffsetX = 0;
let checkpointOffsetY = 0;
let checkpointReached = false;


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

document.addEventListener('DOMContentLoaded', function () {
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

    function updateKeyBindings() {
        keys.gaucheInput.key = gaucheInput.value;
        keys.droiteInput.key = droiteInput.value;
        keys.sauterInput.key = sauterInput.value;
        keys.utiliserInput.key = utiliserInput.value;
        keys.utiliserSortInput.key = utiliserSortInput.value;
    }

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

    saveButton.addEventListener('click', function (event) {
        event.preventDefault();
        saveSettings();
    });

    settingsForm.addEventListener('submit', function (event) {
        event.preventDefault();
        saveSettings();
    });

    loadSettings();
});

const runningSound = document.getElementById('running-sound');
const originalVolume = 1;
let currentVolume = originalVolume;

function decreaseVolume() {
    const decreaseRate = 0.3;

    const interval = setInterval(() => {
        currentVolume -= decreaseRate;
        if (currentVolume <= 0) {
            clearInterval(interval);
            currentVolume = 0;
        }
        runningSound.volume = currentVolume;
    }, 200);
}


function resetVolume() {
    currentVolume = 0.8;
    runningSound.volume = currentVolume;
    decreaseVolume();
}

const jumpSound = document.getElementById('jump-sound');


let leftButtonTouch = false;
let rightButtonTouch = false;
let jumpButtonTouch = false;
let powerButtonTouch = false;

function moveLeft() {
    player.velocity.x = -2.5;
    keys.gaucheInput.pressed = true;
    instructionCount++;
    updateInstructionText(instructionCount);
    runningSound.play();
}

function moveRight() {
    player.velocity.x = 2.5;
    keys.droiteInput.pressed = true;
    instructionCount++;
    updateInstructionText(instructionCount);
    runningSound.play();
}

function jump() {
    if (player.isOnGround && !player.velocity.y > 0) {
        player.velocity.y = -6.5;
        keys.sauterInput.pressed = true;
        player.isOnGround = false;
        instructionCount++;
        updateInstructionText(instructionCount);
    }
}

function usePower() {
    keys.utiliserSortInput.pressed = true;
    player.isInvertedColor = !player.isInvertedColor;
    updatePowerLeftCounter();
    player.powerLeft--;
}



document.getElementById('left_button').addEventListener('touchstart', (event) => {
    event.preventDefault();
    leftButtonTouch = true;
    moveLeft();
    isRunning = true;
    runningSound.loop = true; 
    runningSound.play();
    resetVolume()
});

document.getElementById('left_button').addEventListener('touchend', () => {
    leftButtonTouch = false;
    keys.gaucheInput.pressed = false;
    runningSound.pause();
    runningSound.currentTime = 0;
});

document.getElementById('right_button').addEventListener('touchstart', (event) => {
    event.preventDefault();
    rightButtonTouch = true;
    moveRight();
    runningSound.loop = true; 
    runningSound.play();
    resetVolume()
});

document.getElementById('right_button').addEventListener('touchend', () => {
    rightButtonTouch = false;
    keys.droiteInput.pressed = false;
    runningSound.pause();
    runningSound.currentTime = 0;
});

document.getElementById('jump_button').addEventListener('touchstart', (event) => {
    event.preventDefault();
    jumpButtonTouch = true;
    jump();
});

document.getElementById('jump_button').addEventListener('touchend', () => {
    jumpButtonTouch = false;
    keys.sauterInput.pressed = false;
});

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


let isRunning = false;

window.addEventListener('keydown', (event) => {
    if (!isMenuOpen) {
        updatePowerLeftCounter();
        const isOnQG = player.checkQG();
        switch (event.key) {
            case keys.gaucheInput.key:
                player.velocity.x = -2.5;
                keys.gaucheInput.pressed = true;
                instructionCount++;
                updateInstructionText(instructionCount);
                if (!isRunning) {
                    isRunning = true;
                    runningSound.loop = true;
                    runningSound.play();
                    resetVolume()
                }
                break;
            case keys.droiteInput.key:
                player.velocity.x = 2.5;
                keys.droiteInput.pressed = true;
                instructionCount++;
                updateInstructionText(instructionCount);
                if (!isRunning) {
                    isRunning = true;
                    runningSound.loop = true; 
                    runningSound.play();
                    resetVolume()
                }
                break;
            case keys.sauterInput.key:
                // if (player.isOnGround && !player.velocity.y > 0) {
                    player.velocity.y = -6.5;
                    keys.sauterInput.pressed = true;
                    player.isOnGround = false;
                    instructionCount++;
                    updateInstructionText(instructionCount);
                    jumpSound.play();
                // }
                break;
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

window.addEventListener('keyup', (event) => {
    if (!isMenuOpen) {
        hasMoved = true;
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
        if (event.key === keys.gaucheInput.key || event.key === keys.droiteInput.key) {
            runningSound.pause();
            runningSound.currentTime = 0;
            isRunning = false;
        }
    }
});

runningSound.addEventListener('ended', () => {
    runningSound.currentTime = 0;
    runningSound.play();
});

var bouton = document.getElementById('menu_button');
var menu = document.getElementById('settings_page');

bouton.addEventListener('click', function () {
    menu.style.display = 'block';
    menu.style.zIndex = '-100';
});






/******************/
/* GENERALE LEVEL */
/******************/
const backgroundImage = new Image(); //défintion image level
backgroundImage.src = 'img/bgMap.png'; // assignation image level

const qg = document.getElementById('qg');
let qgAffiche = false;
function afficherQG() {
    const isOnQG = player.checkQG();
    if (isOnQG && !qgAffiche) {
        qg.style.zIndex = '5';
        qgAffiche = true;
    } else if ((!isOnQG) && qgAffiche) {
        qgAffiche = false;
    }
}

const TRANSPARENT_COLOR = 'rgba(0, 0, 0, 0)';








//global platform


const instructionElement = document.querySelector('.instruction');
let hasMoved = false;
let instructionCount = 0;
let initialInstructionCount = 0;
let instructionDisplayed = false;

function updateInstructionText(count) {
    if (!instructionDisplayed) {
        if (initialInstructionCount === 0) {
            setTimeout(() => {
                instructionElement.style.zIndex = '1';
                instructionElement.innerHTML = `
                <p class="intrcution-text">Bienvenue dans le monde Contraste mortel, déplacez-vous dans ce monde avec les touches :</p>
                <div class="instruction-container">
                    <div class="instruction-key">
                        <div class="card-key">&nbsp&nbsp${keys.gaucheInput.key}</div> pour aller à gauche.
                    </div>
                    <div class="instruction-key">
                        <div class="card-key">&nbsp&nbsp${keys.droiteInput.key}</div> pour aller à droite.
                    </div>
                    <div class="instruction-key">
                        <div class="card-key">${keys.sauterInput.key}</div> pour sauter.
                    </div>
                </div>
                `;
                initialInstructionCount = count;
                instructionDisplayed = true;
            }, 2500);
        }
    }
    
    if (count >= initialInstructionCount + 4) {
        instructionElement.style.zIndex = '-1';
    }

    if (count >= initialInstructionCount + 6) {
        instructionElement.style.zIndex = '1';
        instructionElement.innerHTML = `
        <p class="intrcution-text"> Vous avez un pouvoir spécial en ce monde :</p>
        <div class="instruction-container">
            <div class="instruction-key">
                <div class="card-key">&nbsp&nbsp${keys.utiliserSortInput.key}</div> pour utiliser le pouvoir Chroma Switch.
            </div>
            <p class="intrcution-text"> Vous pouvez vous déplacer sur les blocs d'une couleur différente de vous.</p>
        </div>
        `;
    }

    if (count >= initialInstructionCount + 10) {
        instructionElement.style.zIndex = '-1';
    }
}

updateInstructionText(0);


let platform;
let blackPlatform;
let whitePlatform;
let killPlatform;
let qgPlatform;
let enemySpawn;
let bouncePlatform;
let checkpoint;

let mapImage = null;
let playerSpawn = null;
let bgImageHeight = null;
let bgImageWidth = null;
let camera = null;
let positionMob = null;

let enemieslevel1;
let defaultPowerLeft;
let allPlatforms;


let level = 1;
const levels = {
    1: {
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
            mapImage = new Sprite({
                position: {
                    x: 0,
                    y: 0,
                },
                imageSrc: './img/map3IMG.png',
            });

            bgImageHeight = 1280 / 2;
            bgImageWidth = 800;
            defaultPowerLeft = 6;

            playerSpawn = {
                x: 50,
                y: 200
            };

            camera = {
                position: {
                    x: 0,
                    y: -bgImageHeight + scaledCanvas.width + 60,
                },
            };

            mobSpawn = {
                x: 400,
                y: 284
            };

            const mob = new Enemy({
                position: mobSpawn,
                mobSpawn: mobSpawn,
                collisionBlocks: platform,
                blackPlatform,
                whitePlatform,
                imageSrc: "./img/Enemy.png",
                frameRate: 6,
                frameBuffer: 20
            });
            
            enemieslevel1.push(mob);
            
            const mob2Spawn = {
                x: 1136,
                y: 236
            };
            
            
            const mob2 = new Enemy({
                position: mob2Spawn,
                mobSpawn: mob2Spawn,
                collisionBlocks: platform,
                blackPlatform,
                whitePlatform,
                imageSrc: "./img/Enemy.png",
                frameRate: 6,
                frameBuffer: 20
            });
            
            enemieslevel1.push(mob2);

            for (let i = 0; i < floorCollision_1.length; i += 80) {
                const row = floorCollision_1.slice(i, i + 80);
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

            blackCollision_1.forEach((symbol, index) => {
                const position = { x: (index % 80) * 16, y: Math.floor(index / 80) * 16 };
                if (symbol === 779) {
                    blackPlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                }
            });

            whiteCollision_1.forEach((symbol, index) => {
                const position = { x: (index % 80) * 16, y: Math.floor(index / 80) * 16 };
                if (symbol === 776) {
                    whitePlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                }
            });

            killCollision_1.forEach((symbol, index) => {
                const position = { x: (index % 80) * 16, y: Math.floor(index / 80) * 16 };
                if (symbol === 71) {
                    killPlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                }
            });

            QGCollision_1.forEach((symbol, index) => {
                const position = { x: (index % 80) * 16, y: Math.floor(index / 80) * 16 };
                if (symbol === 11) {
                    qgPlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                }
            });

            enemy_1.forEach((symbol, index) => {
                const position = { x: (index % 80) * 16, y: Math.floor(index / 80) * 16 };
                if (symbol === 241) {
                enemySpawn.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                console.log(`Bloc de spawn d'ennemi ajouté à la position : x = ${position.x}, y = ${position.y}`);
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
                imageSrc: './img/monochromeMeadows.png',
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

            defaultPowerLeft = 20;

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
            
            

            for (let i = 0; i < floorCollision_2.length; i += 210) {
                const row = floorCollision_2.slice(i, i + 210);
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
                        case 813: // Ajout du checkpoint
                            checkpoint.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                            break;
                        default:
                            break;
                    }
                });
            }

    
            blackCollision_2.forEach((symbol, index) => {
                const position = { x: (index % 210) * 16, y: Math.floor(index / 210) * 16 };
                if (symbol === 779) {
                    blackPlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                }
            });
    
            whiteCollision_2.forEach((symbol, index) => {
                const position = { x: (index % 210) * 16, y: Math.floor(index / 210) * 16 };
                if (symbol === 776) {
                    whitePlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                }
            });
    
            killCollision_2.forEach((symbol, index) => {
                const position = { x: (index % 210) * 16, y: Math.floor(index / 210) * 16 };
                if (symbol === 71) {
                    killPlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                }
            });
    
            QGCollision_2.forEach((symbol, index) => {
                const position = { x: (index % 210) * 16, y: Math.floor(index / 210) * 16 };
                if (symbol === 11) {
                    qgPlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                }
            });

            enemy_2.forEach((symbol, index) => {
                const position = { x: (index % 210) * 16, y: Math.floor(index / 210) * 16 };
                if (symbol === 241) {
                enemySpawn.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                console.log(`Level 2 - Bloc de spawn d'ennemi ajouté à la position : x = ${position.x}, y = ${position.y}`);
            }
            });

            bounce_2.forEach((symbol, index) => {
                const position = { x: (index % 210) * 16, y: Math.floor(index / 210) * 16 };
                if (symbol === 565) {
                    bouncePlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                }
            });
            checkpoint_2.forEach((symbol, index) => {
                const position = { x: (index % 210) * 16, y: Math.floor(index / 210) * 16 };
                if (symbol === 813) {
                    checkpoint.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                    console.log(`Checkpoint ajouté à la position : x = ${position.x}, y = ${position.y}`);
                }
            });
        }
    }
}

levels[level].init();

const buttons = document.querySelectorAll('.btn');

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const mapName = button.dataset.map;
        const isLocked = button.dataset.lock === 'true';

        if (isLocked) {
            const overlay = document.getElementById('overlay');
            overlay.style.display = 'block';
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 1s';
            overlay.offsetHeight;

            overlay.style.opacity = '1';

            setTimeout(() => {
            loadMap(mapName);
        }, 1000);
        }
    });
});


const overlay = document.getElementById('overlay');
const saveMapButton = document.getElementById('save-map');
const levelButtons = document.querySelectorAll('.btn[data-map]');

let selectedMap = null;

levelButtons.forEach(button => {
    button.addEventListener('click', () => {
        selectedMap = button.dataset.map;
        saveMapButton.disabled = false;
    });
});

saveMapButton.addEventListener('click', () => {
    if (selectedMap !== null) {
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

document.addEventListener('click', (event) => {
    if (event.target.id === 'save-map' && selectedMap === null) {
        event.preventDefault();
    }
});

saveMapButton.disabled = true;







const resetLevelButton = document.getElementById('reset-level-button');

resetLevelButton.addEventListener('click', () => {
    playerScore -= (250 + (player.powerLeft * 300));
    updateScoreDisplay();
    resetLevel();
    resetLevelButton.blur();
});




function resetLevel() {
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





function loadMap(mapName) {
    if (player.powerLeft > 0) {
        playerScore += player.powerLeft * 300;
        updateScoreDisplay();
    }
    if (mapName === 'Guided Light') {
        level = 1;
        levels[1].init();
    }
    if (mapName === 'Monochrome Meadows') {
        level = 2;
        levels[2].init();
        CANVAS.width = 3360 / 2;
        CANVAS.height = 1280;
    }

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
    player.powerLeft = defaultPowerLeft;
    checkpointReached = false;
    player.playerSpawn.x = 50;
    player.playerSpawn.y = 500;
    checkpointOffsetX = 0;
    checkpointOffsetY = 0;
}


const scoreDisplay = document.getElementById('scoreDisplay');
let playerScore = 0;

function updateScoreDisplay() {
    scoreDisplay.textContent = `Score: ${playerScore}`;
}


const player = new Player({
    position: playerSpawn,
    playerSpawn: playerSpawn,
    collisionBlocks: platform,
    whitePlatform,
    blackPlatform,
    killPlatform,
    qgPlatform,
    bouncePlatform: bouncePlatform,
    imageSrc: "./img/Character/Idle.png",
    frameRate: 12,
    powerLeft: defaultPowerLeft,
    animations: {
        Idle: {
            imageSrc: "./img/Character/Idle.png",
            frameRate: 12,
            frameBuffer: 5
        },
        IdleLeft: {
            imageSrc: "./img/Character/IdleLeft.png",
            frameRate: 12,
            frameBuffer: 5
        },
        Run: {
            imageSrc: "./img/Character/Run.png",
            frameRate: 8,
            frameBuffer: 8
        },
        RunLeft: {
            imageSrc: "./img/Character/RunLeft.png",
            frameRate: 8,
            frameBuffer: 5
        },
        Jump: {
            imageSrc: "./img/Character/Jump.png",
            frameRate: 4,
            frameBuffer: 3
        },
        JumpLeft: {
            imageSrc: "./img/Character/JumpLeft.png",
            frameRate: 4,
            frameBuffer: 3
        },
        Fall: {
            imageSrc: "./img/Character/Fall.png",
            frameRate: 3,
            frameBuffer: 15
        },
        FallLeft: {
            imageSrc: "./img/Character/FallLeft.png",
            frameRate: 3,
            frameBuffer: 15
        },
    },
    checkpoint: checkpoint,
});





function animate() {
    window.requestAnimationFrame(animate);
    SCREEN.fillStyle = 'grey';
    SCREEN.drawImage(backgroundImage, 0, 0, CANVAS.width, CANVAS.height);

    SCREEN.save();
    SCREEN.scale(scale, scale);
    SCREEN.translate(camera.position.x,camera.position.y);
    mapImage.update();
    platform.forEach((platform) => {
        platform.update();
    });
    blackPlatform.forEach((blakcBlock) => {
        blakcBlock.update();
    });
    whitePlatform.forEach((whiteBlock) => {
        whiteBlock.update();
    });

    player.checkForHorizontalCollisionCanvas()
    player.update();

    player.velocity.x = 0; 
    if(keys.droiteInput.pressed) {
        player.switchSprite('Run')
        player.velocity.x = 2.5
        player.lastDirection = 'right'
        player.cameraToTheLeft({CANVAS, camera})

    } else if(keys.gaucheInput.pressed) {
        player.switchSprite('RunLeft')
        player.velocity.x = -2.5
        player.lastDirection = 'left'
        player.cameraToTheRight({CANVAS, camera})
    }
    else if (player.velocity.y === 0){
        if(player.lastDirection === 'right') player.switchSprite('Idle')
        else player.switchSprite('IdleLeft')
    }

    if (player.velocity.y < 0) {
        player.cameraToDown({CANVAS, camera})
        if(player.lastDirection === 'right') player.switchSprite('Jump')
        else player.switchSprite('JumpLeft')
    }
    else if(player.velocity.y > 0) {
        player.cameraToUp({CANVAS, camera})
        if(player.lastDirection === 'right')
            player.switchSprite('Fall')
        else player.switchSprite('FallLeft')
    }

        enemieslevel1.forEach((enemy) => {
            enemy.checkForHorizontalCollisionCanvas();
            enemy.update();
        });
    updateScoreDisplay()

    SCREEN.restore(); 
}

animate();






