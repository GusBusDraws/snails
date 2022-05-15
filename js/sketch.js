/*
Hello! Thank you for looking at my sketch!
I have created a system that generates trail-leaving snails and sets them free across the canvas! Snails are generated as instances of the Snail class and are kept in the snails array. Each of the globally defined variables can be tweaked to change the bahavior of the snails.
I hope you enjoy!
<3 Gus
*/
let nPixelsWidth = 500
let nPixelsHeight = nPixelsWidth
let bgColor = ['#36393E']
// Snail variables
let bodyLength = 20
let bodyWidthMin = 5
let bodyWidthMax = 15
let nStartingSnails = 2
let probNewSnail = 0.01
let snails = []
// Trail variables
let trailWidth = 5
let trailStep = trailWidth / 2
let trailColor = [360, 0, 100, 25]  // 50% opacity white in in HSB
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
    let hue = random(0, 360)
    let shellSat = random(75, 100)
    this.shellColor = [hue, shellSat, 100]
    this.shellRadius = 1.5 * bodyWidthMax
    this.shellPos = null
    this.shellLayerOffset = 0.5
    this.bodyColor = [hue, shellSat / 2, 100]
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
  }
  drawTrail() {
    strokeWeight(trailWidth)
    stroke.apply(null, trailColor)
    for (let p of this.trailPoints) { 
      point(p[0], p[1])
    }
  }
  drawBody() {
    stroke.apply(null, this.bodyColor)
    let bodyWidth = bodyWidthMin
    for (let i = 0; i < this.bodyPoints.length; i ++) {
      let p = this.bodyPoints[this.bodyPoints.length - i - 1]
      // Front of snail: increase body width by bodyWidthInc at each point. Back: decrease
      if (i <= floor(bodyLength / 2) - 1) {
        bodyWidth += this.bodyWidthInc
        if (i == floor(bodyLength / 2) - 1) this.shellPos = p
      } else (
        bodyWidth -= this.bodyWidthInc
      )
      strokeWeight(bodyWidth)
      point(p[0], p[1])
    }
  }
  drawShell(x, y) {
    if (this.shellPos != null) {
      let [x, y] = this.shellPos
      stroke(0)
      strokeWeight(1)
      fill.apply(null, this.shellColor)
      circle(x, y, this.shellRadius)
      for (let i = 1; i < 3; i ++) {
        circle(x, y, 2 / (i * 3) * this.shellRadius)
      }
    }
  }
}

function setup() {
  createCanvas(nPixelsWidth, nPixelsHeight)
  frameRate(fps)
  colorMode(HSB, 360, 100, 100, 100)
  resetSketch()
  console.log('Press SPACE to stop looping or r to reset.')
}

function draw() {
  if (saveFrames) saveFrame()
  background.apply(null, bgColor)
  if (random() < probNewSnail) {
    snails.push(new Snail(random(width), random(height)))
  }
  // Move snails and draw their trails
  for (let snail of snails) {
    snail.move()
    snail.drawTrail()
  }
  // Draw snails & shells in a separate loop so every snail is above any trail
  for (let snail of snails) {
    snail.drawBody()
    snail.drawShell()
  }
}

function mousePressed() {
  snails.push(new Snail(mouseX, mouseY))
  console.log(`New snail at ${mouseX}, ${mouseY}. There are now ${snails.length} snails.`)
}

function resetSketch() {
  snails = []
  for (let i = 0; i < nStartingSnails; i ++){
    snails.push(
      new Snail(
        random(width / 4, 3 / 4 * width), 
        random(height / 4, 3 / 4 * height)
      )
    )
  }
  background.apply(null, bgColor)
}
