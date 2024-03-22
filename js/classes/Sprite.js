class Sprite {
    constructor({ position, imageSrc }) {
        this.position = position;
        this.image = new Image();
        this.imageSrc = imageSrc;
        this.image.src = this.imageSrc;
        this.image.onload = () => {
            this.draw();
        };
    }
    draw() {
        if (!this.image.complete) return;
        SCREEN.drawImage(this.image, this.position.x, this.position.y);
    }

    update() {
        this.draw();
    }
}