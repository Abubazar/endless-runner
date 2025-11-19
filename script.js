const canvas = document.getElementById('canvasArea')
const ctx = canvas.getContext('2d')
ctx.imageSmoothingEnabled = false
canvas.style.imageRendering = "pixelated"

let lastTime = 0
const FPS = 60
const timestep = 1000/FPS

const imgList = []

const ground = new Image(); ground.src = 'jungle tileset.png'
const cactusImg = new Image(); cactusImg.src = 'cactus.png'
const dino1 = new Image(); dino1.src = 'sheets/doux.png'
const dino2 = new Image(); dino2.src = 'sheets/mort.png'
const dino3 = new Image(); dino3.src = 'sheets/tard.png'
const dino4 = new Image(); dino4.src = 'sheets/vita.png'

const charList = [dino1, dino2, dino3, dino4]

function drawCropAnimation(){

}

class Player{
    constructor(){
        this.life = 3
        this.x = 50
        this.y = 30
        this.char = 0
        this.frame = 0
        this.delta = 0
    }

    update(){
        if (this.y <= 120-20){
            this.y +=2
        }
    }

    draw(){
        
        ctx.drawImage(charList[this.char],this.frame,0,24,24,this.x,this.y,24,24)
    }
}

// -- INITIALIZE VARIABLES AND ENTITIES --
let groundPos = 0
const player = new Player()
player.char = 0

function update(delta){
groundPos-=30*delta
groundPos = groundPos%959
player.update()
player.delta = delta
}

function render(){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    ctx.drawImage(ground,groundPos,120)
    ctx.drawImage(ground,groundPos+959,120)
    player.draw()
}

function gameLoop(ctime){
    const deltaTime = (ctime - lastTime)/1000

    if (ctime - lastTime >= timestep){
        update(deltaTime)
        render()
        lastTime = ctime
    }

    requestAnimationFrame(gameLoop)
}
requestAnimationFrame(gameLoop)