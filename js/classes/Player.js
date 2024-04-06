class Player extends Sprite {
    constructor({position, collisionBlocks, whitePlatform, blackPlatform, imageSrc, frameRate, scale = 0.8, animations}) {
        super({ imageSrc, frameRate, scale});
        this.position = position;
        this.isOnGround = false;
        this.velocity = {
            x: 0,
            y: 1.0,
        };
        this.collisionBlocks = collisionBlocks;
        this.whitePlatform = whitePlatform;
        this.blackPlatform = blackPlatform;
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

            this.camerabox = {
                position:{
                    x: this.position.x,
                    y: this.position.y,
                },
                width: 200,
                height: 80,

            }
    }
    invertColors() {
        this.isInvertedColor = true;
    }

    switchSprite(key){
        if(this.image === this.animations[key].image || !this.loaded) return

        this.currentFrame = 0
        this.image = this.animations[key].image
        this.frameBuffer = this.animations[key].frameBuffer
        this.frameRate = this.animations[key].frameRate
    }

    updateCameraBox(){
        this.camerabox = {
            position:{
                x: this.position.x - 125,
                y: this.position.y - 25,
            },
            width: 300,
            height: 120,

        }
    }

    checkForHorizontalCollisionCanvas(){
        if(this.hitbox.position.x + this.hitbox.width + this.velocity.x >= bgImageWidth || this.hitbox.position.x + this.velocity.x <= 0){//CANVAS.width remplacer par la largeur de notre image bg
            this.velocity.x =0
        }
    }

    cameraToTheLeft({CANVAS, camera}){
        const cameraboxRightSide = this.camerabox.position.x + this.camerabox.width 
        const scaleCanvasWidth = CANVAS.width / scale

        if (cameraboxRightSide >= bgImageWidth) return

        if(cameraboxRightSide >= scaleCanvasWidth + Math.abs(camera.position.x)){
           camera.position.x -= this.velocity.x

        }
    }

    cameraToTheRight({CANVAS, camera}){
        if(this.camerabox.position.x <= 0) return
        if(this.camerabox.position.x <= Math.abs(camera.position.x)){
            camera.position.x -= this.velocity.x
        }
    }

    cameraToDown({CANVAS, camera}){
        if(this.camerabox.position.y + this.velocity.y <= 0) return
        if(this.camerabox.position.y <= Math.abs(camera.position.y)){
            camera.position.y -= this.velocity.y
        }
    }

    cameraToUp({CANVAS, camera}){
        if(this.camerabox.position.y + this.camerabox.height + this.velocity.y >= bgImageHeight) return
        const scaleCanvasHeight = CANVAS.height / scale

        if(this.camerabox.position.y + this.camerabox.height >= Math.abs(camera.position.y) + scaleCanvasHeight){
            camera.position.y -= this.velocity.y
        }
    }

    update() {
        this.updateFrame()
        this.updateHitbox()


        /* SCREEN.fillStyle = 'rgba(0,255,0,0.1)';
        SCREEN.fillRect(this.position.x, this.position.y, this.width, this.height);*/

        /* SCREEN.fillStyle = 'rgba(255,0,0,0.5)';
        SCREEN.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height);  */

       /*  SCREEN.fillStyle = 'rgba(0,0,255,0.5)';
        SCREEN.fillRect(this.camerabox.position.x, this.camerabox.position.y, this.camerabox.width, this.camerabox.height); */

        this.updateCameraBox()
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

                        const offset = this.hitbox.position.x - this.position.x + this.hitbox.width

                        this.position.x = collisionBlock.position.x - offset - 0.01;
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
                    this.isOnGround = true;
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

    const platforms = this.isInvertedColor ? this.blackPlatform : this.whitePlatform;

    for(let i = 0; i < platforms.length; i++){
        const platformBlock = platforms[i];
        if(
            collisionDetection({
                object1: this.hitbox,
                object2: platformBlock,
            })){
                this.isOnGround = true;
                if(this.velocity.y > 0){
                    this.velocity.y = 0;

                    const offset = this.hitbox.position.y - this.position.y + this.hitbox.height;

                    this.position.y = platformBlock.position.y - offset - 0.01;
                    break;
                }
                if(this.velocity.y < 0){
                    this.velocity.y = 0;

                    const offset = this.hitbox.position.y - this.position.y;

                    this.position.y = platformBlock.position.y + platformBlock.height - offset + 0.01;
                    break;
                }
        }
    }
    if (!this.isOnGround) {
        this.isOnGround = false;
    }

}
}
