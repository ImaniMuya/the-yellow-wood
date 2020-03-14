import GameState from "./state"
import { setUpInputs, drawHUD } from "./hud"
import { SIZE, getEl, canvas, towers, enemies} from "./globals"
import { drawMap1 } from "./fields"

const ctx = canvas.getContext("2d")
canvas.width = SIZE
canvas.height = SIZE

setUpInputs()
// game loop in state.js
window.gameState = new GameState()
gameState.setState(GameState.GAME, gameUpdate, gameDraw);

gameState.tick();

function gameDraw() {
  ctx.clearRect(0,0,SIZE,SIZE)
  drawMap1(ctx)
  towers.forEach(tower => {tower.draw(ctx)})
  enemies.forEach(enemy => {enemy.draw(ctx)})
  drawHUD(ctx)
}

function gameUpdate() {
  towers.forEach(tower => {tower.update()})
  enemies.forEach(enemy => {enemy.update()})
}

