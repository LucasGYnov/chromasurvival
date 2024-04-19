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

window.addEventListener('keydown', (event) => {
    if (!isMenuOpen) {
        const isOnQG = player.checkQG();
        switch (event.key) {
            case keys.gaucheInput.key:
                player.velocity.x = -2.5;
                keys.gaucheInput.pressed = true;
                instructionCount++;
                updateInstructionText(instructionCount);
                runningSound.play();
                break;
            case keys.droiteInput.key:
                player.velocity.x = 2.5;
                keys.droiteInput.pressed = true;
                instructionCount++;
                updateInstructionText(instructionCount);
                runningSound.play();
                break;
            case keys.sauterInput.key:
    if (player.isOnGround && !player.velocity.y > 0) {
        player.velocity.y = -6.5;
        keys.sauterInput.pressed = true;
        player.isOnGround = false;
        instructionCount++;
        updateInstructionText(instructionCount);
    }
    break;
                break;
                case keys.utiliserInput.key:
                    keys.utiliserInput.pressed = true;
                    break;
            case keys.utiliserSortInput.key:
                keys.utiliserSortInput.pressed = true;
                player.isInvertedColor = !player.isInvertedColor;
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
    runningSound.pause();
    runningSound.currentTime = 0;
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

let mapImage = null;
let playerSpawn = null;
let bgImageHeight = null;
let bgImageWidth = null;
let camera = null;
let positionMob = null;

let level = 1;
const levels = {
    1: {
        init: () => {
            platform = [];
            blackPlatform = [];
            whitePlatform = [];
            killPlatform = [];
            qgPlatform = [];
            mapImage = new Sprite({
                position: {
                    x: 0,
                    y: 0,
                },
                imageSrc: './img/map3IMG.png',
            });

            bgImageHeight = 1280 / 2;
            bgImageWidth = 800;

            playerSpawn = {
                x: 50,
                y: 200
            };

            camera = {
                position: {
                    x: 0,
                    y: -bgImageHeight + scaledCanvas.width - 20,
                },
            };

            mobSpawn = {
                x: 385,
                y: 30
            };


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
                        case 221:
                            returnMob.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                            break;
                        default:
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
        }
    },
    2: {
        init: () => {
            platform = [];
            blackPlatform = [];
            whitePlatform = [];
            killPlatform = [];
            qgPlatform = [];
            mapImage = new Sprite({
                position: {
                    x: 0,
                    y: 0,
                },
                imageSrc: './img/map2IMG.png',
            });
    
            playerSpawn = {
                x: 50,
                y: 200
            };
    
            bgImageHeight = 1280 / 2;
            bgImageWidth = 800;
    
            camera = {
                position: {
                    x: 0,
                    y: -bgImageHeight + scaledCanvas.width - 20,
                },
            };
    
            // Initialisation des plateformes, des collisions, etc. pour le niveau 2
            for (let i = 0; i < floorCollision_0.length; i += 80) {
                const row = floorCollision_0.slice(i, i + 80);
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
                        default:
                            break;
                    }
                });
            }
    
            blackCollision_0.forEach((symbol, index) => {
                const position = { x: (index % 80) * 16, y: Math.floor(index / 80) * 16 };
                if (symbol === 779) {
                    blackPlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                }
            });
    
            whiteCollision_0.forEach((symbol, index) => {
                const position = { x: (index % 80) * 16, y: Math.floor(index / 80) * 16 };
                if (symbol === 776) {
                    whitePlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                }
            });
    
            killCollision_0.forEach((symbol, index) => {
                const position = { x: (index % 80) * 16, y: Math.floor(index / 80) * 16 };
                if (symbol === 71) {
                    killPlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
                }
            });
    
            QGCollision_0.forEach((symbol, index) => {
                const position = { x: (index % 80) * 16, y: Math.floor(index / 80) * 16 };
                if (symbol === 11) {
                    qgPlatform.push(new Platform({ position, color: TRANSPARENT_COLOR }));
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

saveMapButton.addEventListener('click', () => {
    qg.style.zIndex = '-1';
    overlay.style.transition = 'opacity 1s';
    overlay.style.opacity = '0';
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 1000);
});



function loadMap(mapName) {
    if (mapName === 'Monochrome Meadows') {
        level = 2;
        levels[2].init(); 
        player.collisionBlocks = platform.slice();
        player.whitePlatform = whitePlatform.slice();
        player.blackPlatform = blackPlatform.slice();
        player.killPlatform = killPlatform.slice();
        player.qgPlatform = qgPlatform.slice();
        player.position = playerSpawn;
        player.velocity = { x: 0, y: 0 };
    }
    if (mapName === 'Guided Light') {
        level = 1;
        levels[1].init(); 
        player.collisionBlocks = platform.slice();
        player.whitePlatform = whitePlatform.slice();
        player.blackPlatform = blackPlatform.slice();
        player.killPlatform = killPlatform.slice();
        player.qgPlatform = qgPlatform.slice();
        player.position = playerSpawn;
        player.velocity = { x: 0, y: 0 };
    }
}


const player = new Player({
    position:playerSpawn,
    playerSpawn: playerSpawn,
    collisionBlocks : platform,
    whitePlatform,
    blackPlatform,
    killPlatform,
    qgPlatform,
    imageSrc : "./img/Character/Idle.png",
    frameRate: 12,
    animations:{
        Idle:{
            imageSrc : "./img/Character/Idle.png",
            frameRate: 12,
            frameBuffer : 5
        },
        IdleLeft:{
            imageSrc : "./img/Character/IdleLeft.png",
            frameRate: 12,
            frameBuffer : 5
        },
        Run:{
            imageSrc : "./img/Character/Run.png",
            frameRate: 8,
            frameBuffer : 5
        },
        RunLeft:{
            imageSrc : "./img/Character/RunLeft.png",
            frameRate: 8,
            frameBuffer : 5
        },
        Jump:{
            imageSrc : "./img/Character/Jump.png",
            frameRate: 4,
            frameBuffer : 3
        },
        JumpLeft:{
            imageSrc : "./img/Character/JumpLeft.png",
            frameRate: 4,
            frameBuffer : 3
        },
        Fall:{
            imageSrc : "./img/Character/Fall.png",
            frameRate: 3,
            frameBuffer : 15
        },
        FallLeft:{
            imageSrc : "./img/Character/FallLeft.png",
            frameRate: 3,
            frameBuffer : 15
        },
    },
})

const enemieslevel1 = [];

const mob = new Enemy({
    position: mobSpawn,
    mobSpawn: mobSpawn,
    collisionBlocks: platform,
    blackPlatform,
    whitePlatform,
    imageSrc: "./img/Enemy.png",
    frameRate: 6,
});

enemieslevel1.push(mob);


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
    mob.checkForHorizontalCollisionCanvas()
    mob.update();

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

    SCREEN.restore(); 
}

animate();


