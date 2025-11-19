const canvas = document.getElementById('canvasArea')
const ctx = canvas.getContext('2d')

let lastTime = 0
const FPS = 60
const timestep = 1000/FPS