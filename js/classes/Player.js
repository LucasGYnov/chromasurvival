class Player {
    constructor(position) {
        this.position = position;
        this.velocity = {
            x: 0,
            y: 1.0,
        };
        this.width = 100;
        this.height = 150;
        this.image = new Image();
        this.image.src = './img/player2.png';
        this.isInvertedColor = false;
    }
        invertColors() {
        this.isInvertedColor = true;
    }

    draw() {
        if (!this.image.complete) return;
        SCREEN.save();
        if (this.isInvertedColor) {
            SCREEN.filter = 'invert(100%)'; // Appliquer le filtre au contexte de rendu
        }
        SCREEN.drawImage(this.image, this.position.x, this.position.y, this.width, this.height); 
        SCREEN.restore();
    }
    update() {
        this.draw();
        this.position.y += this.velocity.y;
        if (this.position.y + this.height + this.velocity.y < CANVAS.height)
            this.velocity.y += GRAVITY;
        else this.velocity.y = 0;
    }
}