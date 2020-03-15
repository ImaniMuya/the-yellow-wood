import Vector from "./vector";
import Animation from "./animator";
import { getEl } from "./globals";

const frames = [
    {"x":227,"y":243,"w":220,"h":267,"ax":333,"ay":375},
    {"x":565,"y":243,"w":295,"h":258,"ax":721,"ay":375},
    {"x":936,"y":189,"w":348,"h":357,"ax":1121,"ay":375},
    {"x":565,"y":243,"w":295,"h":258,"ax":721,"ay":375},

]
export default class Bullet {
    constructor(position, radius, speed, damage, type, target){
        this.position = position;
        this.radius = radius;
        this.speed = speed;
        this.damage = damage;
        this.type = type;
        if(!target.position){
            this.target = {
                position: {
                    x: target.x,
                    y: target.y
                }
            }
        } else{
            this.target = target;
        }
        this.deleted = false;
        this.lifeSpan = 2000;
        this.lifeEnd = Date.now() + this.lifeSpan;
        this.xVel = 0;
        this.yVel = 0;
        this.anim = new Animation(getEl("arrowImg"), frames, Animation.getLoopingFrameSelector(500,3))

    }

    get x(){ return this.position.x }
    get y(){ return this.position.y }

    getTarget(){
        return this.target;
    }

    hit(){
        this.target.takeDamage(damage);
        this.deleted = true;
    }

    move(){
        if (this.target.dead && (this.xVel !== 0 && this.yVel !== 0 )){
            this.position.x += this.xVel;
            this.position.y += this.yVel;
        }else{

            const xDiff = this.target.position.x - this.position.x;
            const yDiff = this.target.position.y - this.position.y;
            let vector = Vector.normalize(new Vector(xDiff, yDiff));
            let xMag = vector.x;
            let yMag = vector.y;
            this.xVel = xMag * this.speed;
            this.yVel = yMag * this.speed;
            this.position.x += this.xVel;
            this.position.y += this.yVel;
        }

    }

    update(){
        this.move();
        if(this.lifeEnd < Date.now()){
            this.deleted = true;
        }
        
    }
    draw(ctx) {
        // ctx.fillStyle = "blue"
        // ctx.beginPath()
        // ctx.arc(this.x,this.y,10,0,2*Math.PI)
        // ctx.fill()
        this.anim.draw(ctx, this.x, this.y, false, .1)
    }
}