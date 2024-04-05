class Player extends Sprite {
    constructor({position, collisionBlocks, imageSrc, frameRate}) {
        super({ imageSrc});
        this.position = position;
        this.velocity = {
            x: 0,
            y: 1.0,
        };
        /* this.width = 50 / scale; */
        /* this.height = 50 / scale; */
        this.collisionBlocks = collisionBlocks;
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

    /* draw(){
        SCREEN.save();
        SCREEN.fillStyle = 'white';
        SCREEN.fillRect(this.position.x, this.position.y, this.width, this.height);
        SCREEN.restore();
    } */

    update() {
        SCREEN.fillStyle = 'rgba(0,255,0,0.1)';
        SCREEN.fillRect(this.position.x, this.position.y, this.width, this.height);
        this.draw();
        this.position.x += this.velocity.x;
        this.checkForHorizontalCollision()
        this.applyGravity()
        this.checkForVerticalCollision()
    }

    checkForHorizontalCollision(){
        for(let i = 0; i < this.collisionBlocks.length; i++){
            const collisionBlock = this.collisionBlocks[i]
            if(
                collisionDetection({
                    object1: this,
                    object2: collisionBlock,
                })){
                    if(this.velocity.x > 0){
                        this.velocity.x = 0;
                        this.position.x = collisionBlock.position.x - this.width - 0.01;
                        break
                    }
                    if(this.velocity.x < 0){
                        this.velocity.x = 0;
                        this.position.x = collisionBlock.position.x + collisionBlock.width + 0.01;
                        break
                    }
            }
        }
    }

    applyGravity(){
        this.position.y += this.velocity.y;
        this.velocity.y += GRAVITY;
    }
    checkForVerticalCollision(){
        for(let i = 0; i < this.collisionBlocks.length; i++){
            const collisionBlock = this.collisionBlocks[i]
            if(
                collisionDetection({
                    object1: this,
                    object2: collisionBlock,
                })){
                    if(this.velocity.y > 0){
                        this.velocity.y = 0;
                        this.position.y = collisionBlock.position.y - this.height - 0.01;
                        break
                    }
                    if(this.velocity.y < 0){
                        this.velocity.y = 0;
                        this.position.y = collisionBlock.position.y + collisionBlock.height + 0.01;
                        break
                    }
            }
        }
    }
}
