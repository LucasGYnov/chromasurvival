class Player extends Sprite {
    constructor({position, collisionBlocks, imageSrc, frameRate, scale = 0.8, animations}) {
        super({ imageSrc, frameRate, scale});
        this.position = position;
        this.velocity = {
            x: 0,
            y: 1.0,
        };
        this.collisionBlocks = collisionBlocks;
        this.hitbox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
                width:10,
                height:10
            }
            this.animations = animations
            this.lastDirection = 'right'
            this.isInvertedColor = false;

            for(let key in this.animations) {
                const image = new Image()
                image.src = this.animations[key].imageSrc

                this.animations[key].image = image
            }
    }
    invertColors() {
        this.isInvertedColor = true;
    }

    switchSprite(key){
        if(this.image === this.animations[key].image || !this.loaded) return

        this.image = this.animations[key].image
        this.frameBuffer = this.animations[key].frameBuffer
        this.frameRate = this.animations[key].frameRate
    }

    update() {
        this.updateFrame()
        this.updateHitbox()


        /* SCREEN.fillStyle = 'rgba(0,255,0,0.1)';
        SCREEN.fillRect(this.position.x, this.position.y, this.width, this.height);

        SCREEN.fillStyle = 'rgba(255,0,0,0.5)';
        SCREEN.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height); */

        this.draw();
        this.position.x += this.velocity.x;
        this.updateHitbox()
        this.checkForHorizontalCollision()
        this.applyGravity()
        this.updateHitbox()
        this.checkForVerticalCollision()
    }

    updateHitbox() {
        this.hitbox = {
            position: {
                x: this.position.x +  17,
                y: this.position.y + 16,
            },
                width:16,
                height:35
            }
    }

    checkForHorizontalCollision(){
        for(let i = 0; i < this.collisionBlocks.length; i++){
            const collisionBlock = this.collisionBlocks[i]
            if(
                collisionDetection({
                    object1: this.hitbox,
                    object2: collisionBlock,
                })){
                    if(this.velocity.x > 0){
                        this.velocity.x = 0;

                        // const offset = this.hitbox.position.x - this.position.x + this.hitbox.width

                        this.position.x = collisionBlock.position.x - this.width - 0.01;
                        break
                    }
                    if(this.velocity.x < 0){
                        this.velocity.x = 0;

                        const offset = this.hitbox.position.x - this.position.x

                        this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01;
                        break
                    }
            }
        }
    }

    applyGravity(){
        this.velocity.y += GRAVITY;
        this.position.y += this.velocity.y;
    }
    checkForVerticalCollision(){
        for(let i = 0; i < this.collisionBlocks.length; i++){
            const collisionBlock = this.collisionBlocks[i]
            if(
                collisionDetection({
                    object1: this.hitbox,
                    object2: collisionBlock,
                })){
                    if(this.velocity.y > 0){
                        this.velocity.y = 0;

                        const offset = this.hitbox.position.y - this.position.y + this.hitbox.height

                        this.position.y = collisionBlock.position.y - offset - 0.01;
                        break
                    }
                    if(this.velocity.y < 0){
                        this.velocity.y = 0;

                        const offset = this.hitbox.position.y - this.position.y

                        this.position.y = collisionBlock.position.y + collisionBlock.height - offset + 0.01;
                        break
                    }
            }
        }
    }
}
