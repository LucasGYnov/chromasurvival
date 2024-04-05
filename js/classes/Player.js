class Player {
    constructor({position, collisionBlocks}) {
        this.position = position;
        this.velocity = {
            x: 0,
            y: 1.0,
        };
        this.width = 100;
        this.height = 100;
        this.collisionBlocks = collisionBlocks;
        this.image = new Image();
        this.image.src = './img/player2.png';
        this.isInvertedColor = false;
    }
        invertColors() {
        this.isInvertedColor = true;
    }

    /* draw() {
        if (!this.image.complete) return;
        SCREEN.save();
        if (this.isInvertedColor) {
            SCREEN.filter = 'invert(100%)';
        }
        SCREEN.drawImage(this.image, this.position.x, this.position.y, this.width, this.height); 
        SCREEN.restore();
    } */

    draw(){
        SCREEN.save();
        SCREEN.fillStyle = 'white';
        SCREEN.fillRect(this.position.x, this.position.y, this.width, this.height);
        if (this.isInvertedColor) {
            SCREEN.filter = 'invert(100%)';
        }
        SCREEN.restore();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.applyGravity()
        this.checkForVerticalCollision()
    }
    applyGravity(){
        this.position.y += this.velocity.y;
        this.velocity.y += GRAVITY;
    }
    checkForVerticalCollision(){
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i]
    
            if(
                collision({
                    object1: this,
                    object2: collisionBlock,
                })
            ){
                console.log("we are colliding")
            }
        }
    }

}
