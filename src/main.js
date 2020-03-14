import GameState from "./state"
import { setUpInputs, drawHUD } from "./hud"
import { SIZE, getEl, canvas, towers, enemies, hitBoxes, windStorms} from "./globals"
import { drawMap1 } from "./fields"

const ctx = canvas.getContext("2d")
canvas.width = SIZE
canvas.height = SIZE

setUpInputs()
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
  updateEnemies()
  updateWindStorms()
}

function updateEnemies() {
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
