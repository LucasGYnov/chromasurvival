const CANVAS = document.querySelector('canvas');
const SCREEN = CANVAS.getContext('2d');

CANVAS.width = 1024;
CANVAS.height = 576;

const scale = 2;

const scaledCanvas = {
    width: CANVAS.width / scale,
    height: CANVAS.height / scale,
};

// Définition des couleurs
/* const BLACK_COLOR = 'rgba(0, 0, 0, 0.5)'; */
/* const WHITE_COLOR = 'rgba(255, 255, 255, 0.5)'; */
/* const PLATFORM_COLOR = 'rgba(128, 128, 128, 0.5)'; */

const BLACK_COLOR = 'rgba(255, 0, 0, 0.5)';
const WHITE_COLOR = 'rgba(0, 255, 255, 0.5)';
const PLATFORM_COLOR = 'rgba(128, 128, 128, 0.5)';

// Création des plateformes avec les couleurs appropriées
const floorCollision2D = [];
for (let i = 0; i < floorCollision.length; i += 60) {
    floorCollision2D.push(floorCollision.slice(i, i + 60));
}

const platform = [];
floorCollision2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol === 12) {
            platform.push(new Platform({
                position: {
                    x: x * 16,
                    y: y * 16,
                },
                color: PLATFORM_COLOR // Utilisation de la couleur grise pour les plateformes
            }));
        }
    });
});

const blackCollision2D = [];
for (let i = 0; i < blackCollision.length; i += 60) {
    blackCollision2D.push(blackCollision.slice(i, i + 60));
}

const blackPlatform = [];
blackCollision2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol === 379) {
            blackPlatform.push(new Platform({
                position: {
                    x: x * 16,
                    y: y * 16,
                },
                color: BLACK_COLOR // Utilisation de la couleur noire pour les plateformes noires
            }));
        }
    });
});

const whiteCollision2D = [];
for (let i = 0; i < whiteCollision.length; i += 60) {
    whiteCollision2D.push(whiteCollision.slice(i, i + 60));
}

const whitePlatform = [];
whiteCollision2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol === 376) {
            whitePlatform.push(new Platform({
                position: {
                    x: x * 16,
                    y: y * 16,
                },
                color: WHITE_COLOR // Utilisation de la couleur blanche pour les plateformes blanches
            }));
        }
    });
});

const GRAVITY = 0.5;



const player = new Player({
    position: {
        x: 100,
        y: 475,
    },
    collisionBlocks : platform,
    imageSrc : "./img/Character/Idle.png",
    frameRate: 12,
    animations:{
        Idle:{
            imageSrc : "./img/Character/Idle.png",
            frameRate: 12,
        },
        Run:{
            imageSrc : "./img/Character/Run.png",
            frameRate: 8,
        },
    }

});


// Définir les touches par défaut
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
        key: 's',
    },
};

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: './img/map2.png',

});

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
        gaucheInput.value = localStorage.getItem('gauche_value') || 'a';
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

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case keys.gaucheInput.key:
            player.velocity.x = -5;
            keys.gaucheInput.pressed = true;
            break;
        case keys.droiteInput.key:
            player.velocity.x = 5;
            keys.droiteInput.pressed = true;
            break;
        case keys.sauterInput.key:
            player.velocity.y = -8;
            keys.sauterInput.pressed = true;
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
});

window.addEventListener('keyup', (event) => {
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
});

var bouton = document.getElementById('menu_button');
var menu = document.getElementById('settings_page');

bouton.addEventListener('click', function () {
    menu.style.display = 'block';
    menu.style.zIndex = '-100';
});



function animate() {
    window.requestAnimationFrame(animate);
    SCREEN.fillStyle = 'grey';
    SCREEN.fillRect(0, 0, CANVAS.width, CANVAS.height);

    SCREEN.save();
    SCREEN.scale(scale, scale);
    SCREEN.translate(0, -background.image.height + scaledCanvas.height);
    background.update();
    platform.forEach((platform) => {
        platform.update();
    });
    blackPlatform.forEach((blakcBlock) => {
        blakcBlock.update();
    });
    whitePlatform.forEach((whiteBlock) => {
        whiteBlock.update();
    });
    
    
    player.update();

    /* if (keys.gaucheInput.pressed) {
        player.position.x += -1;
        player.velocity.x = -5;
    } else if (keys.droiteInput.pressed) {
        player.position.x += 1;
        player.velocity.x = 5;
    } else {
        player.velocity.x = 0;
    } */

    player.velocity.x = 0; 
    if(keys.droiteInput.pressed) {
        player.switchSprite('Run')
        player.velocity.x = 5
    } else if(keys.gaucheInput.pressed) player.velocity.x = -5
    else if (player.velocity.x === 0){
        player.switchSprite('Idle')
    }
    SCREEN.restore(); 
}

animate();
