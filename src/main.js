import GameState from "./state"
import { setUpInputs, drawHUD } from "./hud"
import { SIZE, getEl, canvas, towers, enemies, hitBoxes, windStorms, LINEWIDTH} from "./globals"
import { drawMap1 } from "./fields"
import Spawner from "./spawner";
import Vector from "./vector";

const ctx = canvas.getContext("2d")
let waveSpawner;
canvas.width = SIZE
canvas.height = SIZE

function init(){
  waveSpawner = new Spawner(0, {x:10,y:100}, 1000,10000);
  ctx.lineWidth = LINEWIDTH
}

setUpInputs()
init();
// game loop in state.js
window.gameState = new GameState()
function startGame() {
  gameState.setState(GameState.GAME, gameUpdate, gameDraw)
}

getEl("playBtn").addEventListener("click", startGame)

gameState.tick();
// window.towers = towers
// window.enemies = enemies
// window.hitBoxes = hitBoxes

function gameDraw() {
  ctx.clearRect(0,0,SIZE,SIZE)
  drawMap1(ctx)
  towers.forEach(tower => {tower.draw(ctx)})
  windStorms.forEach(ws => {ws.draw(ctx)})
  enemies.forEach(enemy => {enemy.draw(ctx)})
  hitBoxes.forEach(hb => {hb.draw(ctx)})
  drawHUD(ctx)
}

function gameUpdate() {
  towers.forEach(tower => {tower.update()})
  updateHitboxes()
  waveSpawner.update();
  updateEnemies();
  updateWindStorms()
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
