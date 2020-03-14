export class Bullet{
    constructor(position, speed, damage, type, target){
        this.position = position;
        this.speed = speed;
        this.damage = damage;
        this.type = type;
        if(this.type === "divergence"){
            this.target = {
                position: target
            }
        } else{
            this.target = target;
        }
        this.deleted = false;
        this.lifeSpan = 100000;
        this.lifeEnd = new Date() + this.lifeEnd;
    }

    getTarget(){
        return this.target;
    }

    hit(){
        this.target.takeDamage(damage);
        this.deleted = true;
    }

    move(){
       const xDiff = this.target.position.x - this.position.x;
       const yDiff = this.target.position.y - this.position.y;
       const total = Math.abs(xDiff + yDiff);
       const xMag = xDiff / total;
       const yMag = yDiff / total;
       const xVel = xMag * this.speed;
       const yVel = yMag * this.speed;
       this.position.x += xVel;
       this.position.y += yVel;

    }

    update(){
        this.move();
        if(this.lifeEnd < new Date()){
            this.deleted = true;
        }
    }
}