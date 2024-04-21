let isMenuOpen = true;

const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', (e) => {
   cursor.style.left = e.pageX + 'px';
   cursor.style.top = e.pageY + 'px';
});


document.addEventListener('DOMContentLoaded', function () {
   const settingsButton = document.getElementById('settings_button');
   const closeButton = document.querySelector('#settings_page .close');
   const settingsPage = document.getElementById('settings_page');

   settingsButton.addEventListener('click', function () {
      settingsPage.style.zIndex = "-100";
   });

   closeButton.addEventListener('click', function () {
      settingsPage.style.zIndex = "-100";
   });

   settingsButton.addEventListener('click', function () {
      settingsPage.style.zIndex = "100";
   });
});

document.addEventListener('DOMContentLoaded', function () {
    const saveButton = document.getElementById('save');
    const errorMessage = document.getElementById('error_key');

    function checkUniqueKeys() {
        const keys = [gaucheInput.value, droiteInput.value, sauterInput.value, utiliserInput.value, utiliserSortInput.value];
        const uniqueKeys = new Set(keys);
        return uniqueKeys.size === keys.length;
    }

    function updateButtonAndError() {
        if (checkUniqueKeys()) {
            saveButton.value = "Enregistrer";
            saveButton.style.color = 'black';
            errorMessage.textContent = "";
        } else {
            saveButton.value = "Impossible d'assigner différentes touches à une même action";
            saveButton.style.color = 'red';
            errorMessage.textContent = "Impossible d'assigner différentes touches à une même action";
        }
        inputs.forEach(input => {
            input.style.color = checkUniqueKeys() ? 'black' : 'red';
        });
    }

    const gaucheInput = document.getElementById('gaucheInput');
    const droiteInput = document.getElementById('droiteInput');
    const sauterInput = document.getElementById('sauterInput');
    const utiliserInput = document.getElementById('utiliserInput');
    const utiliserSortInput = document.getElementById('utiliserSortInput');

    const inputs = [gaucheInput, droiteInput, sauterInput, utiliserInput, utiliserSortInput];
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            updateButtonAndError();
        });
    });

    saveButton.addEventListener('click', function (event) {
        event.preventDefault();
        if (checkUniqueKeys()) {
            saveSettings();
        } else {
            errorMessage.textContent = "Impossible d'assigner différentes touches à une même action";
        }
    });

    function saveSettings() {
        localStorage.setItem('son_enabled', sonCheckbox.checked);
        localStorage.setItem('mobile_enabled', mobileCheckbox.checked);
        localStorage.setItem('vibration_enabled', vibrationCheckbox.checked);
        localStorage.setItem('gauche_value', gaucheInput.value);
        localStorage.setItem('droite_value', droiteInput.value);
        localStorage.setItem('sauter_value', sauterInput.value);
        localStorage.setItem('utiliser_value', utiliserInput.value);
        localStorage.setItem('utiliser_sort_value', utiliserSortInput.value);
        settingsPage.style.zIndex = "-100";
        updateButtonAndError();
    }

    loadSettings();
});


document.addEventListener('DOMContentLoaded', function () {
    const jeuContainer = document.querySelector('.jeu');
    const menuContainer = document.querySelector('.menu');

    function afficherMenu() {
        jeuContainer.style.zIndex = "-1";
        menuContainer.style.zIndex = "1";
        isMenuOpen = true;
    }

    function afficherJeu() {
        menuContainer.style.zIndex = "-1";
        jeuContainer.style.zIndex = "1";
        isMenuOpen = false;
    }

    const boutonJoueur = document.getElementById('lunch_game');
    boutonJoueur.addEventListener('click', function () {
        afficherJeu();
        isMenuOpen = false;
    });

    const boutonRetourMenu = document.getElementById('menu_button');
    boutonRetourMenu.addEventListener('click', function () {
        afficherMenu();
        isMenuOpen = true;
    });

    afficherMenu();
});

