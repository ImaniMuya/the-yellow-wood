import { getFieldVector, B, isOnPath } from "./fields";
import Helpers from "./helpers";
import Vector from "./vector";
import Animation from "./animator";
import { hitBoxes, windStorms, resources, enemySpeed, getEl } from "./globals";
import Resource from "./resource";
import { checkAndDeselectEnemy } from "./hud"
import {resourceCounter} from "./main";


const fieldFactor = .8
const pushFactor = .1
const nudgeFactor = .2
const frames = [
    {"x":556,"y":587,"w":848,"h":1034,"ax":531+500,"ay":561+600},
    {"x":1809,"y":845,"w":831,"h":762,"ax":1837+500,"ay":561+600},    
]
export class Enemy {
    constructor(position, radius, width, height, speed, health, type, field){
        this.position = position;
        this.radius = radius;
        this.width = width;
        this.height = height;
        this.vel = new Vector(0, 0)
        this.speed = speed;
        this.health = health;
        this.type = type;
        this.dead = false;
        this.field = field;
        this.deleted = false;
        this.born = false;
        this.windVector = null
        this.nudgeVector = null
        this.r = 20
        this.inWall = true

        // if (this.type == Enemy.BOSS) {
        this.anim = new Animation(getEl("bossImg"), frames, Animation.getLoopingFrameSelector(500,2))
        // }
        // if (this.type == BASIC) {
        //     this.anim = new Animation("../assets/gnome.png", frames, frameSelector)
        // }

        this.finalR = 50;
        this.finalPosition = {x:950, y:500}
    }

    static get BASIC() { return 52 }
    static get BOSS() { return 53 }

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
        this.deleted = true;
        const resource = new Resource({x: this.position.x, y: this.position.y});
        resources.push(resource);

        checkAndDeselectEnemy(this)
    }
    move(){
        // from flow field
        let fcv = this.getFieldComboVector()
        if(Helpers.closeTo(fcv.x, 0) && Helpers.closeTo(fcv.x, 0)) {
            fcv = new Vector(Math.random()*2,Math.random()*2)
        } else {
            fcv = Vector.normalize(fcv)
        }

        this.vel.x = (fieldFactor * fcv.x) + ((1-fieldFactor)*this.vel.x)
        this.vel.y = (fieldFactor * fcv.y) + ((1-fieldFactor)*this.vel.y)
        
        // from wind
        if (this.windVector != null){
            this.vel.x = (pushFactor * this.windVector.x) + ((1-pushFactor)*this.vel.x)
            this.vel.y = (pushFactor * this.windVector.y) + ((1-pushFactor)*this.vel.y)
            this.windVector = null;
        }

        // from nudge
        if (this.nudgeVector != null){
            this.vel.x += (nudgeFactor * this.nudgeVector.x)
            this.vel.y += (nudgeFactor * this.nudgeVector.y)
            this.nudgeVector = null;
        }

        this.position.x += this.vel.x * this.speed;
        this.position.y += this.vel.y * this.speed;
    }

    hitTown(){
        resourceCounter.loseLife();
        this.deleted = true;
        this.dead = true;
    }

    lose(){
        this.speed = 0;
    }
    
    win(){
        this.speed = 0;
    }

    checkForHit(hitBox){
        //omit positions
        return Helpers.circleContainCircle(this.position, this.radius, hitBox.position, hitBox.radius)

    }

    update(){
        this.move();
        hitBoxes.forEach(hitBox => {
            if(this.checkForHit(hitBox)){
                this.takeDamage(hitBox.damage);
                hitBox.deleted = true; //TODO: only delete bullets
            }
        });
        if(Helpers.circleContainCircle(this.position, this.r, this.finalPosition, this.finalR)){
            this.hitTown();
        }
    }
    draw(ctx) {
        if(!this.born){
            return
        }
        // if (this.type == Enemy.BOSS) {
            this.anim.draw(ctx, this.x, this.y, false, .1)
        // }
        // ctx.fillStyle = "green"
        // ctx.beginPath()
        // ctx.arc(this.x,this.y,this.radius,0,2*Math.PI)
        // ctx.fill()
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

    contains(position) {
        return Helpers.circleContainsPoint(this.position, this.r, position)
    }

    static drawEnemyProfile(ctx) {
        //TODO: base image on type
        // ctx.fillStyle = "green"
        // ctx.fillRect(40,700,300,275)
        ctx.drawImage(getEl("bossImg"), 556,587,848,1034, 40, 700, 300, 275);
    }
}
