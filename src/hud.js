
import { SIZE, canvas, towers, enemies, windStorms, windType, LINEWIDTH, getEl, towerCost, towerDamage, powerCost } from "./globals"
import Vector from "./vector"
import Tower from "./tower";
import { Enemy } from "./enemy";
import { field1, isOnPlatform } from "./fields";
import WindStorm from "./wind";
import {resourceCounter, waveSpawner} from "./main";
import Animation from "./animator";
import { Particles } from "./particles"

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
          if (btn.special && !(selectedObject instanceof Tower)) return
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
        getEl("nopeSfx").currentTime = 0
        getEl("nopeSfx").play()
        // console.log("cant place")
        return
      }
      // TODO: tower collision (check neighbors)
      let tower = new Tower({x:cursor.x,y:cursor.y}, Tower.BASIC, 1000, towerDamage, 200)
      towers.push(tower)
      Particles.spiral(cursor.x,cursor.y,"yellow",10,5)
      resourceCounter.spendResources(towerCost);
      cursorHoldState = NO_SELECTION
      selectedObject = tower
    } else if (cursorHoldState == ABILITY){
      if (isInHUD(cursor)) return
      let ws = new WindStorm({x:cursor.x,y:cursor.y}, WindStorm.DIVERGE, 100)      
      windStorms.push(ws)
      Particles.spiral(cursor.x,cursor.y,"orange",15,6)
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

const hudImg = getEl("hudImg")
export function drawHUD(ctx) {
  ctx.drawImage(hudImg, 0, 0, SIZE, SIZE)
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
  ctx.font = "30px Arial";
  ctx.fillText("Resource", 20, 30)
  ctx.fillText(resourceCounter.getResources(), 20+140, 30)
  ctx.fillText("Mana", 20, 70)
  ctx.fillText(resourceCounter.getMana(), 20+90, 70)
  ctx.fillText("Lives", 20, 110)
  ctx.fillText(resourceCounter.getLives(), 20+90, 110)
  ctx.fillText("Waves left", 20, 150)
  let waveLeft = waveSpawner.getWaves();
  ctx.fillText(waveSpawner.getWaves(), 20+150, 150)

  //draw rect around d/c wind
  ctx.strokeStyle = "yellow"
  ctx.lineWidth = 7
  if (windType.state == windType.CONVERGING) {
    ctx.strokeRect(650,20,140,140)
  } else {
    ctx.strokeRect(800,20,140,140)
  }
  ctx.lineWidth = LINEWIDTH
}

const LH = SIZE * .25
function drawLowerHUD(ctx) {
  // selected upgrades and details
  if (selectedObject instanceof Tower) {
    Tower.drawTowerProfile(ctx)
  } else if (selectedObject instanceof Enemy) {
    Enemy.drawEnemyProfile(ctx, selectedObject.gnome)
  }
}

let archerAnim = new Animation(getEl("archerImg"),
[{"x":106,"y":287,"w":640,"h":837,"ax":440,"ay":518+200}], 
Animation.getLinearFrameSelector(500,1))

function drawCursorHoldObject(ctx) {
  if (cursorHoldState == NO_SELECTION) return
  if (cursorHoldState == TOWER) {
    ctx.fillStyle = "yellow"
    ctx.fillRect(cursor.x,cursor.y,10,10)
    archerAnim.draw(ctx, cursor.x, cursor.y, false, .1)
  } else if (cursorHoldState == ABILITY) {
    ctx.strokeStyle = "orange"
    ctx.beginPath()
    ctx.arc(cursor.x,cursor.y,90,0,2*Math.PI)
    ctx.stroke()
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
  constructor(x, y, w, h, callback, special=false) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.callback = callback
    this.special = special
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
    // ctx.fillStyle = "green"
    // ctx.fillRect(this.x,this.y,this.w,this.h)
    if (!stroke) return
    if (this.special && !(selectedObject instanceof Tower)) return
    ctx.strokeStyle = "white"
    ctx.strokeRect(this.x,this.y,this.w,this.h)
  }
}



function archerBtnClicked() {
  if(resourceCounter.getResources() < towerCost){
    //can't afford Tower
    getEl("nopeSfx").currentTime = 0
    getEl("nopeSfx").play()
    return
  }
  cursorHoldState = TOWER
  selectedObject = null
}

function stormBtnClicked() {
  if(resourceCounter.getMana() < powerCost){
    //can't afford Storm
    getEl("nopeSfx").currentTime = 0
    getEl("nopeSfx").play()
    return
  }
  cursorHoldState = ABILITY
  selectedObject = null
}

function waveBtnClicked() {
  for (let i=0; i<1; i++){
    let enemy = new Enemy({x:10,y:100}, 40, 20, 20, 1000, 100, Enemy.BOSS, field1)
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

function upgradeTower() {
  // do upgrade
  selectedObject.upgrade();

}

var buttons = {
  "archer": new Button(250,25,100,100,archerBtnClicked),
  "storm": new Button(425,25,180,100,stormBtnClicked),
  "wave": new Button(800,10,100,30,waveBtnClicked),
  "convStormBtn": new Button(650,20,140,140,convStormBtnClicked),
  "divStormBtn": new Button(800,20,140,140,divStormBtnClicked),
  "upgrade": new Button(700,728,200,200,upgradeTower, true),
}