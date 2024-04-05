class Sprite {
    constructor({ position, imageSrc, frameRate = 1, frameBuffer = 5, scale = 1}) {
        this.scale = scale;
        this.position = position;
        this.image = new Image();
        this.image.onload = () => {
            this.width = (this.image.width / this.frameRate) * scale;
            this.height = this.image.height * scale;
        }
        this.image.src = imageSrc;
        this.frameRate = frameRate
        this.currentFrame = 0;
        this.frameBuffer = frameBuffer;
        this.elapsedFrames = 0
    }
    draw() {
        if (!this.image.complete) return;
        if (this.isInvertedColor) {
            SCREEN.filter = 'invert(100%)';
        }

        const cropbox ={
            position:{
                x: this.currentFrame *  this.image.width / this.frameRate,
                y: 0,
            },
            width :this.image.width / this.frameRate,
            height:this.image.height,
        }
        SCREEN.drawImage(
            this.image, 
            cropbox.position.x, 
            cropbox.position.y,
            cropbox.width, 
            cropbox.height, 
            this.position.x, 
            this.position.y,
            this.width, 
            this.height
        );
    }

    update() {
        this.draw();
        this.updateFrame()
    }

    updateFrame(){
        this.elapsedFrames++
        if(this.elapsedFrames % this.frameBuffer === 0){
            if (this.currentFrame < this.frameRate - 1)this.currentFrame++
            else this.currentFrame = 0
        }
    }
}