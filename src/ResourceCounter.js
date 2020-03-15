import { resourceLifeSpan, resourceRadius, lives} from "./globals";
export class ResourceCounter{
  constructor(){
    this.total = 200;
    this.totalMana = 30;
    this.maxMana = 30;
    this.gameOver = false;
    this.won = false;
    this.lost = false;
    this.lives = lives;
  }
  spendResources(num){
    this.total -= num;
  }
  getResources(){
    return this.total;
  }
  gainResources(num){
    this.total += num;
  }
  spendMana(num){
    this.totalMana -= num;
  }
  getMana(){
    return this.totalMana;
  }
  gainMana(num){
    this.totalMana += num;
    if(this.totalMana > this.maxMana){
      this.totalMana = this.maxMana;
    }
  }
  getGameOver(){
    return this.gameOver;
  }

  loseLife(){
    this.lives -= 1;
    if(this.lives <= 0){
      this.lose();
    }
  }

  getWin(){
    return this.won;
  }
  getLose(){
    return this.lost;
  }

  set win(bool){
    this.won = bool;
  }
  set lose(bool){
     this.lost = bool;
  }
  win(){
    this.gameOver = true;
    this.won = true;
  }
  lose(){
    this.gameOver = true;
    this.lost = true;
  }
  getLives(){
    return this.lives;
  }
}