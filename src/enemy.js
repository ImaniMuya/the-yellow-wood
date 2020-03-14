import { getFieldVector, B } from "./fields";
import Helpers from "./helpers";
import Vector from "./vector";
import { hitBoxes } from "./globals";

const fieldFactor = .8;

export class Enemy {
    constructor(position, width, height, speed, health, type, field){
        this.position = position;
        this.width = width;
        this.height = height;
        this.vel = new Vector(0, 0)
        this.speed = speed;
        this.health = health;
        this.type = type;
        this.dead = false;
        this.field = field;
        this.deleted = false;
    }

    static get BASIC() { return 52 }

    get x(){ return this.position.x}
    get y(){ return this.position.y}

    getSpeed(){
        return this.speed;
    }
    setSpeed(speed){
        this.speed = speed;
    }
    getHealth(){
        return this.health;
    }
    takeDamage(damage){
        this.health = this.health - damage;
        if(this.health<= 0){
            this.die();
        }
    }
    die(){
        //do death things
        this.speed = 0;
        this.dead = true;
        console.log("dead");
        this.deleted = true;
    }
    move(){
        // from flow field
        let fcv = this.getFieldComboVector()
        if(Helpers.closeTo(fcv.x, 0) && Helpers.closeTo(fcv.x, 0)) {
            fcv = new Vector(0,0)
        } else {
            fcv = Vector.normalize(fcv)
        }

        this.vel.x = (fieldFactor * fcv.x) + ((1-fieldFactor)*this.vel.x);
        this.vel.y = (fieldFactor * fcv.y) + ((1-fieldFactor)*this.vel.y);

        this.position.x += this.vel.x;
        this.position.y += this.vel.y;
    }
    lose(){
        this.speed = 0;
    }
    
    win(){
        this.speed = 0;
    }

    checkForHit(hitBox){
        //omit positions
        return Helpers.rectContainsRect(this.position.x, hitBox.position.x, this.position.y, hitBox.position.y, this.width, hitBox.width, this.height, hitBox.height)

    }

    update(){
        this.move();
        hitBoxes.forEach(hitBox => {
            if(this.checkForHit(hitBox)){
                this.takeDamage(hitBox.damage);
                hitBox.deleted = true; //TODO: only delete bullets
            }
        });
    }
    draw(ctx) {
        ctx.fillStyle = "green"
        ctx.beginPath()
        ctx.arc(this.x,this.y,40,0,2*Math.PI)
        ctx.fill()
    }
    getFieldComboVector(){
        let fx = this.x - B/2;
        let fy = this.y - B/2;
        let cx = this.x + B/2;
        let cy = this.y + B/2;

        let v1 = getFieldVector(this.field, fx, fy);
        let v2 = getFieldVector(this.field, fx, cy);
        let v3 = getFieldVector(this.field, cx, fy);
        let v4 = getFieldVector(this.field, cx, cy);
     
        let xWeight = ((this.x - B/2) - fx) / B; 
        if (xWeight < 0) console.log(xWeight)
        let topx = v1.x * (1-xWeight) +  v2.x * xWeight;
        let topy = v1.y * (1-xWeight) +  v2.y * xWeight;
        let botx = v3.x * (1-xWeight) +  v4.x * xWeight;
        let boty = v3.y * (1-xWeight) +  v4.y * xWeight;

        let yWeight = ((this.y - B/2) - fy) / B;
        if (yWeight < 0) console.log(yWeight)

        return new Vector(
            topx * (1-yWeight) + botx * yWeight,
            topy * (1-yWeight) + boty * yWeight
        )
    }

}
