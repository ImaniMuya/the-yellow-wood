export class ResourceCounter{
  constructor(){
    this.total = 0;
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