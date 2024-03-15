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
    // Définir une variable pour le bouton Enregistrer
    const saveButton = document.getElementById('save');
    // Définir une variable pour le message d'erreur
    const errorMessage = document.getElementById('error_key');

    // Fonction pour vérifier si les touches sont uniques
    function checkUniqueKeys() {
        const keys = [gaucheInput.value, droiteInput.value, sauterInput.value, utiliserInput.value, utiliserSortInput.value];
        const uniqueKeys = new Set(keys);
        return uniqueKeys.size === keys.length;
    }

    // Fonction pour mettre à jour le texte du bouton et le message d'erreur
    function updateButtonAndError() {
        if (checkUniqueKeys()) {
            saveButton.value = "Enregistrer";
            saveButton.style.color = 'black';
            errorMessage.textContent = ""; // Effacer le message d'erreur s'il n'y en a pas
        } else {
            saveButton.value = "Impossible d'assigner différentes touches à une même";
            saveButton.style.color = 'red';
            errorMessage.textContent = "Impossible d'assigner différentes touches à une même action";
        }
        // Mettre à jour la couleur des lettres en fonction de la validité des touches
        inputs.forEach(input => {
            input.style.color = checkUniqueKeys() ? 'black' : 'red';
        });
    }

    // Ajouter un écouteur d'événements à chaque champ de saisie pour détecter les changements
    const inputs = [gaucheInput, droiteInput, sauterInput, utiliserInput, utiliserSortInput];
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            updateButtonAndError(); // Mettre à jour le texte du bouton et le message d'erreur lorsqu'une touche est modifiée
        });
    });

    // Écouteur d'événements pour le clic sur le bouton Enregistrer
    saveButton.addEventListener('click', function (event) {
        event.preventDefault();
        if (checkUniqueKeys()) {
            // Enregistrer les paramètres si les touches sont uniques
            saveSettings();
        } else {
            // Afficher un message d'erreur si les touches ne sont pas uniques
            errorMessage.textContent = "Impossible d'assigner différentes touches à une même action";
        }
    });

    // Fonction pour sauvegarder les paramètres
    function saveSettings() {
        // Sauvegarder les paramètres dans le stockage local
        localStorage.setItem('son_enabled', sonCheckbox.checked);
        localStorage.setItem('mobile_enabled', mobileCheckbox.checked);
        localStorage.setItem('vibration_enabled', vibrationCheckbox.checked);
        localStorage.setItem('gauche_value', gaucheInput.value);
        localStorage.setItem('droite_value', droiteInput.value);
        localStorage.setItem('sauter_value', sauterInput.value);
        localStorage.setItem('utiliser_value', utiliserInput.value);
        localStorage.setItem('utiliser_sort_value', utiliserSortInput.value);
        settingsPage.style.zIndex = "-100";
        // Réinitialiser le texte du bouton après avoir enregistré les paramètres
        updateButtonAndError();
    }

    // Charger les paramètres au chargement de la page
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

const textHidden = document.querySelector('.text__hidden');
         textHidden.addEventListener('mouseenter', () => {
            textHidden.style.color = 'white';
         });

         textHidden.addEventListener('mouseleave', () => {
            textHidden.style.color = 'transparent';
         });