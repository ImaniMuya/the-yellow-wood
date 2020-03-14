
export default class Helpers{
    constructor(){}
    static getDistance(position1, position2){
        const xDiff = Math.pow(position1.x - position2.x, 2);
        const yDiff = Math.pow(position1.y - position2.y, 2);
        return Math.sqrt(xDiff + yDiff);
    }
    static getClosestToBase(enemies){
        let currentClosestEnemy = enemies[0];
        let currentClosestDistance = -1;
        enemies.forEach(enemy => {
            //todo: get distance later.
            let currentDistance = 0;
            if(currentClosestDistance === -1 || currentDistance < currentClosestDistance){
                currentClosestDistance = currentDistance;
                currentClosestEnemy = enemy;
            }
        });
        return currentClosestEnemy;
     }
     rectContainsPoint(x, y, w, h, position2){
         if(position2.x >= x && position2.x <= (x + w) && position2.y >= y && position2.y <= (y + h)){
             return true;
         } 
         return false;
     } 

     rectContainsRect(x1, x2, y1, y2,  w1, w2, h1,h2 ){
         if(x1 > x2 + w2 || y1 > y2 + h2 || x2 > x1 + w1 || y2 > y1 + h1){
             return false;
         } else{
             return true;
         }
     }
     circleContainsPoint(position1, r, position2){
         if(getDistance(position1, position2) <= r){
             return true;
         } else{
             return false;
         }
     }

     circleContainCircle(position1, r1, position2, r2){
         const bigCircleR = r1 + r2;
         if(this.circleContainsPoint(position1, bigCircleR, position2)){
             return true;
         }else{
             return false;
         }
     }
}