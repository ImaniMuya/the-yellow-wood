export class ResourceCounter{
  constructor(){
    this.total = 200;
    this.totalMana = 30;
    this.maxMana = 30;
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
}