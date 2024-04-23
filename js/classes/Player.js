class Player extends Sprite {
   constructor({position, playerSpawn,  collisionBlocks, whitePlatform, blackPlatform, killPlatform, qgPlatform, bouncePlatform,  imageSrc, frameRate, scale = 0.8, powerLeft, animations, checkpoint}) {
      super({
         imageSrc,
         frameRate,
         scale
      }); // Call the superclass constructor

      // Initialize player properties
      this.position = {
         ...position
      }; // Player position
      this.playerSpawn = {
         ...playerSpawn
      }; // Player spawn point
      this.isOnGround = false; // Flag to indicate if player is on the ground
      this.velocity = {
         x: 0, // Horizontal velocity
         y: 1.0, // Vertical velocity
      };
      this.collisionBlocks = collisionBlocks; // Array of collision blocks
      this.whitePlatform = whitePlatform; // Array of white platforms
      this.blackPlatform = blackPlatform; // Array of black platforms
      this.killPlatform = killPlatform; // Array of kill platforms
      this.qgPlatform = qgPlatform; // Array of QG (Quartier Général) platforms
      this.bouncePlatform = bouncePlatform; // Array of bounce platforms
      this.hitbox = {
         position: {
            x: this.position.x, // Hitbox x position
            y: this.position.y, // Hitbox y position
         },
         width: 10, // Hitbox width
         height: 10 // Hitbox height
      };
      this.animations = animations; // Animation frames for the player
      this.powerLeft = powerLeft; // Remaining power for the player
      this.lastDirection = 'right'; // Last direction the player was facing
      this.isInvertedColor = false; // Flag to indicate if colors are inverted
      this.checkpoint = checkpoint; // Checkpoint for respawning

      // Preload animation images
      for (let key in this.animations) {
         const image = new Image();
         image.src = this.animations[key].imageSrc;
         this.animations[key].image = image;
      }

      // Initialize camera box
      this.camerabox = {
         position: {
            x: this.position.x, // Camera box x position
            y: this.position.y, // Camera box y position
         },
         width: 200, // Camera box width
         height: 80, // Camera box height
      };
   }

   /*     invertColors() {
          for (let key in this.animations) {
              const animation = this.animations[key];
              const invertedImages = [];
              for (let i = 0; i < animation.images.length; i++) {
                  const image = animation.images[i];
                  const invertedImage = this.invertImage(image);
                  invertedImages.push(invertedImage);
              }
              animation.images = invertedImages;
          }
      }

      invertImage(image) {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = image.width;
          canvas.height = image.height;
          context.drawImage(image, 0, 0);
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imageData.data;
      
          for (let i = 0; i < pixels.length; i += 4) {
              pixels[i] = 255 - pixels[i];       // Rouge
              pixels[i + 1] = 255 - pixels[i + 1]; // Vert
              pixels[i + 2] = 255 - pixels[i + 2]; // Bleu
              // Garder l'alpha (transparence) inchangée
          }
      
          context.putImageData(imageData, 0, 0);
          const invertedImage = new Image();
          invertedImage.src = canvas.toDataURL(); // Convertir le canvas en une URL d'image
          return invertedImage;
      } */


   switchSprite(key) {
      // Check if the current image is the same as the target animation image or if the animation is not loaded
      if (this.image === this.animations[key].image || !this.loaded) return;

      // Reset the current frame to the beginning of the animation
      this.currentFrame = 0;
      // Set the image to the target animation image
      this.image = this.animations[key].image;
      // Set the frame buffer for the animation
      this.frameBuffer = this.animations[key].frameBuffer;
      // Set the frame rate for the animation
      this.frameRate = this.animations[key].frameRate;
   }

   updateCameraBox() {
      // Update the camera box position based on the player's position
      this.camerabox = {
         position: {
            x: this.position.x - 125, // Adjusted x position
            y: this.position.y - 25, // Adjusted y position
         },
         width: 300, // Camera box width
         height: 120, // Camera box height
      };
   }

   checkForHorizontalCollisionCanvas() {
      // Check for horizontal collision with the canvas boundaries
      if (this.hitbox.position.x + this.hitbox.width + this.velocity.x >= (CANVAS.width * 2) || this.hitbox.position.x + this.velocity.x <= 0) {
         // If the player hits the canvas boundaries, stop horizontal movement
         this.velocity.x = 0;
      }
   }

   cameraToTheLeft({
      CANVAS,
      camera
   }) {
      // Calculate the right side position of the camera box
      const cameraboxRightSide = this.camerabox.position.x + this.camerabox.width;
      // Calculate the width of the scaled canvas
      const scaleCanvasWidth = bgImageWidth / scale;

      // Check if the right side of the camera box exceeds double the canvas width
      if (cameraboxRightSide >= (CANVAS.width * 2)) return;

      // Check if the right side of the camera box exceeds the scaled canvas width plus the absolute value of the camera's x position
      if (cameraboxRightSide >= scaleCanvasWidth + Math.abs(camera.position.x)) {
         // Move the camera to the left based on the player's velocity
         camera.position.x -= this.velocity.x;
      }
   }

   cameraToTheRight({
      CANVAS,
      camera
   }) {
      // Check if the left side of the camera box is less than or equal to 0
      if (this.camerabox.position.x <= 0) return;
      // Check if the left side of the camera box is less than or equal to the absolute value of the camera's x position
      if (this.camerabox.position.x <= Math.abs(camera.position.x)) {
         // Move the camera to the right based on the player's velocity
         camera.position.x -= this.velocity.x;
      }
   }

   cameraToDown({
      CANVAS,
      camera
   }) {
      // Check if moving the camera down would exceed the upper boundary
      if ((this.camerabox.position.y + this.velocity.y) <= 0) return;

      // Check if the top of the camera box is less than or equal to the absolute value of the camera's y position
      if (this.camerabox.position.y <= Math.abs(camera.position.y)) {
         // Move the camera down based on the player's velocity
         camera.position.y -= this.velocity.y;
      }
   }

   cameraToUp({
      CANVAS,
      camera
   }) {
      // Check if moving the camera up would exceed the lower boundary
      if (this.camerabox.position.y + this.camerabox.height + this.velocity.y >= bgImageHeight) return;

      // Calculate the scaled canvas height
      const scaleCanvasHeight = CANVAS.height / scale;

      // Check if the bottom of the camera box exceeds the scaled canvas height plus half of the canvas height
      if (this.camerabox.position.y + this.camerabox.height >= Math.abs(camera.position.y) + scaleCanvasHeight / 1.5) {
         // Move the camera up based on the player's velocity
         camera.position.y -= this.velocity.y;
      }
   }

   invertColors() {
      for (let key in this.animations) {
         const canvas = document.createElement('canvas');
         const ctx = canvas.getContext('2d');
         const animation = this.animations[key];
         canvas.width = animation.image.width;
         canvas.height = animation.image.height;

         // Dessiner l'image sur le canvas
         ctx.drawImage(animation.image, 0, 0);

         // Obtenir les données de l'image
         const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
         const data = imageData.data;

         // Inverser les couleurs pixel par pixel
         for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i]; // Inverser le canal rouge
            data[i + 1] = 255 - data[i + 1]; // Inverser le canal vert
            data[i + 2] = 255 - data[i + 2]; // Inverser le canal bleu
            // Ne pas modifier l'alpha (canal alpha)
         }

         // Remettre les données modifiées sur le canvas
         ctx.putImageData(imageData, 0, 0);

         // Mettre à jour l'image de l'animation avec les couleurs inversées
         animation.image.src = canvas.toDataURL();
      }
   }




   update() {
      // Apply color inversion effect if needed
      if (this.isInvertedColor) {
         // SCREEN.filter = 'invert(100%)';
         this.invertColors()
      }

      // Call the superclass update method
      super.update();

      // Update frame and hitbox
      this.updateFrame();
      this.updateHitbox();


      /* SCREEN.fillStyle = 'rgba(0,255,0,0.1)';
      SCREEN.fillRect(this.position.x, this.position.y, this.width, this.height);*/

      /* SCREEN.fillStyle = 'rgba(255,0,0,0.5)';
      SCREEN.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height);  */

      /* SCREEN.fillStyle = 'rgba(0,0,255,0.5)';
      SCREEN.fillRect(this.camerabox.position.x, this.camerabox.position.y, this.camerabox.width, this.camerabox.height); */

      // Display QG (Quartier Général)
      afficherQG();

      // Update camera box
      this.updateCameraBox();

      // Check if player is on QG (Quartier Général)
      this.checkQG();

      // Check collision with checkpoints
      this.checkpointCollision();

      // Check collision with kill blocks
      this.checkKillBlockCollision();

      // Check collision with enemies
      this.checkEnemyCollision(enemieslevel1);

      // Check collision with bounce platforms
      this.checkBounceCollision();

      // Draw player sprite
      this.draw();

      // Update player position based on velocity
      this.position.x += this.velocity.x;

      // Update player hitbox
      this.updateHitbox();

      // Check for horizontal collisions
      this.checkForHorizontalCollision();

      // Apply gravity to the player
      this.applyGravity();

      // Update player hitbox again
      this.updateHitbox();

      // Check for vertical collisions
      this.checkForVerticalCollision();

      // Update score display
      updateScoreDisplay();

   }


   // Update the hitbox position and size based on the player's position
   updateHitbox() {
      // Set the hitbox position relative to the player's position
      this.hitbox = {
         position: {
            x: this.position.x + 17, // Adjusted x position of the hitbox
            y: this.position.y + 16, // Adjusted y position of the hitbox
         },
         width: 16, // Width of the hitbox
         height: 35 // Height of the hitbox
      }
   }

   // Check for horizontal collisions with collision blocks and platforms
   checkForHorizontalCollision() {
      // Check collisions with collision blocks
      for (let i = 0; i < this.collisionBlocks.length; i++) {
         const collisionBlock = this.collisionBlocks[i];
         if (
            collisionDetection({
               object1: this.hitbox,
               object2: collisionBlock,
            })
         ) {
            // Handle collisions when moving to the right
            if (this.velocity.x > 0) {
               this.velocity.x = 0;

               // Calculate offset to adjust player position
               const offset = this.hitbox.position.x - this.position.x + this.hitbox.width;

               // Adjust player position to avoid collision
               this.position.x = collisionBlock.position.x - offset - 0.01;
               break;
            }
            // Handle collisions when moving to the left
            if (this.velocity.x < 0) {
               this.velocity.x = 0;

               // Calculate offset to adjust player position
               const offset = this.hitbox.position.x - this.position.x;

               // Adjust player position to avoid collision
               this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01;
               break;
            }
         }
      }

      // Check collisions with platforms
      const platforms = this.isInvertedColor ? this.blackPlatform : this.whitePlatform;
      for (let i = 0; i < platforms.length; i++) {
         const platformBlock = platforms[i];
         if (
            collisionDetection({
               object1: this.hitbox,
               object2: platformBlock,
            })
         ) {
            // Handle collisions when moving to the right
            if (this.velocity.x > 0) {
               this.velocity.x = 0;

               // Calculate offset to adjust player position
               const offset = this.hitbox.position.x - this.position.x + this.hitbox.width;

               // Adjust player position to avoid collision
               this.position.x = platformBlock.position.x - offset - 0.01;
               break;
            }
            // Handle collisions when moving to the left
            if (this.velocity.x < 0) {
               this.velocity.x = 0;

               // Calculate offset to adjust player position
               const offset = this.hitbox.position.x - this.position.x;

               // Adjust player position to avoid collision
               this.position.x = platformBlock.position.x + platformBlock.width - offset + 0.01;
               break;
            }
         }
      }
   }

   // Apply gravity to the player's vertical velocity
   applyGravity() {
      this.velocity.y += GRAVITY; // Increment vertical velocity by gravity
      this.position.y += this.velocity.y; // Update player's y position based on velocity
   }

   // Check for vertical collisions with collision blocks and platforms
   checkForVerticalCollision() {
      // Check collisions with collision blocks
      for (let i = 0; i < this.collisionBlocks.length; i++) {
         const collisionBlock = this.collisionBlocks[i];
         if (
            collisionDetection({
               object1: this.hitbox,
               object2: collisionBlock,
            })
         ) {
            this.isOnGround = true; // Set flag indicating player is on the ground
            // Handle collisions when moving downward
            if (this.velocity.y > 0) {
               this.velocity.y = 0; // Stop vertical movement

               // Calculate offset to adjust player position
               const offset = this.hitbox.position.y - this.position.y + this.hitbox.height;

               // Adjust player position to avoid collision
               this.position.y = collisionBlock.position.y - offset - 0.01;
               break; // Exit loop once collision is resolved
            }
            // Handle collisions when moving upward
            if (this.velocity.y < 0) {
               this.velocity.y = 0; // Stop vertical movement

               // Calculate offset to adjust player position
               const offset = this.hitbox.position.y - this.position.y;

               // Adjust player position to avoid collision
               this.position.y = collisionBlock.position.y + collisionBlock.height - offset + 0.01;
               break; // Exit loop once collision is resolved
            }
         }
      }

      // Check collisions with platforms
      const platforms = this.isInvertedColor ? this.blackPlatform : this.whitePlatform;
      for (let i = 0; i < platforms.length; i++) {
         const platformBlock = platforms[i];
         if (
            collisionDetection({
               object1: this.hitbox,
               object2: platformBlock,
            })
         ) {
            this.isOnGround = true; // Set flag indicating player is on the ground
            // Handle collisions when moving downward
            if (this.velocity.y > 0) {
               this.velocity.y = 0; // Stop vertical movement

               // Calculate offset to adjust player position
               const offset = this.hitbox.position.y - this.position.y + this.hitbox.height;

               // Adjust player position to avoid collision
               this.position.y = platformBlock.position.y - offset - 0.01;
               break; // Exit loop once collision is resolved
            }
            // Handle collisions when moving upward
            if (this.velocity.y < 0) {
               this.velocity.y = 0; // Stop vertical movement

               // Calculate offset to adjust player position
               const offset = this.hitbox.position.y - this.position.y;

               // Adjust player position to avoid collision
               this.position.y = platformBlock.position.y + platformBlock.height - offset + 0.01;
               break; // Exit loop once collision is resolved
            }
         }
      }
      // Reset flag indicating player is on the ground if no collision detected
      if (!this.isOnGround) {
         this.isOnGround = false;
      }
   }


   // Check for collision with kill platforms and handle player respawn
   checkKillBlockCollision() {
      // Loop through each kill platform
      for (let i = 0; i < this.killPlatform.length; i++) {
         const killBlock = this.killPlatform[i];
         // Check for collision between player hitbox and kill platform
         if (collisionDetection({
               object1: this.hitbox,
               object2: killBlock
            })) {
            this.respawn(); // Respawn the player
            this.respawn(); // Respawn the player
            playerScore -= 100; // Deduct score for collision with kill platform
            updatePowerLeftCounter(); // Update power left counter
            break; // Exit loop once collision is detected
         }
      }
   }

   // Check for collision with enemies and handle player interaction
   checkEnemyCollision(enemies) {
      // Loop through each enemy
      for (let i = 0; i < enemies.length; i++) {
         const enemy = enemies[i];
         // Check for collision between player hitbox and enemy hitbox
         if (collisionDetection({
               object1: this.hitbox,
               object2: enemy.hitbox,
            })) {
            // Check if player is falling onto enemy
            if (this.velocity.y > 0) {
               enemies.splice(i, 1); // Remove enemy from array
               player.velocity.y = -5; // Set player upward velocity
               this.powerLeft += 2; // Increase player power
               playerScore += 100; // Increase score for defeating enemy
               updateScoreDisplay(); // Update score display
               updatePowerLeftCounter();
               break; // Exit loop once collision is resolved
            } else if (this.position.y + this.hitbox.width < enemy.position.y) {
               this.respawn(); // Respawn the player
               playerScore -= 150; // Deduct score for colliding with enemy
               updateScoreDisplay(); // Update score display
               break; // Exit loop once collision is resolved
            }
         }
      }
   }

   // Check for collision with bounce platforms and adjust player velocity
   checkBounceCollision() {
      // Loop through each bounce platform
      for (let i = 0; i < this.bouncePlatform.length; i++) {
         const bounce = this.bouncePlatform[i];
         // Check for collision between player hitbox and bounce platform
         if (collisionDetection({
               object1: this.hitbox,
               object2: bounce,
            })) {
            // Check if player is moving downward
            if (this.velocity.y > 0) {
               this.velocity.y = -12; // Set upward velocity to bounce player
               break; // Exit loop once collision is resolved
            }
         }
      }
   }

   // Check for collision with checkpoint platforms and update player spawn point
   checkpointCollision() {
      // Loop through each checkpoint platform
      for (let i = 0; i < this.checkpoint.length; i++) {
         const checkpointBlock = this.checkpoint[i];
         // Check for collision between player hitbox and checkpoint platform
         if (collisionDetection({
               object1: this.hitbox,
               object2: checkpointBlock
            })) {
            if (!checkpointReached) {
               // Update player spawn point to the checkpoint position
               this.playerSpawn.x = checkpointBlock.position.x;
               this.playerSpawn.y = checkpointBlock.position.y;
               checkpointOffsetX = 3526; // Update checkpoint offset
               checkpointOffsetY = 500; // Update checkpoint offset
               this.powerLeft += 5; // Increase player power
               updatePowerLeftCounter(); // Update power left counter
               playerScore += 150; // Increase score for reaching checkpoint
               updateScoreDisplay(); // Update score display
               checkpointReached = true; // Set flag indicating checkpoint is reached
               break; // Exit loop once collision is resolved
            }
         }
      }
   }

   // Respawn the player at the spawn point
   respawn() {
      this.position.x = this.playerSpawn.x; // Set player x position to spawn point x
      this.position.y = this.playerSpawn.y; // Set player y position to spawn point y
      this.updateCameraBox(); // Update player's camera box position
      camera.position.x = this.position.x - (CANVAS.width / scale - (CANVAS.width / 3.4)) - checkpointOffsetX; // Update camera position
      camera.position.y = this.position.y - ((CANVAS.height / scale) + (CANVAS.height / 5.5)) - checkpointOffsetY; // Update camera position
      this.isInvertedColor = false; // Reset color inversion flag
   }

   // Check if the player is on a Quartier Général (QG) platform
   checkQG() {
      let isOnQGPlatform = false;
      // Loop through each QG platform
      for (let i = 0; i < this.qgPlatform.length; i++) {
         const QGBlock = this.qgPlatform[i];
         // Check for collision between player hitbox and QG platform
         if (collisionDetection({
               object1: this.hitbox,
               object2: QGBlock
            })) {
            isOnQGPlatform = true; // Set flag to true if player is on QG platform
            break; // Exit loop once collision is detected
         }
      }
      return isOnQGPlatform; // Return flag indicating if player is on QG platform
   }
}