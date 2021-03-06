import { getEl, canvas } from "./globals"
export default class GameState {
  constructor() {
    this.state = 0
    this.update = ()=>{}
    this.draw = ()=>{}
  }
  static get MENU() {return 0}
  static get GAME() {return 1}
  static get SCENE1() {return 2}
  static get SCENE2() {return 3}
  static get END() {return 5}
  static get CRED() {return 6}

  inState(num) {
    return this.state == num
  }

  setState(num, update, draw) {
    if (this.inState(num)) return
    this.state = num
    this.update = update
    this.draw = draw
    hideOuterDivs()
    divDict[num].classList.remove("nodisplay")
  }


  tick() {
    let current = Date.now();
    let elapsed = current - lastTime;
    lastTime = current;
    lag += elapsed;
    while (lag >= MS_PER_UPDATE) {
      this.update();
      lag -= MS_PER_UPDATE;
    }
    this.draw();
    requestAnimationFrame(this.tick.bind(this));
  }
}

const divDict = {}

divDict[GameState.GAME] = canvas
divDict[GameState.MENU] = getEl("menuDiv")
divDict[GameState.SCENE1] = getEl("scene1")
divDict[GameState.SCENE2] = getEl("scene2")
divDict[GameState.END] = getEl("endDiv")
divDict[GameState.CRED] = getEl("credDiv")


const body = getEl("body")
function hideOuterDivs() {
  for (let child of body.children) {
    child.classList.add("nodisplay")
  }
}

const UPDATES_PER_SEC = 30;
const MS_PER_UPDATE = 1000 / UPDATES_PER_SEC;
var lastTime = Date.now();
var lag = 0;

