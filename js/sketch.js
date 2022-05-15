let nPixelsWidth = 500
let nPixelsHeight = nPixelsWidth
// Snail variables
let bodyColor = [255]
let bodyLength = 10
let bodyWidthMin = 5
let bodyWidthMax = 10
let nStartingSnails = 2
let probNewSnail = 0.02
let snails = []
// Trail variables
let trailWidth = 5
let trailStep = trailWidth / 2
let trailColor = [255, 255, 255, 50]
let trailWobble = 1 / 4  // In fraction of pi
// Shell variables
let offsetX = nPixelsWidth / 2
let offsetY = nPixelsHeight
let shellTheta = 0
let ampX = 250
let ampY = 10
// Other variable
// let saveFrames = true
let saveFrames = false
let fps = 10
let nFrames = 250

class Snail {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.bodyPoints = [[this.x, this.y]]
    this.bodyWidthInc = (bodyWidthMax - bodyWidthMin) / floor(bodyLength / 2) 
    this.trailPoints = [[this.x, this.y]]
    this.trailTheta = random(2 * PI)
  }
  move() {
    let dTheta = random(-PI * trailWobble / 2, PI * trailWobble / 2)
    this.trailTheta += dTheta
    let x2 = this.x + trailStep * cos(this.trailTheta)
    let y2 = this.y + trailStep * sin(this.trailTheta)
    // Add point to array of trail points so it can be redrawn every frame
    this.trailPoints.push([x2, y2])
    // Add point to body if not full size or replace the first body point
    if (this.trailPoints.length < bodyLength) {
      this.bodyPoints.push([x2, y2])
    } else {
      // Remove first element of bodyPoints array
      this.bodyPoints.splice(0, 1)
      // Add new body point to the end of the bodyPoints array
      this.bodyPoints.push([x2, y2])
    }
    this.x = x2
    this.y = y2
    this.drawBody()
    this.drawTrail()
  }
  drawTrail() {
    strokeWeight(trailWidth)
    stroke.apply(null, trailColor)
    for (let p of this.trailPoints) { 
      point(p[0], p[1])
    }
  }
  drawBody() {
    stroke.apply(null, bodyColor)
    let bodyWidth = bodyWidthMin
    for (let i = 0; i < this.bodyPoints.length; i ++) {
      let p = this.bodyPoints[this.bodyPoints.length - i - 1]
      // Front of snail: increase body width by bodyWidthInc at each point. Back: decrease
      if (i <= floor(bodyLength / 2) - 1) {
        bodyWidth += this.bodyWidthInc
      } else (
        bodyWidth -= this.bodyWidthInc
      )
      strokeWeight(bodyWidth)
      point(p[0], p[1])
    }
  }
}

function setup() {
  createCanvas(nPixelsWidth, nPixelsHeight)
  frameRate(fps)
  background(100)
  for (let i = 0; i < nStartingSnails; i ++){
    snails.push(new Snail(random(width / 2), random(height / 2)))
  }
  console.log('Press SPACE to stop looping or r to reset.')
}

function draw() {
  if (saveFrames) saveFrame()
  background(100)
  if (random() < probNewSnail) {
    snails.push(new Snail(random(width / 2), random(height / 2)))
  }
  for (let snail of snails) {
    snail.move()
  }
}

function mousePressed() {
  snails.push(new Snail(mouseX, mouseY))
  console.log(`New snail at ${mouseX}, ${mouseY}. There are now ${snails.length} snails.`)
}

function drawShell() {
  strokeWeight(1)
  stroke(255, 0, 0)
  // point(offsetX, offsetY)
  let x = offsetX + ampX * cos(theta)
  let y = offsetY + ampY * sin(theta)
  stroke(0)
  point(x, y)
  theta += 0.05
  ampX -= 0.1
  // ampY -= 0
  offsetY -= 0.1
}
