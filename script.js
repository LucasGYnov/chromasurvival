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
        localStorage.setItem('son_enabled', sonCheckbox.checked);
        localStorage.setItem('mobile_enabled', mobileCheckbox.checked);
        localStorage.setItem('vibration_enabled', vibrationCheckbox.checked);
        localStorage.setItem('gauche_value', gaucheInput.value);
        localStorage.setItem('droite_value', droiteInput.value);
        localStorage.setItem('sauter_value', sauterInput.value);
        localStorage.setItem('utiliser_value', utiliserInput.value);
        localStorage.setItem('utiliser_sort_value', utiliserSortInput.value);
        settingsPage.style.zIndex = "-100";
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

var bouton = document.getElementById("lunch_game");

bouton.addEventListener("click", function() {
  window.location.href = "game.html";
});


