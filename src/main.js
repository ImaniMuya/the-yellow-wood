import GameState from "./state"
import { setUpInputs, drawHUD } from "./hud"
import { SIZE, getEl, canvas, towers, enemies, hitBoxes, windStorms, resources, LINEWIDTH} from "./globals"
import Spawner from "./spawner";
import { ResourceCounter } from "./ResourceCounter";
import { drawMap1 } from "./fields"
import Vector from "./vector";
import { Particles } from "./particles"

const ctx = canvas.getContext("2d")
export let waveSpawner;
export let resourceCounter;
canvas.width = SIZE
canvas.height = SIZE

function init(){
  resourceCounter = new ResourceCounter();
  waveSpawner = new Spawner(0, {x:10,y:100}, 5000,10000);

  ctx.lineWidth = LINEWIDTH

}

setUpInputs()
init();
// game loop in state.js
window.gameState = new GameState()
function startGame() {
  gameState.setState(GameState.GAME, gameUpdate, gameDraw)
  getEl("menuMusic").pause()
  getEl("gameMusic").play()
}

getEl("playBtn").addEventListener("click", startGame)
getEl("beginBtn").addEventListener("click", ()=>{
  gameState.setState(GameState.SCENE1, ()=>{},  ()=>{})
  getEl("menuMusic").play()
})
getEl("scene1btn").addEventListener("click", ()=>{
  gameState.setState(GameState.SCENE2, ()=>{},  ()=>{})
})
getEl("endDivbtn").addEventListener("click", ()=>{
  gameState.setState(GameState.CRED, ()=>{},  ()=>{})
  getEl("menuMusic").play()
  getEl("endMusic").pause()
  getEl("gameMusic").pause()
})
getEl("credBtn").addEventListener("click", ()=>{
  gameState.setState(GameState.CRED, ()=>{},  ()=>{})
  getEl("menuMusic").play()
})
getEl("credDivbtn").addEventListener("click", ()=>{
  gameState.setState(GameState.MENU, ()=>{},  ()=>{})
  getEl("menuMusic").play()
  if(resourceCounter.getWin()) location.reload();
})

gameState.tick();
window.towers = towers
window.enemies = enemies
window.hitBoxes = hitBoxes
window.resources = resources


function gameDraw() {
  ctx.clearRect(0,0,SIZE,SIZE)
  drawMap1(ctx)
  towers.forEach(tower => {tower.draw(ctx)})
  windStorms.forEach(ws => {ws.draw(ctx)})
  enemies.forEach(enemy => {enemy.draw(ctx)})
  hitBoxes.forEach(hb => {hb.draw(ctx)})
  resources.forEach(r => {r.draw(ctx)})
  drawHUD(ctx)
  Particles.draw(ctx)
}

function gameUpdate() {
  if(resourceCounter.getGameOver()){
    if(resourceCounter.getWin()){
      // console.log("win");
      gameState.setState(GameState.END, ()=>{},  ()=>{})
      getEl("gameMusic").pause()
      getEl("menuMusic").pause()
      getEl("endMusic").play()

    }
    if(resourceCounter.getLose()){
      // console.log("lose");
      gameState.setState(GameState.MENU, ()=>{},  ()=>{})
      getEl("menuMusic").play()
      getEl("gameMusic").pause()
    }
    return //dispaly picture
  }
  generateMana();
  towers.forEach(tower => {tower.update()})
  updateHitboxes()
  waveSpawner.update();
  updateEnemies();
  updateWindStorms();
  updateResources();
  Particles.update()

}

function generateMana(){
  resourceCounter.gainMana(1);
}

function updateEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    let u1 = enemies[i];
    for (let j = i+1; j < enemies.length; j++) {
      let u2 = enemies[j];
      let dx = u2.x - u1.x;
      if (Math.abs(dx) > u1.r) continue;
      let dy = u2.y - u1.y;
      if (Math.abs(dy) > u1.r) continue;
      let nx = Math.sign(dx) * (u1.r-Math.abs(dx));
      let ny = Math.sign(dy) * (u1.r-Math.abs(dy));

      u2.nudgeVector = new Vector(nx,ny)
      u1.nudgeVector = new Vector(-nx,-ny)
    }
  }
  for (let i=0; i<enemies.length; i++) {
    let enemy = enemies[i]
    if (enemy.deleted) { 
      enemies.splice(i, 1)
      i -= 1
    } else {
      enemy.update()
    }
  }
}


function updateHitboxes() {
  for (let i=0; i<hitBoxes.length; i++) {
    let hb = hitBoxes[i]
    if (hb.deleted) { 
      hitBoxes.splice(i, 1)
      i -= 1
    } else {
      hb.update()
    }
  }
}

function updateWindStorms() {
  for (let i=0; i<windStorms.length; i++) {
    let ws = windStorms[i]
    if (ws.dead) { 
      windStorms.splice(i, 1)
      i -= 1
    } else {
      ws.update()
    }
  }
}

function updateResources() {
  for (let i=0; i<resources.length; i++) {
    let resource = resources[i]
    if (resource.deleted) { 
      resources.splice(i, 1)
      i -= 1
    } else {
      resource.update()
    }
  }
}
