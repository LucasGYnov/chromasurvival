// Variable to track whether the menu is open or closed
let isMenuOpen = true;

// Get the cursor element
const cursor = document.querySelector('.cursor');

// Event listener to update cursor position on mousemove
document.addEventListener('mousemove', (e) => {
   cursor.style.left = e.pageX + 'px';
   cursor.style.top = e.pageY + 'px';
});

// Event listener for when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function () {
   // Get the settings button, close button, and settings page elements
   const settingsButton = document.getElementById('settings_button');
   const closeButton = document.querySelector('#settings_page .close');
   const settingsPage = document.getElementById('settings_page');

   // Event listener to hide settings page when settings button is clicked
   settingsButton.addEventListener('click', function () {
      settingsPage.style.zIndex = "-100";
   });

   // Event listener to hide settings page when close button is clicked
   closeButton.addEventListener('click', function () {
      settingsPage.style.zIndex = "-100";
   });

   // Event listener to show settings page when settings button is clicked
   settingsButton.addEventListener('click', function () {
      settingsPage.style.zIndex = "100";
   });
});

// Event listener for when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function () {
   // Get the save button and error message elements
   const saveButton = document.getElementById('save');
   const errorMessage = document.getElementById('error_key');

   // Function to check if unique keys are assigned
   function checkUniqueKeys() {
      const keys = [gaucheInput.value, droiteInput.value, sauterInput.value, utiliserInput.value, utiliserSortInput.value];
      const uniqueKeys = new Set(keys);
      return uniqueKeys.size === keys.length;
   }

   // Function to update save button and error message
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

   // Get input elements for keys
   const gaucheInput = document.getElementById('gaucheInput');
   const droiteInput = document.getElementById('droiteInput');
   const sauterInput = document.getElementById('sauterInput');
   const utiliserInput = document.getElementById('utiliserInput');
   const utiliserSortInput = document.getElementById('utiliserSortInput');

   // Array of input elements
   const inputs = [gaucheInput, droiteInput, sauterInput, utiliserInput, utiliserSortInput];

   // Add event listeners to inputs to update save button and error message
   inputs.forEach(input => {
      input.addEventListener('input', () => {
         updateButtonAndError();
      });
   });

   // Event listener for save button click
   saveButton.addEventListener('click', function (event) {
      event.preventDefault();
      if (checkUniqueKeys()) {
         saveSettings();
      } else {
         errorMessage.textContent = "Impossible d'assigner différentes touches à une même action";
      }
   });

   // Function to save settings to localStorage
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

   // Load settings from localStorage
   loadSettings();
});

// Event listener for when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function () {
   // Get the jeu (game) and menu container elements
   const jeuContainer = document.querySelector('.jeu');
   const menuContainer = document.querySelector('.menu');
   const aboutContainer = document.querySelector('.about');

   // Function to show menu
   function afficherMenu() {
      aboutContainer.style.zIndex = "-2";
      jeuContainer.style.zIndex = "-1";
      menuContainer.style.zIndex = "1";
      isMenuOpen = true;
   }

   // Function to show game
   function afficherJeu() {
      aboutContainer.style.zIndex = "-2";
      menuContainer.style.zIndex = "-1";
      jeuContainer.style.zIndex = "1";
      isMenuOpen = false;
   }

   // Function to show about setion
   function afficherApropos() {
      jeuContainer.style.zIndex = "-2";
      menuContainer.style.zIndex = "-1";
      aboutContainer.style.zIndex = "1";
      isMenuOpen = false;
   }

   // Get the buttons for launching game and returning to menu
   const boutonJoueur = document.getElementById('lunch_game');
   const boutonRetourMenu = document.getElementById('menu_button');
   const boutonAbout = document.getElementById('about');
   const boutonMenu = document.getElementById('return-menu-button');

   // Event listener to launch game
   boutonJoueur.addEventListener('click', function () {
      afficherJeu();
      isMenuOpen = false;
   });

   boutonMenu.addEventListener('click', function () {
      afficherMenu();
      isMenuOpen = true;
   });

   // Event listener to return to menu
   boutonRetourMenu.addEventListener('click', function () {
      afficherMenu();
      isMenuOpen = true;
   });

   boutonAbout.addEventListener('click', function () {
      afficherApropos();
      isMenuOpen = false;
   });

   // Show menu by default
   afficherMenu();
});

// Event listener for when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function () {
   // Get the elements related to mobile controls and settings
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

   // Function to update visibility of mobile controls and related sections
   function updateVisibility() {
      // If mobile checkbox is checked, show mobile controls and related sections
      if (mobileCheckbox.checked) {
         mobileControls.style.display = 'flex';
         vibrationSection.classList.remove('hidden');
         reverseSection.classList.remove('hidden');
      } else {
         // If mobile checkbox is unchecked, hide mobile controls and related sections
         mobileControls.style.display = 'none';
         vibrationSection.classList.add('hidden');
         reverseSection.classList.add('hidden');
      }
   }

   // Event listener for reverse checkbox change
   reverseCheckbox.addEventListener('change', function () {
      // If reverse checkbox is checked, adjust mobile controls layout
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
         // If reverse checkbox is unchecked, reset mobile controls layout
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

   // Event listener for mobile checkbox change
   mobileCheckbox.addEventListener('change', function () {
      // Update visibility of mobile controls and related sections
      updateVisibility();
   });

   // Initially update visibility based on the state of the mobile checkbox
   updateVisibility();
});


