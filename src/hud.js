import { SIZE, canvas, towers } from "./globals"
import Vector from "./vector"

// HUD and input
const keys = {} //for debug 
const cursor = new Vector(-1,-1)
const MLEFT = 0
const MRIGHT = 2
const K_1 = 49 
const K_2 = 50
const K_3 = 51
const K_SPACE = 32

var cursorHoldState = 0 //tower or ability
const NO_SELECTION = 0 
const TOWER = 1
const ABILITY = 2
var selectedObject = null //tower or enemy

export function setUpInputs() {
  window.addEventListener("keydown", e => {
    let k = e.keyCode
    if (keys[k] == true) return;
    keys[k] = true
  })
  window.addEventListener("keyup", e => {
    let k = e.keyCode
    keys[k] = false
  })

  window.addEventListener("mousedown", e => {
    e.preventDefault()
    updateCursorPos(e)
    let k = e.button
    keys[k] = true

    // in no selection state
    if (cursorHoldState === NO_SELECTION){
      // click button
      for (let bName in buttons) {
        let btn = buttons[bName]
        if(btn.contains(cursor.x, cursor.y)){
          btn.click()
          return
        }
      }
      // select tower

      // select enemy
    } else if (cursorHoldState == TOWER){
      // TODO: check if can place tower
      towers.push({x:cursor.x,y:cursor.y})
      cursorHoldState = NO_SELECTION
    } else if (cursorHoldState == ABILITY){
      // TODO: Create wind storm
      cursorHoldState = NO_SELECTION
    }

  })
  window.addEventListener("mouseup", e => {
    updateCursorPos(e)
    let k = e.button
    keys[k] = false
  })
  window.addEventListener("mousemove", e => {
    updateCursorPos(e)
    let k = e.button
    if (keys[k] == true) return;
    keys[k] = true
  })
}

const clientRatio = SIZE/canvas.clientWidth

function updateCursorPos(event) {
  cursor.x = (event.pageX - canvas.offsetLeft)*clientRatio
  cursor.y = (event.pageY - canvas.offsetTop)*clientRatio
}
export function drawHUD(ctx) {
  drawCursorHoldObject(ctx)

  drawUpperHUD(ctx)
  drawLowerHUD(ctx)

  for (let bName in buttons) {
    let btn = buttons[bName]
    btn.draw(ctx, btn.contains(cursor.x, cursor.y))
  }
}

const UH = SIZE * .1

function drawUpperHUD(ctx) {
  // resources, abilities, towers?, callWave
  ctx.fillStyle = "#777"
  ctx.fillRect(0,0,SIZE,UH)
}

const LH = SIZE * .25
function drawLowerHUD(ctx) {
  // selected upgrades and details
  
  ctx.fillStyle = "#999"
  ctx.fillRect(0,SIZE-LH,SIZE,LH)
}

function drawCursorHoldObject(ctx) {
  if (cursorHoldState == NO_SELECTION) return
  if (cursorHoldState == TOWER) {
    ctx.fillStyle = "yellow"
    ctx.fillRect(cursor.x,cursor.y,10,10)
  } else if (cursorHoldState == ABILITY) {
    ctx.fillStyle = "orange"
    ctx.fillRect(cursor.x,cursor.y,20,10)
  }
}

class Button {
  constructor(x, y, w, h, callback) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.callback = callback
  }

  contains(x,y){
    if (x < this.x) return false;
    if (x > this.x + this.w) return false;
    if (y < this.y) return false;
    if (y > this.y + this.h) return false;
    return true;
  }

  click() { this.callback() }

  draw(ctx, stroke=false){
    ctx.fillStyle = "green"
    ctx.fillRect(this.x,this.y,this.w,this.h)
    if (!stroke) return
    ctx.strokeStyle = "white"
    ctx.strokeRect(this.x,this.y,this.w,this.h)
  }
}

function archerBtnClicked() {
  cursorHoldState = TOWER
}

function stormBtnClicked() {
  cursorHoldState = ABILITY
}
var buttons = {
  "archer": new Button(10,10,100,30,archerBtnClicked),
  "storm": new Button(200,10,100,30,stormBtnClicked),

}