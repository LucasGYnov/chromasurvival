class Player extends Sprite {
    constructor({position, playerSpawn, collisionBlocks, whitePlatform, blackPlatform, killPlatform, qgPlatform, bouncePlatform, imageSrc, frameRate, scale = 0.8, powerLeft, animations, checkpoint}) {
        super({
          imageSrc,
          frameRate,
          scale
       }); // Call the constructor of the parent class (Sprite)
 
       // Initialize player properties
       this.position = {
          ...position
       }; // Player's current position
       this.playerSpawn = {
          ...playerSpawn
       }; // Player's spawn position
       this.isOnGround = false; // Flag to indicate if the player is on the ground
       this.velocity = { // Player's velocity in x and y directions
          x: 0,
          y: 1.0,
       };
       this.collisionBlocks = collisionBlocks; // Array of collision blocks
       this.whitePlatform = whitePlatform; // White platform object
       this.blackPlatform = blackPlatform; // Black platform object
       this.killPlatform = killPlatform; // Kill platform object
       this.qgPlatform = qgPlatform; // QG platform object
       this.bouncePlatform = bouncePlatform; // Bounce platform object
       this.hitbox = { // Player's hitbox
          position: {
             x: this.position.x,
             y: this.position.y,
          },
          width: 10, // Hitbox width
          height: 10 // Hitbox height
       };
       this.animations = animations; // Animations for the player
       this.powerLeft = powerLeft; // Remaining power for special abilities
       this.lastDirection = 'right'; // Last movement direction of the player
       this.isInvertedColor = false; // Flag to indicate if player's color is inverted
       this.checkpoint = checkpoint; // Player's checkpoint position
 
       // Load animation images
       for (let key in this.animations) {
          const image = new Image();
          image.src = this.animations[key].imageSrc;
          this.animations[key].image = image;
       }
 
       // Define camera box dimensions
       this.camerabox = {
          position: {
             x: this.position.x,
             y: this.position.y,
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
       // Check if the current image is already the same as the one for the specified animation key or if the image hasn't been loaded yet
       if (this.image === this.animations[key].image || !this.loaded) return;
 
       // Reset the current frame to start from the beginning of the animation
       this.currentFrame = 0;
 
       // Update the sprite's image, frame buffer, and frame rate based on the specified animation key
       this.image = this.animations[key].image;
       this.frameBuffer = this.animations[key].frameBuffer;
       this.frameRate = this.animations[key].frameRate;
    }
 
    // Update the camera box position and dimensions based on the sprite's position
    updateCameraBox() {
       // Set the camera box position to be centered around the sprite's position
       this.camerabox = {
          position: {
             x: this.position.x - 125, // Adjusted x position to center the camera box
             y: this.position.y - 25, // Adjusted y position to center the camera box
          },
          width: 300, // Camera box width
          height: 120, // Camera box height
       }
    }
 
    // Check for horizontal collisions with the canvas boundaries
    checkForHorizontalCollisionCanvas() {
       // Check if the sprite is about to collide with the left or right boundaries of the canvas
       if (this.hitbox.position.x + this.hitbox.width + this.velocity.x >= (CANVAS.width * 2) || this.hitbox.position.x + this.velocity.x <= 0) {
          // If collision is detected, stop horizontal movement
          this.velocity.x = 0;
       }
    }
 
    // Move the camera to the left if the sprite is moving towards the right boundary of the canvas
    cameraToTheLeft({
       CANVAS,
       camera
    }) {
       const cameraboxRightSide = this.camerabox.position.x + this.camerabox.width;
       const scaleCanvasWidth = bgImageWidth / scale;
 
       // Check if the right side of the camera box is reaching the right boundary of the canvas
       if (cameraboxRightSide >= (CANVAS.width * 2)) return;
 
       // Check if the camera box is overlapping with the scaled canvas width plus the absolute value of the camera's x position
       if (cameraboxRightSide >= scaleCanvasWidth + Math.abs(camera.position.x)) {
          // Move the camera to the left by adjusting its position based on the sprite's velocity
          camera.position.x -= this.velocity.x;
       }
    }
 
    // Move the camera to the right if the sprite is moving towards the left boundary of the canvas
    cameraToTheRight({
       CANVAS,
       camera
    }) {
       // Check if the left side of the camera box is reaching the left boundary of the canvas
       if (this.camerabox.position.x <= 0) return;
 
       // Check if the camera box is overlapping with the absolute value of the camera's x position
       if (this.camerabox.position.x <= Math.abs(camera.position.x)) {
          // Move the camera to the right by adjusting its position based on the sprite's velocity
          camera.position.x -= this.velocity.x;
       }
    }
 
    // Move the camera downward if the sprite is moving upward
    cameraToDown({
       CANVAS,
       camera
    }) {
       // Check if moving downward will exceed the top boundary of the canvas
       if ((this.camerabox.position.y + this.velocity.y) <= 0) return;
 
       // Check if the camera box is overlapping with the absolute value of the camera's y position
       if (this.camerabox.position.y <= Math.abs(camera.position.y)) {
          // Move the camera downward by adjusting its position based on the sprite's velocity
          camera.position.y -= this.velocity.y;
       }
    }
 
    // Move the camera upward if the sprite is moving downward
    cameraToUp({
       CANVAS,
       camera
    }) {
       // Check if moving upward will exceed the bottom boundary of the canvas
       if (this.camerabox.position.y + this.camerabox.height + this.velocity.y >= bgImageHeight) return;
       const scaleCanvasHeight = CANVAS.height / scale;
 
       // Check if the camera box is overlapping with the scaled canvas height plus half of the scaled canvas height
       if (this.camerabox.position.y + this.camerabox.height >= Math.abs(camera.position.y) + scaleCanvasHeight / 1.5) {
          // Move the camera upward by adjusting its position based on the sprite's velocity
          camera.position.y -= this.velocity.y;
       }
    }
 
 
    update() {
       // Apply color inversion effect if needed
       if (this.isInvertedColor) {
          SCREEN.filter = 'invert(100%)';
       }
 
       // Call the update method of the parent class (Sprite)
       super.update();
 
       // Update the sprite's frame and hitbox
       this.updateFrame();
       this.updateHitbox();
 
       // Display the base sprite image
       this.draw();
 
       // Additional rendering for debugging purposes
       /* SCREEN.fillStyle = 'rgba(0,255,0,0.1)';
       SCREEN.fillRect(this.position.x, this.position.y, this.width, this.height);*/
 
       /* SCREEN.fillStyle = 'rgba(255,0,0,0.5)';
       SCREEN.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height);  */
 
       /* SCREEN.fillStyle = 'rgba(0,0,255,0.5)';
       SCREEN.fillRect(this.camerabox.position.x, this.camerabox.position.y, this.camerabox.width, this.camerabox.height); */
 
       // Display the player's home base
       afficherQG();
 
       // Update the camera box position
       this.updateCameraBox();
 
       // Check for interactions with the home base
       this.checkQG();
 
       // Check for collision with the checkpoint
       this.checkpointCollision();
 
       // Check for collision with kill blocks
       this.checkKillBlockCollision();
 
       // Check for collision with enemies
       this.checkEnemyCollision(enemieslevel1);
 
       // Check for collision with bounce platforms
       this.checkBounceCollision();
 
       // Move the player horizontally
       this.position.x += this.velocity.x;
       // Check for horizontal collisions
       this.checkForHorizontalCollision();
 
       // Apply gravity to the player
       this.applyGravity();
 
       // Update the player's hitbox
       this.updateHitbox();
 
       // Check for vertical collisions
       this.checkForVerticalCollision();
 
       // Update the score display
       updateScoreDisplay();
    }
 
    // Update the hitbox position and dimensions
    updateHitbox() {
       this.hitbox = {
          position: {
             x: this.position.x + 17, // Adjusted hitbox x position
             y: this.position.y + 16, // Adjusted hitbox y position
          },
          width: 16, // Hitbox width
          height: 35 // Hitbox height
       };
    }
 
    // Check for horizontal collisions with collision blocks and platforms
    checkForHorizontalCollision() {
       // Check collision with collision blocks
       for (let i = 0; i < this.collisionBlocks.length; i++) {
          const collisionBlock = this.collisionBlocks[i];
          if (
             collisionDetection({
                object1: this.hitbox,
                object2: collisionBlock,
             })) {
             if (this.velocity.x > 0) {
                this.velocity.x = 0;
 
                const offset = this.hitbox.position.x - this.position.x + this.hitbox.width;
 
                this.position.x = collisionBlock.position.x - offset - 0.01;
                break;
             }
             if (this.velocity.x < 0) {
                this.velocity.x = 0;
 
                const offset = this.hitbox.position.x - this.position.x;
 
                this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01;
                break;
             }
          }
       }
 
       // Check collision with platforms
       const platforms = this.isInvertedColor ? this.blackPlatform : this.whitePlatform;
       for (let i = 0; i < platforms.length; i++) {
          const platformBlock = platforms[i];
          if (
             collisionDetection({
                object1: this.hitbox,
                object2: platformBlock,
             })
          ) {
             if (this.velocity.x > 0) {
                this.velocity.x = 0;
 
                const offset = this.hitbox.position.x - this.position.x + this.hitbox.width;
 
                this.position.x = platformBlock.position.x - offset - 0.01;
                break;
             }
             if (this.velocity.x < 0) {
                this.velocity.x = 0;
 
                const offset = this.hitbox.position.x - this.position.x;
 
                this.position.x = platformBlock.position.x + platformBlock.width - offset + 0.01;
                break;
             }
          }
       }
    }
 
    // Apply gravity to the player
    applyGravity() {
       this.velocity.y += GRAVITY;
       this.position.y += this.velocity.y;
    }
 
 
    // Check for collisions with the ground and platforms
    checkForVerticalCollision() {
       // Check collision with collision blocks
       for (let i = 0; i < this.collisionBlocks.length; i++) {
          const collisionBlock = this.collisionBlocks[i];
          if (
             collisionDetection({
                object1: this.hitbox,
                object2: collisionBlock,
             })
          ) {
             this.isOnGround = true;
             if (this.velocity.y > 0) {
                this.velocity.y = 0;
 
                const offset = this.hitbox.position.y - this.position.y + this.hitbox.height;
 
                this.position.y = collisionBlock.position.y - offset - 0.01;
                break;
             }
             if (this.velocity.y < 0) {
                this.velocity.y = 0;
 
                const offset = this.hitbox.position.y - this.position.y;
 
                this.position.y = collisionBlock.position.y + collisionBlock.height - offset + 0.01;
                break;
             }
          }
       }
 
       // Check collision with platforms
       const platforms = this.isInvertedColor ? this.blackPlatform : this.whitePlatform;
       for (let i = 0; i < platforms.length; i++) {
          const platformBlock = platforms[i];
          if (
             collisionDetection({
                object1: this.hitbox,
                object2: platformBlock,
             })) {
             this.isOnGround = true;
             if (this.velocity.y > 0) {
                this.velocity.y = 0;
 
                const offset = this.hitbox.position.y - this.position.y + this.hitbox.height;
 
                this.position.y = platformBlock.position.y - offset - 0.01;
                break;
             }
             if (this.velocity.y < 0) {
                this.velocity.y = 0;
 
                const offset = this.hitbox.position.y - this.position.y;
 
                this.position.y = platformBlock.position.y + platformBlock.height - offset + 0.01;
                break;
             }
          }
       }
       // Reset the 'isOnGround' flag if not touching any ground or platform
       if (!this.isOnGround) {
          this.isOnGround = false;
       }
    }
 
    // Check for collision with kill blocks
    checkKillBlockCollision() {
       for (let i = 0; i < this.killPlatform.length; i++) {
          const killBlock = this.killPlatform[i];
          if (collisionDetection({
                object1: this.hitbox,
                object2: killBlock
             })) {
             this.respawn(); // Respawn the player
             playerScore -= 100; // Deduct score
             updatePowerLeftCounter(); // Update power left counter
             break;
          }
       }
    }
 
    // Check for collision with enemies
    checkEnemyCollision(enemies) {
       for (let i = 0; i < enemies.length; i++) {
          const enemy = enemies[i];
          if (collisionDetection({
                object1: this.hitbox,
                object2: enemy.hitbox,
             })) {
             if (this.velocity.y > 0) { // Player is falling
                enemies.splice(i, 1); // Remove the enemy
                this.velocity.y = -5; // Bounce player upward
                this.powerLeft += 2; // Increase power left
                playerScore += 100; // Increase score
                updateScoreDisplay(); // Update score display
                break;
             } else if (this.position.y + this.hitbox.width < enemy.position.y) { // Player is above enemy
                playerScore -= 150; // Deduct score
                updateScoreDisplay(); // Update score display
                this.respawn(); // Respawn the player
                break;
             }
          }
       }
    }
 
    // Check for collision with bounce platforms
    checkBounceCollision() {
       for (let i = 0; i < this.bouncePlatform.length; i++) {
          const bounce = this.bouncePlatform[i];
          if (collisionDetection({
                object1: this.hitbox,
                object2: bounce,
             })) {
             if (this.velocity.y > 0) { // Player is falling
                this.velocity.y = -12; // Bounce player upward
                break;
             }
          }
       }
    }
 
    // Check collision with checkpoints
    checkpointCollision() {
       for (let i = 0; i < this.checkpoint.length; i++) {
          const checkpointBlock = this.checkpoint[i];
          if (collisionDetection({
                object1: this.hitbox,
                object2: checkpointBlock
             })) {
             if (!checkpointReached) { // If checkpoint not reached before
                this.playerSpawn.x = checkpointBlock.position.x; // Update player spawn point
                this.playerSpawn.y = checkpointBlock.position.y;
                checkpointOffsetX = 3526; // Adjust checkpoint offset
                checkpointOffsetY = 500;
                this.powerLeft += 5; // Increase power left
                updatePowerLeftCounter(); // Update power left counter
                playerScore += 150; // Increase score
                updateScoreDisplay(); // Update score display
                checkpointReached = true; // Set checkpoint as reached
                break;
             }
          }
       }
    }
 
    // Respawn the player at the spawn point
    respawn() {
       this.position.x = this.playerSpawn.x;
       this.position.y = this.playerSpawn.y;
       this.updateCameraBox();
 
       camera.position.x = this.position.x - (CANVAS.width / scale - (CANVAS.width / 3.4)) - checkpointOffsetX;
       camera.position.y = this.position.y - ((CANVAS.height / scale) + (CANVAS.height / 5.5)) - checkpointOffsetY;
 
       this.isInvertedColor = false; // Reset color inversion
    }
 
    // Check if the player is on the home base platform
    checkQG() {
       let isOnQGPlatform = false;
       for (let i = 0; i < this.qgPlatform.length; i++) {
          const QGBlock = this.qgPlatform[i];
          if (collisionDetection({
                object1: this.hitbox,
                object2: QGBlock
             })) {
             isOnQGPlatform = true;
             break;
          }
       }
       return isOnQGPlatform; // Return whether player is on home base platform
    }
 }