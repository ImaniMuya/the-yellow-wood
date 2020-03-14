import Vector from "./vector"
import Helpers from "./helpers";

export default class WindStorm {
  constructor(position, state, radius) {
    this.position = position
    this.state = state
    this.lifeSpan = 2000
    this.begin = Date.now()
    this.dead = false
    this.r = radius
  }

  static get DIVERGE(){ return 0 }
  static get CONVERGE(){ return 1 }

  get x(){ return this.position.x }
  get y(){ return this.position.y }

  update() {
    let elapsed = Date.now() - this.begin
    if (elapsed > this.lifeSpan) { this.dead = true }
  }

  draw(ctx) {
    ctx.fillStyle = "orange"
    ctx.beginPath()
    ctx.arc(this.x,this.y,this.r,0,2*Math.PI)
    ctx.fill()

  }

  contains(position) {
    return Helpers.circleContainsPoint(this.position, this.r, position)
  }

  getPushVector(position) {
    let dx = position.x - this.position.x
    let dy = position.y - this.position.y

    let distsq = dx*dx + dy*dy
    let force = Math.min(maxForce, (this.r * this.r) - distsq)
    let v = Vector.normalize(new Vector(dx, dy))
    v.x = v.x * force
    v.y = v.y * force
    return v
  }

  getPullVector(position) {
    let dx = this.position.x - position.x
    let dy = this.position.y - position.y

    let distsq = dx*dx + dy*dy
    let force = (distsq)/10
    force = Math.min(maxForce, force)
    force += Math.floor(Math.random() * 100) - 50
    let v = Vector.normalize(new Vector(dx, dy))
    v.x = v.x * force
    v.y = v.y * force
    return v
  }
}

const maxForce = 1000