// Get the mobile checkbox and the keys section
const mobileCheckbox = document.querySelector('.mobile-checkbox');
const keysSection = document.getElementById('keys');

// Function to update visibility of the keys section based on the mobile checkbox state
function updateKeysVisibility() {
   keysSection.style.display = mobileCheckbox.checked ? 'none' : 'block';
}

// Add event listener to the mobile checkbox to trigger visibility update
mobileCheckbox.addEventListener('change', updateKeysVisibility);

// Initially set keys section to be visible
keysSection.style.display = 'block';

// Event listener for when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function () {
   // Get checkboxes related to sound, music, and mobile controls
   const mobileCheckbox = document.querySelector('.mobile-checkbox');
   const sonCheckbox = document.querySelector('.son-checkbox');
   const musicCheckbox = document.querySelector('.music-checkbox');
   const soundCheckbox = document.querySelector('.son-checkbox'); // Correction ici

   // Set initial states for the checkboxes
   mobileCheckbox.checked = false;
   sonCheckbox.checked = true;
   musicCheckbox.checked = false;
   soundCheckbox.checked = false;

   // Get the keys section
   const keysSection = document.getElementById('keys');
   // Initially set keys section to be visible
   keysSection.style.display = 'block';

   // Add event listener to the mobile checkbox to trigger visibility update
   mobileCheckbox.addEventListener('change', updateKeysVisibility);
});


// Event listener for when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function () {
   // Get the mobile checkbox and sections related to vibration and reverse
   const mobileCheckbox = document.querySelector('.mobile-checkbox');
   const vibrationSection = document.getElementById('vibration_section');
   const reverseSection = document.getElementById('reverse_section');

   // Function to update visibility of vibration and reverse sections
   function updateSectionsVisibility() {
      // Check if mobile checkbox is checked
      const isMobileChecked = mobileCheckbox.checked;
      // Toggle the 'hidden' class based on the checked state
      vibrationSection.classList.toggle('hidden', !isMobileChecked);
      reverseSection.classList.toggle('hidden', !isMobileChecked);
   }

   // Add event listener to the mobile checkbox to trigger visibility update
   mobileCheckbox.addEventListener('change', updateSectionsVisibility);
   // Initially update visibility based on the state of the mobile checkbox
   updateSectionsVisibility();
});

// Event listener for when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function () {
   // Get the game music element and the music checkbox
   const gameMusic = document.getElementById('game-music');
   
   const musicCheckbox = document.querySelector('.music-checkbox');

   // Function to restart the music with a random delay
   function restartMusic() {
      const delay = Math.random() * (21 - 3) + 3;
      setTimeout(function () {
         gameMusic.currentTime = 0;
         // Check if music checkbox is checked before playing
         if (musicCheckbox.checked) {
            gameMusic.play();
         }
      }, delay * 1000);
   }

   // Event listener for when the music ends
   gameMusic.addEventListener('ended', function () {
      // Restart the music if music checkbox is checked
      if (musicCheckbox.checked) {
         restartMusic();
      }
   });

   // Start playing music if music checkbox is initially checked
   if (musicCheckbox.checked) {
      restartMusic();
   }

   // Event listener for when the music checkbox state changes
   musicCheckbox.addEventListener('change', function () {
      // Pause or play the music based on the checkbox state
      if (!this.checked) {
         gameMusic.pause();
      } else {
         restartMusic();
      }
   });

   // Event listener for when the sound checkbox state changes
   soundCheckbox.addEventListener('change', function () {
      // Pause or play the sounds based on the checkbox state
      if (!this.checked) {
         runningSound.muted = true;
         jumpSound.muted = true;
      } else {
         runningSound.muted = false;
         jumpSound.muted = false;
      }
   });
});

// Event listener for when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function () {
   // Get the mobile checkbox and the mobile controls section
   const mobileCheckbox = document.querySelector('.mobile-checkbox');
   const mobileControls = document.getElementById('mobile-controls');

   // Function to update visibility of mobile controls section based on mobile checkbox state
   function updateMobileControlsVisibility() {
      mobileControls.classList.toggle('hidden', !mobileCheckbox.checked);
   }

   // Add event listener to the mobile checkbox to trigger visibility update
   mobileCheckbox.addEventListener('change', updateMobileControlsVisibility);
   // Initially hide the mobile controls section
   mobileControls.classList.add('hidden');
});

// Maximum number of images to display
const MAX_DISPLAY_COUNT = 10;

// Function to generate HTML for displaying images
function generateImageHTML(imageSrc, count) {
   let html = '';
   // If count is less than or equal to the maximum display count, display all images
   if (count <= MAX_DISPLAY_COUNT) {
      for (let i = 0; i < count; i++) {
         html += `<img src="${imageSrc}">`;
      }
   } else {
      // If count exceeds maximum display count, display maximum count and show remaining count
      const remainingCount = count - MAX_DISPLAY_COUNT;
      for (let i = 0; i < MAX_DISPLAY_COUNT; i++) {
         html += `<img src="${imageSrc}">`;
      }
      html += `+${remainingCount}`;
   }
   return html;
}

// Function to update the power left counter display
function updatePowerLeftCounter() {
   // Image source for the power left counter
   const imageSrc = 'public/logo_chromasurvival.webp';
   // Number of images to display (assuming player object exists)
   const imageCount = player.powerLeft;
   // Generate and display the HTML for the power left counter
   powerLeftCounter.innerHTML = generateImageHTML(imageSrc, imageCount);
}

// Initially update the power left counter display
updatePowerLeftCounter();



