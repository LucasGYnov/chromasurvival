const CANVAS = document.querySelector('canvas');
const SCREEN = CANVAS.getContext('2d');

CANVAS.width = 1024;
CANVAS.height = 576;

const GRAVITY = 0.5;

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
        SCREEN.fillStyle = 'black';
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

    window.addEventListener('keydown', (event) => {
        const inputs = [gaucheInput, droiteInput, sauterInput, utiliserInput, utiliserSortInput];
        inputs.forEach(input => input.style.color = 'black'); // Réinitialiser les couleurs des inputs
        switch (event.key) {
            case gaucheInput.value:
                player.position.x -= 5; // Déplacer le joueur vers la gauche
                break;
            case droiteInput.value:
                player.position.x += 5; // Déplacer le joueur vers la droite
                break;
            case sauterInput.value:
                player.velocity.y = -10; // Donner une impulsion verticale au joueur pour sauter
                break;
            case utiliserInput.value:
                /* utiliser(); */
                break;
            case utiliserSortInput.value:
                /* utiliserSort(); */
                break;
            default:
                break;
        }
        // Mettre en surbrillance les touches identiques en rouge
        const duplicatedKeys = inputs.filter(input => inputs.filter(other => other.value === input.value).length > 1);
        duplicatedKeys.forEach(input => input.style.color = 'red');
    });
});



const backgroundImage = new Image();
backgroundImage.src = 'img/back.jpg';


var bouton = document.getElementById("menu_button");
bouton.addEventListener("click", function() {
  window.location.href = "index.html";
});

function animate(){
    window.requestAnimationFrame(animate);
    SCREEN.drawImage(backgroundImage, 0, 0, CANVAS.width, CANVAS.height);
    player.update();
}

animate();
