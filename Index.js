const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const gravity = 0.3
const gravityP = 0.5

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
            y: 1.0,
        }
        this.height = 100
        this.maxJumps = 2 
        this.jumpCount = 0
        this.color = 'black'
    }
        draw(){
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, 60, this.height)

    }
        update(){
        this.draw()
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x

            if(this.position.y + this.height > canvas.height) {
                this.velocity.y = 0 
                 this.jumpCount = 0
                
             } else {
                this.velocity.y += gravity 
            }
    }

    jump () {
        if ( this.jumpCount < this.maxJumps) {
            this.velocity.y = - 10
            this.jumpCount++
        }
        
    }
    changecolor () {

        this.color = this.color === 'black' ? 'white' : 'black'
    
    }
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


function detecterCollision(player, player2) {
    
    const playerLeft = player.position.x;
    const playerRight = player.position.x + 60;
    const playerTop = player.position.y;
    const playerBottom = player.position.y + player.height;

    const player2Left = player2.position.x;
    const player2Right = player2.position.x + 60; 
    const player2Top = player2.position.y;
    const player2Bottom = player2.position.y + player2.height;

    
    if (playerRight > player2Left && 
        playerLeft < player2Right && 
        playerBottom > player2Top && 
        playerTop < player2Bottom) {
        return true; 
    }

    return false; 
}

function gererCollisions() {
    if (detecterCollision(player, player2)) {
        
        if (player.color !== player2.color) {
            
            if (player.position.x < player2.position.x) {
                
                player.position.x = player2.position.x - 60;
            } else {
                
                player2.position.x = player.position.x - 10;
            }
        }
    }
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

    gererCollisions() 
    player2.update()
    player.update()
    
    player.velocity.x = 0
    if(keys.d.pressed) player.velocity.x = 10
    else if (keys.q.pressed) player.velocity.x = - 7

    
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
        player.jump()

        break

        case 'c':
            player.changecolor()
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
        player.velocity.y =  0

        break

        

    }
})
