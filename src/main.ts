const canvas = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d")!

function resize() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

window.addEventListener("resize", resize)
resize()

function update(_dt: number) {
  // game logic here
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = "#1a1a2e"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = "#fff"
  ctx.font = "24px monospace"
  ctx.textAlign = "center"
  ctx.fillText("squared2", canvas.width / 2, canvas.height / 2)
}

let lastTime = 0

function loop(timestamp: number) {
  const dt = (timestamp - lastTime) / 1000
  lastTime = timestamp

  update(dt)
  draw()

  requestAnimationFrame(loop)
}

requestAnimationFrame(loop)
