class Platform {
    constructor({
       position, color = 'rgba(255, 0, 0, 0.5)'
    }) {
       this.position = position; // Position of the platform
       this.width = 16; // Width of the platform
       this.height = 16; // Height of the platform
       this.color = color; // Color of the platform
    }
 
    // Method to check if a point is inside the platform
    isInside(point) {
       return (
          point.x >= this.position.x &&
          point.x <= this.position.x + this.width &&
          point.y >= this.position.y &&
          point.y <= this.position.y + this.height
       );
    }
 
    // Method to draw the platform
    draw(color) {
       SCREEN.fillStyle = color || this.color; // Set fill style to the platform's color
       SCREEN.fillRect(this.position.x, this.position.y, this.width, this.height); // Draw the platform
    }
 
    // Method to update the platform (currently just draws it)
    update() {
       this.draw(); // Draw the platform
    }
 }