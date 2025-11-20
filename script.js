// -- INITIALIZATION --
const canvas = document.getElementById('canvasArea')
const ctx = canvas.getContext('2d')
ctx.imageSmoothingEnabled = false
canvas.antial
canvas.style.imageRendering = "pixelated"
ctx.font = "10px pixel"


// -- CONSTANT GAME VATIABLES --
let lastTime = 0
const FPS = 6000
const timestep = 1000/FPS
const gravity = 0.3
let gamePlaying = true


// -- IMAGES INITIALIZAION --
const ground = new Image(); ground.src = 'jungle tileset.png'
const cactusImg = new Image(); cactusImg.src = 'cactus.png'
const dayBg = new Image(); dayBg.src = 'day.png'

const dino1 = new Image(); dino1.src = 'sheets/doux.png'
const dino2 = new Image(); dino2.src = 'sheets/mort.png'
const dino3 = new Image(); dino3.src = 'sheets/tard.png'
const dino4 = new Image(); dino4.src = 'sheets/vita.png'

const playImg = new Image(); playImg.src = 'play.svg'
const reloadImg = new Image(); reloadImg.src = 'reload.svg'
const charList = [dino1, dino2, dino3, dino4]


// -- GAME OBJECTS [CLASSES] --
class Player{
    constructor(){
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



// -- LOGIC FUNCTIONS --

function handleCactuses(delta){
    timerCount+=delta
    if (timerCount >=Math.floor(Math.random()*2+1)-(score*0.0001)){
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
        if(cactuses[i].x+10<player.x+20 && cactuses[i].x+18>player.x+2 && player.y>85){
            gamePlaying = false
            if (score > highscore){
                highscore = score
                localStorage.setItem('highscore',score)
            }
        }
        
    }
}

function scoring(delta){
    scoretimecount+=delta
    if (scoretimecount >=0.06){
        score += 1
        scoretimecount = 0
    }
    runSpeed+=score*0.00006
}

function showMenu(){
    ctx.fillStyle = '#725900ff'
    ctx.beginPath()
    ctx.roundRect((canvas.width/2)-10, (canvas.height/2)-10,20,20,5)
    ctx.fill()
    ctx.drawImage(reloadImg,(canvas.width/2)-6, (canvas.height/2)-6,12,12)
}

function resetGame(){
    runSpeed = 160
    groundPos = 0
    player.char = Math.floor(Math.random()*3)
    player.y=100
    timerCount = 0
    scoretimecount = 0
    score = 0
    cactuses = []

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
    if (e.code == 'Enter' &&!gamePlaying){
        gamePlaying = true
        requestAnimationFrame(gameLoop)
        resetGame()
    }
})
window.addEventListener('keyup', (e) =>{
    clickable = true
})
window.addEventListener('touchstart', (e) =>{
    if (clickable){
        player.jump()
        clickable = false
    }
})
canvas.addEventListener('touchstart', (e) =>{
    if (!gamePlaying){
        gamePlaying = true
        requestAnimationFrame(gameLoop)
        resetGame()
        }
    })
window.addEventListener('touchend', (e) =>{
    clickable=true
})


// -- INITIALIZE VARIABLES AND ENTITIES --
let runSpeed = 160
let groundPos = 0
const player = new Player()
const cactie = new Cactus()
player.char = Math.floor(Math.random()*3)
let timerCount = 0
let scoretimecount = 0
score = 0
let highscore = 0
if(localStorage.getItem('highscore')){
    highscore = localStorage.getItem('highscore')
}


let cactuses =[]
cactuses.push(new Cactus())



// -- GAME FUNCTIONS --
console.log(canvas.width)
console.log(canvas.height)

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
    ctx.drawImage(dayBg,0,0,canvas.width,canvas.height)
    ctx.drawImage(ground,groundPos,120)
    ctx.drawImage(ground,groundPos+959,120)
    player.draw()

    for(let q =0; q <cactuses.length; q++){
        cactuses[q].draw()
    }

    ctx.fillStyle = 'black'
    ctx.fillText("Score: "+score,10,20)
    ctx.fillText("HS: "+highscore,85,20)
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
    else{showMenu()}
}
requestAnimationFrame(gameLoop)