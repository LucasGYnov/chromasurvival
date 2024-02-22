const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const gravity = 0.1
const gravityP = 0.2 

class Sprite {
    constructor({position, imageSrc}) {
        this.position = position
        this.image = new Image()
        this.image.src = imageSrc 
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }

    update() {
        this.draw()
    }

}

const backgroundlvl1 = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: './img/back.jpg'
})


class Player {
    constructor(position){
        this.position = position
        this.velocity = {
            x: 0,   
            y: 0.5,
        }
        this.height = 100
    }
        draw(){
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, 60, this.height)

    }
        update(){
        this.draw()
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x

            if(this.position.y + this.height > canvas.height) 
                this.velocity.y = 0
            else 
                this.velocity.y += gravity
 
    }
    // update1(){
    //     this.draw()
    //     this.position.y += this.velocity.y
    //     this.position.x += this.velocity.x

    //     if(this.position.y + this.height > canvas.height) 
    //             this.velocity.y = 0
    //         else        
    //      this.velocity.y += gravityP
 
    // }

}
 
const player = new Player({
        x: 0,   
        y: 0,
})


const player2 = new Player({
    x: 300,   
    y: 0,
})





const scaledCanvas = {
    with: canvas.width / 1,
    height: canvas.height / 1,
}


 
function animate() {
    window.requestAnimationFrame(animate)

    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)

    c.save()
    c.scale(1,1)
    c.translate(0, -backgroundlvl1.image.height +  + scaledCanvas.height)
    backgroundlvl1.update()
    c.restore()
    
    player2.update()
    player.update()
    
    player.velocity.x = 0
    if(keys.d.pressed) player.velocity.x = 9
    else if (keys.q.pressed) player.velocity.x = -9

    
}

const keys = {
    d: {
        pressed: false,
    },
    q: {
        pressed: false,
    }
}

animate()

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd' : 
        keys.d.pressed = true
        break

        case 'q' : 
        keys.q.pressed = true

        break
d
        case 'z' : 
        player.velocity.y = - 7

        break
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd' : 
        keys.d.pressed = false
        break

        case 'q' : 
        keys.q.pressed = false

        break
d
        case 'z' : 
        player.velocity.y = - 7

        break
    }
})
