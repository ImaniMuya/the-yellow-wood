
export class Helpers{
    constructor(){}
    getDistance(position1, position2){
        const xDiff = Math.pow(position1.x - position2.x, 2);
        const yDiff = Math.pow(position1.y - position2.y, 2);
        return Math.sqrt(xDiff + yDiff);
    }
    getClosestToBase(enemies){
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
}