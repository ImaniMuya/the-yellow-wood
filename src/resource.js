import { resourceLifeSpan, resourceRadius, getEl} from "./globals";
import Helpers from "./helpers";
import {cursor} from "./hud";
import {resourceCounter} from "./main";
import Vector from "./vector";
import Animation from "./animator"
import { Particles } from "./particles"

const frames = [
    {"x":483,"y":292,"w":96,"h":89,"ax":232,"ay":126},
]
export default class Resource{
    constructor(position){
        this.value = Resource.generateValue();
        this.position = position;
        this.lifeSpan = resourceLifeSpan;
        this.radius = resourceRadius;
        this.xVel = 0;
        this.yVel = 0;
        this.baseSpeed = 100;
        this.magnetRadius = 50;
        this.maxSpeed = 500;
        this.lifeEnd = Date.now() + this.lifeSpan;

    }

    get x(){ return this.position.x}
    get y(){ return this.position.y}

    static generateValue(){
        return Helpers.randomBetween(10,20);
    }

    gainResource(){
        this.deleted = true;
        //add resources to total
        resourceCounter.gainResources(this.value);
        Particles.explode(this.x,this.y,"red",20,5)

    }

    moveTowardsCursor(){
        const dist= Helpers.getDistance(this.position, {x:cursor.x, y:cursor.y});
        let speed = this.baseSpeed/dist;
        if(speed > this.maxSpeed){
            speed = this.maxSpeed;
        }
        // console.log(speed);
        const xDiff = cursor.x - this.position.x;
        const yDiff = cursor.y - this.position.y;
        let vector = Vector.normalize(new Vector(xDiff, yDiff));
        let xMag = vector.x;
        let yMag = vector.y;
        this.xVel = xMag * speed;
        this.yVel = yMag * speed;
        this.position.x += this.xVel;
        this.position.y += this.yVel;
    }

    update(){
        if(Helpers.circleContainsPoint(this.position, this.radius, {x:cursor.x, y:cursor.y})){
            this.gainResource();
        }else if(Helpers.circleContainsPoint(this.position, this.magnetRadius, {x:cursor.x, y:cursor.y})){
            this.moveTowardsCursor();
        }
        if(this.lifeEnd < Date.now()){
            this.deleted = true;
        }
    }
    draw(ctx) {
        // ctx.fillStyle = "yellow"
        // ctx.beginPath()
        // ctx.arc(this.x,this.y,this.radius,0,2*Math.PI)
        // ctx.fill()
        ctx.drawImage(getEl("mushImg"), 483,292,96,89, this.x-this.radius, this.y-this.radius, this.radius*3, this.radius*3);
    }

}

