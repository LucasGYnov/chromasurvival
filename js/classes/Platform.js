class Platform {
    constructor({ position, color = 'rgba(255, 0, 0, 0.5)' }) {
        this.position = position;
        this.width = 16;
        this.height = 16;
        this.color = color;
    }
    
    draw(color) {
        SCREEN.fillStyle = color || this.color;
        SCREEN.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.draw();
    }
}
