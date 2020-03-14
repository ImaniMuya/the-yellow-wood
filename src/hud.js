import { SIZE, canvas, towers, enemies, windStorms, windType, LINEWIDTH, towerCost, towerDamage, powerCost } from "./globals"
import Vector from "./vector"
import Tower from "./tower";
import { Enemy } from "./enemy";
import { field1, isOnPlatform } from "./fields";
import WindStorm from "./wind";
import {resourceCounter} from "./main";

// HUD and input
const keys = {} //for debug 
export const cursor = new Vector(-1,-1)
const MLEFT = 0
const MRIGHT = 2
const K_1 = 49 
const K_2 = 50
const K_3 = 51
const K_SPACE = 32
const K_ESC = 27
const K_B = 66

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
    if (k == K_ESC){
      cursorHoldState = NO_SELECTION
      selectedObject = null
    }
    if (k === K_B){
      archerBtnClicked();
    }
    if(k === K_SPACE){
      stormBtnClicked();
    }
  })
  window.addEventListener("keyup", e => {
    let k = e.keyCode
    keys[k] = false
  })

  window.addEventListener("mousedown", e => {
    e.preventDefault()
    updateCursorPos(e)
    console.log(cursor)
  
    let k = e.button
    keys[k] = true
    if (k != MLEFT) return //only left click
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
      for (let tower of towers) {
        if (tower.contains(cursor)) {
          selectedObject = tower
          return
        }
      }

      // select enemy
      for (let enemy of enemies) {
        if (enemy.contains(cursor) && !enemy.dead) {
          selectedObject = enemy
          return
        }
      }
      selectedObject = null
    } else if (cursorHoldState == TOWER){
      if (isInHUD(cursor)) return
      if (!isOnPlatform(field1, cursor.x, cursor.y)) {
        // TODO: sfx ding? 
        console.log("cant place")
        return
      }
      // TODO: tower collision (check neighbors)
      let tower = new Tower({x:cursor.x,y:cursor.y}, Tower.BASIC, 1000, towerDamage, 200)
      towers.push(tower)
      resourceCounter.spendResources(towerCost);
      cursorHoldState = NO_SELECTION
      selectedObject = tower
    } else if (cursorHoldState == ABILITY){
      if (isInHUD(cursor)) return
      let ws = new WindStorm({x:cursor.x,y:cursor.y}, WindStorm.DIVERGE, 100)      
      windStorms.push(ws)
      resourceCounter.spendMana(powerCost);
      enemies.forEach(enemy => {
        if(ws.contains(enemy)){
          if (windType.state == windType.CONVERGING) {
            enemy.windVector = ws.getPullVector(enemy.position)
          } else {
            enemy.windVector = ws.getPushVector(enemy.position)
          }
        }
      });
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

  canvas.addEventListener("contextmenu", e => {
    e.preventDefault()
    cursorHoldState = NO_SELECTION
    selectedObject = null
  })
  
}

function updateCursorPos(event) {
  let clientRatio = SIZE/canvas.clientWidth
  cursor.x = (event.pageX - canvas.offsetLeft)*clientRatio
  cursor.y = (event.pageY - canvas.offsetTop)*clientRatio
}

function isInHUD(position) {
  if (position.y < SIZE *.17) { return true }
  if (position.y > SIZE *.68) { return true }
  return false
}

const hudImg = new Image(SIZE,SIZE)
hudImg.src = "../assets/hud.png"
export function drawHUD(ctx) {
  //ctx.drawImage(hudImg, 0, 0, SIZE, SIZE)
  drawCursorHoldObject(ctx)

  drawUpperHUD(ctx)
  drawLowerHUD(ctx)

  for (let bName in buttons) {
    let btn = buttons[bName]
    btn.draw(ctx, btn.contains(cursor.x, cursor.y))
  }

  drawSelectedObjectRing(ctx)
}

const UH = SIZE * .1



function drawUpperHUD(ctx) {
  // resources, abilities, towers?, callWave
  ctx.fillStyle = "purple"
  ctx.font = "20px Arial";
  ctx.fillText("resource", 30, 30)
  ctx.fillText(resourceCounter.getResources(), 60, 50)
  ctx.fillText("Mana", 100, 30)
  ctx.fillText(resourceCounter.getMana(), 130, 50)

  //draw rect around d/c wind
  ctx.strokeStyle = "yellow"
  ctx.lineWidth = 7
  if (windType.state == windType.CONVERGING) {
    ctx.strokeRect(625,30,130,130)
  } else {
    ctx.strokeRect(800,30,130,130)
  }
  ctx.lineWidth = LINEWIDTH
}

const LH = SIZE * .25
function drawLowerHUD(ctx) {
  // selected upgrades and details
  if (selectedObject instanceof Tower) {
    Tower.drawTowerProfile(ctx)
  } else if (selectedObject instanceof Enemy) {
    Enemy.drawEnemyProfile(ctx)
  }
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

function drawSelectedObjectRing(ctx) {
  if (selectedObject == null) return
  if (selectedObject instanceof Tower) {
    ctx.strokeStyle = "yellow"
    ctx.beginPath()
    ctx.arc(selectedObject.x,selectedObject.y,selectedObject.range,0,2*Math.PI)
    ctx.stroke()
  }
  else if (selectedObject instanceof Enemy) {
    ctx.strokeStyle = "lime"
    ctx.beginPath()
    ctx.arc(selectedObject.x,selectedObject.y, 30,0,2*Math.PI)
    ctx.stroke()

  }
}

export function checkAndDeselectEnemy(enemy) {
  if (selectedObject == enemy) {
    selectedObject = null
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
  if(resourceCounter.getResources() < towerCost){
    //can't afford Tower
    return
  }
  cursorHoldState = TOWER
  selectedObject = null
}

function stormBtnClicked() {
  if(resourceCounter.getMana() < powerCost){
    //can't afford Tower
    return
  }
  cursorHoldState = ABILITY
  selectedObject = null
}

function waveBtnClicked() {
  for (let i=0; i<1; i++){
    let enemy = new Enemy({x:10,y:100}, 40, 20, 20, 1000, 100, Enemy.BASIC, field1)
    enemy.born = true;
    enemies.push(enemy)
  }
}

function convStormBtnClicked() {
  windType.state = windType.CONVERGING
  console.log(windType)
}

function divStormBtnClicked() {
  windType.state = windType.DIVERGING
  console.log(windType)
}

var buttons = {
  "archer": new Button(240,30,100,100,archerBtnClicked),
  "storm": new Button(455,46,100,100,stormBtnClicked),
  // "wave": new Button(800,10,100,30,waveBtnClicked),
  "convStormBtn": new Button(625,30,130,130,convStormBtnClicked),
  "divStormBtn": new Button(800,30,130,130,divStormBtnClicked),
}