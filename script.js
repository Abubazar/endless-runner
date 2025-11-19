const canvas = document.getElementById('canvasArea')
const ctx = canvas.getContext('2d')
ctx.imageSmoothingEnabled = false
canvas.style.imageRendering = "pixelated"

let lastTime = 0
const FPS = 60
const timestep = 1000/FPS

const imgList = []

const ground = new Image(); ground.src = 'jungle tileset.png'

let groundPos = 0
function update(delta){
groundPos-=150*delta
groundPos = groundPos%959
}

function render(){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    ctx.drawImage(ground,groundPos,120)
    ctx.drawImage(ground,groundPos+959,120)
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