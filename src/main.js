import GameState from "./state"

const getEl = x => document.getElementById(x)
const canvas = getEl("canvas")
const ctx = canvas.getContext("2d")
ctx.fillStyle = "red"
ctx.fillRect(0, 0, canvas.width, canvas.height)

// game loop in state.js
window.gameState = new GameState()

gameState.tick();