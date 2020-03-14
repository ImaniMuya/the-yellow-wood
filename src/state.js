export default class GameState {
  constructor() {
    this.state = 0
    this.update = ()=>{ console.log("update")}
    this.draw = ()=>{}
  }
  static get MENU() {return 0}
  static get GAME() {return 1}
  static get SCENE1() {return 2}

  inState(num) {
    return this.state == num
  }

  setState(num, update, draw) {
    this.state = num //maybe add logic
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

const UPDATES_PER_SEC = 1;
const MS_PER_UPDATE = 1000 / UPDATES_PER_SEC;
var lastTime = Date.now();
var lag = 0;