document.addEventListener('DOMContentLoaded', function () {
    const reverseCheckbox = document.querySelector('.reverse-checkbox');
    const mobileCheckbox = document.querySelector('.mobile-checkbox');
    const mobileControls = document.getElementById('mobile-controls');
    const leftControls = document.getElementById('left-controls');
    const rightControls = document.getElementById('right-controls');
    const leftButton = document.getElementById('left_button');
    const rightButton = document.getElementById('right_button');
    const jumpButton = document.getElementById('jump_button');
    const chromaSwitchButton = document.getElementById('chroma_switch_button');
    const vibrationSection = document.getElementById('vibration_section');
    const reverseSection = document.getElementById('reverse_section');

    function updateVisibility() {
        if (mobileCheckbox.checked) {
            mobileControls.style.display = 'flex';
            vibrationSection.classList.remove('hidden');
            reverseSection.classList.remove('hidden'); 
        } else {
            mobileControls.style.display = 'none';
            vibrationSection.classList.add('hidden');
            reverseSection.classList.add('hidden'); 
        }
    }

    reverseCheckbox.addEventListener('change', function () {
        if (reverseCheckbox.checked) {
            mobileControls.style.flexDirection = 'row-reverse';
            leftControls.style.marginRight = '0';
            rightControls.style.marginRight = 'auto';
            rightControls.style.marginLeft = '0';

            leftButton.style.marginLeft = 'auto';
            rightButton.style.marginLeft = 'auto';

            jumpButton.style.marginRight = 'auto';
            chromaSwitchButton.style.marginRight = 'auto';
        } else {
            mobileControls.style.flexDirection = 'row';
            leftControls.style.marginRight = 'auto';
            rightControls.style.marginLeft = '0';
            rightControls.style.marginRight = '0';

            leftButton.style.marginLeft = 'auto';
            rightButton.style.marginLeft = 'auto';

            jumpButton.style.marginRight = 'auto';
            chromaSwitchButton.style.marginRight = 'auto';
        }
    });

    mobileCheckbox.addEventListener('change', function () {
        updateVisibility();
    });

    updateVisibility(); 
});

const mobileCheckbox = document.querySelector('.mobile-checkbox');

const keysSection = document.getElementById('keys');

mobileCheckbox.addEventListener('change', function() {
    if (this.checked) {
        keysSection.style.display = 'none';
    } else {
        keysSection.style.display = 'block';
    }
});

keysSection.style.display = 'block';

document.addEventListener('DOMContentLoaded', function () {
    const mobileCheckbox = document.querySelector('.mobile-checkbox');
    const sonCheckbox = document.querySelector('.son-checkbox');
    const musicCheckbox = document.querySelector('.music-checkbox');

    mobileCheckbox.checked = false;

    sonCheckbox.checked = true;
    musicCheckbox.checked = false;

    const keysSection = document.getElementById('keys');
    keysSection.style.display = 'block'; 

    mobileCheckbox.addEventListener('change', function() {
        if (this.checked) {
            keysSection.style.display = 'none';
        } else {
            keysSection.style.display = 'block';
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const mobileCheckbox = document.querySelector('.mobile-checkbox');
    const vibrationSection = document.getElementById('vibration_section');
    const reverseSection = document.getElementById('reverse_section');

    function updateSectionsVisibility() {
        if (mobileCheckbox.checked) {
            vibrationSection.classList.remove('hidden');
            reverseSection.classList.remove('hidden');
        } else {
            vibrationSection.classList.add('hidden');
            reverseSection.classList.add('hidden');
        }
    }

    mobileCheckbox.addEventListener('change', function () {
        updateSectionsVisibility();
    });

    updateSectionsVisibility();
});

document.addEventListener('DOMContentLoaded', function () {
    const gameMusic = document.getElementById('game-music');
    const musicCheckbox = document.querySelector('.music-checkbox');

    function restartMusic() {
        const delay = Math.random() * (21 - 3) + 3;
        setTimeout(function() {
            gameMusic.currentTime = 0;
            if (musicCheckbox.checked) {
                gameMusic.play();
            }
        }, delay * 1000);
    }

    gameMusic.addEventListener('ended', function() {
        if (musicCheckbox.checked) {
            restartMusic();
        }
    });

    if (musicCheckbox.checked) {
        restartMusic();
    }

    musicCheckbox.addEventListener('change', function() {
        if (!this.checked) {
            gameMusic.pause();
        } else {
            restartMusic();
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const mobileCheckbox = document.querySelector('.mobile-checkbox');
    const mobileControls = document.getElementById('mobile-controls');

    mobileCheckbox.addEventListener('change', function () {
        if (this.checked) {
            mobileControls.classList.remove('hidden');
        } else {
            mobileControls.classList.add('hidden');
        }
    });
    mobileControls.classList.add('hidden');
});

const powerLeftCounter = document.getElementById('powerLeftCounter');

function generateImageHTML(imageSrc, count) {
    let html = '';
    for (let i = 0; i < count; i++) {
        html += `<img src="${imageSrc}">`;
    }
    return html;
}

function updatePowerLeftCounter() {
    const imageSrc = 'public/logo_chromasurvival.webp';
    const imageCount = player.powerLeft;
    powerLeftCounter.innerHTML = generateImageHTML(imageSrc, imageCount);
}

updatePowerLeftCounter();




