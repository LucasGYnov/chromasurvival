class Platform {
    constructor({ position, color = 'rgba(255, 0, 0, 0.5)' }) {
        this.position = position;
        this.width = 16;
        this.height = 16;
        this.color = color;
    }

    isInside(point) {
        return (
            point.x >= this.position.x &&
            point.x <= this.position.x + this.width &&
            point.y >= this.position.y &&
            point.y <= this.position.y + this.height
        );
    }
    
    draw(color) {
        SCREEN.fillStyle = color || this.color;
        SCREEN.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.draw();
    }
}
