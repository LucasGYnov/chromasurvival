class Sprite {
    constructor({
       position,
       imageSrc,
       frameRate = 1,
       frameBuffer = 5,
       scale = 1
    }) {
       // Initialize sprite properties
       this.scale = scale; // Scale factor for the sprite
       this.position = position; // Position of the sprite on the canvas
       this.loaded = false; // Flag to indicate if the image is loaded
       this.image = new Image(); // Create a new image object
       this.image.onload = () => {
          // Once the image is loaded, calculate sprite dimensions
          this.width = (this.image.width / this.frameRate) * scale; // Width of a single frame
          this.height = this.image.height * scale; // Height of the sprite
          this.loaded = true; // Set loaded flag to true
       }
       this.image.src = imageSrc; // Set the image source
       this.frameRate = frameRate; // Frame rate for sprite animation
       this.currentFrame = 0; // Current frame of the sprite animation
       this.frameBuffer = frameBuffer; // Frame buffer to control animation speed
       this.elapsedFrames = 0; // Counter to track elapsed frames
    }
 
    // Draw the sprite on the canvas
    draw() {
       if (!this.image.complete) return; // Return if the image is not fully loaded
 
       // Define crop box for the current frame
       const cropbox = {
          position: {
             x: this.currentFrame * this.image.width / this.frameRate, // X position of the frame
             y: 0, // Y position of the frame (always 0 for horizontal sprite sheets)
          },
          width: this.image.width / this.frameRate, // Width of a single frame
          height: this.image.height, // Height of the sprite (same for all frames)
       };
 
       // Draw the sprite on the canvas
       SCREEN.drawImage(
          this.image, // Image object
          cropbox.position.x, // X position of the frame in the sprite sheet
          cropbox.position.y, // Y position of the frame in the sprite sheet
          cropbox.width, // Width of the frame
          cropbox.height, // Height of the frame
          this.position.x, // X position on the canvas
          this.position.y, // Y position on the canvas
          this.width, // Width of the sprite on the canvas
          this.height // Height of the sprite on the canvas
       );
    }
 
    // Update the sprite (draw and advance animation frame)
    update() {
       this.draw(); // Draw the sprite
       this.updateFrame(); // Update the animation frame
    }
 
    // Update the animation frame based on the frame buffer
    updateFrame() {
       this.elapsedFrames++; // Increment elapsed frames counter
       if (this.elapsedFrames % this.frameBuffer === 0) { // Check if it's time to advance frame
          if (this.currentFrame < this.frameRate - 1) // Check if current frame is not the last frame
             this.currentFrame++; // Move to the next frame
          else
             this.currentFrame = 0; // Reset to the first frame if reached the end
       }
    }
 }