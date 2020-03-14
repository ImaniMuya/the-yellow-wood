export class ResourceCounter{
  constructor(){
    this.total = 200;
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
}