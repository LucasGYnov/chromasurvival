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
            saveButton.value = "Impossible d'assigner différentes touches à une même";
            saveButton.style.color = 'red';
            errorMessage.textContent = "Impossible d'assigner différentes touches à une même action";
        }
        inputs.forEach(input => {
            input.style.color = checkUniqueKeys() ? 'black' : 'red';
        });
    }

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
    const mobileCheckbox = document.querySelector('.mobile-checkbox');
    const vibrationSection = document.getElementById('vibration_section');

    function updateVibrationVisibility() {
        if (mobileCheckbox.checked) {
            vibrationSection.classList.remove('hidden');
        } else {
            vibrationSection.classList.add('hidden');
        }
    }

    mobileCheckbox.addEventListener('change', function () {
        updateVibrationVisibility();
    });

    updateVibrationVisibility();
});

document.addEventListener('DOMContentLoaded', function () {
    const jeuContainer = document.querySelector('.jeu');
    const menuContainer = document.querySelector('.menu');

    function afficherMenu() {
        jeuContainer.style.zIndex = "-1";
        menuContainer.style.zIndex = "1";
    }

    function afficherJeu() {
        menuContainer.style.zIndex = "-1";
        jeuContainer.style.zIndex = "1";
    }

    const boutonJoueur = document.getElementById('lunch_game');
    boutonJoueur.addEventListener('click', function () {
        afficherJeu();
    });

    const boutonRetourMenu = document.getElementById('menu_button');
    boutonRetourMenu.addEventListener('click', function () {
        afficherMenu();
    });

    afficherMenu();
});