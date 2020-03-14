import GameState from "./state"
import { setUpInputs, drawHUD } from "./hud"
import { SIZE, getEl, canvas } from "./globals"


const ctx = canvas.getContext("2d")
canvas.width = SIZE
canvas.height = SIZE

setUpInputs()
// game loop in state.js
window.gameState = new GameState()
gameState.setState(GameState.GAME, () =>{}, gameDraw);

gameState.tick();

function gameDraw() {
  ctx.clearRect(0,0,SIZE,SIZE)
  drawHUD(ctx)
}
