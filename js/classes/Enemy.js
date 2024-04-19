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
                x: 0.5,
                y: 1.0,
            };
            this.isInvertedColorMob = false;

            this.direction = 1;

            setInterval(() => {
                this.invertColorsMob();
            }, 1500);
        }

        reverseDirection() {
            this.direction *= -1;
        }

        moveMob() {
            const allPlatforms = this.blackPlatform.concat(this.whitePlatform);
            for (const block of allPlatforms) {
                if (this.isCollidingWith(block)) {
                    this.reverseDirection();
                    break;
                }
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
        

        invertColorsMob() {
            this.isInvertedColorMob = !this.isInvertedColorMob;
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
            this.updateFrame()
            this.updateHitbox()
            this.moveMob()


            /* SCREEN.fillStyle = 'rgba(0,255,0,0.1)';
            SCREEN.fillRect(this.position.x, this.position.y, this.width, this.height); */

            /* SCREEN.fillStyle = 'rgba(255,0,0,0.5)';
            SCREEN.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height);  */

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