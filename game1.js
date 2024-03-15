const CANVAS = document.querySelector('canvas');
const SCREEN = CANVAS.getContext('2d');

CANVAS.width = 1024;
CANVAS.height = 576;

const GRAVITY = 0.5;

class Sprite{
    constructor({position, imageSrc}) {
        this.position = position;
        this.image = new Image();
        this.imageSrc = imageSrc;
    }
    draw() {
        if (!this.image) return
        c.drawImage(this.imageSrc, this.position.x, this.position.y);
    }

    update() {
        this.draw();
    }
}

class Player {
    constructor(position) {
        this.position = position;
        this.velocity = {
            x: 0,
            y: 1.0,
        };
        this.height = 100;
    }
    draw() {
        SCREEN.fillStyle = 'red';
        SCREEN.fillRect(this.position.x, this.position.y, 100, this.height);
    }
    update() {
        this.draw();
        this.position.y += this.velocity.y;
        if (this.position.y + this.height + this.velocity.y < CANVAS.height)
            this.velocity.y += GRAVITY;
        else this.velocity.y = 0;
    }
}

const player = new Player({
    x: 100,
    y: 1,
});

// Définir les touches par défaut
const keys = {
    gaucheInput: {
        pressed: false,
        key: 'q'
    },
    droiteInput: {
        pressed: false,
        key: 'd'
    },
    sauterInput: {
        pressed: false,
        key: ' '
    },
    utiliserInput: {
        pressed: false,
        key: 'x'
    },
    utiliserSortInput: {
        pressed: false,
        key: 's'
    }
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
            settingsPage.style.zIndex = "-100";
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
        const keys = [gaucheInput.value, droiteInput.value, sauterInput.value, utiliserInput.value, utiliserSortInput.value];
        const uniqueKeys = new Set(keys);
        return uniqueKeys.size === keys.length;
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
            player.velocity.y = -10;
            keys.sauterInput.pressed = true;
            break;
        case keys.utiliserInput.key:
            keys.utiliserInput.pressed = true;
            break;
        case keys.utiliserSortInput.key:
            keys.utiliserSortInput.pressed = true;
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

const backgroundImage = new Image();
backgroundImage.src = 'img/bg1.png';

var bouton = document.getElementById("menu_button");
bouton.addEventListener("click", function () {
    window.location.href = "index.html";
});

function animate() {
    window.requestAnimationFrame(animate);
    SCREEN.clearRect(0, 0, CANVAS.width, CANVAS.height);
    SCREEN.drawImage(backgroundImage, 0, 0, CANVAS.width, CANVAS.height);
    player.update();

    if (keys.gaucheInput.pressed) {
        player.position.x += -5;
        player.velocity.x = -5;
    } else if (keys.droiteInput.pressed) {
        player.position.x += 5;
        player.velocity.x = 5;
    } else {
        player.velocity.x = 0;
    }
}

animate();