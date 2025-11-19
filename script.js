const canvas = document.getElementById('canvasArea')
const ctx = canvas.getContext('2d')
ctx.imageSmoothingEnabled = false
canvas.style.imageRendering = "pixelated"
ctx.font = "10px pixel"

let lastTime = 0
const FPS = 60
const timestep = 1000/FPS
const gravity = 0.3
let gamePlaying = true

const ground = new Image(); ground.src = 'jungle tileset.png'
const cactusImg = new Image(); cactusImg.src = 'cactus.png'
const dino1 = new Image(); dino1.src = 'sheets/doux.png'
const dino2 = new Image(); dino2.src = 'sheets/mort.png'
const dino3 = new Image(); dino3.src = 'sheets/tard.png'
const dino4 = new Image(); dino4.src = 'sheets/vita.png'

const charList = [dino1, dino2, dino3, dino4]

class Player{
    constructor(){
        this.life = 3
        this.x = 50
        this.y = 100
        this.char = 0
        this.frame = 120
        this.delta = 0
        this.counter = 0
        this.isOnGround = false
        this.speed = 3
        this.velocity = 2
        this.jumping = false
    }

    update(){
        this.velocity += gravity
        this.y += this.velocity

        if (this.y >= 100){
            this.y = 100
            this.velocity = 0
            this.isOnGround = true
        }
        else{
            this.isOnGround = false
        }
        this.y +=this.velocity
        this.counter = (this.counter+1)%this.speed
    }

    jump(){
        if (this.isOnGround){this.velocity = -4}
    }

    draw(){
        if (this.isOnGround){
            if (this.counter >= this.speed-1){
                this.frame += 24
                if (this.frame > 216){
                    this.frame = 120
                }
            }
            ctx.drawImage(charList[this.char],this.frame,0,24,24,this.x,this.y,24,24)
        }
        else{
            ctx.drawImage(charList[this.char],144,0,24,24,this.x,this.y,24,24)
        }
    }
}

class Cactus{
    constructor(){
        this.x = canvas.width+10
        this.type = Math.floor(Math.random()*2)
    }

    draw(){
        if (this.type == 0){
        ctx.drawImage(cactusImg,this.x,96)
        }
        else{
            ctx.drawImage(cactusImg,this.x,96)
            ctx.drawImage(cactusImg,this.x+7,96)
        }
    }
}


function handleCactuses(delta){
    timerCount+=delta
    if (timerCount >=2){
        cactuses.push(new Cactus())
        timerCount = 0
    }

    for(let i = 0; i < cactuses.length; i++){
        cactuses[i].x-= Math.round(runSpeed*delta)
        if (cactuses[i].x <=-50){
            cactuses.splice(i,1)
        }
    }
}

function collide(){
    for(let i =0; i<cactuses.length; i++){
        if(cactuses[i].x+8<=player.x+20 && cactuses[i].x+20>=player.x-10 && player.isOnGround){
            console.log('damage taken')
            gamePlaying = false
        }
    }
}

function scoring(delta){
    scoretimecount+=delta
    if (scoretimecount >=0.5){
        score += 1
        scoretimecount = 0
    }
}


// -- INPUT HANDLING --

let clickable = true
window.addEventListener('keydown', (e) =>{
    if (e.code == 'Space' || e.code == 'ArrowUp'){
        if (clickable){
            player.jump()
            clickable = false
        }
    }
})
window.addEventListener('keyup', (e) =>{
    clickable = true
})


// -- INITIALIZE VARIABLES AND ENTITIES --
let runSpeed = 100
let groundPos = 0
const player = new Player()
const cactie = new Cactus()
player.char = 1
let timerCount = 0
let scoretimecount = 0
score = 0

const cactuses =[]
cactuses.push(new Cactus())



// -- GAME FUNCTIONS --

function update(delta){
    groundPos-=Math.round(runSpeed*delta)
    groundPos = groundPos%959
    player.update()
    player.delta = delta
    handleCactuses(delta)
    scoring(delta)
    collide()
}

function render(){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    ctx.drawImage(ground,groundPos,120)
    ctx.drawImage(ground,groundPos+959,120)
    player.draw()

    for(let q =0; q <cactuses.length; q++){
        cactuses[q].draw()
    }

    ctx.fillStyle = 'black'
    ctx.fillText("Score: "+score,50,30)
}



function gameLoop(ctime){
    if (gamePlaying){
        const deltaTime = (ctime - lastTime)/1000

        if (ctime - lastTime >= timestep){
            update(deltaTime)
            render()
            lastTime = ctime
        }

        requestAnimationFrame(gameLoop)
    }
}
requestAnimationFrame(gameLoop)