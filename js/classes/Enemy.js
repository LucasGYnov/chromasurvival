class Enemy extends Sprite {
   constructor({ position, mobSpawn, collisionBlocks, blackPlatform, whitePlatform, imageSrc, frameRate, frameBuffer = 5, scale = 0.8 }) {
       super({
          imageSrc,
          frameRate,
          frameBuffer,
          scale
       }); // Call the superclass constructor
       this.position = {
          ...position
       }; // Position of the enemy sprite
       this.mobSpawn = {
          ...mobSpawn
       }; // Spawn point of the enemy
       this.collisionBlocks = collisionBlocks; // Array of collision blocks
       this.blackPlatform = blackPlatform; // Array of black platforms
       this.whitePlatform = whitePlatform; // Array of white platforms
       this.hitbox = { // Hitbox of the enemy sprite
          position: {
             x: this.position.x,
             y: this.position.y,
          },
          width: 10,
          height: 10
       };
       this.velocity = { // Velocity of the enemy sprite
          x: 0.3,
          y: 1.0,
       };
       this.direction = 1; // Direction of movement
    }
 
    // Method to move the enemy sprite
    moveMob() {
       const allPlatforms = this.blackPlatform.concat(this.whitePlatform); // Combine black and white platforms
       let collisionDetected = false; // Flag to indicate collision detection
 
       // Check collision with each platform
       for (const block of allPlatforms) {
          if (this.isCollidingWith(block)) {
             collisionDetected = true;
             break;
          }
       }
 
       // Reverse direction if collision detected
       if (collisionDetected) {
          this.reverseDirection();
       }
 
       // Move the sprite horizontally
       this.position.x += this.velocity.x * this.direction;
       this.position.y += this.velocity.y; // Move the sprite vertically
    }
 
    // Method to reverse the direction of movement
    reverseDirection() {
       this.direction *= -1;
    }
 
    // Method to check if the enemy sprite is colliding with a platform
    isCollidingWith(block) {
       const collidingHorizontally = this.hitbox.position.x < block.position.x + block.width &&
          this.hitbox.position.x + this.hitbox.width > block.position.x;
 
       const collidingVertically = this.hitbox.position.y < block.position.y + block.height &&
          this.hitbox.position.y + this.hitbox.height > block.position.y;
 
       return collidingHorizontally && collidingVertically;
    }
 
    // Method to check the bounds of the platforms
    checkPlatformBounds() {
       const allPlatforms = this.collisionBlocks.concat(this.blackPlatform, this.whitePlatform); // Combine all platform arrays
 
       // Calculate the position of the next block on the right and left
       const nextBlockPositionRight = {
          x: this.position.x + this.width * 1.1,
          y: this.position.y + this.height
       };
 
       const nextBlockPositionLeft = {
          x: this.position.x + uniqueBlockSize * -0.1,
          y: this.position.y + this.height
       };
 
       // Check if the next block is different and reverse the direction accordingly
       const nextBlockIsDifferentRight = allPlatforms.every(platform => !platform.isInside(nextBlockPositionRight));
       if (nextBlockIsDifferentRight) {
          this.velocity.x *= -1;
       }
 
       const nextBlockIsDifferentLeft = allPlatforms.every(platform => !platform.isInside(nextBlockPositionLeft));
       if (nextBlockIsDifferentLeft) {
          this.velocity.x *= -1;
       }
    }
 
    // Method to apply gravity to the enemy sprite
    applyGravity() {
       this.velocity.y += GRAVITY; // Apply gravity to the vertical velocity
       this.position.y += this.velocity.y; // Move the sprite vertically
    }
 
    // Method to switch the sprite image
    switchSprite(key) {
       if (this.image === this.animations[key].image || !this.loaded) return; // Return if the sprite image is already loaded or not loaded
 
       this.currentFrame = 0; // Reset the current frame
       this.image = this.animations[key].image; // Set the sprite image
       this.frameBuffer = this.animations[key].frameBuffer; // Set the frame buffer
       this.frameRate = this.animations[key].frameRate; // Set the frame rate
    }
 
    // Method to check for horizontal collision with the canvas boundaries
    checkForHorizontalCollisionCanvas() {
       // Check if the hitbox collides with the canvas boundaries
       if (this.hitbox.position.x + this.hitbox.width + this.velocity.x >= CANVAS.width || this.hitbox.position.x + this.velocity.x <= 0) {
          this.velocity.x = 0; // Stop horizontal movement if collision detected
       }
    }
 
 
    update() {
       super.update(); // Call the superclass update method
       this.updateFrame(); // Update the frame of the Enemy sprite
       this.updateHitbox(); // Update the hitbox of the Enemy sprite
       this.checkPlatformBounds(); // Check if the Enemy sprite is within platform bounds
       this.moveMob(); // Move the Enemy sprite
 
       // Uncomment to draw debug rectangles
       /* SCREEN.fillStyle = 'rgba(0,255,0,0.1)';
       SCREEN.fillRect(this.position.x, this.position.y, this.width, this.height); */
 
       /*  SCREEN.fillStyle = 'rgba(255,0,0,0.5)';
        SCREEN.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height);  */
 
       /*             const nextBlockPosition = {
             x: this.position.x + uniqueBlockSize*1.2,
             y: this.position.y + this.height + 1
         };
 */
       /* const nextBlockPosition = {
             x: this.position.x + uniqueBlockSize * 1.1,
             y: this.position.y + this.height
         };
 
         const nextBlockPosition2 = {
             x: this.position.x + uniqueBlockSize * -0.1,
             y: this.position.y + this.height
         };
     
         // Dessiner le rectangle autour de nextBlockPosition
         SCREEN.fillStyle = 'rgba(255, 0, 0, 0.5)';
         SCREEN.fillRect(nextBlockPosition.x, nextBlockPosition.y, uniqueBlockSize, uniqueBlockSize);
 
         SCREEN.fillStyle = 'rgba(0, 255, 0, 0.5)';
         SCREEN.fillRect(nextBlockPosition2.x, nextBlockPosition2.y, uniqueBlockSize, uniqueBlockSize); */
 
       // Draw the Enemy sprite
       this.draw();
 
       // Update the position of the Enemy sprite horizontally
       this.position.x += this.velocity.x;
 
       // Update the hitbox of the Enemy sprite
       this.updateHitbox();
 
       // Check for horizontal collision with platforms
       this.checkForHorizontalCollision();
 
       // Apply gravity to the Enemy sprite
       this.applyGravity();
 
       // Update the hitbox of the Enemy sprite
       this.updateHitbox();
 
       // Check for vertical collision with platforms
       this.checkForVerticalCollision();
    }
 
    // Update the hitbox of the Enemy sprite
    updateHitbox() {
       this.hitbox = {
          position: {
             x: this.position.x + 3, // Adjusted hitbox x position
             y: this.position.y + 9, // Adjusted hitbox y position
          },
          width: 19, // Hitbox width
          height: 16 // Hitbox height
       };
    }
 
    // Check for horizontal collision with platforms
    checkForHorizontalCollision() {
       const allPlatforms = this.collisionBlocks.concat(this.blackPlatform, this.whitePlatform);
       for (let i = 0; i < allPlatforms.length; i++) {
          const collisionBlock = allPlatforms[i];
          if (collisionDetection({
                object1: this.hitbox,
                object2: collisionBlock,
             })) {
             if (this.velocity.x > 0) { // Collision from the right
                this.velocity.x = 0;
                const offset = this.hitbox.position.x - this.position.x + this.hitbox.width;
                this.position.x = collisionBlock.position.x - offset - 0.01; // Adjust position to prevent overlap
                break;
             }
             if (this.velocity.x < 0) { // Collision from the left
                this.velocity.x = 0;
                const offset = this.hitbox.position.x - this.position.x;
                this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01; // Adjust position to prevent overlap
                break;
             }
          }
       }
    }
 
    // Check for vertical collision with platforms
    checkForVerticalCollision() {
       const allPlatforms = this.collisionBlocks.concat(this.blackPlatform, this.whitePlatform);
       for (let i = 0; i < allPlatforms.length; i++) {
          const collisionBlock = allPlatforms[i];
          if (collisionDetection({
                object1: this.hitbox,
                object2: collisionBlock,
             })) {
             this.isOnGround = true;
             if (this.velocity.y > 0) { // Collision from the top
                this.velocity.y = 0;
                const offset = this.hitbox.position.y - this.position.y + this.hitbox.height;
                this.position.y = collisionBlock.position.y - offset - 0.01; // Adjust position to prevent overlap
                break;
             }
             if (this.velocity.y < 0) { // Collision from the bottom
                this.velocity.y = 0;
                const offset = this.hitbox.position.y - this.position.y;
                this.position.y = collisionBlock.position.y + collisionBlock.height - offset + 0.01; // Adjust position to prevent overlap
                break;
             }
          }
       }
    }
 }