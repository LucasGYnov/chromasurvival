class Enemy extends Sprite {
    constructor({position, mobSpawn, collisionBlocks, blackPlatform, whitePlatform, imageSrc, frameRate, scale = 0.8}) {
        super({ imageSrc, frameRate, scale});
        this.position = {...position};
        this.mobSpawn = {...mobSpawn};
        this.collisionBlocks = collisionBlocks;
        this.blackPlatform = blackPlatform;
        this.whitePlatform = whitePlatform;
        this.hitbox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            width: 10,
            height: 10
        };
        this.velocity = {
            x: 0.3,
            y: 1.0,
        };

        this.direction = 1;
    }


    moveMob() {
        const allPlatforms = this.blackPlatform.concat(this.whitePlatform);
        let collisionDetected = false;
        
        for (const block of allPlatforms) {
            if (this.isCollidingWith(block)) {
                collisionDetected = true;
                break;
            }
        }
    
        if (collisionDetected) {
            this.reverseDirection();
        }
    
        this.position.x += this.velocity.x * this.direction;
        this.position.y += this.velocity.y;
    }
    

    isCollidingWith(block) {
        const collidingHorizontally = this.hitbox.position.x < block.position.x + block.width &&
            this.hitbox.position.x + this.hitbox.width > block.position.x;
    
        const collidingVertically = this.hitbox.position.y < block.position.y + block.height &&
            this.hitbox.position.y + this.hitbox.height > block.position.y;
    
        return collidingHorizontally && collidingVertically;
    }
    checkPlatformBounds() {
        const allPlatforms = this.collisionBlocks.concat(this.blackPlatform, this.whitePlatform);
    
        const nextBlockPositionRight = {
            x: this.position.x + this.width * 1.1,
            y: this.position.y + this.height
        };

        const nextBlockPositionLeft = {
            x: this.position.x + uniqueBlockSize * -0.1,
            y: this.position.y + this.height
        };
    
        const nextBlockIsDifferentRight = allPlatforms.every(platform => !platform.isInside(nextBlockPositionRight));
        if (nextBlockIsDifferentRight) {
            this.velocity.x *= -1;
        }


        const nextBlockIsDifferentLeft = allPlatforms.every(platform => !platform.isInside(nextBlockPositionLeft));
        if (nextBlockIsDifferentLeft) {
            this.velocity.x *= -1;
        }
    }


    applyGravity(){
        this.velocity.y += GRAVITY;
        this.position.y += this.velocity.y;
    }

    switchSprite(key){
        if(this.image === this.animations[key].image || !this.loaded) return

        this.currentFrame = 0
        this.image = this.animations[key].image
        this.frameBuffer = this.animations[key].frameBuffer
        this.frameRate = this.animations[key].frameRate
    }

    checkForHorizontalCollisionCanvas(){
        if(this.hitbox.position.x + this.hitbox.width + this.velocity.x >= CANVAS.width || this.hitbox.position.x + this.velocity.x <= 0){//CANVAS.width remplacer par la largeur de notre image bg
            this.velocity.x = 0
        }
    }

    update() {
        super.update();
        this.updateFrame()
        this.updateHitbox()
        this.checkPlatformBounds()
        this.moveMob()


        /* SCREEN.fillStyle = 'rgba(0,255,0,0.1)';
        SCREEN.fillRect(this.position.x, this.position.y, this.width, this.height); */

        SCREEN.fillStyle = 'rgba(255,0,0,0.5)';
        SCREEN.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height); 

        /*             const nextBlockPosition = {
            x: this.position.x + uniqueBlockSize*1.2,
            y: this.position.y + this.height + 1
        };
*/
        /* const nextBlockPosition = {
            x: this.position.x + uniqueBlockSize * 1.1,
            y: this.position.y + this.height
        };

        const nextBlockPosition2 = {
            x: this.position.x + uniqueBlockSize * -0.1,
            y: this.position.y + this.height
        };
    
        // Dessiner le rectangle autour de nextBlockPosition
        SCREEN.fillStyle = 'rgba(255, 0, 0, 0.5)';
        SCREEN.fillRect(nextBlockPosition.x, nextBlockPosition.y, uniqueBlockSize, uniqueBlockSize);

        SCREEN.fillStyle = 'rgba(0, 255, 0, 0.5)';
        SCREEN.fillRect(nextBlockPosition2.x, nextBlockPosition2.y, uniqueBlockSize, uniqueBlockSize); */
    
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
                x: this.position.x + 3,
                y: this.position.y + 9,
            },
                width:19,
                height:16
            }
    }

    checkForHorizontalCollision() {
        const allPlatforms = this.collisionBlocks.concat(this.blackPlatform, this.whitePlatform);
        for (let i = 0; i < allPlatforms.length; i++) {
            const collisionBlock = allPlatforms[i];
            if (
                collisionDetection({
                    object1: this.hitbox,
                    object2: collisionBlock,
                })
            ) {
                if (this.velocity.x > 0) {
                    this.velocity.x = 0;
                    const offset = this.hitbox.position.x - this.position.x + this.hitbox.width;
                    this.position.x = collisionBlock.position.x - offset - 0.01;
                    break;
                }
                if (this.velocity.x < 0) {
                    this.velocity.x = 0;
                    const offset = this.hitbox.position.x - this.position.x;
                    this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01;
                    break;
                }
            }
        }
    }

    checkForVerticalCollision() {
        const allPlatforms = this.collisionBlocks.concat(this.blackPlatform, this.whitePlatform);
        for (let i = 0; i < allPlatforms.length; i++) {
            const collisionBlock = allPlatforms[i];
            if (
                collisionDetection({
                    object1: this.hitbox,
                    object2: collisionBlock,
                })
            ) {
                this.isOnGround = true;
                if (this.velocity.y > 0) {
                    this.velocity.y = 0;
                    const offset = this.hitbox.position.y - this.position.y + this.hitbox.height;
                    this.position.y = collisionBlock.position.y - offset - 0.01;
                    break;
                }
                if (this.velocity.y < 0) {
                    this.velocity.y = 0;
                    const offset = this.hitbox.position.y - this.position.y;
                    this.position.y = collisionBlock.position.y + collisionBlock.height - offset + 0.01;
                    break;
                }
            }
        }
    }
}